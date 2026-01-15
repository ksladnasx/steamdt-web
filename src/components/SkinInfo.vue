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

    <!-- 磨损/品质价格信息卡片 -->
    <div class="wear-info-card">
      <div class="card-header">
        <h3 class="card-title">更多价格信息</h3>
        <el-button
          v-if="!wearData"
          type="primary"
          :loading="loadingWear"
          :disabled="loadingWear"
          @click="loadWearData"
          size="small"
        >
          {{ loadingWear ? '加载中...' : '查看其他磨损/品质' }}
        </el-button>
        <el-button
          v-else
          type="info"
          @click="wearData = null"
          size="small"
        >
          收起信息
        </el-button>
      </div>

      <div v-if="loadingWear" class="loading-section">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="wearData" class="wear-data-section">
        <!-- 相关磨损列表 -->
        <div class="wear-section" v-if="wearData.relatedList && wearData.relatedList.length > 0">
          <h4 class="section-subtitle">
            不同磨损价格
            <span class="count-badge">{{ wearData.relatedList.length }}种</span>
          </h4>
          <el-table
            :data="wearData.relatedList"
            :border="true"
            :stripe="true"
            size="small"
            class="wear-table"
            height="300"
          >
            <el-table-column prop="tagZh" label="磨损等级" width="100" />
            <el-table-column prop="marketHashName" label="饰品名称" min-width="200">
              <template #default="{ row }">
                <div class="market-name-cell">
                  <span class="market-name">{{ row.marketHashName }}</span>
                  <el-tooltip
                    :content="`英文: ${row.tagEn}`"
                    placement="top"
                  >
                    <span class="tag-en">({{ row.tagEn }})</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="价格" width="120" sortable>
              <template #default="{ row }">
                <span class="price-cell" :class="getPriceColor(row.sellPrice)">
                  ¥{{ formatPrice(row.sellPrice) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="surviveNum" label="存世量" width="100" sortable>
              <template #default="{ row }">
                <div class="survive-cell">
                  <el-tag
                    :type="getSurviveTagType(row.surviveNum)"
                    size="small"
                  >
                    {{ formatSurviveNum(row.surviveNum) }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="140">
              <template #default="{ row }">
                {{ formatUpdateTime(row.updateTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="handleWearItemClick(row)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分类列表（贴纸等） -->
        <div class="category-section" v-if="wearData.categoryList && wearData.categoryList.length > 0">
          <h4 class="section-subtitle">
            其他品质/分类
            <span class="count-badge">{{ wearData.categoryList.length }}种</span>
          </h4>
          <el-table
            :data="wearData.categoryList"
            :border="true"
            :stripe="true"
            size="small"
            class="category-table"
          >
            <el-table-column prop="tagZh" label="分类" width="100" />
            <el-table-column prop="marketHashName" label="饰品名称" min-width="200">
              <template #default="{ row }">
                <div class="market-name-cell">
                  <span class="market-name">{{ row.marketHashName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="价格" width="120" sortable>
              <template #default="{ row }">
                <span class="price-cell" :class="getPriceColor(row.sellPrice)">
                  ¥{{ formatPrice(row.sellPrice) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="surviveNum" label="存世量" width="100" sortable>
              <template #default="{ row }">
                <div class="survive-cell">
                  <el-tag
                    :type="getSurviveTagType(row.surviveNum)"
                    size="small"
                  >
                    {{ formatSurviveNum(row.surviveNum) }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="140">
              <template #default="{ row }">
                {{ formatUpdateTime(row.updateTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="handleCategoryItemClick(row)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 空状态 -->
        <div v-if="!wearData.relatedList?.length && !wearData.categoryList?.length" class="empty-wear">
          <el-empty description="暂无磨损/品质数据" />
        </div>
      </div>

      <div v-else class="wear-prompt">
        <div class="prompt-content">
          <el-icon size="20" color="#909399"><InfoFilled /></el-icon>
          <span class="prompt-text">点击上方按钮查看该饰品的不同磨损和品质价格信息</span>
        </div>
      </div>
    </div>

    <!-- 查询按钮 -->
    <div class="action-buttons">
      <button
        class="query-btn primary"
        :disabled="loadingPrice"
        @click="handleQueryPrice"
      >
        <span v-if="loadingPrice" class="loading">查询价格中...</span>
        <span v-else>查询实时价格</span>
      </button>
      <button
        class="query-btn secondary"
        :disabled="loadingAvg"
        @click="handleQueryAvgPrice"
      >
        <span v-if="loadingAvg" class="loading">查询中...</span>
        <span v-else>查询7日均价</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElTag, ElTooltip, ElSkeleton, ElEmpty, ElIcon } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import type { SkinItem, SkinWearDetailResponse, WearItem, CategoryItem } from '@/types'
import * as api from '@/api'

interface Props {
  skin: SkinItem
  loadingPrice?: boolean
  loadingAvg?: boolean
}

const props = defineProps<Props>()

// 使用一致的命名约定：camelCase
const emit = defineEmits<{
  queryPrice: [marketHashName: string]
  queryAvgPrice: [marketHashName: string]
}>()

// 磨损数据相关
const wearData = ref<SkinWearDetailResponse | null>(null)
const loadingWear = ref(false)
const errorWear = ref<string | null>(null)

// 处理查询价格按钮点击
const handleQueryPrice = () => {
  emit('queryPrice', props.skin.marketHashName)
}

// 处理查询均价按钮点击
const handleQueryAvgPrice = () => {
  emit('queryAvgPrice', props.skin.marketHashName)
}


// 加载相关数据
const loadWearData = async () => {
  loadingWear.value = true
  errorWear.value = null
  
  try {
    wearData.value = await api.getMoreSkinPrices(props.skin.marketHashName)
  } catch (err: any) {
    errorWear.value = err.message || '加载相关数据失败'
    console.error('加载相关数据失败:', err)
    
    // 使用模拟数据作为演示
    
  } finally {
    loadingWear.value = false
  }
}

// 格式化价格
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// 格式化存世量
const formatSurviveNum = (numStr: string) => {
  const num = parseInt(numStr)
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return numStr
}

// 格式化更新时间
const formatUpdateTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleDateString('zh-CN')
}

// 获取价格颜色class
const getPriceColor = (price: number) => {
  if (price < 100) return 'price-low'
  if (price < 500) return 'price-medium'
  if (price < 1000) return 'price-high'
  return 'price-very-high'
}

// 获取存世量标签类型
const getSurviveTagType = (surviveNum: string) => {
  const num = parseInt(surviveNum)
  if (num < 1000) return 'danger' // 稀少
  if (num < 5000) return 'warning' // 较少
  if (num < 20000) return 'info' // 中等
  return 'success' // 充足
}

// 处理磨损项点击
const handleWearItemClick = (item: WearItem) => {
  console.log('点击磨损项:', item)
  // 触发查询价格事件
  emit('queryPrice', item.marketHashName)
}

// 处理分类项点击
const handleCategoryItemClick = (item: CategoryItem) => {
  console.log('点击分类项:', item)
  // 触发查询价格事件
  emit('queryPrice', item.marketHashName)
}

onMounted(() => {
  // 初始加载磨损数据（可选）
  loadWearData()
})

watch(() => props.skin, () => {
  // 重新请求数据
  loadWearData()
})
</script>

<style scoped>
/* 样式部分保持不变 */
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

.loading-section {
  padding: 20px 0;
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
  padding: 40px 0;
}

.wear-prompt {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  border: 1px dashed #d1d5db;
  text-align: center;
}

.prompt-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
}

.prompt-text {
  font-size: 14px;
}

/* 操作按钮 */
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
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>