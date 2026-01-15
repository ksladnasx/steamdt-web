<template>
  <div class="skin-info-container">
    <!-- 基本信息卡片 -->
    <div class="basic-info-card">
      <h3 class="card-title">饰品信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">名称：</span>
          <span class="info-value">{{ skin.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Hash名称：</span>
          <span class="info-value code">{{ skin.marketHashName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">平台数量：</span>
          <span class="info-value">{{ skin.platformList.length }}</span>
        </div>
      </div>
    </div>

    <!-- 平台ID卡片 -->
    <div class="platforms-card">
      <h3 class="card-title">平台ID</h3>
      <div class="platforms-grid">
        <div
          v-for="platform in skin.platformList"
          :key="platform.name"
          class="platform-item"
        >
          <div class="platform-name">{{ platform.name }}</div>
          <div class="platform-id">{{ platform.itemId }}</div>
        </div>
      </div>
    </div>

    <!-- 查询按钮 -->
    <div class="action-buttons">
      <button
        class="query-btn primary"
        :disabled="loadingPrice"
        @click="queryPrice"
      >
        <span v-if="loadingPrice" class="loading">查询价格中...</span>
        <span v-else>查询实时价格</span>
      </button>
      <button
        class="query-btn secondary"
        :disabled="loadingAvg"
        @click="queryAvgPrice"
      >
        <span v-if="loadingAvg" class="loading">查询中...</span>
        <span v-else>查询7日均价</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SkinItem } from '@/types'

const props = defineProps<{
  skin: SkinItem
}>()

const emit = defineEmits<{
  queryPrice: [marketHashName: string]
  queryAvgPrice: [marketHashName: string]
}>()

const loadingPrice = ref(false)
const loadingAvg = ref(false)

const queryPrice = () => {
  loadingPrice.value = true
  emit('queryPrice', props.skin.marketHashName)
  setTimeout(() => {
    loadingPrice.value = false
  }, 1000)
}

const queryAvgPrice = () => {
  loadingAvg.value = true
  emit('queryAvgPrice', props.skin.marketHashName)
  setTimeout(() => {
    loadingAvg.value = false
  }, 1000)
}
</script>

<style scoped>
.skin-info-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basic-info-card,
.platforms-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 500;
}

.info-value.code {
  font-family: 'Monaco', 'Consolas', monospace;
  background: #f9fafb;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.platform-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.platform-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.platform-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.platform-id {
  font-size: 13px;
  color: #6b7280;
  font-family: 'Monaco', 'Consolas', monospace;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.query-btn {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.query-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.query-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

.query-btn.secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.query-btn.secondary:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>