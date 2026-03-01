// RiverEdge 部署面板 - 单二进制，零运行时依赖
// 编译后可直接在空白 Windows/Linux 环境运行，用于准备 RiverEdge 部署环境
package main

import (
	"crypto/rand"
	_ "embed"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

//go:embed web/index.html
var staticHTML []byte

var (
	panelDir   string
	projectDir string
	configPath string
	authPath   string
	sessions   = make(map[string]time.Time)
	sessionsMu sync.RWMutex
	sessionTTL = 24 * time.Hour

	// 一键安装任务状态（Ubuntu/Linux）
	installJobs   = make(map[string]*installJob)
	installJobsMu sync.RWMutex
)

type installJob struct {
	Running bool
	Done    bool
	Success bool
	Output  string
	Start   time.Time
}

func init() {
	execPath, _ := os.Executable()
	panelDir = filepath.Dir(execPath)
	projectDir = filepath.Join(panelDir, "..")
	if _, err := os.Stat(filepath.Join(projectDir, "riveredge-backend")); err != nil {
		projectDir = panelDir
	}
	configPath = filepath.Join(panelDir, "deploy-config.json")
	authPath = filepath.Join(panelDir, "panel-auth.json")
}

type checkItem struct {
	Installed       bool   `json:"installed"`
	Version         string `json:"version,omitempty"`
	Path            string `json:"path,omitempty"`
	MeetsRequirement bool  `json:"meets_requirement,omitempty"`
}

type checkResult struct {
	Platform string               `json:"platform"`
	Distro   string               `json:"distro,omitempty"`   // ubuntu, debian, etc.
	DistroVer string              `json:"distro_ver,omitempty"` // 22.04, etc.
	Checks   map[string]checkItem `json:"checks"`
}

type configData struct {
	Platform string               `json:"platform"`
	Checks   map[string]checkItem `json:"checks"`
	Config   map[string]any       `json:"config"`
	History  []any                `json:"history"`
}

func loadConfig() configData {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return configData{
			Platform: runtime.GOOS,
			Checks:   map[string]checkItem{},
			Config:   map[string]any{},
			History:  []any{},
		}
	}
	var c configData
	_ = json.Unmarshal(data, &c)
	if c.Checks == nil {
		c.Checks = map[string]checkItem{}
	}
	if c.Config == nil {
		c.Config = map[string]any{}
	}
	return c
}

func saveConfig(c configData) error {
	data, _ := json.MarshalIndent(c, "", "  ")
	return os.WriteFile(configPath, data, 0644)
}

func loadMasterHash() string {
	data, err := os.ReadFile(authPath)
	if err != nil {
		return ""
	}
	var v struct {
		MasterPasswordHash string `json:"master_password_hash"`
	}
	_ = json.Unmarshal(data, &v)
	return v.MasterPasswordHash
}

func saveMasterHash(hash string) error {
	data, _ := json.MarshalIndent(map[string]string{"master_password_hash": hash}, "", "  ")
	return os.WriteFile(authPath, data, 0600)
}

func generateSessionToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func createSession() string {
	token := generateSessionToken()
	sessionsMu.Lock()
	sessions[token] = time.Now().Add(sessionTTL)
	sessionsMu.Unlock()
	return token
}

func checkSession(r *http.Request) bool {
	c, err := r.Cookie("panel_session")
	if err != nil || c.Value == "" {
		return false
	}
	sessionsMu.RLock()
	exp, ok := sessions[c.Value]
	sessionsMu.RUnlock()
	if !ok || time.Now().After(exp) {
		return false
	}
	return true
}

func getSessionCookie(r *http.Request) string {
	c, _ := r.Cookie("panel_session")
	if c != nil {
		return c.Value
	}
	return ""
}

func apiAuthStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	hash := loadMasterHash()
	hasPassword := hash != ""
	authenticated := hasPassword && checkSession(r)
	writeJSON(w, map[string]any{"has_password": hasPassword, "authenticated": authenticated})
}

func apiSetMasterPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if loadMasterHash() != "" {
		http.Error(w, "Master 密码已设置", http.StatusBadRequest)
		return
	}
	var body struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Password == "" {
		http.Error(w, "请提供密码", http.StatusBadRequest)
		return
	}
	if len(body.Password) < 6 {
		http.Error(w, "密码至少 6 位", http.StatusBadRequest)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := saveMasterHash(string(hash)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	token := createSession()
	http.SetCookie(w, &http.Cookie{Name: "panel_session", Value: token, Path: "/", MaxAge: int(sessionTTL.Seconds()), HttpOnly: true, SameSite: http.SameSiteLaxMode})
	writeJSON(w, map[string]any{"success": true, "message": "Master 密码已设置"})
}

func apiLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	hash := loadMasterHash()
	if hash == "" {
		http.Error(w, "请先设置 Master 密码", http.StatusBadRequest)
		return
	}
	var body struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "请提供密码", http.StatusBadRequest)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(body.Password)); err != nil {
		http.Error(w, "密码错误", http.StatusUnauthorized)
		return
	}
	token := createSession()
	http.SetCookie(w, &http.Cookie{Name: "panel_session", Value: token, Path: "/", MaxAge: int(sessionTTL.Seconds()), HttpOnly: true, SameSite: http.SameSiteLaxMode})
	writeJSON(w, map[string]any{"success": true, "message": "登录成功"})
}

func apiLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	token := getSessionCookie(r)
	if token != "" {
		sessionsMu.Lock()
		delete(sessions, token)
		sessionsMu.Unlock()
	}
	http.SetCookie(w, &http.Cookie{Name: "panel_session", Value: "", Path: "/", MaxAge: -1, HttpOnly: true})
	writeJSON(w, map[string]any{"success": true})
}

func requireAuth(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if loadMasterHash() == "" {
			h(w, r)
			return
		}
		if !checkSession(r) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":"未登录"}`))
			return
		}
		h(w, r)
	}
}

func getEnhancedPath() string {
	path := os.Getenv("PATH")
	if runtime.GOOS != "windows" {
		return path
	}
	// Windows 双击运行 exe 时 PATH 可能不完整，补充常见安装路径
	userProfile := os.Getenv("USERPROFILE")
	programFiles := os.Getenv("ProgramFiles")
	extra := []string{
		filepath.Join(programFiles, "nodejs"),
		filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python311"),
		filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python312"),
		filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python313"),
		filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python311", "Scripts"),
		filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python312", "Scripts"),
		filepath.Join(programFiles, "Python311"),
		filepath.Join(programFiles, "Python312"),
		filepath.Join(userProfile, ".local", "bin"),
		filepath.Join(userProfile, ".cargo", "bin"),
		filepath.Join(programFiles, "PostgreSQL", "15", "bin"),
		filepath.Join(programFiles, "PostgreSQL", "16", "bin"),
		filepath.Join(programFiles, "PostgreSQL", "17", "bin"),
		filepath.Join(programFiles, "Redis"),
	}
	for _, p := range extra {
		if p != "" {
			if _, err := os.Stat(p); err == nil {
				path = p + string(filepath.ListSeparator) + path
			}
		}
	}
	return path
}

func runCmd(name string, arg ...string) (bool, string) {
	cmd := exec.Command(name, arg...)
	if runtime.GOOS == "windows" {
		env := os.Environ()
		enhanced := "PATH=" + getEnhancedPath()
		found := false
		for i, e := range env {
			if strings.HasPrefix(e, "PATH=") {
				env[i] = enhanced
				found = true
				break
			}
		}
		if !found {
			env = append(env, enhanced)
		}
		cmd.Env = env
	}
	out, err := cmd.CombinedOutput()
	s := strings.TrimSpace(string(out))
	return err == nil, s
}

func checkNode() checkItem {
	ok, out := runCmd("node", "-v")
	if !ok {
		return checkItem{Installed: false}
	}
	v := extractVersion(out, `v?(\d+\.\d+\.\d+)`)
	return checkItem{
		Installed:       true,
		Version:         v,
		MeetsRequirement: versionGE(v, "22.0.0"),
	}
}

func checkPython() checkItem {
	// Windows 上尝试 python、py、python3；Linux 用 python3
	for _, py := range []string{"python", "py", "python3"} {
		if runtime.GOOS != "windows" && py != "python3" {
			continue
		}
		ok, out := runCmd(py, "--version")
		if ok {
			v := extractVersion(out, `(\d+\.\d+\.\d+)`)
			return checkItem{
				Installed:       true,
				Version:         v,
				MeetsRequirement: versionGE(v, "3.12.0"),
			}
		}
	}
	return checkItem{Installed: false}
}

func checkUV() checkItem {
	// 先尝试 PATH 中的 uv
	ok, out := runCmd("uv", "--version")
	if ok {
		v := extractVersion(out, `uv\s+(\d+\.\d+\.\d+)`)
		return checkItem{Installed: true, Version: v}
	}
	// Windows: PATH 可能不包含 uv，按已知路径直接执行
	if runtime.GOOS == "windows" {
		userProfile := os.Getenv("USERPROFILE")
		candidates := []string{
			filepath.Join(userProfile, ".local", "bin", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python311", "Scripts", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python312", "Scripts", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python313", "Scripts", "uv.exe"),
		}
		for _, p := range candidates {
			if _, err := os.Stat(p); err != nil {
				continue
			}
			ok, out = runCmdEx(p, "--version")
			if ok {
				v := extractVersion(out, `uv\s+(\d+\.\d+\.\d+)`)
				return checkItem{Installed: true, Version: v}
			}
		}
	}
	return checkItem{Installed: false}
}

func runCmdEx(name string, arg ...string) (bool, string) {
	cmd := exec.Command(name, arg...)
	out, err := cmd.CombinedOutput()
	s := strings.TrimSpace(string(out))
	return err == nil, s
}

// resolveUvPath 返回 uv 可执行文件路径。Windows 双击运行时 PATH 可能不含 uv，按已知路径查找
func resolveUvPath() string {
	ok, _ := runCmd("uv", "--version")
	if ok {
		return "uv"
	}
	if runtime.GOOS == "windows" {
		userProfile := os.Getenv("USERPROFILE")
		programFiles := os.Getenv("ProgramFiles")
		appData := os.Getenv("APPDATA")
		candidates := []string{
			filepath.Join(userProfile, ".local", "bin", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python311", "Scripts", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python312", "Scripts", "uv.exe"),
			filepath.Join(userProfile, "AppData", "Local", "Programs", "Python", "Python313", "Scripts", "uv.exe"),
			filepath.Join(programFiles, "Python311", "Scripts", "uv.exe"),
			filepath.Join(programFiles, "Python312", "Scripts", "uv.exe"),
			filepath.Join(appData, "Python", "Python311", "Scripts", "uv.exe"),
			filepath.Join(appData, "Python", "Python312", "Scripts", "uv.exe"),
		}
		for _, p := range candidates {
			if _, err := os.Stat(p); err == nil {
				return p
			}
		}
	}
	return "uv"
}

func checkNpm() checkItem {
	ok, out := runCmd("npm", "-v")
	if !ok {
		return checkItem{Installed: false}
	}
	v := strings.TrimSpace(out)
	return checkItem{
		Installed:       true,
		Version:         v,
		MeetsRequirement: versionGE(v, "10.0.0"),
	}
}

func checkPostgres() checkItem {
	for _, cmd := range [][]string{{"psql", "--version"}, {"pg_config", "--version"}} {
		ok, out := runCmd(cmd[0], cmd[1:]...)
		if ok {
			v := extractVersion(out, `(\d+\.\d+)`)
			return checkItem{
				Installed:       true,
				Version:         v,
				MeetsRequirement: versionGE(v, "15.0"),
			}
		}
	}
	return checkItem{Installed: false}
}

func checkRedis() checkItem {
	ok, out := runCmd("redis-cli", "--version")
	if !ok {
		return checkItem{Installed: false}
	}
	v := extractVersion(out, `(\d+\.\d+\.\d+)`)
	return checkItem{
		Installed:       true,
		Version:         v,
		MeetsRequirement: versionGE(v, "6.0"),
	}
}

func checkBash() checkItem {
	// Launch.dev.sh 需要 bash，Windows 上需 Git Bash 或 WSL
	ok, _ := runCmd("bash", "-c", "echo 1")
	if ok {
		return checkItem{Installed: true, Version: "available"}
	}
	if runtime.GOOS == "windows" {
		// 尝试 WSL
		ok, _ = runCmd("wsl", "--version")
		if ok {
			return checkItem{Installed: true, Version: "WSL"}
		}
		// 尝试常见 Git Bash 路径
		for _, dir := range []string{os.Getenv("ProgramFiles"), os.Getenv("ProgramFiles(x86)")} {
			if dir == "" {
				continue
			}
			p := filepath.Join(dir, "Git", "bin", "bash.exe")
			if _, err := os.Stat(p); err == nil {
				ok, _ := runCmdEx(p, "-c", "echo 1")
				if ok {
					return checkItem{Installed: true, Version: "Git Bash"}
				}
			}
		}
	}
	return checkItem{Installed: false}
}

func checkCaddy() checkItem {
	ok, out := runCmd("caddy", "version")
	if ok {
		v := extractVersion(out, `v(\d+\.\d+\.\d+)`)
		if v == "" {
			v = strings.TrimSpace(out)
		}
		return checkItem{Installed: true, Version: v}
	}
	return checkItem{Installed: false}
}

func checkInngest() checkItem {
	// 先尝试 PATH
	ok, out := runCmd("inngest", "--version")
	if ok {
		v := extractVersion(out, `(\d+\.\d+\.\d+)`)
		return checkItem{Installed: true, Version: v}
	}
	// 检查项目 bin 目录（Launch.dev.sh 使用的方式）
	candidates := []string{
		filepath.Join(projectDir, "bin", "inngest", "inngest.exe"),
		filepath.Join(projectDir, "bin", "inngest", "inngest"),
		filepath.Join(projectDir, "bin", "inngest", "inngest-windows-amd64.exe"),
		filepath.Join(projectDir, "bin", "inngest.exe"),
		filepath.Join(projectDir, "bin", "inngest"),
	}
	for _, p := range candidates {
		if _, err := os.Stat(p); err != nil {
			continue
		}
		ok, out = runCmdEx(p, "--version")
		if ok {
			v := extractVersion(out, `(\d+\.\d+\.\d+)`)
			return checkItem{Installed: true, Version: v}
		}
	}
	return checkItem{Installed: false}
}

func extractVersion(s, re string) string {
	r := regexp.MustCompile(re)
	if m := r.FindStringSubmatch(s); len(m) > 1 {
		return m[1]
	}
	return s
}

// detectDistro 读取 /etc/os-release 检测 Linux 发行版（Ubuntu 22 等）
func detectDistro() (distro, ver string) {
	if runtime.GOOS != "linux" {
		return "", ""
	}
	data, err := os.ReadFile("/etc/os-release")
	if err != nil {
		return "", ""
	}
	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "ID=") {
			distro = strings.Trim(strings.TrimPrefix(line, "ID="), `"`)
		}
		if strings.HasPrefix(line, "VERSION_ID=") {
			ver = strings.Trim(strings.TrimPrefix(line, "VERSION_ID="), `"`)
		}
	}
	return distro, ver
}

func versionGE(v, min string) bool {
	va := strings.Split(v, ".")
	vb := strings.Split(min, ".")
	for i := 0; i < 3; i++ {
		var a, b int
		if i < len(va) {
			fmt.Sscanf(va[i], "%d", &a)
		}
		if i < len(vb) {
			fmt.Sscanf(vb[i], "%d", &b)
		}
		if a > b {
			return true
		}
		if a < b {
			return false
		}
	}
	return true
}

func apiCheck(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	distro, distroVer := detectDistro()
	res := checkResult{
		Platform:  runtime.GOOS,
		Distro:    distro,
		DistroVer: distroVer,
		Checks: map[string]checkItem{
			"node":       checkNode(),
			"python":     checkPython(),
			"uv":         checkUV(),
			"npm":        checkNpm(),
			"postgresql": checkPostgres(),
			"redis":      checkRedis(),
			"bash":       checkBash(),
			"inngest":    checkInngest(),
			"caddy":      checkCaddy(),
		},
	}
	cfg := loadConfig()
	cfg.Checks = res.Checks
	cfg.Platform = res.Platform
	_ = saveConfig(cfg)
	writeJSON(w, res)
}

func apiGetConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	writeJSON(w, loadConfig())
}

func apiSaveConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var body struct {
		Config map[string]any `json:"config"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	cfg := loadConfig()
	for k, v := range body.Config {
		cfg.Config[k] = v
	}
	if err := saveConfig(cfg); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]bool{"success": true})
}

var installScripts = map[string]map[string]string{
	"node": {
		"windows":  "winget install OpenJS.NodeJS.LTS --accept-package-agreements",
		"linux":    "sudo apt update && sudo apt install -y nodejs npm || sudo dnf install -y nodejs npm",
		"ubuntu22": "sudo apt update && sudo apt install -y ca-certificates curl gnupg && sudo mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && echo 'deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main' | sudo tee /etc/apt/sources.list.d/nodesource.list && sudo apt update && sudo apt install -y nodejs",
	},
	"python": {
		"windows":  "winget install Python.Python.3.12 --accept-package-agreements",
		"linux":    "sudo apt install -y python3.12 python3.12-venv python3-pip || sudo dnf install -y python3.12",
		"ubuntu22": "sudo apt update && sudo apt install -y software-properties-common && sudo add-apt-repository -y ppa:deadsnakes/ppa && sudo apt update && sudo apt install -y python3.12 python3.12-venv && curl -sS https://bootstrap.pypa.io/get-pip.py | python3.12",
	},
	"uv": {
		"windows":  `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`,
		"linux":    "curl -LsSf https://astral.sh/uv/install.sh | sh",
		"ubuntu22": "curl -LsSf https://astral.sh/uv/install.sh | sh",
	},
	"postgresql": {
		"windows":  "winget install PostgreSQL.PostgreSQL --accept-package-agreements",
		"linux":    "sudo apt install -y postgresql postgresql-contrib || sudo dnf install -y postgresql-server postgresql-contrib",
		"ubuntu22": "sudo apt update && sudo apt install -y postgresql-common && sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh && sudo apt install -y postgresql-15 postgresql-contrib-15",
	},
	"redis": {
		"windows":  "winget install Redis.Redis --accept-package-agreements",
		"linux":    "sudo apt install -y redis-server || sudo dnf install -y redis",
		"ubuntu22": "sudo apt update && sudo apt install -y redis-server",
	},
	"inngest": {
		"windows":  "从 bin/inngest/ 目录或 https://github.com/inngest/inngest-cli/releases 下载 inngest.exe 置于项目 bin/inngest/",
		"linux":    "从 https://github.com/inngest/inngest-cli/releases 下载对应架构的 inngest 置于项目 bin/inngest/",
		"ubuntu22": "从 https://github.com/inngest/inngest-cli/releases 下载对应架构的 inngest 置于项目 bin/inngest/",
	},
	"bash": {
		"windows":  "winget install Git.Git --accept-package-agreements（安装 Git for Windows 含 Git Bash），或启用 WSL",
		"linux":    "通常已预装 bash",
		"ubuntu22": "通常已预装 bash",
	},
	"caddy": {
		"windows":  "从 https://github.com/caddyserver/caddy/releases 下载 caddy_*_windows_amd64.zip 解压到 PATH",
		"linux":    "sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list && sudo apt update && sudo apt install caddy",
		"ubuntu22": "sudo apt update && sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list && sudo apt update && sudo apt install -y caddy",
	},
}

func apiInstallScript(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	comp := strings.TrimPrefix(r.URL.Path, "/api/install-script/")
	plat := "linux"
	if runtime.GOOS == "windows" {
		plat = "windows"
	}
	scripts, ok := installScripts[comp]
	if !ok {
		http.Error(w, "unknown component", http.StatusNotFound)
		return
	}
	cmd := scripts[plat]
	// Ubuntu 22 优先使用优化脚本
	if plat == "linux" {
		distro, ver := detectDistro()
		if distro == "ubuntu" && (strings.HasPrefix(ver, "22") || strings.HasPrefix(ver, "24")) {
			if ubuntuCmd, has := scripts["ubuntu22"]; has && ubuntuCmd != "" {
				cmd = ubuntuCmd
				plat = "ubuntu22"
			}
		}
	}
	writeJSON(w, map[string]string{"platform": plat, "component": comp, "command": cmd})
}

// 可一键安装的组件（排除需手动下载的 inngest、bash）
var installableComponents = map[string]bool{
	"node": true, "python": true, "uv": true, "postgresql": true, "redis": true, "caddy": true,
}

func apiInstall(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if runtime.GOOS != "linux" {
		http.Error(w, "一键安装仅支持 Linux (Ubuntu 22)", http.StatusBadRequest)
		return
	}
	comp := strings.Trim(strings.TrimPrefix(r.URL.Path, "/api/install/"), "/")
	if !installableComponents[comp] {
		http.Error(w, "该组件不支持一键安装，请手动执行安装命令", http.StatusBadRequest)
		return
	}
	scripts, ok := installScripts[comp]
	if !ok {
		http.Error(w, "unknown component", http.StatusNotFound)
		return
	}
	plat := "linux"
	distro, ver := detectDistro()
	if distro == "ubuntu" && (strings.HasPrefix(ver, "22") || strings.HasPrefix(ver, "24")) {
		if ubuntuCmd, has := scripts["ubuntu22"]; has && ubuntuCmd != "" {
			plat = "ubuntu22"
		}
	}
	cmd := scripts[plat]
	if cmd == "" {
		cmd = scripts["linux"]
	}
	// 检查是否已在运行
	installJobsMu.Lock()
	if j, ok := installJobs[comp]; ok && j.Running {
		installJobsMu.Unlock()
		writeJSON(w, map[string]any{"started": false, "message": "该组件正在安装中"})
		return
	}
	installJobs[comp] = &installJob{Running: true, Start: time.Now()}
	installJobsMu.Unlock()
	// 后台执行
	go func() {
		runCmd := exec.Command("bash", "-c", cmd)
		var out strings.Builder
		runCmd.Stdout = &out
		runCmd.Stderr = &out
		err := runCmd.Run()
		installJobsMu.Lock()
		j := installJobs[comp]
		if j != nil {
			j.Running = false
			j.Done = true
			j.Success = err == nil
			j.Output = out.String()
		}
		installJobsMu.Unlock()
	}()
	writeJSON(w, map[string]any{"started": true, "message": "安装已启动，请稍候"})
}

func apiInstallStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	comp := strings.Trim(strings.TrimPrefix(r.URL.Path, "/api/install-status/"), "/")
	installJobsMu.RLock()
	j := installJobs[comp]
	installJobsMu.RUnlock()
	if j == nil {
		writeJSON(w, map[string]any{"running": false, "done": false})
		return
	}
	writeJSON(w, map[string]any{
		"running": j.Running,
		"done":    j.Done,
		"success": j.Success,
		"output":  j.Output,
	})
}

func generateJwtSecret() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b) // 43 字符，无填充
}

func apiGenerateEnv(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	envExample := filepath.Join(projectDir, "riveredge-backend", ".env.example")
	envPath := filepath.Join(projectDir, "riveredge-backend", ".env")
	data, err := os.ReadFile(envExample)
	if err != nil {
		http.Error(w, ".env.example not found", http.StatusInternalServerError)
		return
	}
	cfg := loadConfig()
	// 生产环境自动生成 JWT_SECRET_KEY，并持久化到 deploy-config
	if v, ok := cfg.Config["jwt_secret_key"]; !ok || v == nil || strings.TrimSpace(fmt.Sprint(v)) == "" {
		secret := generateJwtSecret()
		cfg.Config["jwt_secret_key"] = secret
		if err := saveConfig(cfg); err != nil {
			log.Printf("[generate-env] 保存 jwt_secret_key 到配置失败: %v", err)
		}
	}
	mapping := map[string]string{
		"db_host": "DB_HOST", "db_port": "DB_PORT", "db_user": "DB_USER",
		"db_password": "DB_PASSWORD", "db_name": "DB_NAME",
		"redis_host": "REDIS_HOST", "redis_port": "REDIS_PORT", "redis_password": "REDIS_PASSWORD",
		"backend_port": "PORT", "frontend_port": "FRONTEND_PORT",
		"platform_superadmin_password": "PLATFORM_SUPERADMIN_PASSWORD",
		"jwt_secret_key": "JWT_SECRET_KEY",
	}
	content := string(data)
	for k, envKey := range mapping {
		if v, ok := cfg.Config[k]; ok && v != nil {
			val := fmt.Sprint(v)
			re := regexp.MustCompile(`(?m)^` + regexp.QuoteMeta(envKey) + `=.*$`)
			content = re.ReplaceAllString(content, envKey+"="+val)
		}
	}
	if err := os.WriteFile(envPath, []byte(content), 0644); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]any{"success": true, "path": envPath})
}

func apiMigrate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	backendDir := filepath.Join(projectDir, "riveredge-backend")
	if _, err := os.Stat(backendDir); err != nil {
		log.Printf("[migrate] riveredge-backend 目录不存在: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "error": "riveredge-backend 目录不存在，请确认项目结构"})
		return
	}
	uvPath := resolveUvPath()
	cmd := exec.Command(uvPath, "run", "aerich", "upgrade")
	cmd.Dir = backendDir
	srcDir := filepath.Join(backendDir, "src")
	pathSep := ":"
	if runtime.GOOS == "windows" {
		pathSep = ";"
	}
	pythonPath := backendDir + pathSep + srcDir
	if existing := os.Getenv("PYTHONPATH"); existing != "" {
		pythonPath = pythonPath + pathSep + existing
	}
	env := os.Environ()
	pyFound := false
	for i, e := range env {
		if strings.HasPrefix(e, "PYTHONPATH=") {
			env[i] = "PYTHONPATH=" + pythonPath
			pyFound = true
			break
		}
	}
	if !pyFound {
		env = append(env, "PYTHONPATH="+pythonPath)
	}
	if runtime.GOOS == "windows" {
		enhanced := "PATH=" + getEnhancedPath()
		found := false
		for i, e := range env {
			if strings.HasPrefix(e, "PATH=") {
				env[i] = enhanced
				found = true
				break
			}
		}
		if !found {
			env = append(env, enhanced)
		}
	}
	cmd.Env = env
	out, err := cmd.CombinedOutput()
	if err != nil {
		errMsg := strings.TrimSpace(string(out))
		if errMsg == "" {
			errMsg = err.Error()
		}
		log.Printf("[migrate] aerich upgrade 失败: %v\n输出: %s", err, errMsg)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "error": errMsg})
		return
	}
	writeJSON(w, map[string]bool{"success": true})
}

func apiTestPostgres(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var cfg struct {
		DbHost     string `json:"db_host"`
		DbPort     int    `json:"db_port"`
		DbUser     string `json:"db_user"`
		DbPassword string `json:"db_password"`
		DbName     string `json:"db_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil {
		writeJSON(w, map[string]any{"ok": false, "error": "参数错误"})
		return
	}
	if cfg.DbPort == 0 {
		cfg.DbPort = 5432
	}
	cmd := exec.Command("psql", "-h", cfg.DbHost, "-p", fmt.Sprintf("%d", cfg.DbPort), "-U", cfg.DbUser, "-d", cfg.DbName, "-c", "SELECT 1")
	cmd.Env = append(os.Environ(), "PGPASSWORD="+cfg.DbPassword)
	cmd.Env = append(cmd.Env, "PGSSLMODE=prefer")
	out, err := cmd.CombinedOutput()
	if err != nil {
		writeJSON(w, map[string]any{"ok": false, "error": strings.TrimSpace(string(out))})
		return
	}
	writeJSON(w, map[string]any{"ok": true})
}

func apiTestRedis(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var cfg struct {
		RedisHost     string `json:"redis_host"`
		RedisPort     int    `json:"redis_port"`
		RedisPassword string `json:"redis_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&cfg); err != nil {
		writeJSON(w, map[string]any{"ok": false, "error": "参数错误"})
		return
	}
	if cfg.RedisPort == 0 {
		cfg.RedisPort = 6379
	}
	args := []string{"-h", cfg.RedisHost, "-p", fmt.Sprintf("%d", cfg.RedisPort)}
	if cfg.RedisPassword != "" {
		args = append(args, "-a", cfg.RedisPassword)
	}
	args = append(args, "PING")
	cmd := exec.Command("redis-cli", args...)
	out, err := cmd.CombinedOutput()
	if err != nil || !strings.Contains(strings.ToLower(string(out)), "pong") {
		writeJSON(w, map[string]any{"ok": false, "error": strings.TrimSpace(string(out))})
		return
	}
	writeJSON(w, map[string]any{"ok": true})
}

func apiLaunch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	launchSh := filepath.Join(projectDir, "Launch.dev.sh")
	if _, err := os.Stat(launchSh); err != nil {
		http.Error(w, "Launch.dev.sh not found", http.StatusInternalServerError)
		return
	}
	cfg := loadConfig().Config
	env := os.Environ()
	if isTrue(cfg["launch_mobile"]) {
		env = append(env, "LAUNCH_MOBILE=true")
	}
	cmd := exec.Command("bash", launchSh)
	cmd.Dir = projectDir
	cmd.Env = env
	cmd.Stdout = nil
	cmd.Stderr = nil
	if err := cmd.Start(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]any{"success": true, "message": "Launch script started"})
}

func generateCaddyfileFromConfig(cfg map[string]any) (string, error) {
	if cfg == nil {
		cfg = loadConfig().Config
	}
	domain := ""
	if v, ok := cfg["caddy_domain"]; ok && v != nil {
		domain = strings.TrimSpace(fmt.Sprint(v))
	}
	proxyPort := 8080
	if v, ok := cfg["caddy_proxy_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			proxyPort = p
		}
	}
	backendPort := 8200
	if v, ok := cfg["backend_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			backendPort = p
		}
	}
	enableLE := false
	if v, ok := cfg["caddy_enable_letsencrypt"]; ok && v != nil {
		enableLE = isTrue(v)
	}

	addr := fmt.Sprintf(":%d", proxyPort)
	if domain != "" {
		if enableLE {
			addr = domain
		} else {
			addr = fmt.Sprintf("http://%s:%d", domain, proxyPort)
		}
	}

	frontendRoot := filepath.Join(projectDir, "riveredge-frontend", "dist")
	mobileRoot := filepath.Join(projectDir, "riveredge-mobile", "dist")
	backendAddr := fmt.Sprintf("127.0.0.1:%d", backendPort)

	sb := strings.Builder{}
	sb.WriteString(fmt.Sprintf("# RiverEdge Caddy 配置 - 由面板生成\n# 地址: %s\n\n", addr))
	sb.WriteString(fmt.Sprintf("%s {\n", addr))
	sb.WriteString("    handle /api/* { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle /static/* { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle /docs* { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle /redoc* { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle /openapi.json { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle /health { reverse_proxy " + backendAddr + " }\n")
	sb.WriteString("    handle_path /mobile* {\n")
	sb.WriteString("        root * " + mobileRoot + "\n")
	sb.WriteString("        try_files {path} /index.html\n        file_server\n    }\n")
	sb.WriteString("    handle {\n")
	sb.WriteString("        root * " + frontendRoot + "\n")
	sb.WriteString("        try_files {path} /index.html\n        file_server\n    }\n")
	sb.WriteString("}\n")

	return sb.String(), nil
}

func generateCaddyfile() (string, error) {
	return generateCaddyfileFromConfig(loadConfig().Config)
}

func toInt(v any) (int, bool) {
	switch x := v.(type) {
	case int:
		return x, true
	case float64:
		return int(x), true
	case string:
		var n int
		_, err := fmt.Sscanf(x, "%d", &n)
		return n, err == nil
	}
	return 0, false
}

func isTrue(v any) bool {
	switch x := v.(type) {
	case bool:
		return x
	case string:
		return strings.EqualFold(x, "true") || x == "1"
	}
	return false
}

func apiGenerateCaddyfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	content, err := generateCaddyfile()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	caddyDir := filepath.Join(panelDir, "caddy")
	os.MkdirAll(caddyDir, 0755)
	caddyPath := filepath.Join(caddyDir, "Caddyfile")
	if err := os.WriteFile(caddyPath, []byte(content), 0644); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]any{"success": true, "path": caddyPath, "content": content})
}

func apiCaddyfilePreview(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	cfg := loadConfig()
	if r.Body != nil {
		var body struct {
			Config map[string]any `json:"config"`
		}
		if json.NewDecoder(r.Body).Decode(&body) == nil && body.Config != nil {
			for k, v := range body.Config {
				cfg.Config[k] = v
			}
		}
	}
	content, err := generateCaddyfileFromConfig(cfg.Config)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]string{"content": content})
}

func apiLaunchProd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	content, err := generateCaddyfile()
	if err != nil {
		http.Error(w, "生成 Caddyfile 失败: "+err.Error(), http.StatusInternalServerError)
		return
	}
	caddyDir := filepath.Join(panelDir, "caddy")
	os.MkdirAll(caddyDir, 0755)
	caddyPath := filepath.Join(caddyDir, "Caddyfile")
	if err := os.WriteFile(caddyPath, []byte(content), 0644); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	launchProd := filepath.Join(projectDir, "riveredge-panel", "Launch.prod.sh")
	if runtime.GOOS == "windows" {
		launchProd = filepath.Join(projectDir, "riveredge-panel", "Launch.prod.win.sh")
	}
	if _, err := os.Stat(launchProd); err != nil {
		http.Error(w, "生产启动脚本不存在: "+launchProd, http.StatusInternalServerError)
		return
	}
	cfg := loadConfig().Config
	branch := "develop"
	if v, ok := cfg["git_branch"]; ok && v != nil {
		if s := strings.TrimSpace(fmt.Sprint(v)); s != "" {
			branch = s
		}
	}
	remoteURL, _ := cfg["git_remote_url"].(string)
	remoteURL = strings.TrimSpace(remoteURL)
	env := os.Environ()
	env = append(env, "GIT_BRANCH="+branch)
	if remoteURL != "" {
		env = append(env, "GIT_REMOTE_URL="+remoteURL)
	}
	cmd := exec.Command("bash", launchProd, "start")
	cmd.Dir = projectDir
	cmd.Env = env
	cmd.Stdout = nil
	cmd.Stderr = nil
	if err := cmd.Start(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	port := 8080
	if v, ok := cfg["caddy_proxy_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			port = p
		}
	}
	domain, _ := cfg["caddy_domain"].(string)
	domain = strings.TrimSpace(domain)
	url := fmt.Sprintf("http://127.0.0.1:%d", port)
	if domain != "" {
		url = fmt.Sprintf("https://%s", domain)
	}
	writeJSON(w, map[string]any{"success": true, "message": "生产环境启动中，访问 " + url})
}

func apiUpdateProd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	content, err := generateCaddyfile()
	if err != nil {
		http.Error(w, "生成 Caddyfile 失败: "+err.Error(), http.StatusInternalServerError)
		return
	}
	caddyDir := filepath.Join(panelDir, "caddy")
	os.MkdirAll(caddyDir, 0755)
	caddyPath := filepath.Join(caddyDir, "Caddyfile")
	if err := os.WriteFile(caddyPath, []byte(content), 0644); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	launchProd := filepath.Join(projectDir, "riveredge-panel", "Launch.prod.sh")
	if runtime.GOOS == "windows" {
		launchProd = filepath.Join(projectDir, "riveredge-panel", "Launch.prod.win.sh")
	}
	if _, err := os.Stat(launchProd); err != nil {
		http.Error(w, "生产启动脚本不存在: "+launchProd, http.StatusInternalServerError)
		return
	}
	cfg := loadConfig().Config
	branch := "develop"
	if v, ok := cfg["git_branch"]; ok && v != nil {
		if s := strings.TrimSpace(fmt.Sprint(v)); s != "" {
			branch = s
		}
	}
	remoteURL, _ := cfg["git_remote_url"].(string)
	remoteURL = strings.TrimSpace(remoteURL)
	env := os.Environ()
	env = append(env, "GIT_BRANCH="+branch)
	if remoteURL != "" {
		env = append(env, "GIT_REMOTE_URL="+remoteURL)
	}
	cmd := exec.Command("bash", launchProd, "update")
	cmd.Dir = projectDir
	cmd.Env = env
	cmd.Stdout = nil
	cmd.Stderr = nil
	if err := cmd.Start(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, map[string]any{"success": true, "message": "生产更新已启动：拉取代码 → 迁移 → 重建 → 重启"})
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func checkPortReachable(host string, port int) bool {
	addr := fmt.Sprintf("%s:%d", host, port)
	conn, err := net.DialTimeout("tcp", addr, 2*time.Second)
	if err != nil {
		return false
	}
	conn.Close()
	return true
}

func checkHTTPOk(url string) bool {
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return resp.StatusCode < 500
}

func apiLaunchStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	cfg := loadConfig().Config
	backendPort := 8200
	if v, ok := cfg["backend_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			backendPort = p
		}
	}
	frontendPort := 8100
	if v, ok := cfg["frontend_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			frontendPort = p
		}
	}
	proxyPort := 8080
	if v, ok := cfg["caddy_proxy_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			proxyPort = p
		}
	}
	mobilePort := 8101
	if v, ok := cfg["mobile_port"]; ok && v != nil {
		if p, ok := toInt(v); ok && p > 0 {
			mobilePort = p
		}
	}
	// 手机端：开发模式在 8101 独立进程；生产模式由 Caddy 在 /mobile 提供
	mobileRunning := checkPortReachable("127.0.0.1", mobilePort)
	mobileURL := fmt.Sprintf("http://127.0.0.1:%d", mobilePort)
	mobilePortDisplay := mobilePort
	if !mobileRunning && checkPortReachable("127.0.0.1", proxyPort) {
		mobileURL = fmt.Sprintf("http://127.0.0.1:%d/mobile", proxyPort)
		mobileRunning = checkHTTPOk(mobileURL)
		mobilePortDisplay = proxyPort
	}
	status := map[string]any{
		"backend": map[string]any{
			"running": checkHTTPOk(fmt.Sprintf("http://127.0.0.1:%d/health", backendPort)),
			"port":   backendPort,
			"url":    fmt.Sprintf("http://127.0.0.1:%d", backendPort),
		},
		"frontend": map[string]any{
			"running": checkPortReachable("127.0.0.1", frontendPort),
			"port":   frontendPort,
			"url":    fmt.Sprintf("http://127.0.0.1:%d", frontendPort),
		},
		"mobile": map[string]any{
			"running": mobileRunning,
			"port":   mobilePortDisplay,
			"url":    mobileURL,
		},
		"inngest": map[string]any{
			"running": checkPortReachable("127.0.0.1", 8288),
			"port":   8288,
		},
		"caddy": map[string]any{
			"running": checkPortReachable("127.0.0.1", proxyPort),
			"port":   proxyPort,
			"url":    fmt.Sprintf("http://127.0.0.1:%d", proxyPort),
		},
	}
	writeJSON(w, status)
}

var allowedLogFiles = map[string]bool{
	"backend": true, "frontend": true, "inngest": true, "caddy": true, "mobile": true,
}

func apiLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	file := r.URL.Query().Get("file")
	if file == "" {
		file = "backend"
	}
	if !allowedLogFiles[file] {
		http.Error(w, "invalid log file", http.StatusBadRequest)
		return
	}
	lines := 300
	if n := r.URL.Query().Get("lines"); n != "" {
		if v, err := fmt.Sscanf(n, "%d", &lines); v == 1 && err == nil {
			if lines < 1 {
				lines = 100
			}
			if lines > 1000 {
				lines = 1000
			}
		}
	}
	logPath := filepath.Join(projectDir, ".logs", file+".log")
	data, err := os.ReadFile(logPath)
	if err != nil {
		if os.IsNotExist(err) {
			writeJSON(w, map[string]any{"content": "", "file": file, "message": "日志文件尚未生成，请等待服务启动"})
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	content := string(data)
	lineList := strings.Split(content, "\n")
	if len(lineList) > lines {
		lineList = lineList[len(lineList)-lines:]
	}
	writeJSON(w, map[string]any{"content": strings.Join(lineList, "\n"), "file": file})
}

func cors(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		h(w, r)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth-status", cors(apiAuthStatus))
	mux.HandleFunc("/api/set-master-password", cors(apiSetMasterPassword))
	mux.HandleFunc("/api/login", cors(apiLogin))
	mux.HandleFunc("/api/logout", cors(apiLogout))
	mux.HandleFunc("/api/check", cors(requireAuth(apiCheck)))
	mux.HandleFunc("/api/config", cors(requireAuth(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			apiGetConfig(w, r)
		} else {
			apiSaveConfig(w, r)
		}
	})))
	mux.HandleFunc("/api/install-script/", cors(requireAuth(apiInstallScript)))
	mux.HandleFunc("/api/install/", cors(requireAuth(apiInstall)))
	mux.HandleFunc("/api/install-status/", cors(requireAuth(apiInstallStatus)))
	mux.HandleFunc("/api/generate-env", cors(requireAuth(apiGenerateEnv)))
	mux.HandleFunc("/api/migrate", cors(requireAuth(apiMigrate)))
	mux.HandleFunc("/api/launch", cors(requireAuth(apiLaunch)))
	mux.HandleFunc("/api/launch-prod", cors(requireAuth(apiLaunchProd)))
	mux.HandleFunc("/api/update-prod", cors(requireAuth(apiUpdateProd)))
	mux.HandleFunc("/api/generate-caddyfile", cors(requireAuth(apiGenerateCaddyfile)))
	mux.HandleFunc("/api/caddyfile-preview", cors(requireAuth(apiCaddyfilePreview)))
	mux.HandleFunc("/api/test-postgres", cors(requireAuth(apiTestPostgres)))
	mux.HandleFunc("/api/test-redis", cors(requireAuth(apiTestRedis)))
	mux.HandleFunc("/api/logs", cors(requireAuth(apiLogs)))
	mux.HandleFunc("/api/launch-status", cors(requireAuth(apiLaunchStatus)))
	mux.HandleFunc("/api/health", cors(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]string{"status": "ok"})
	}))

	// 静态文件：内联 HTML
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "/index.html" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(staticHTML)
	})

	addr := ":8300"
	fmt.Println("RiverEdge 部署面板: http://127.0.0.1" + addr)
	fmt.Println("按 Ctrl+C 停止")
	if err := http.ListenAndServe(addr, mux); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
