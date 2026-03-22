# Pierre Dellacherie AI 俄罗斯方块 (Tetris)

这是一个基于 **React 19**、**TypeScript** 和 **Vite** 开发的现代俄罗斯方块游戏。它不仅支持手动操作，还集成了一个基于经典的 **Pierre Dellacherie 算法** 的智能 AI 博弈系统。

## 🚀 核心特性

-   **智能 AI 博弈**：一键开启 Pierre Dellacherie 算法，观看 AI 如何以精准的逻辑评估每一步并追求长久生存。
-   **手动挑战模式**：支持标准的键盘控制及**移动端触控 D-pad**（旋转、左右移动、软降、硬降）。
-   **实时视觉反馈**：
    -   **AI 决策轨迹**：在 AI 模式下实时显示目标位置和旋转状态。
    -   **下一个展示**：清晰的下一个方块预览区域。
    -   **沉浸感设计**：采用暗黑霓虹风格界面，配合流畅的微动画。
-   **完整音效系统**：提供旋转、移动、消行及按钮点击的实时音效反馈。
-   **战绩追踪**：内置历史战绩榜单，本地汇总您的最高得分记录。

## 🛠️ 技术栈

-   **前端框架**：[React 19](https://react.dev/)
-   **构建工具**：[Vite 8](https://vitejs.dev/)
-   **编程语言**：[TypeScript](https://www.typescriptlang.org/)
-   **样式处理**：Vanilla CSS & CSS-In-JS
-   **核心算法**：Pierre Dellacherie 评价函数

## 🧠 AI 算法详解 (Pierre Dellacherie)

本项目实现的 AI 机器人通过枚举当前方块所有可能的放置位置和旋转状态，并使用以下六个维度的加权评分来寻找“最优解”：

| 评价维度 | 描述 | 权重 |
| :--- | :--- | :--- |
| **下落高度 (Landing Height)** | 方块最终落点的高度（越低越好） | -4.5 |
| **消行贡献 (Eroded Piece Cells)** | 本次消掉的行数与当前方块在该行格数的乘机 | 3.418 |
| **行变换数 (Row Transitions)** | 每一行格子的空/实变换次数 | -3.21789 |
| **列变换数 (Col Transitions)** | 每一列格子的空/实变换次数 | -9.3487 |
| **空洞数 (Holes)** | 被上方方块遮挡的空白格子数 | -7.899 |
| **井深累计 (Cumulative Wells)** | 所有“井”的深度阶乘累加 | -3.3856 |

## 📦 快速开始

### 1. 环境准备
确保您的系统中已安装 [Node.js](https://nodejs.org/) (建议 v18+)。

### 2. 安装依赖
```bash
npm install
```

### 3. 本地开发运行
```bash
npm run dev
```
启动后访问控制台输出的本地地址 (通常是 `http://localhost:5173`) 即可开始游戏。

### 4. 项目构建
```bash
npm run build
```

---

由 [Antigravity](https://github.com/google-deepmind) 参与协作开发。
