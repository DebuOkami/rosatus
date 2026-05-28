import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Rosatus',
  description: 'Personal static blog powered by VitePress.',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/DebuOkami/rosatus' }
    ],
    footer: {
      message: 'Powered by VitePress.',
      copyright: 'Copyright © 2026 Rosatus'
    },
    search: {
      provider: 'local'
    }
  }
})
