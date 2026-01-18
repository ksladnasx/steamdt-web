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
                        <!-- 左侧：图片和名称 -->
                        <div class="selected-left">
                            <div class="selected-image">
                                <el-image :src="itemimg" fit="cover" :preview-src-list="[itemimg]" :initial-index="0"
                                    :hide-on-click-modal="true" :z-index="9999" preview-teleported>
                                    <!-- 可以添加加载状态的slot -->
                                    <template #placeholder>
                                        <div class="image-placeholder">
                                            <span class="loading-spinner small"></span>
                                        </div>
                                    </template>
                                    <template #error>
                                        <div class="image-error">
                                            <span>图片加载失败</span>
                                        </div>
                                    </template>
                                </el-image>
                                <div v-if="loading" class="loading-overlay">
                                    <span class="loading-spinner"></span>
                                </div>

                                <!-- 添加放大图标提示 -->
                                <div class="preview-hint">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                    </svg>
                                    查看
                                </div>
                            </div>
                            <div class="selected-name">
                                {{ selectedSkin.name }}
                            </div>
                        </div>

                        <!-- 右侧：信息展示区域 -->
                        <div class="selected-right">
                            <SkinInfo :skin="selectedSkin" />
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
import { ref, onMounted } from 'vue'
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


const itemimg = ref('')

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
        itemimg.value = (await api.getSkinDetail(skin.marketHashName)).imageUrl
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
            //   wearData.value = api.getMockWearDetailData(skin.marketHashName)
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

    // 这里需要重新搜索对应的饰品并加载数据
    // 你可以调用父组件的方法，或者直接在这里重新加载数据
    // 例如：
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
</script>

<style scoped>
/* 保持原有样式不变 */
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

/* 选中的饰品容器 */
.selected-container {
    margin-top: 24px;
    background: rgb(255, 255, 255);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
}

.selected-content {
    display: flex;
    gap: 32px;
    align-items: flex-start;
}

/* 左侧：图片和名称 */
.selected-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 200px;
    flex-shrink: 0;
}

.selected-image {
    position: relative;
    width: 180px;
    height: 135px;
    /* 4:3比例 */
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    background: #f8fafc;
}

.selected-image .el-image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
}

.selected-image:hover .el-image {
    transform: scale(1.05);
}

/* 图片占位符 */
.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
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
    width: 24px;
    height: 24px;
    border-width: 2px;
}

/* 可选：添加点击放大动画效果 */
.selected-image:active .el-image {
    transform: scale(0.98);
}

.selected-name {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    word-break: break-word;
    max-width: 200px;
}

/* 右侧：信息展示区域 */
.selected-right {
    flex: 1;
    min-width: 0;
    /* 防止flex item溢出 */
}

/* 加载遮罩 */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.loading-spinner {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 3px solid #3b82f6;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .selected-content {
        flex-direction: column;
        gap: 24px;
    }

    .selected-left {
        width: 100%;
        min-width: auto;
    }

    .selected-image {
        width: 100%;
        max-width: 300px;
        margin: 0 auto 16px;
    }

    .selected-name {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .selected-container {
        padding: 16px;
    }

    .selected-image {
        width: 100%;
        height: auto;
        aspect-ratio: 4/3;
    }
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
    to {
        transform: rotate(360deg);
    }
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



/* 图片预览提示 */
.preview-hint {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.selected-image:hover .preview-hint {
    opacity: 1;
}


</style>