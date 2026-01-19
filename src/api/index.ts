// src/api/index.ts
import type {
  SkinItem,
  PriceData,
  AvgPriceResponse,
  SkinDetailInfo,
} from "@/types";
import { useitemsStore } from "@/stores/items";
import axios from "axios";

// 本地内容数据的接口
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
  BASE: "/api", // 使用代理
  MoreInfoBASE: "/moreinfo",
  TIMEOUT: 10000, // 10秒超时
  // ✅ 动态获取 TOKEN：用函数替代直接赋值
  getToken: () => {
    const itemsStore = useitemsStore(); // 函数执行时才实例化 store否则报错
    return `Bearer ${itemsStore.apiKey}`;
  },
};

// 定义代理配置的类型（明确类型，避免报错）
interface ProxyConfig {
  host: string;
  port: number;
  protocol: string;
}

/**
 * 安全解析代理 URL，处理端口缺失/格式不规范问题
 * @param proxyUrl 代理URL，如 "http://123.45.67.89:8080" 或 "https://123.45.67.89"
 * @returns 合法的 { host: string, port: number }
 */
function parseProxyUrl(proxyUrl: any): ProxyConfig {
  // 第一步：校验代理URL是否合法
  if (!proxyUrl || !proxyUrl.startsWith("http")) {
    throw new Error(`无效的代理URL：${proxyUrl}，请确保以 http/https 开头`);
  }

  const urlObj = new URL(proxyUrl);

  // 第二步：处理 hostname（确保非空）
  const host = urlObj.hostname;
  if (!host) {
    throw new Error(`代理URL解析失败，无法获取主机名：${proxyUrl}`);
  }

  // 第三步：处理 port（补充默认端口，避免空字符串/undefined）
  let port = urlObj.port;
  // 如果没有显式端口，根据协议补默认端口
  if (!port) {
    port = urlObj.protocol === "https:" ? "443" : "80";
  }
  // 转换为数字并校验
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
    throw new Error(`代理端口不合法：${port}（URL：${proxyUrl}）`);
  }

  return { 
    host, 
    port: portNum,
    protocol: urlObj.protocol.replace(':', '') // 移除冒号，得到 'http' 或 'https'
  };
}

export async function checkAxiosProxy() {
  try {
    // 这个请求会走 Vite/Nginx 配置的反向代理
    const response = await axios.get('http://httpbin.org/ip', {
      // 确保请求走你的代理前缀（比如 /moreinfo 或 /api）
      baseURL: API_CONFIG.MoreInfoBASE,
      // 禁用缓存，避免影响验证结果
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    console.log('✅ Axios 请求出口 IP：', response.data.origin);
    console.log('🔍 代理配置的 IP：', '你的代理IP（如 123.45.67.89）');
    
    // 核心判断：出口IP是否等于代理IP
    if (response.data.origin.includes('你的代理IP')) {
      console.log('🎉 代理生效！');
    } else {
      console.log('❌ 代理未生效，出口IP是本机/其他IP');
    }
    return response.data.origin;
  } catch (error) {
    console.error('❌ 验证代理失败：', error);
  }
}

// 代理池（确保每个URL都是合法的 http/https 格式）
const proxyPool = [
  "http://18.163.99.118:80",
  "http://27.124.3.251:9000",
  "http://122.10.82.237:80",
];

// 检查代理是否有效的函数
async function checkProxyAvailability(proxyConfig: ProxyConfig): Promise<boolean> {
  try {
    const testUrl = "http://httpbin.org/ip";
    const response = await axios.get(testUrl, {
      proxy: {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol
      },
      timeout: 5000 // 5秒超时
    });
    console.log(`✅ 代理 ${proxyConfig.host}:${proxyConfig.port} 可用`);
    return true;
  } catch (error) {
    console.log(`❌ 代理 ${proxyConfig.host}:${proxyConfig.port} 不可用`);
    return false;
  }
}

// 获取可用代理配置
async function getAvailableProxyConfig(): Promise<ProxyConfig | null> {
  // 尝试最多3个代理
  const maxAttempts = Math.min(3, proxyPool.length);
  const triedProxies = new Set<number>();
  
  for (let i = 0; i < maxAttempts; i++) {
    let proxyIndex;
    
    // 确保不重复尝试同一个代理
    do {
      proxyIndex = Math.floor(Math.random() * proxyPool.length);
    } while (triedProxies.has(proxyIndex) && triedProxies.size < proxyPool.length);
    
    triedProxies.add(proxyIndex);
    const proxyUrl = proxyPool[proxyIndex];
    const proxyConfig = parseProxyUrl(proxyUrl);
    
    console.log(`🔍 测试代理 ${i + 1}/${maxAttempts}: ${proxyConfig.host}:${proxyConfig.port}`);
    
    const isAvailable = await checkProxyAvailability(proxyConfig);
    if (isAvailable) {
      return proxyConfig;
    }
  }
  
  console.log('⚠️ 所有代理都不可用，将使用无代理模式');
  return null;
}

// 加载本地数据
export async function loadLocalSkinData(): Promise<SkinItem[]> {
  try {
    const module = await import("@/datacontent/content.json");
    const skinDataJson = module.default as ContentJsonData;

    if (skinDataJson.success && skinDataJson.data) {
      return skinDataJson.data;
    } else {
      console.error("加载饰品数据失败:", skinDataJson.errorMsg);
      throw new Error(skinDataJson.errorMsg || "加载饰品数据失败");
    }
  } catch (error) {
    console.error("加载JSON文件失败:", error);
    throw error;
  }
}

// 封装延迟函数：生成随机延迟（单位：毫秒）
const delay = (min = 1000, max = 3000) => {
  const randomTime = Math.floor(Math.random() * (max - min) + min);
  return new Promise((resolve) => setTimeout(resolve, randomTime));
};

// 获取饰品实时价格
export async function getSkinPrice(
  marketHashName: string,
): Promise<PriceData[]> {
  await checkAxiosProxy();
  try {
    // 每次请求都获取新的代理配置
    const proxyConfig = await getAvailableProxyConfig();
    
    const encodedName = encodeURIComponent(marketHashName);
    const url = `${API_CONFIG.BASE}/cs2/v1/price/single?marketHashName=${encodedName}`;
    
    const requestConfig: any = {
      headers: {
        Authorization: API_CONFIG.getToken(),
        "Content-Type": "application/json",
      },
    };
    
    // 如果有可用代理，则使用代理
    if (proxyConfig) {
      requestConfig.proxy = {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol
      };
      console.log(`🔄 使用代理: ${proxyConfig.host}:${proxyConfig.port}`);
    } else {
      console.log('⚠️ 无可用代理，直接连接');
    }
    
    const response = await axios.get(url, requestConfig);

    const data = response.data;

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.errorMsg || "查询价格失败");
    }
  } catch (error) {
    console.error("获取饰品价格失败:", error);
    throw error;
  }
}

// 获取饰品7日均价
export async function getSkinAvgPrice(
  marketHashName: string,
): Promise<AvgPriceResponse["data"]> {
  try {
    // 每次请求都获取新的代理配置
    const proxyConfig = await getAvailableProxyConfig();
    
    const encodedName = encodeURIComponent(marketHashName);
    const url = `${API_CONFIG.BASE}/cs2/v1/price/avg?marketHashName=${encodedName}`;
    
    const requestConfig: any = {
      headers: {
        Authorization: API_CONFIG.getToken(),
        "Content-Type": "application/json",
      },
    };
    
    // 如果有可用代理，则使用代理
    if (proxyConfig) {
      requestConfig.proxy = {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol
      };
      console.log(`🔄 使用代理: ${proxyConfig.host}:${proxyConfig.port}`);
    }

    const response = await axios.get(url, requestConfig);

    const data = response.data;

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.errorMsg || "查询均价失败");
    }
  } catch (error) {
    console.error("获取饰品均价失败:", error);
    throw error;
  }
}

//获取饰品其他磨损的价格
export async function getMoreSkinPrices(marketHashName: string): Promise<any> {
  // ✅ 请求前先延迟
  await delay(600, 1000);
  try {
    // 每次请求都获取新的代理配置
    const proxyConfig = await getAvailableProxyConfig();
    
    const timestamp = Date.now();
    const url = `${API_CONFIG.MoreInfoBASE}/sale-wear-detail?timestamp=${timestamp}`;
    
    const requestConfig: any = {
      headers: {
        Authorization: API_CONFIG.getToken(),
        "Content-Type": "application/json",
      },
    };
    
    // 如果有可用代理，则使用代理
    if (proxyConfig) {
      requestConfig.proxy = {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol
      };
      console.log(`🔄 使用代理: ${proxyConfig.host}:${proxyConfig.port}`);
    }

    const response = await axios.post(
      url,
      {
        appId: 730,
        marketHashName: marketHashName,
      },
      requestConfig,
    );

    const data = response.data;

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.errorMsg || "查询其他磨损价格失败");
    }
  } catch (error) {
    console.error("获取其他磨损价格失败:", error);
    throw error;
  }
}

// 添加获取饰品详细信息的API函数
export const getSkinDetail = async (
  marketHashName: string,
): Promise<SkinDetailInfo> => {
  // ✅ 请求前先延迟（随机）
  await delay(10, 900);
  try {
    // 每次请求都获取新的代理配置
    const proxyConfig = await getAvailableProxyConfig();
    
    const timestamp = Date.now();
    
    const requestConfig: any = {
      headers: {
        Authorization: API_CONFIG.getToken(),
        "Content-Type": "application/json",
      },
    };
    
    // 如果有可用代理，则使用代理
    if (proxyConfig) {
      requestConfig.proxy = {
        host: proxyConfig.host,
        port: proxyConfig.port,
        protocol: proxyConfig.protocol
      };
      console.log(`🔄 使用代理: ${proxyConfig.host}:${proxyConfig.port}`);
    }

    const response = await axios.post(
      `${API_CONFIG.MoreInfoBASE}/item?timestamp=${timestamp}`,
      {
        appId: 730,
        marketHashName,
      },
      requestConfig,
    );
    const data = response.data;

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.errorMsg || "获取饰品详情失败");
    }
  } catch (error: any) {
    console.error("获取饰品详情失败:", error);
    throw error;
  }
};

// 模拟数据函数（用于演示或备用）
export function getMockPriceData(marketHashName: string): PriceData[] {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      platform: "BUFF",
      platformItemId: "33811",
      sellPrice: 20.9,
      sellCount: 651,
      biddingPrice: 20.6,
      biddingCount: 31,
      updateTime: now - 3600,
    },
    {
      platform: "C5",
      platformItemId: "22326",
      sellPrice: 21.5,
      sellCount: 211,
      biddingPrice: 21.0,
      biddingCount: 50,
      updateTime: now - 7200,
    },
    {
      platform: "STEAM",
      platformItemId: "",
      sellPrice: 30.24,
      sellCount: 290,
      biddingPrice: 0.0,
      biddingCount: 0,
      updateTime: now - 1800,
    },
  ];
}
export function getMockAvgPriceData(
  marketHashName: string,
): AvgPriceResponse["data"] {
  return {
    marketHashName,
    avgPrice: 23.07,
    dataList: [
      { platform: "HALOSKINS", avgPrice: 22.73 },
      { platform: "C5", avgPrice: 21.97 },
      { platform: "YOUPIN", avgPrice: 21.48 },
      { platform: "STEAM", avgPrice: 28.43 },
      { platform: "BUFF", avgPrice: 21.14 },
    ],
  };
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
        { name: "STEAM", itemId: "553456" },
      ],
    },
    {
      name: "M4A4 | 龙王 (略有磨损)",
      marketHashName: "M4A4 | Evil Daimyo (Minimal Wear)",
      platformList: [
        { name: "C5", itemId: "22314" },
        { name: "BUFF", itemId: "34124" },
        { name: "YOUPIN", itemId: "1458" },
      ],
    },
    {
      name: "AK-47 | 燃料喷射器 (崭新出厂)",
      marketHashName: "AK-47 | Fuel Injector (Factory New)",
      platformList: [
        { name: "C5", itemId: "22315" },
        { name: "BUFF", itemId: "34125" },
        { name: "STEAM", itemId: "553457" },
      ],
    },
  ];
}