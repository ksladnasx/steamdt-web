<template>
    <div class="price-display-container">
        <!-- 实时价格表格 -->
        <div v-if="priceData" class="price-section">
            <div class="section-header">
                <h3 class="section-title">实时价格</h3>
                <div class="update-time">
                    <!-- 更新时间：{{ formatTime(priceData[0]?.updateTime) }} -->
                </div>
            </div>
            <div class="table-container">
                <table class="price-table">
                    <thead>
                        <tr>
                            <th>平台</th>
                            <th>售价</th>
                            <th>数量</th>
                            <th>求购价</th>
                            <th>求购量</th>
                            <th>更新时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredPriceData" :key="item.platform" >
                            <td class="platform-cell">
                                <span class="platform-badge">{{ item.platform }}</span>
                            </td>
                            <td class="price-cell">
                                <span class="price-value" :class="{ 'zero-price': item.sellPrice === 0 }">
                                    ¥{{ formatPrice(item.sellPrice) }}
                                </span>
                            </td>
                            <td class="count-cell">
                                {{ item.sellCount }}
                            </td>
                            <td class="price-cell">
                                <span class="bid-price" :class="{ 'zero-price': item.biddingPrice === 0 }">
                                    ¥{{ formatPrice(item.biddingPrice) }}
                                </span>
                            </td>
                            <td class="count-cell">
                                {{ item.biddingCount }}
                            </td>
                            <td class="time-cell">
                                {{ formatRelativeTime(item.updateTime) }}
                            </td>


                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 7日均价卡片 -->
        <div v-if="avgPriceData" class="avg-price-section">
            <div class="section-header">
                <h3 class="section-title">7日平台均价</h3>
                <div class="avg-price">
                    平均：¥{{ formatPrice(avgPriceData.avgPrice) }}
                </div>
            </div>
            <div class="avg-grid">
                <div v-for="item in avgPriceData.dataList" :key="item.platform" class="avg-card">
                    <div class="avg-platform">{{ item.platform }}</div>
                    <div class="avg-price-value">¥{{ formatPrice(item.avgPrice) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PriceData, AvgPriceResponse } from '@/types'
import { computed } from 'vue';

const props = defineProps<{
    priceData?: PriceData[]
    avgPriceData?: AvgPriceResponse['data']
}>()

const formatPrice = (price: number) => {
    if (price === 0) return '0.00'
    return price.toFixed(2)
} 
//过滤掉售价为0的数据
const filteredPriceData = computed(()=>{
    return props.priceData?.filter(item => item.sellPrice !== 0);
})

const formatTime = (timestamp: number) => {
    if (!timestamp) return '-'
    return new Date(timestamp * 1000).toLocaleString('zh-CN')
}

const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return '-'

    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp

    if (diff < 60) return '刚刚'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    return `${Math.floor(diff / 86400)}天前`
}
</script>

<style scoped>
.price-display-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.price-section,
.avg-price-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f3f4f6;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.update-time {
    font-size: 14px;
    color: #6b7280;
}

.avg-price {
    font-size: 16px;
    font-weight: 600;
    color: #3b82f6;
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.price-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}

.price-table th {
    background: #f9fafb;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    border-bottom: 2px solid #e5e7eb;
}

.price-table td {
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
}

.price-table tbody tr:hover {
    background-color: #f9fafb;
}

.platform-cell {
    width: 120px;
}

.platform-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}

.price-cell {
    width: 120px;
}

.price-value {
    font-weight: 600;
    color: #059669;
    font-size: 16px;
}

.bid-price {
    font-weight: 600;
    color: #7c3aed;
    font-size: 16px;
}

.zero-price {
    color: #9ca3af !important;
}

.count-cell {
    width: 80px;
    text-align: center;
    font-weight: 500;
}

.time-cell {
    width: 100px;
    color: #6b7280;
    font-size: 14px;
}

.avg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
}

.avg-card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.avg-card:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: translateY(-2px);
}

.avg-platform {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
}

.avg-price-value {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
}
</style>