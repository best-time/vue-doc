module.exports = {
  title: 'vue文档',
  description: 'vue文档分析',
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
    nav: [{ text: "关于", link: '/about/' }],
    sidebar: {
    '/about/': [
        {
          title: "vue-base",
          children: [
              '',
              'a1'
          ]
        }
      ]
    }
  }
};
