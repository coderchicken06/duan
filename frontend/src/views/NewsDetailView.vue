<template>
    <main class="container py-5 news-detail">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <article v-else-if="news"><span class="eyebrow">TIN TỨC CARSTORE</span>
            <h1>{{ news.title }}</h1>
            <p class="meta">{{ formatDate(news.createdAt) }} · {{ news.author }}</p><img class="news-image"
                :src="newsImageUrl(news)" :alt="news.title" @error="useNewsFallback">
            <p class="summary">{{ news.summary }}</p>
            <div class="content">{{ news.content }}</div>
        </article>
        <div v-else class="text-center">Đang tải...</div>
    </main>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { newsApi, carImageUrl } from '../api'
import { useAutoRefresh } from '../composables/useAutoRefresh'

const route = useRoute()
const news = ref(null)
const error = ref('')
const formatDate = value => value ? new Date(value).toLocaleDateString('vi-VN') : ''
const newsImageUrl = item => carImageUrl(item?.image || item?.thumbnail || 'Wildtrak2025.png')

function useNewsFallback(event) {
  event.target.onerror = null
  event.target.src = '/images/Wildtrak2025.png'
}

async function loadNews() {
  try {
    const { data } = await newsApi.getBySlug(route.params.slug)
    news.value = data.data
    error.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Không thể tải tin tức'
  }
}

onMounted(loadNews)
useAutoRefresh(loadNews)
</script>
<style
    scoped>
    .news-detail {
        max-width: 900px
    }

    .eyebrow {
        color: #b91c1c;
        font-weight: 800
    }

    .news-detail h1 {
        font-weight: 900;
        margin: 10px 0
    }

    .meta {
        color: #6b7280
    }

    .news-detail .news-image {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        object-position: center;
        border-radius: 14px;
        background: #f3f4f6;
        margin: 20px 0
    }

    .summary {
        font-size: 1.15rem;
        font-weight: 700
    }

    .content {
        white-space: pre-wrap;
        line-height: 1.8
    }
</style>
