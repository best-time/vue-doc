module.exports = {
  title: '文档',
  description: 'base point',
  markdown: {
    toc: {
      includeLevel: [2, 3, 4, 5, 6]
    }
  },
  themeConfig: {
    docsDir: 'docs',
    editLinks: true,
    // editLinkText: '错别字纠正',
    sidebarDepth: 3,
    nav: [{ text: "js", link: '/js/' },{ text: "css", link: '/css/' },{ text: "关于", link: '/about/' }],
    sidebar: {
    '/about/': [
        {
          title: "vue-base",
          children: [
              '/',
              'a1'
          ]
        }
      ],
      '/js/': [
        {
          title: "javascript",
          children: [
              // '/',
              'classList',
              'operation',
              'Proxy',
              'Reflect',
              'reg',
              'screen'
          ]
        }
      ],
      '/css/': [
        {
          title: "css",
          children: [
              // '/',
              'less',
          ]
        }
      ]
    }
  }
};
