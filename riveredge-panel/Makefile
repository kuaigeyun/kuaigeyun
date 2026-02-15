# RiverEdge 部署面板 - 单二进制构建
# 编译前需安装 Go：https://go.dev/dl/
# 编译后得到零依赖可执行文件，可直接在空白 Windows/Linux 运行

.PHONY: build build-windows build-linux clean

build:
	go build -o riveredge-panel ./panel

build-windows:
	GOOS=windows GOARCH=amd64 go build -o riveredge-panel-windows-amd64.exe ./panel

build-linux:
	GOOS=linux GOARCH=amd64 go build -o riveredge-panel-linux-amd64 ./panel

build-all: build-windows build-linux

clean:
	rm -f riveredge-panel riveredge-panel-*.exe riveredge-panel-*
