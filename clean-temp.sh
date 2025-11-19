#!/bin/bash
# RiverEdge SaaS 框架 - 清理临时文件脚本

echo "🧹 清理临时文件..."

# 清理项目根目录的PID文件
if [ -f "backend.pid" ]; then
    echo "删除 backend.pid"
    rm -f backend.pid
fi

if [ -f "frontend.pid" ]; then
    echo "删除 frontend.pid"
    rm -f frontend.pid
fi

# 清理logs目录外的日志文件
if [ -f "backend.log" ]; then
    echo "删除 backend.log"
    rm -f backend.log
fi

if [ -f "frontend.log" ]; then
    echo "删除 frontend.log"
    rm -f frontend.log
fi

# 清理nul文件
if [ -f "nul" ]; then
    echo "删除 nul 文件"
    rm -f nul
fi

echo "✅ 清理完成"
