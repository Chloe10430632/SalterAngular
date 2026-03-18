export interface HouseListDTO {
  roomTypeId: number;
  name: string;
  pricePerNight: number;
  citie: string;      // 對應後端的 Citie
  district: string;   // 對應後端的 District
  allImages: string[];
  viewCount: number;
}
