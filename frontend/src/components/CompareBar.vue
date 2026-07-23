<template>
  <aside v-if="selectedCars.length" class="compare-bar">
    <div class="compare-bar__title">
      <strong>So sánh xe</strong>
      <span>{{ selectedCars.length }} xe đã chọn · tối đa 3</span>
    </div>

    <div class="compare-bar__cars">
      <div v-for="car in selectedCars" :key="car.id" class="compare-chip">
        <img :src="carImageUrl(car.image)" :alt="car.name" />
        <span>{{ car.name }}</span>
        <button type="button" aria-label="Bỏ xe khỏi so sánh" @click="remove(car.id)">×</button>
      </div>

      <div
        v-for="slot in Math.max(0, 3 - selectedCars.length)"
        :key="`empty-${slot}`"
        class="compare-chip compare-chip--empty"
      >
        + Thêm xe
      </div>
    </div>

    <router-link
      v-if="selectedCars.length >= 2"
      class="ford-btn-primary compare-go"
      :to="`/compare?ids=${selectedCars.map((car) => car.id).join(',')}`"
    >
      SO SÁNH
    </router-link>

    <span v-else class="compare-hint">Chọn thêm 1 xe để so sánh</span>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { carApi, carImageUrl } from '../api'
import { useCompare } from '../composables/useCompare'

const { selectedIds, remove } = useCompare()
const selectedCars = ref([])
let requestVersion = 0

watch(
  selectedIds,
  async (ids) => {
    const currentVersion = ++requestVersion
    const normalizedIds = [...new Set(
      ids.map(Number).filter((id) => Number.isInteger(id) && id > 0),
    )].slice(0, 3)

    if (!normalizedIds.length) {
      selectedCars.value = []
      return
    }

    try {
      const responses = await Promise.all(
        normalizedIds.map((id) => carApi.getById(id).catch(() => null)),
      )

      if (currentVersion !== requestVersion) return

      selectedCars.value = responses
        .filter(Boolean)
        .map((response) => response.data?.data || response.data)
        .filter((car) => car && car.id != null)
    } catch {
      if (currentVersion === requestVersion) selectedCars.value = []
    }
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.compare-bar {
  position: fixed;
  z-index: 2000;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(1120px, calc(100% - 24px));
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #ddd;
  border-top: 4px solid #d71920;
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.compare-bar__title {
  min-width: 105px;
  display: flex;
  flex-direction: column;
}

.compare-bar__title span,
.compare-hint {
  font-size: 13px;
  color: #666;
}

.compare-bar__cars {
  display: grid;
  grid-template-columns: repeat(3, minmax(145px, 1fr));
  gap: 10px;
  flex: 1;
}

.compare-chip {
  height: 58px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
  font-size: 13px;
  font-weight: 700;
}

.compare-chip img {
  width: 58px;
  height: 42px;
  object-fit: cover;
  border-radius: 5px;
}

.compare-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compare-chip button {
  margin-left: auto;
  border: 0;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
}

.compare-chip--empty {
  justify-content: center;
  color: #999;
  border-style: dashed;
}

.compare-go {
  white-space: nowrap;
  text-decoration: none;
}

.compare-hint {
  min-width: 100px;
  text-align: center;
}

@media (max-width: 800px) {
  .compare-bar {
    align-items: stretch;
    flex-direction: column;
    bottom: 8px;
  }

  .compare-bar__title {
    flex-direction: row;
    justify-content: space-between;
  }

  .compare-bar__cars {
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
  }

  .compare-chip {
    height: auto;
    min-height: 48px;
  }

  .compare-chip img {
    display: none;
  }

  .compare-go {
    text-align: center;
  }

  .compare-chip--empty {
    display: none;
  }
}
</style>
