import re
import os

root = "src"
files = []
for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        if fn.endswith((".tsx", ".ts")):
            path = os.path.join(dirpath, fn)
            with open(path, encoding="utf-8") as f:
                content = f.read()
            if re.search(
                r"(Modal\.confirm|getAntdModal\(\)\.confirm|modal\.confirm|modalApi\.confirm)",
                content,
            ):
                count = len(
                    re.findall(
                        r"(Modal\.confirm|getAntdModal\(\)\.confirm|modal\.confirm|modalApi\.confirm)",
                        content,
                    )
                )
                files.append((path.replace("\\", "/"), count))
files.sort(key=lambda x: x[1])
print(f"Total files: {len(files)}, Total confirms: {sum(c for _, c in files)}")
for p, c in files:
    print(f"{c:3d} {p}")
