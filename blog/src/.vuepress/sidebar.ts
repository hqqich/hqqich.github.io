import {sidebar} from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "个人学习日志",
      icon: "laptop-code",
      prefix: "md/dev-log/",
      children: ["day01.md"],
    },
  ],
});
