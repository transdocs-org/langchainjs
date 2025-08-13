/* eslint-disable global-require,import/no-extraneous-dependencies */

// @ts-check
// 注意：类型注解允许类型检查和IDE自动补全
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
  // 设置站点的生产环境URL
  url: "https://langchainjs.transdocs.org",
  // 设置站点提供的 /<baseUrl>/ 路径
  // 对于GitHub Pages部署，通常是 '/<projectName>/'
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
              // 这允许通过在每个斜杠后插入一个零宽度空格，将长的侧边栏标签分成多行。
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
          '<strong>我们的 <a href="https://academy.langchain.com/courses/ambient-agents/?utm_medium=internal&utm_source=docs&utm_campaign=q2-2025_ambient-agents_co" target="_blank">使用LangGraph构建环境代理</a> 课程现已在LangChain学院上线！</strong>',
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
          // 请将GitHub链接保留在右侧以保持一致性。
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
        copyright: `版权所有 © ${new Date().getFullYear()} LangChain, Inc.`,
      },
      algolia: {
        // Algolia提供的应用程序ID
        appId: "3EZV6U1TYC",

        // 公共API密钥：提交是安全的
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