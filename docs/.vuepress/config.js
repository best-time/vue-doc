module.exports = {
  title: '文档',
  description: 'base point',
  markdown: {
    lineNumbers: true,
    toc: {
      includeLevel: [2, 3, 4, 5, 6],
    },
  },
  // plugins: ['@vuepress/back-to-top'],
  plugins: {
    '@vuepress/last-updated': true, // 更新时间
    '@vuepress/back-to-top': true, // 返回顶部
    '@vuepress/nprogress': true, // 进度条
  },
  themeConfig: {
    docsDir: 'docs',
    editLinks: true,
    // editLinkText: '错别字纠正',
    sidebarDepth: 2,
    nav: [
      {text: 'js', link: '/js/'},
      {text: 'css', link: '/css/'},
      {text: 'git', link: '/git/'},
      {text: '关于', link: '/about/'},
    ],
    sidebar: {
      '/about/': [
        {
          title: 'vue-base',
          children: ['/', 'a1'],
        },
      ],
      '/js/': [
        {
          title: 'js',
          children: [
            // '/',
            'designPatterns',
            'classList',
            'operation',
            'reg',
            'screen',
          ],
        },
        {
          title: 'es6',
          children: [
            // '/',
            'Proxy',
            'Reflect',
            {title: 'typescript', path: '/js/es6/typescript'},
          ],
        },
      ],
      '/css/': [
        {
          title: 'css',
          children: [
            // '/',
            'less',
          ],
        },
      ],

      '/git/': [
        {
          title: 'git命令',
          children: [
            // '/',
            'git',
          ],
        },
      ],
    },
  },
};
