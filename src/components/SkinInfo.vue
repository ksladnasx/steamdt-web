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
          <span class="info-label">在售平台数：</span>
          <span class="info-value">{{ skin.platformList.length }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SkinItem } from '@/types'

interface Props {
  skin: SkinItem
}

const props = defineProps<Props>()

</script>

<style scoped>
.skin-info-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 基本信息卡片 */
.basic-info-card,
.wear-info-card {
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

/* 磨损信息卡片 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header .card-title {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.loading-indicator-container {
  display: flex;
  align-items: center;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.wear-table,
.category-table {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.market-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.market-name {
  font-weight: 500;
  color: #1f2937;
}

.tag-en {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.price-cell {
  font-weight: 600;
  font-size: 15px;
}

.price-low {
  color: #10b981; /* 绿色 */
}

.price-medium {
  color: #3b82f6; /* 蓝色 */
}

.price-high {
  color: #f59e0b; /* 橙色 */
}

.price-very-high {
  color: #ef4444; /* 红色 */
}

.survive-cell {
  display: flex;
  justify-content: center;
}

.empty-wear {
  padding: 20px 0;
  text-align: center;
}

.empty-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  padding: 12px 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
}

.empty-text {
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .skin-info-container {
    gap: 16px;
  }
  
  .basic-info-card,
  .wear-info-card {
    padding: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>