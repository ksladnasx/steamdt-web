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
                    <SearchInput :items="skinData" @select="handleSkinSelect" />
                </div>

                <!-- 选中后的展示区域 -->
                <div v-if="selectedSkin" class="selected-container">
                    <div class="selected-content">
                        <!-- 左侧：图片和名称 -->
                        <div class="selected-left">
                            <!-- 基本信息卡片 -->
                            <div class="select-info">
                                <div class="selected-image">
                                    <el-image :src="itemimg" fit="contain" :preview-src-list="[itemimg]"
                                        :initial-index="0" :hide-on-click-modal="true" :z-index="9999"
                                        preview-teleported>
                                        <template #placeholder>
                                            <div class="image-placeholder">
                                                <div class="loading-spinner small"></div>
                                                <span class="loading-text">加载中...</span>
                                            </div>
                                        </template>
                                        <template #error>
                                            <div class="image-error">
                                                <span>图片加载失败</span>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div v-if="loading" class="loading-overlay">
                                        <div class="loading-spinner"></div>
                                    </div>

                                    <!-- 添加放大图标提示 -->
                                    <div class="preview-hint">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                        </svg>
                                        点击查看大图
                                    </div>
                                </div>
                                <!-- 品质标签 -->
                                <div v-if="itemDetail" class="quality-tags">
                                    <el-tag size="small" :color="itemDetail.qualityColor" effect="dark"
                                        class="quality-tag">
                                        {{ itemDetail.qualityName }}
                                    </el-tag>
                                    <el-tag size="small" :color="itemDetail.rarityColor" effect="dark"
                                        class="rarity-tag">
                                        {{ itemDetail.rarityName }}
                                    </el-tag>
                                    <el-tag size="small" :color="itemDetail.exteriorColor" effect="dark"
                                        class="exterior-tag">
                                        {{ itemDetail.exteriorName }}
                                    </el-tag>
                                </div>
                                <div class="selected-name">
                                    {{ selectedSkin.name }}
                                </div>
                            </div>
                            <!-- 交易建议卡片 -->
                            <div v-if="itemDetail && (itemDetail.consignmentBest || itemDetail.purchaseBest)"
                                class="trading-advice-card">
                                <h3 class="card-title">交易建议</h3>
                                <p></p>
                                <div class="advice-grid">
                                    <div v-if="itemDetail.consignmentBest" class="advice-item">
                                        <div class="advice-icon buy">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </div>
                                        <div class="advice-content">
                                            <div class="advice-label">寄售最佳价</div>
                                            <div class="advice-value">¥{{ formatPrice(itemDetail.consignmentBest) }}
                                            </div>
                                            <div class="advice-desc">推荐寄售价格</div>
                                        </div>
                                    </div>

                                    <div v-if="itemDetail.purchaseBest" class="advice-item">
                                        <div class="advice-icon sell">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                                                stroke="currentColor">
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

                        <!-- 右侧：信息展示区域 -->
                        <div class="selected-right">
                            <SkinInfo :skin="selectedSkin" :item-detail="itemDetail" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 价格展示区域 -->
            <div v-if="priceData || avgPriceData" class="price-section">
                <PriceDisplay :price-data="priceData" :avg-price-data="avgPriceData" />
            </div>

            <div v-if="selectedSkin" class="info-section">
                <MoreInfo :wear-data="wearData" :loading-wear="loadingWear" @view-item="handleViewItem" />
            </div>

            <!-- 空状态 -->
            <div v-else-if="!selectedSkin" class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
import { ref, onMounted, computed } from 'vue'
import { ElTag } from 'element-plus'
import SearchInput from '@/components/SearchInput.vue'
import SkinInfo from '@/components/SkinInfo.vue'
import PriceDisplay from '@/components/PriceDisplay.vue'
import MoreInfo from '@/components/MoreInfo.vue'
import type { SkinItem, PriceData, AvgPriceResponse, SkinWearDetailResponse } from '@/types'
import * as api from '@/api'

// 组件状态
const skinData = ref<SkinItem[]>([])
const selectedSkin = ref<any>(null)
const priceData = ref<PriceData[]>()
const avgPriceData = ref<AvgPriceResponse['data']>()
const wearData = ref<SkinWearDetailResponse | null>(null)
const loading = ref(false)
const loadingWear = ref(false)
const error = ref<string | null>(null)
const itemDetail: any = ref(null)

const itemimg = computed(() => {
    if (itemDetail.value && itemDetail.value.imageUrl) {
        return itemDetail.value.imageUrl;
    }
    return '';
});

// 在组件挂载时加载数据
onMounted(async () => {
    try {
        skinData.value = await api.loadLocalSkinData()
    } catch (err) {
        console.error('加载饰品数据失败，使用示例数据:', err)
        skinData.value = api.getSampleSkinData()
        error.value = '本地数据加载失败，已使用示例数据'
    }
})

// 处理饰品选择
const handleSkinSelect = async (skin: any) => {
    selectedSkin.value = skin
    priceData.value = undefined
    avgPriceData.value = undefined
    wearData.value = null
    error.value = null
    loading.value = true
    loadingWear.value = true

    try {
        // 并行请求所有数据
        const [priceResult, avgPriceResult, wearResult] = await Promise.allSettled([
            api.getSkinPrice(skin.marketHashName),
            api.getSkinAvgPrice(skin.marketHashName),
            api.getMoreSkinPrices(skin.marketHashName)
        ])

        // 获取选择的饰品的详细信息
        itemDetail.value = await api.getSkinDetail(skin.marketHashName);

        // 处理价格数据
        if (priceResult.status === 'fulfilled') {
            priceData.value = priceResult.value
        } else {
            console.error('获取价格数据失败:', priceResult.reason)
            priceData.value = api.getMockPriceData(skin.marketHashName)
        }

        // 处理均价数据
        if (avgPriceResult.status === 'fulfilled') {
            avgPriceData.value = avgPriceResult.value
        } else {
            console.error('获取均价数据失败:', avgPriceResult.reason)
            avgPriceData.value = api.getMockAvgPriceData(skin.marketHashName)
        }

        // 处理磨损数据
        if (wearResult.status === 'fulfilled') {
            wearData.value = wearResult.value
        } else {
            console.error('获取磨损数据失败:', wearResult.reason)
        }

    } catch (err: any) {
        error.value = '数据加载失败，请稍后重试'
        console.error('加载数据失败:', err)
    } finally {
        loading.value = false
        loadingWear.value = false
    }
}

// 处理查看按钮点击
const handleViewItem = async (marketHashName: string) => {
    console.log('开始搜索:', marketHashName)

    loadingWear.value = true
    try {
        // 重新加载数据
        handleSkinSelect(skinData.value.find(skin => skin.marketHashName === marketHashName))
    } catch (error) {
        console.error('重新加载数据失败:', error)
    } finally {
        loadingWear.value = false
    }
}


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
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

.search-section {
    margin-bottom: 40px;
}

.search-wrapper {
    margin-bottom: 16px;
}

/* 选中的饰品容器 */
.selected-container {
    margin-top: 24px;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
}

.selected-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

/* 左侧：图片和名称 - 增大尺寸 */


.selected-left {
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
    justify-content: space-between; 
    min-width: 320px;
    flex-shrink: 0;
    min-height: 400px; 
}
/* 信息 */
.select-info{
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 7%;
    min-width: 60%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}
.selected-image {
    position: relative;
    width: 300px;
    height: 225px;
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.selected-image:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.selected-image:hover .el-image {
    transform: scale(1.05);
}

.selected-image:active {
    transform: translateY(0);
}

/* 图片占位符 */
.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    gap: 12px;
}

.image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fef2f2;
    color: #dc2626;
    font-size: 14px;
}

.loading-spinner.small {
    width: 40px;
    height: 40px;
    border: 3px solid #3b82f6;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 14px;
    color: #6b7280;
}

/* 品质标签容器 */
.quality-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    justify-content: center;
}

.quality-tag,
.rarity-tag,
.exterior-tag {
    font-weight: 600;
    border: none !important;
    font-size: 12px;
    padding: 4px 10px;
}

/* 名称样式 */
.selected-name {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.4;
    word-break: break-word;
    max-width: 300px;
    padding: 0 10px;
    margin-bottom: 8px;
}

/* 交易建议 */

.trading-advice-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-top: 7%;
    min-width: 85%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
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

/* 交易建议网格 */
.advice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
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

/* 右侧：信息展示区域 */
.selected-right {
    flex: 1;
    min-width: 0;
    min-height: 400px;
}

/* 加载遮罩 */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #3b82f6;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* 图片预览提示 */
.preview-hint {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    backdrop-filter: blur(4px);
}

.selected-image:hover .preview-hint {
    opacity: 1;
    bottom: 20px;
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
    max-width: 1400px;
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 响应式调整 */
@media (max-width: 1200px) {
    .selected-left {
        min-width: 280px;
    }

    .selected-image {
        width: 260px;
        height: 195px;
    }

    .selected-name {
        max-width: 260px;
        font-size: 18px;
    }
}

@media (max-width: 992px) {
    .selected-content {
        gap: 32px;
    }

    .selected-left {
        min-width: 240px;
    }

    .selected-image {
        width: 220px;
        height: 165px;
    }
}

@media (max-width: 768px) {
    .selected-content {
        flex-direction: column;
        gap: 32px;
    }

    .selected-left {
        width: 100%;
        min-width: auto;
        align-items: center;
    }

    .selected-image {
        width: 100%;
        max-width: 320px;
        height: 240px;
        margin: 0 auto 20px;
    }

    .selected-name {
        max-width: 100%;
        font-size: 20px;
    }

    .quality-tags {
        justify-content: center;
    }

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

@media (max-width: 480px) {
    .selected-container {
        padding: 20px;
    }

    .selected-image {
        width: 100%;
        height: auto;
        aspect-ratio: 4/3;
    }

    .selected-name {
        font-size: 18px;
    }
}
</style>