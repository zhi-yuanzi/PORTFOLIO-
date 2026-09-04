# Jack — 3D Creator

使用 React 18、TypeScript、Tailwind CSS 3、Framer Motion 和 Lucide React 搭建的个人作品集框架。

## 运行

需要 Node.js 20.19+（推荐 22 LTS）及 pnpm。

```sh
pnpm install
pnpm dev
```

浏览器打开终端显示的本地地址（默认 http://127.0.0.1:5173）。

```sh
pnpm build    # TypeScript 检查与生产构建
pnpm preview  # 预览 dist 构建结果
```

也可以使用 npm install、npm run dev 和 npm run build。

## 修改内容

- `src/data.ts`：姓名、联系邮箱、介绍、服务、项目名称及项目链接。
- `src/assets.json`：提示词中的肖像、4 张装饰图、21 张动图、9 张项目图的原始 URL。
- `src/App.tsx`：Hero → Marquee → About → Services → Projects，另附联系页脚和弹窗。
- `src/components.tsx`：FadeIn、Magnet、AnimatedText、ContactButton、图片容错及弹窗。
- `src/styles.css`：渐变、字体、尺寸、响应式布局与动效样式。
- `index.html`：页面标题、描述和 Google Fonts 配置。

## 联系和项目链接

提示词没有提供真实邮箱和项目外链。默认点击 Contact Me 打开需求表单，支持校验、生成和复制项目需求，**不会发送消息**。在 `profile.email` 填入自己的邮箱后，提交按钮会调用访客的邮件客户端。

项目 `url` 留空时，Live Project 打开作品预览弹窗；填写真实 URL 后，在新标签页打开该网站。

Price 导航指向服务区块，价格按项目报价，没有添加虚构收费。

## 响应式和动画

- 桌面支持磁吸肖像、随滚动反向移动的双排动图、逐字显现及 3 张项目卡片叠放。
- 768px 以下的项目卡片按正常文档流排列，避免小屏幕被 sticky 卡片遮挡。
- 默认展示完整动效；页脚 Motion on/off 可切换减少动态效果，并保存访客选择。此设置独立于系统或内嵌浏览器的偏好；外部 GIF 自身仍可能播放。
- 弹窗支持 Escape、键盘焦点约束及关闭后的焦点还原；表单配有标签和状态提示。
- 图片懒加载，外链加载失败时显示抽象占位图；字体无法加载时回退到 sans-serif。

## 素材与上线

已将 34 张原始素材缓存到 `public/media/`，页面优先使用同源本地素材，不依赖访客连接外部图片服务器。`src/assets.json` 保留原始 URL，`src/local-assets.json` 保存路径映射。第 21 张动图源地址返回 HTTP 404，直接显示占位图。运行 `node scripts/cache-assets.mjs` 可重新获取素材。原始 GIF 较大（素材合计约 183 MB），上线前可按需压缩。本项目只含前端，无表单后台或数据存储。

执行 `pnpm build` 后将 `dist/` 发布到任意静态网站托管服务即可。

验证记录：TypeScript 与生产构建通过；390、768、1440、1920px 宽度无横向溢出；需求复制、项目弹窗及 Escape 关闭验证通过。测试时 hero-celestia 动图被浏览器以 ERR_BLOCKED_BY_ORB 拒绝，自动使用占位图；其他高清素材可能需要较长加载时间。


图片默认可见，不以 load 事件控制透明度；图片加载完成前、缓存命中及热更新后均不会被加载状态隐藏。头像保留固有比例，磁吸同时兼容 pointermove 与 mousemove，并在离开或滚动时归位。

# PORTFOLIO-
