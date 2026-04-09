export interface HouseListDTO {
  roomTypeId: number;
  name: string;
  pricePerNight: number;
  citie: string;      // 對應後端的 Citie
  district: string;   // 對應後端的 District
  allImages: string[];
  viewCount: number;
}
export interface HousePreviewDTO {
  roomTypeName: string;
  houseId: number;
  roomTypeId: number;
  title: string;        // 顯示名稱
  price: number;
  city: string;
  district: string;
  imageUrl: string;     // 首頁只需要一張封面圖
  guests: number;
}

// 城市分組用的 DTO
export interface CityGroupDTO {
  cityName: string;
  houses: HousePreviewDTO[]; // 這裡面裝的是上面的預覽小卡片
}

export interface BookingListViewModel {
  bookingId: number;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  createdTime: string;
}
