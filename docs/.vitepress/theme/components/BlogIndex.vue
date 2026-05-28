<script setup lang="ts">
import { withBase } from 'vitepress'

const modules = import.meta.glob('../../../posts/*.md', { eager: true })

type PostModule = {
  __pageData?: {
    frontmatter?: {
      title?: string
      date?: string | Date
      description?: string
      tags?: string[]
    }
  }
}

function formatDate(date: string | Date | undefined) {
  if (!date) return ''
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}T/.test(date)) return date.slice(0, 10)
  return date
}

const posts = Object.entries(modules)
  .map(([path, module]) => {
    const frontmatter = (module as PostModule).__pageData?.frontmatter ?? {}
    const fileName = path.split('/').pop()?.replace(/\.md$/, '') ?? ''

    return {
      fileName,
      title: frontmatter.title || fileName,
      date: formatDate(frontmatter.date),
      description: frontmatter.description || '',
      tags: frontmatter.tags ?? [],
      link: withBase(`/posts/${fileName}`)
    }
  })
  .filter((post) => post.fileName !== 'index')
  .sort((a, b) => {
    if (!a.date && !b.date) return a.title.localeCompare(b.title)
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })
</script>

<template>
  <section v-if="posts.length" class="blog-index">
    <article v-for="post in posts" :key="post.link" class="post-item">
      <a class="post-title" :href="post.link">{{ post.title }}</a>
      <time v-if="post.date" class="post-date">{{ post.date }}</time>
      <p v-if="post.description" class="post-description">
        {{ post.description }}
      </p>
      <div v-if="post.tags.length" class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">
          {{ tag }}
        </span>
      </div>
    </article>
  </section>
  <p v-else class="empty-posts">还没有文章。把 Markdown 文件放进 <code>docs/posts/</code> 后会自动显示在这里。</p>
</template>
