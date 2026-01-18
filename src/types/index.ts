export interface PlatformItem {
  name: string;
  itemId: string;
}

export interface SkinItem {
  name: string;
  marketHashName: string;
  platformList: PlatformItem[];
}

export interface ApiResponse {
  success: boolean;
  data: SkinItem[];
  errorCode: number;
  errorMsg: string | null;
  errorData: any;
  errorCodeStr: string | null;
}
// 在 src/types/index.ts 中添加
export interface WearItem {
  itemId: string;
  tag: string;
  tagZh: string;
  tagEn: string;
  marketHashName: string;
  sellPrice: number;
  surviveNum: string;
  updateTime: string;
}

export interface CategoryItem {
  itemId: string;
  tag: string;
  tagZh: string;
  tagEn: string;
  marketHashName: string;
  sellPrice: number;
  surviveNum: string;
  updateTime: string;
}

export interface SkinWearDetailResponse {
  relatedList: WearItem[];
  categoryList: CategoryItem[];
}
export interface PriceData {
  platform: string;
  platformItemId: string;
  sellPrice: number;
  sellCount: number;
  biddingPrice: number;
  biddingCount: number;
  updateTime: number;
}

export interface PriceResponse {
  success: boolean;
  data: PriceData[];
  errorCode: number;
  errorMsg: string | null;
  errorData: any;
  errorCodeStr: string | null;
}

export interface AvgPriceData {
  platform: string;
  avgPrice: number;
}

export interface AvgPriceResponse {
  success: boolean;
  data: {
    marketHashName: string;
    avgPrice: number;
    dataList: AvgPriceData[];
  };
  errorCode: number;
  errorMsg: string | null;
  errorData: any;
  errorCodeStr: string | null;
}

// 添加类型定义
export interface SellingPrice {
  platform: string;
  platformName: string;
  price: number;
  updateTime: number;
  link: string;
}

export interface AnalysisTag {
  type: string;
  key: string;
  style: string;
  background: string;
  desc: string;
}

export interface SkinDetailInfo {
  id: string;
  itemType: string;
  itemId: string;
  name: string;
  shortName: string;
  marketHashName: string;
  marketShortName: string;
  imageUrl: string;
  qualityName: string;
  qualityColor: string;
  rarityName: string;
  rarityColor: string;
  exteriorName: string;
  exteriorColor: string;
  addNum: string;
  surviveNum: string;
  turnoverRate: number;
  turnoverRateIsRise: number;
  holdersNum: string;
  volumeRatio: number;
  sellingPriceList: SellingPrice[];
  consignmentBest: number;
  purchaseBest: number;
  purchaseStable: number;
  diff1Day: number;
  diff7Day: number;
  diff30Day: number;
  diff6Month: number;
  diff1DayPrice: number;
  diff7DayPrice: number;
  diff30DayPrice: number;
  diff6MonthPrice: number;
  increasePrice: number;
  trendList: any[];
  isCollect: boolean;
  tags: string[];
  transactionCount: string;
  analysisTags: AnalysisTag[];
  cashRatio: number;
  specialStyle: any[];
}

export interface SkinDetailResponse {
  success: boolean;
  data: SkinDetailInfo;
  errorCode: number;
  errorMsg: string | null;
  errorData: any;
  errorCodeStr: string | null;
}