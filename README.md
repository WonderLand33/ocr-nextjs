# WeChat Image OCR Demo

一个基于Next.js开发的微信图片OCR工具，可以快速从微信截图中提取文字内容。

## 功能特点

- 🖼️ 支持微信截图文字识别
- 🚀 基于Next.js 15.2构建，性能优异
- 💅 使用Tailwind CSS和shadcn/ui构建的现代化UI
- 📱 响应式设计，支持移动端和桌面端
- 🔍 支持图片预览和OCR结果展示

## 效果展示

![主界面](public/screenshots/eg1.png)
![主界面](public/screenshots/eg.png)

主界面支持拖拽上传或点击选择文件，支持PNG、JPG等常见图片格式。上传后会自动进行OCR识别并展示结果。

## 本地开发

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆项目到本地：

```bash
git clone https://github.com/your-username/wx-ocr-demo.git
cd wx-ocr-demo
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果

## 构建部署

执行以下命令构建生产环境版本：

```bash
npm run build
```

构建完成后，可以使用以下命令启动生产环境服务器：

```bash
npm run start
```

## 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI原语

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

[MIT](LICENSE)
