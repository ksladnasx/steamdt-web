<template>
  <div class="skin-info-container">
    <!-- 基本信息卡片 -->
    <div class="basic-info-card">
      <div class="card-header">
        <h3 class="card-title">饰品信息</h3>
        <div v-if="itemDetail?.analysisTags?.length" class="analysis-tags-mini">
          <div 
            v-for="(tag, index) in itemDetail.analysisTags.slice(0, 2)" 
            :key="index"
            class="analysis-tag-mini"
            :style="{ backgroundColor: tag.background }"
          >
            <span v-html="tag.style"></span>
          </div>
        </div>
      </div>
      
      <div class="info-grid">
        <!-- 基础信息 -->
        <div class="info-item">
          <span class="info-label">中文名称</span>
          <span class="info-value">{{ skin.name }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">英文名称</span>
          <span class="info-value code">{{ skin.marketHashName }}</span>
        </div>
        
        <div v-if="itemDetail?.shortName" class="info-item">
          <span class="info-label">简称</span>
          <span class="info-value">{{ itemDetail.shortName }}</span>
        </div>
        
        <div v-if="itemDetail?.itemType" class="info-item">
          <span class="info-label">武器类型</span>
          <span class="info-value">{{ formatItemType(itemDetail.itemType) }}</span>
        </div>
        
        <!-- 统计数据 -->
        <div v-if="itemDetail" class="info-item">
          <span class="info-label">在售平台</span>
          <span class="info-value highlight">{{ getActivePlatformCount() }}</span>
        </div>
        
        <div v-if="itemDetail?.holdersNum" class="info-item">
          <span class="info-label">持有者数量</span>
          <span class="info-value">{{ formatNumber(itemDetail.holdersNum) }}</span>
        </div>
      </div>
      
      <!-- 标签展示 -->
      <div v-if="itemDetail?.tags?.length" class="tags-section">
        <div class="section-subtitle">饰品标签</div>
        <div class="tags-container">
          <el-tag 
            v-for="(tag, index) in getFilteredTags()" 
            :key="index"
            size="small"
            type="info"
            class="info-tag"
          >
            {{ formatTag(tag) }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <!-- 市场动态卡片 -->
    <div v-if="itemDetail" class="market-dynamics-card">
      <h3 class="card-title">市场动态</h3>
      <div class="dynamics-grid">
        <!-- 存世量 -->
        <div class="dynamic-item">
          <div class="dynamic-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="dynamic-content">
            <div class="dynamic-label">存世量</div>
            <div class="dynamic-value">{{ formatNumber(itemDetail.surviveNum) }}</div>
            <div class="dynamic-desc">当前市场流通数量</div>
          </div>
        </div>
        
        <!-- 换手率 -->
        <div class="dynamic-item">
          <div class="dynamic-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="dynamic-content">
            <div class="dynamic-label">换手率</div>
            <div class="dynamic-value">
              <span :class="getTrendClass(itemDetail.turnoverRateIsRise)">
                {{ (itemDetail.turnoverRate * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="dynamic-desc">
              <span :class="getTrendClass(itemDetail.turnoverRateIsRise)">
                {{ getTrendText(itemDetail.turnoverRateIsRise) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 成交量比率 -->
        <div v-if="itemDetail?.volumeRatio" class="dynamic-item">
          <div class="dynamic-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="dynamic-content">
            <div class="dynamic-label">成交量比率</div>
            <div class="dynamic-value">{{ (itemDetail.volumeRatio * 100).toFixed(0) }}%</div>
            <div class="dynamic-desc">相对市场平均水平</div>
          </div>
        </div>
        
        <!-- 近期成交 -->
        <div v-if="itemDetail?.transactionCount" class="dynamic-item">
          <div class="dynamic-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="dynamic-content">
            <div class="dynamic-label">日成交量</div>
            <div class="dynamic-value">{{ formatNumber(itemDetail.transactionCount) }}</div>
            <div class="dynamic-desc">近24小时成交</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 价格趋势卡片 -->
    <div v-if="itemDetail && (itemDetail.diff1Day || itemDetail.diff7Day)" class="trend-card">
      <h3 class="card-title">价格趋势</h3>
      <div class="trend-container">
        <div class="trend-item" :class="getPriceTrendClass(itemDetail.diff1Day)">
          <div class="trend-label">24小时</div>
          <div class="trend-value">{{ formatTrendValue(itemDetail.diff1Day) }}</div>
          <div class="trend-price">¥{{ formatPrice(Math.abs(itemDetail.diff1DayPrice)) }}</div>
        </div>
        
        <div class="trend-item" :class="getPriceTrendClass(itemDetail.diff7Day)">
          <div class="trend-label">7天</div>
          <div class="trend-value">{{ formatTrendValue(itemDetail.diff7Day) }}</div>
          <div class="trend-price">¥{{ formatPrice(Math.abs(itemDetail.diff7DayPrice)) }}</div>
        </div>
        
        <div v-if="itemDetail.diff30Day" class="trend-item" :class="getPriceTrendClass(itemDetail.diff30Day)">
          <div class="trend-label">30天</div>
          <div class="trend-value">{{ formatTrendValue(itemDetail.diff30Day) }}</div>
          <div class="trend-price">¥{{ formatPrice(Math.abs(itemDetail.diff30DayPrice)) }}</div>
        </div>
        
        <div v-if="itemDetail.diff6Month" class="trend-item" :class="getPriceTrendClass(itemDetail.diff6Month)">
          <div class="trend-label">6个月</div>
          <div class="trend-value">{{ formatTrendValue(itemDetail.diff6Month) }}</div>
          <div class="trend-price">¥{{ formatPrice(Math.abs(itemDetail.diff6MonthPrice)) }}</div>
        </div>
      </div>
    </div>
    
    <!-- 交易建议卡片 -->
    <div v-if="itemDetail && (itemDetail.consignmentBest || itemDetail.purchaseBest)" class="trading-advice-card">
      <h3 class="card-title">交易建议</h3>
      <div class="advice-grid">
        <div v-if="itemDetail.consignmentBest" class="advice-item">
          <div class="advice-icon buy">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div class="advice-content">
            <div class="advice-label">寄售最佳价</div>
            <div class="advice-value">¥{{ formatPrice(itemDetail.consignmentBest) }}</div>
            <div class="advice-desc">推荐寄售价格</div>
          </div>
        </div>
        
        <div v-if="itemDetail.purchaseBest" class="advice-item">
          <div class="advice-icon sell">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="advice-content">
            <div class="advice-label">收购最佳价</div>
            <div class="advice-value">¥{{ formatPrice(itemDetail.purchaseBest) }}</div>
            <div class="advice-desc">推荐收购价格</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import type { SkinItem } from '@/types'

interface Props {
  skin: SkinItem
  itemDetail?: any
}

const props = defineProps<Props>()

// 格式化武器类型
const formatItemType = (type: string) => {
  const typeMap: Record<string, string> = {
    'CSGO_Type_SniperRifle': '狙击步枪',
    'CSGO_Type_Rifle': '步枪',
    'CSGO_Type_SMG': '冲锋枪',
    'CSGO_Type_Shotgun': '霰弹枪',
    'CSGO_Type_Machinegun': '机枪',
    'CSGO_Type_Pistol': '手枪',
    'CSGO_Type_Knife': '刀具',
    'CSGO_Type_Gloves': '手套',
    'CSGO_Type_WeaponCase': '武器箱',
    'CSGO_Type_Sticker': '贴纸',
    'CSGO_Type_Agent': '探员',
    'CSGO_Type_MusicKit': '音乐盒',
    'CSGO_Type_Patch': '布章',
    'CSGO_Type_Collectible': '收藏品'
  }
  return typeMap[type] || type.replace('CSGO_Type_', '').replace(/_/g, ' ')
}

// 过滤和格式化标签
const getFilteredTags = () => {
  if (!props.itemDetail?.tags) return []
  return props.itemDetail.tags
    .filter((tag: string) => !tag.includes('Exterior#') && !tag.includes('Quality#') && !tag.includes('Rarity#'))
    .slice(0, 6) // 只显示前6个标签
}

const formatTag = (tag: string) => {
  return tag
    .replace(/^[^#]+#/, '') // 移除前缀
    .replace(/_/g, ' ') // 替换下划线为空格
}

// 获取活跃平台数量
const getActivePlatformCount = () => {
  if (!props.itemDetail?.sellingPriceList) return '0'
  return props.itemDetail.sellingPriceList.filter((p: any) => p.price > 0).length
}

// 格式化数字
const formatNumber = (numStr: string) => {
  const num = parseInt(numStr)
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + '千万'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千'
  }
  return numStr
}

// 格式化价格
const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(2) + 'M'
  }
  if (price >= 10000) {
    return (price / 10000).toFixed(2) + '万'
  }
  if (price >= 1000) {
    return (price / 1000).toFixed(2) + '千'
  }
  return price.toFixed(2)
}

// 格式化趋势值
const formatTrendValue = (value: number) => {
  if (value === 0) return '0.00%'
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%'
}

// 获取价格趋势类名
const getPriceTrendClass = (value: number) => {
  if (value > 5) return 'trend-strong-up'
  if (value > 0) return 'trend-up'
  if (value < -5) return 'trend-strong-down'
  if (value < 0) return 'trend-down'
  return 'trend-neutral'
}

// 获取趋势文本
const getTrendText = (trend: number) => {
  if (trend > 0) return '上升'
  if (trend < 0) return '下降'
  return '持平'
}

// 获取趋势类名
const getTrendClass = (trend: number) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return ''
}
</script>

<style scoped>
.skin-info-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* 卡片通用样式 */
.basic-info-card,
.market-dynamics-card,
.trend-card,
.trading-advice-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 分析标签迷你版 */
.analysis-tags-mini {
  display: flex;
  gap: 6px;
}

.analysis-tag-mini {
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 11px;
  font-weight: 500;
}

.analysis-tag-mini :deep(span) {
  font-size: 11px !important;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.info-value.code {
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  background: #f9fafb;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  word-break: break-all;
}

.info-value.highlight {
  color: #3b82f6;
  font-weight: 700;
}

/* 标签区域 */
.tags-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-tag {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #4b5563;
  font-size: 12px;
  padding: 4px 10px;
}

.info-tag:hover {
  background: #e5e7eb;
}

/* 市场动态网格 */
.dynamics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.dynamic-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dynamic-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.dynamic-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  color: #3b82f6;
  flex-shrink: 0;
}

.dynamic-content {
  flex: 1;
  min-width: 0;
}

.dynamic-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.dynamic-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}

.dynamic-desc {
  font-size: 12px;
  color: #9ca3af;
}

/* 趋势容器 */
.trend-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.trend-item {
  padding: 16px;
  border-radius: 12px;
  border: 2px solid;
  text-align: center;
  transition: all 0.3s ease;
}

.trend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.trend-item.trend-strong-up {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.trend-item.trend-up {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 80%);
}

.trend-item.trend-strong-down {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.trend-item.trend-down {
  border-color: #f87171;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 80%);
}

.trend-item.trend-neutral {
  border-color: #6b7280;
  background: #f9fafb;
}

.trend-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.trend-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.trend-item.trend-strong-up .trend-value {
  color: #059669;
}

.trend-item.trend-up .trend-value {
  color: #16a34a;
}

.trend-item.trend-strong-down .trend-value {
  color: #dc2626;
}

.trend-item.trend-down .trend-value {
  color: #ea580c;
}

.trend-item.trend-neutral .trend-value {
  color: #6b7280;
}

.trend-price {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* 交易建议网格 */
.advice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.advice-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.advice-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.advice-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.advice-icon.buy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.advice-icon.sell {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.advice-content {
  flex: 1;
  min-width: 0;
}

.advice-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.advice-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}

.advice-desc {
  font-size: 12px;
  color: #9ca3af;
}

/* 趋势颜色类 */
.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .skin-info-container {
    gap: 16px;
  }
  
  .basic-info-card,
  .market-dynamics-card,
  .trend-card,
  .trading-advice-card {
    padding: 20px;
  }
  
  .info-grid,
  .dynamics-grid,
  .trend-container,
  .advice-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .analysis-tags-mini {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .basic-info-card,
  .market-dynamics-card,
  .trend-card,
  .trading-advice-card {
    padding: 16px;
  }
  
  .info-value.code {
    font-size: 13px;
    padding: 4px 8px;
  }
  
  .dynamic-item,
  .advice-item {
    padding: 14px;
  }
}
</style>