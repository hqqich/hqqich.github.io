// 这个是学习日志里的页面导航，新加的页面要写在children里面；
import {sidebar} from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "学习日志",
      icon: "laptop-code",
      prefix: "md/dev-log/",
      children: ["day01.md"],
    },
  ],
});
