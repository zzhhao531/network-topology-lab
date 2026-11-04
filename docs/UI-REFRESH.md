# 界面美化记录

2026-11-04。按 Impeccable typeset、layout、polish 指南应用，参考 Ant Design 中文排版原则和交互式教学中图形与说明相邻的组织方式。技能安装在用户项目目录，不纳入网站发布。引擎因缓存权限未启动，本次直接读取项目和指南，未运行自动设计检测或宣称完整 critique 流程。

已统一系统中文字体、字号角色、间距、颜色、SVG 图标与键盘焦点。移除重复站点大标题；实验内容成为主标题。宽屏把步骤与画布并排，中屏步骤两列，手机单列。步骤按钮沿用现有 go(index)，可停止播放后定位。当前状态、路径、活动树和故障用文字、线型、颜色共同表达。辅助知识改为分隔和留白，画布保持浅色以便连续阅读。

协议封装图显示四层过程，链路层帧头在左、帧尾在右。拓扑故障边始终用红色虚线，备用边使用灰色虚线。

验证：两站原有 8 项逻辑检查，生产构建；桌面宽屏及 390px iframe 布局，iframe 内有效宽度 380px，页面 scrollWidth 与 clientWidth 相同。手机端测试断开 A–F 后显示 A–B–F。桌面验证步骤定位、播放、切换主题重置进度。两站浏览器控制台未见错误。另做独立代码复核，未发现发布阻塞项。

参考：
- https://github.com/pbakaus/impeccable ，本地安装固定提交 695cea5c6d1cbd420fc331375c7ef126a774e5f7
- https://ant.design/docs/spec/font-cn/
- https://www.redblobgames.com/pathfinding/a-star/introduction.html

不包含以上站点的源代码、图形或原文复制；页面与 SVG 均由本项目独立实现。
