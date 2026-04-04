export interface DCourseOrder {
  courseSessionId: number;
}

export interface DTransacRequest {
   transactionId: number;
  description?: string;  // 補這行
  itemName?: string;
  baseUrl?: string;
}
