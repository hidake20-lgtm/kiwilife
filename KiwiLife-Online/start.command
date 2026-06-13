#!/bin/bash
# Kiwi Life Online 一鍵啟動（macOS 雙擊執行）
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "❌ 找不到 Node.js，請先到 https://nodejs.org 安裝 LTS 版本"
  read -p "按 Enter 關閉..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "📦 第一次啟動，安裝套件中（約 1-2 分鐘）..."
  npm install
fi
echo "🥝 啟動伺服器..."
(sleep 2 && open "http://localhost:2567") &
npm start
