<template>
    <!-- 更多价格信息卡片（磨损/品质） -->
    <div v-if="wearData && (wearData.relatedList.length > 0 || wearData.categoryList.length > 0)"
        class="wear-info-card">
        <div class="card-header">
            <h3 class="card-title">更多价格信息</h3>
            <div class="loading-indicator-container">
                <span v-if="loadingWear" class="loading-text">加载中...</span>
            </div>
        </div>

        <!-- 相关磨损列表 -->
        <div v-if="wearData.relatedList && wearData.relatedList.length > 0" class="wear-section">
            <h4 class="section-subtitle">
                不同磨损价格
                <span class="count-badge">{{ wearData.relatedList.length }}种</span>
            </h4>
            <el-table :data="wearData.relatedList" :border="true" :stripe="true" size="small" class="wear-table"
                height="300">
                <el-table-column prop="tagZh" label="磨损等级" width="100" />
                <el-table-column prop="marketHashName" label="饰品名称" min-width="200">
                    <template #default="{ row }">
                        <div class="market-name-cell">
                            <span class="market-name">{{ row.marketHashName }}</span>
                            <el-tooltip :content="`英文: ${row.tagEn}`" placement="top">
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
                            <el-tag :type="getSurviveTagType(row.surviveNum)" size="small">
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
                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleViewItem(row.marketHashName)"
                            class="view-btn">
                            跳转
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分类列表（贴纸等） -->
        <div v-if="wearData.categoryList && wearData.categoryList.length > 0" class="category-section">
            <h4 class="section-subtitle">
                其他品质/分类
                <span class="count-badge">{{ wearData.categoryList.length }}种</span>
            </h4>
            <el-table :data="wearData.categoryList" :border="true" :stripe="true" size="small" class="category-table">
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
                            <el-tag :type="getSurviveTagType(row.surviveNum)" size="small">
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
                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleViewItem(row.marketHashName)"
                            class="view-btn">
                            跳转
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 空状态 -->
        <div v-if="!wearData.relatedList?.length && !wearData.categoryList?.length" class="empty-wear">
            <div class="empty-content">
                <el-icon size="24" color="#909399">
                    <InfoFilled />
                </el-icon>
                <span class="empty-text">暂无更多价格信息</span>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ElTable, ElTableColumn, ElTag, ElTooltip, ElIcon, ElButton } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import type { SkinItem, SkinWearDetailResponse, WearItem, CategoryItem } from '@/types'

interface Props {
    wearData: SkinWearDetailResponse | null
    loadingWear?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    viewItem: [marketHashName: string]
}>()

// 处理跳转按钮点击
const handleViewItem = (marketHashName: string) => {
    console.log('跳转饰品:', marketHashName)
    emit('viewItem', marketHashName)
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
    color: #10b981;
    /* 绿色 */
}

.price-medium {
    color: #3b82f6;
    /* 蓝色 */
}

.price-high {
    color: #f59e0b;
    /* 橙色 */
}

.price-very-high {
    color: #ef4444;
    /* 红色 */
}

.survive-cell {
    display: flex;
    justify-content: center;
}

.view-btn {
    padding: 4px 8px;
    font-size: 12px;
    height: auto;
}

.view-btn:hover {
    background-color: rgba(59, 130, 246, 0.1);
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