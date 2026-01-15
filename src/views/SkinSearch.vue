<template>
  <div class="skin-search-container">
    <!-- 头部 -->
    <header class="header">
      <h1 class="title">Steam饰品价格查询</h1>
      <p class="subtitle">快速查询CSGO饰品在各平台的价格信息</p>
    </header>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
        <button class="error-close" @click="error = null">×</button>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-wrapper">
          <SearchInput
            :items="skinData"
            @select="handleSkinSelect"
          />
        </div>
        
        <div v-if="selectedSkin" class="selected-info">
          <div class="selected-badge">
            当前选择：{{ selectedSkin.name }}
            <span v-if="loading" class="loading-indicator"></span>
          </div>
        </div>
      </div>

      <!-- 信息展示区域 -->
      <div v-if="selectedSkin" class="info-section">
        <SkinInfo
          :skin="selectedSkin"
          @query-price="handleQueryPrice"
          @query-avg-price="handleQueryAvgPrice"
          :loading-price="loading"
          :loading-avg="loading"
        />
      </div>

      <!-- 价格展示区域 -->
      <div v-if="priceData || avgPriceData" class="price-section">
        <PriceDisplay
          :price-data="priceData"
          :avg-price-data="avgPriceData"
        />
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && !selectedSkin" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="empty-title">请搜索并选择饰品</h3>
        <p class="empty-desc">在搜索框中输入饰品名称开始查询</p>
        <div class="tips">
          <div class="tip-item">💡 支持中文名称搜索</div>
          <div class="tip-item">💡 支持英文名称搜索</div>
          <div class="tip-item">💡 支持模糊搜索</div>
        </div>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <p>数据来源于SteamDT API</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import SkinInfo from '@/components/SkinInfo.vue'
import PriceDisplay from '@/components/PriceDisplay.vue'
import type { SkinItem, PriceData, AvgPriceResponse } from '@/types'
import * as api from '@/api'

// 组件状态
const skinData = ref<SkinItem[]>([])
const selectedSkin = ref<SkinItem | null>(null)
const priceData = ref<PriceData[]>()
const avgPriceData = ref<AvgPriceResponse['data']>()
const loading = ref(false)
const error = ref<string | null>(null)

// 生命周期
onMounted(async () => {
  try {
    skinData.value = await api.loadLocalSkinData()
  } catch (err) {
    console.error('加载饰品数据失败，使用示例数据:', err)
    skinData.value = api.getSampleSkinData()
    error.value = '本地数据加载失败，已使用示例数据'
  }
})

// 事件处理
const handleSkinSelect = (skin: SkinItem) => {
  selectedSkin.value = skin
  priceData.value = undefined
  avgPriceData.value = undefined
  error.value = null
}

const handleQueryPrice = async (marketHashName: string) => {
  loading.value = true
  error.value = null
  
  try {
    priceData.value = await api.getSkinPrice(marketHashName)
  } catch (err: any) {
    error.value = err.message || '查询价格失败'
    console.error('查询价格失败:', err)
    
    // 失败时使用模拟数据
    priceData.value = api.getMockPriceData(marketHashName)
  } finally {
    loading.value = false
  }
}

const handleQueryAvgPrice = async (marketHashName: string) => {
  loading.value = true
  error.value = null
  
  try {
    avgPriceData.value = await api.getSkinAvgPrice(marketHashName)
  } catch (err: any) {
    error.value = err.message || '查询均价失败'
    console.error('查询均价失败:', err)
    
    // 失败时使用模拟数据
    avgPriceData.value = api.getMockAvgPriceData(marketHashName)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.skin-search-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
}

.title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-section {
  margin-bottom: 40px;
}

.search-wrapper {
  margin-bottom: 16px;
}

.selected-info {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.selected-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 20px;
  color: #3b82f6;
  font-weight: 500;
  font-size: 14px;
}

.info-section {
  margin-bottom: 40px;
}

.price-section {
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #9ca3af;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.empty-desc {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.tips {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.tip-item {
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.footer {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 14px;
  margin-top: 60px;
  border-top: 1px solid #e5e7eb;
}

/* 错误提示样式 */
.error-message {
  background: linear-gradient(135deg, #fee, #fff5f5);
  border: 1px solid #fca5a5;
  border-radius: 12px;
  padding: 12px 20px;
  margin: 20px auto;
  max-width: 1200px;
  color: #991b1b;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 18px;
}

.error-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 20px;
  color: #991b1b;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.error-close:hover {
  background: rgba(153, 27, 27, 0.1);
}

.loading-indicator {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .main-content {
    padding: 0;
  }
  
  .tips {
    flex-direction: column;
    align-items: center;
  }
  
  .tip-item {
    width: 100%;
    text-align: center;
  }
}
</style>