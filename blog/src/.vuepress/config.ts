// 项目全局设置
import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  // dest: "./dev-ops/nginx/html"  // nginx 用这个
  dest: "./dist",
  base: "/blog/dist/",  // 主路由，因为这里放在github.io上，所以用这个前缀
  lang: "zh-CN",
  title: "blog",
  description: "学习成长经历",
  theme,
});
