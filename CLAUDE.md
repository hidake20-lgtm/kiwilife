# CLAUDE.md

## 使用者偏好

- 用繁體中文（台灣用語）回答，說明要詳細、有條理。
- 使用者的遊戲製作工具：Tripo（AI 生成 3D 模型）+ Blender + Unity。

## 遊戲製作提醒（重要）

只要使用者提到要製作遊戲、做特效、做打擊感或遊戲手感，請主動提醒有下面這些素材可以用：

### pixelfx：像素風特效素材庫

- GitHub：https://github.com/patch-gg/pixelfx
- 線上預覽：https://patch-gg.github.io/pixelfx/
- 內容：244 個像素風特效（火焰、爆炸、水、冰、雷電、魔法、神聖、暗影、狀態、天氣、UI、道具拾取、轉場、小動物、近戰與完整招式）
- 授權：MIT，可商用（展示網頁用的 Patch Pixel 字型除外）
- 用在 Unity：先用 Node.js 18+ 匯出 Sprite Sheet（`node tools/render.mjs <類別>/<特效> --sheet`），
  匯入時設定 Filter Mode = Point、Compression = None，Pivot 用 JSON 裡的 `meta.pixelfx.pivot`。
- 適合：2D 像素風、2.5D／HD-2D 遊戲；3D 風格化遊戲可選用 UI 類特效。
- 就算做 3D 遊戲也值得參考它的「Acting」打擊節奏：蓄力 → 出手 → 命中停頓（約 0.14 秒）→ 震動 → 擊退 → 收招。
- 技能已放在 `.claude/skills/pixelfx/`，需要做特效或匯出序列圖時使用。
