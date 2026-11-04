# 网络拓扑实验室

zzhhao531 的独立 Vue 3 / Vite 教学项目。

计划站点：https://zzhhao531.github.io/network-topology-lab/

姊妹站点：https://zzhhao531.github.io/network-visual-lab/

## 本地使用

需要 Node.js 24。

```sh
npm ci
npm test
npm run dev
npm run build
```

打开开发服务输出的地址（包含 /network-topology-lab/）。主题使用 hash 深链接，刷新无需 404 回退。空格播放、左右方向键切步、R 重置；表单和按钮拥有焦点时不拦截键盘。

## 发布

仓库 Settings → Pages → Source 选择 GitHub Actions，推送 main 即自动测试、构建、部署。工作流只在部署任务授予 Pages 写入及 OIDC 权限。无需保存个人令牌。首次上线须检查 Actions 结果和实际站点。

## 原创与来源

本项目独立实现，不是 WBW-QD 项目的 fork，不包含其源代码、图片、说明文案或 Git 历史。参考站仅用于确认同类教学主题。审计见 [RIGHTS.md](docs/RIGHTS.md)。所有图形由本项目 SVG 生成，无第三方图片。Vue 和 Vite 各自适用其上游许可证（MIT），安装包内保留上游声明。

未给本项目擅自添加开源许可；在另行明确授权前，保留适用权利。

## 模型边界

是教学演示，不是真实抓包或协议模拟器。每个实验下方说明其简化范围。拓扑使用无权图路径算法，生成树不实现完整 IEEE STP。
