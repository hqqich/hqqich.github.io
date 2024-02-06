// 主题配置
import {hopeTheme} from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
    hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",
    author: {
        name: "hqqich",
        url: "https://mister-hope.com",
    },
    iconAssets: "fontawesome-with-brands",
    logo: "/logo.svg",
    repo: "hqqich/hqqich.github.io",
    docsDir: "src",
    // navbar
    navbar,
    // sidebar
    sidebar,
    footer: "hqqich",
    displayFooter: true,
    encrypt: {
        config: {
            "/demo/encrypt.html": ["1234"],
        },
    },
    // page meta
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },
    plugins: {
        mdEnhance: {
            align: true,
            attrs: true,
            card: true,
            codetabs: true,
            demo: true,
            figure: true,
            imgLazyload: true,
            imgSize: true,
            include: true,
            mark: true,
            playground: {
                presets: ["ts", "vue"],
            },
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({tag}) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: {type: "tip"},
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
        },
    },
});
