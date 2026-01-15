// src/api/index.ts
import type { SkinItem, PriceData, AvgPriceResponse } from '@/types'

export interface ContentJsonData {
  success: boolean;
  data: SkinItem[];
  errorCode: number;
  errorMsg: string | null;
  errorData: any;
  errorCodeStr: string | null;
}

// API 配置
export const API_CONFIG = {
  BASE: '/api', // 使用代理
  MoreInfoBASE:'/moreinfo',
  TOKEN: 'Bearer 04a77f47d70a47809ce4006c553494f2',
  TIMEOUT: 10000 // 10秒超时
}

// 加载本地数据
export async function loadLocalSkinData(): Promise<SkinItem[]> {
  try {
    const module = await import('@/datacontent/content.json')
    const skinDataJson = module.default as ContentJsonData
    
    if (skinDataJson.success && skinDataJson.data) {
      return skinDataJson.data
    } else {
      console.error('加载饰品数据失败:', skinDataJson.errorMsg)
      throw new Error(skinDataJson.errorMsg || '加载饰品数据失败')
    }
  } catch (error) {
    console.error('加载JSON文件失败:', error)
    throw error
  }
}

// 获取饰品实时价格
export async function getSkinPrice(marketHashName: string): Promise<PriceData[]> {
  try {
    const encodedName = encodeURIComponent(marketHashName)
    const url = `${API_CONFIG.BASE}/cs2/v1/price/single?marketHashName=${encodedName}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': API_CONFIG.TOKEN,
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.errorMsg || '查询价格失败')
    }
  } catch (error) {
    console.error('获取饰品价格失败:', error)
    throw error
  }
}

// 获取饰品7日均价
export async function getSkinAvgPrice(marketHashName: string): Promise<AvgPriceResponse['data']> {
  try {
    const encodedName = encodeURIComponent(marketHashName)
    const url = `${API_CONFIG.BASE}/cs2/v1/price/avg?marketHashName=${encodedName}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': API_CONFIG.TOKEN,
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.errorMsg || '查询均价失败')
    }
  } catch (error) {
    console.error('获取饰品均价失败:', error)
    throw error
  }
}

//获取饰品其他磨损的价格
export async function getMoreSkinPrices(marketHashName: string): Promise<any> {
  try {
    const timestamp = Date.now();
    const url = `${API_CONFIG.MoreInfoBASE}/sale-wear-detail?timestamp=${timestamp}`
    //发送post请求
    const response = await fetch(url, {
      headers: {
        'Authorization': API_CONFIG.TOKEN,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ 
        "appId": 730,
        marketHashName: marketHashName
       })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.errorMsg || '查询其他磨损价格失败')
    }
  } catch (error) {
    console.error('获取其他磨损价格失败:', error)
    throw error
  }
}

// 模拟数据函数（用于演示或备用）
export function getMockPriceData(marketHashName: string): PriceData[] {
  const now = Math.floor(Date.now() / 1000)
  return [
    {
      platform: "BUFF",
      platformItemId: "33811",
      sellPrice: 20.90,
      sellCount: 651,
      biddingPrice: 20.6,
      biddingCount: 31,
      updateTime: now - 3600
    },
    {
      platform: "C5",
      platformItemId: "22326",
      sellPrice: 21.50,
      sellCount: 211,
      biddingPrice: 21.0,
      biddingCount: 50,
      updateTime: now - 7200
    },
    {
      platform: "STEAM",
      platformItemId: "",
      sellPrice: 30.24,
      sellCount: 290,
      biddingPrice: 0.0,
      biddingCount: 0,
      updateTime: now - 1800
    }
  ]
}

export function getMockAvgPriceData(marketHashName: string): AvgPriceResponse['data'] {
  return {
    marketHashName,
    avgPrice: 23.07,
    dataList: [
      { platform: "HALOSKINS", avgPrice: 22.73 },
      { platform: "C5", avgPrice: 21.97 },
      { platform: "YOUPIN", avgPrice: 21.48 },
      { platform: "STEAM", avgPrice: 28.43 },
      { platform: "BUFF", avgPrice: 21.14 }
    ]
  }
}

// 获取示例饰品数据
export function getSampleSkinData(): SkinItem[] {
  return [
    {
      name: "AWP | 响尾蛇 (略有磨损)",
      marketHashName: "AWP | Pit Viper (Minimal Wear)",
      platformList: [
        { name: "C5", itemId: "22313" },
        { name: "BUFF", itemId: "34123" },
        { name: "STEAM", itemId: "553456" }
      ]
    },
    {
      name: "M4A4 | 龙王 (略有磨损)",
      marketHashName: "M4A4 | Evil Daimyo (Minimal Wear)",
      platformList: [
        { name: "C5", itemId: "22314" },
        { name: "BUFF", itemId: "34124" },
        { name: "YOUPIN", itemId: "1458" }
      ]
    },
    {
      name: "AK-47 | 燃料喷射器 (崭新出厂)",
      marketHashName: "AK-47 | Fuel Injector (Factory New)",
      platformList: [
        { name: "C5", itemId: "22315" },
        { name: "BUFF", itemId: "34125" },
        { name: "STEAM", itemId: "553457" }
      ]
    }
  ]
}