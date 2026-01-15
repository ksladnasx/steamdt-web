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