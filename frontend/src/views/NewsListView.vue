<template>
    <main class="container py-5">
        <header class="mb-4"><span class="eyebrow">CARSTORE</span>
            <h1>Tin tức ô tô</h1>
        </header>
        <div v-if="loading" class="text-center py-5">Đang tải...</div>
        <div v-else class="news-grid">
            <article v-for="item in articles" :key="item.id" class="news-card">
                <div class="news-image-wrapper"><img class="news-thumb"
                        :src="newsImageUrl(item)" :alt="item.title" @error="useNewsFallback"></div>
                <div class="news-card-body"><small>{{ formatDate(item.createdAt) }}</small>
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.summary }}</p><router-link :to="`/news/${item.slug}`">Đọc chi tiết</router-link>
                </div>
            </article>
        </div>
        <p v-if="!loading && !articles.length" class="text-center py-5">Chưa có tin tức.</p>
    </main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { newsApi, carImageUrl } from '../api'
import { useAutoRefresh } from '../composables/useAutoRefresh'

const articles = ref([])
const loading = ref(true)
const formatDate = value => value ? new Date(value).toLocaleDateString('vi-VN') : ''
const newsImageUrl = item => carImageUrl(item?.image || item?.thumbnail || 'Wildtrak2025.png')

function useNewsFallback(event) {
  event.target.onerror = null
  event.target.src = '/images/Wildtrak2025.png'
}

async function loadNews() {
  try {
    const { data } = await newsApi.getPublished()
    articles.value = data.data || []
  } finally {
    loading.value = false
  }
}

onMounted(loadNews)
useAutoRefresh(loadNews)
</script>
<style
    scoped>
    .eyebrow {
        color: #b91c1c;
        font-weight: 800
    }

    .news-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px
    }

    .news-card {
        overflow: hidden;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #fff;
        padding: 0 !important;
        display: flex;
        flex-direction: column;
        transition: transform .2s ease, box-shadow .2s ease
    }

    .news-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%)
    }

    .news-image-wrapper {
        width: 100%;
        height: 220px;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center
    }

    .news-thumb {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        object-position: center;
        transition: transform .3s ease
    }

    .news-card:hover .news-thumb {
        transform: scale(1.04)
    }

    .news-card-body {
        padding: 20px;
        display: flex;
        flex: 1;
        flex-direction: column
    }

    .news-card small {
        color: #6b7280
    }

    .news-card h2 {
        font-size: 1.2rem;
        font-weight: 800;
        margin: 8px 0
    }

    .news-card p {
        color: #6b7280
    }

    @media(max-width:850px) {
        .news-grid {
            grid-template-columns: 1fr
        }
    }
</style>
