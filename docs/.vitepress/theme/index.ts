import DefaultTheme from 'vitepress/theme'
import BlogIndex from './components/BlogIndex.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogIndex', BlogIndex)
  }
}
