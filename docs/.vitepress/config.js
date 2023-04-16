export default {
    lang: 'en-US',
    title: 'OMS',
    description: 'Vite & Vue powered static site generator.',
    lastUpdated: true,
    themeConfig: {
      logo: 'logo.png',
      nav: nav(),
      sidebar: {
        '/oms/': sidebarGuide(),
        '/btf/': sidebarConfig(),
        '/backend/': sidebarBackend(),
      },
      editLink: {
        pattern: 'https://github.com/daodao97/oms/edit/master/docs/:path',
        text: 'Edit this page on GitHub'
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/daodao97/oms' }
      ],
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2021-present daodao97'
      },
    }
  }
  
  function nav() {
    return [
      { text: 'OMS', link: '/oms/getting-started', activeMatch: '/oms/' },
      { text: '前端组件', link: '/btf/index', activeMatch: '/btf/' },
      { text: '后端', link: '/backend/index', activeMatch: '/backend/' },
    ]
  }
  
  function sidebarGuide() {
    return [
      {
        text: '介绍',
        collapsible: true,
        items: [
          { text: '快速开始', link: '/oms/getting-started' },
          { text: '架构设计', link: '/oms/structure' },
          { text: 'API交互协议', link: '/oms/iiop' },
        ]
      },
      {
        text: '页面配置',
        collapsible: true,
        items: [
          { text: 'PageSchema', link: '/oms/page-schema' },
        ]
      },
      {
        text: '权限管理',
        collapsible: true,
        items: []
      },
    ]
  }
  
  function sidebarConfig() {
    return [
      {
        text: '表单',
        collapsible: true,
        items: [
          { text: 'Form', link: '/btf/form' },
          { text: 'Input', link: '/btf/input' },
          { text: 'Select', link: '/btf/select' },
          { text: 'Number', link: '/btf/number' },
        ]
      },
      {
        text: '列表',
        collapsible: true,
        items: [
          { text: 'Table', link: '/btf/vform' },
          { text: '单元格', link: '/btf/vform' },
        ]
      },
      {
        text: '按钮',
        collapsible: true,
        items: [
          { text: 'Button', link: '/btf/vform' },
          { text: 'ButtonGroup', link: '/btf/vform' },
          { text: '按钮类型', link: '/btf/vform' },
        ]
      },
    ]
  }

  function sidebarBackend() {
    return [
      {
        text: '命令行工具',
        collapsible: true,
        items: []
      },
      {
        text: '脚手架',
        collapsible: true,
        items: []
      },
      {
        text: '通用DB',
        collapsible: true,
        items: []
      },
    ]
  }