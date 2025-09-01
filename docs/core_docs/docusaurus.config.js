/* eslint-disable global-require,import/no-extraneous-dependencies */

// @ts-check
// 注意：类型注解支持类型检查与 IDE 自动补全
// eslint-disable-next-line import/no-extraneous-dependencies
const { ProvidePlugin } = require("webpack");
const path = require("path");
require("dotenv").config();

const examplesPath = path.resolve(__dirname, "..", "..", "examples", "src");
const mdxComponentsPath = path.resolve(__dirname, "docs", "mdx_components");

const baseLightCodeBlockTheme = require("prism-react-renderer/themes/vsLight");
const baseDarkCodeBlockTheme = require("prism-react-renderer/themes/vsDark");

const baseUrl = "/";

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: '🦜️🔗 Langchain | Langchainjs 中文文档',
  tagline: "LangChain.js 中文文档",
  favicon: "img/brand/favicon.png",
  // 在此设置您站点的生产环境 URL
  url: "https://langchainjs.transdocs.org",
  // 设置站点服务的 /<baseUrl>/ 路径
  // 对于 GitHub Pages 部署，通常是 '/<projectName>/'
  baseUrl,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  plugins: [
    () => ({
      name: "custom-webpack-config",
      configureWebpack: () => ({
        plugins: [
          new ProvidePlugin({
            process: require.resolve("process/browser"),
          }),
        ],
        resolve: {
          fallback: {
            path: false,
            url: false,
          },
          alias: {
            "@examples": examplesPath,
            "@mdx_components": mdxComponentsPath,
            react: path.resolve("../../node_modules/react"),
          },
        },
        module: {
          rules: [
            {
              test: examplesPath,
              use: ["json-loader", "./scripts/code-block-loader.js"],
            },
            {
              test: /\.ya?ml$/,
              use: "yaml-loader",
            },
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      }),
    }),
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: "GTM-NN9LVH7S",
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            sidebarItems.forEach((subItem) => {
              // 通过在斜杠后插入零宽空格，允许将长侧边栏标签拆分为多行
              if (
                "label" in subItem &&
                subItem.label &&
                subItem.label.includes("/")
              ) {
                // eslint-disable-next-line no-param-reassign
                subItem.label = subItem.label.replace(/\//g, "/\u200B");
              }
              if (args.item.className) {
                subItem.className = args.item.className;
              }
            });
            return sidebarItems;
          },
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve("swc-loader"),
      options: {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2017",
        },
        module: {
          type: isServer ? "commonjs" : "es6",
        },
      },
    }),
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { name: 'description', content: 'langchainjs 中文文档，每天定时同步官网更新。' },
        { name: 'keywords', content: 'langchain,langchainjs,中文文档' },
      ],
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        content:
          '我们的新课程《LangChain Academy：用 LangGraph 进行深度研究》现已上线！<a href="https://academy.langchain.com/courses/deep-research-with-langgraph/?utm_medium=internal&utm_source=docs&utm_campaign=q3-2025_deep-research-course_co" target="_blank">免费报名</a>。',
        backgroundColor: "#d0c9fe",
      },
      prism: {
        theme: {
          ...baseLightCodeBlockTheme,
          plain: {
            ...baseLightCodeBlockTheme.plain,
            backgroundColor: "#F5F5F5",
          },
        },
        darkTheme: {
          ...baseDarkCodeBlockTheme,
          plain: {
            ...baseDarkCodeBlockTheme.plain,
            backgroundColor: "#222222",
          },
        },
      },
      image: "img/brand/theme-image.png",
      navbar: {
        logo: {
          src: "img/brand/wordmark.png",
          srcDark: "img/brand/wordmark-dark.png",
        },
        items: [
          {
            type: "docSidebar",
            position: "left",
            sidebarId: "integrations",
            label: "集成",
          },
          {
            href: "https://v03.api.js.langchain.com",
            label: "API 参考",
            position: "left",
          },
          {
            type: "dropdown",
            label: "更多",
            position: "left",
            items: [
              {
                to: "/docs/people/",
                label: "人员",
              },
              {
                to: "/docs/community",
                label: "社区",
              },
              {
                to: "/docs/troubleshooting/errors",
                label: "错误参考",
              },
              {
                to: "/docs/additional_resources/tutorials",
                label: "外部指南",
              },
              {
                to: "/docs/contributing",
                label: "贡献",
              },
            ],
          },
          {
            type: "dropdown",
            label: "v0.3",
            position: "right",
            items: [
              {
                label: "v0.3",
                href: "/docs/introduction",
              },
              {
                label: "v0.2",
                href: "https://js.langchain.com/v0.2/docs/introduction",
              },
              {
                label: "v0.1",
                href: "https://js.langchain.com/v0.1/docs/get_started/introduction",
              },
            ],
          },
          {
            type: "dropdown",
            label: "🦜🔗",
            position: "right",
            items: [
              {
                href: "https://smith.langchain.com",
                label: "LangSmith",
              },
              {
                href: "https://docs.smith.langchain.com",
                label: "LangSmith 文档",
              },
              {
                href: "https://smith.langchain.com/hub",
                label: "LangChain Hub",
              },
              {
                href: "https://github.com/langchain-ai/langserve",
                label: "LangServe",
              },
              {
                href: "https://python.langchain.com/",
                label: "Python 文档",
              },
            ],
          },
          {
            href: "https://chatjs.langchain.com",
            label: "聊天",
            position: "right",
          },
          // 请保持 GitHub 链接在右侧以保持一致性
          {
            href: "https://github.com/langchain-ai/langchainjs",
            className: "header-github-link",
            position: "right",
            "aria-label": "GitHub 仓库",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "社区",
            items: [
              {
                label: "LangChain 论坛",
                href: "https://forum.langchain.com/",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/LangChainAI",
              },
            ],
          },
          {
            title: "GitHub",
            items: [
              {
                label: "Python",
                href: "https://github.com/langchain-ai/langchain",
              },
              {
                label: "JS/TS",
                href: "https://github.com/langchain-ai/langchainjs",
              },
            ],
          },
          {
            title: "更多",
            items: [
              {
                label: "首页",
                href: "https://langchain.com",
              },
              {
                label: "博客",
                href: "https://blog.langchain.dev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LangChain, Inc.`,
      },
      algolia: {
        // Algolia 提供的应用 ID
        appId: "3EZV6U1TYC",

        // 公开 API 密钥：可以安全提交
        // 当前关联到 erick@langchain.dev
        apiKey: "180851bbb9ba0ef6be9214849d6efeaf",

        indexName: "js-langchain-latest",

        contextualSearch: false,
      },
    }),

  scripts: [
    baseUrl + "js/job_link.js",
    {
      src: 'https://cdn.jsdmirror.com/gh/transdocs-org/cdn/transdocs-info-modal.js',
      defer: true
    },
    {
      src: 'https://hm.baidu.com/hm.js?2fe1095387fd2f2c25892a4fde2f0cc2',
      async: true
    },
  ],

  customFields: {
    supabasePublicKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
};

module.exports = config;