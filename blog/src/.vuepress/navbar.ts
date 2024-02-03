// 标题栏，指定路由跳转
import {navbar} from "vuepress-theme-hope";

export default navbar([
  "/",
  "/md/resume",
  {
    text: "学习日志",
    icon: "book",
    link: "/md/dev-log/day01.md",
  }
]);
