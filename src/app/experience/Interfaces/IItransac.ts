export interface DCourseOrder {
  courseSessionId: number;
}

export interface DTransacRequest {
  transactionId: number;
  description?: string;
  itemName?: string;
  baseUrl?: string;
  typeId?: number;
}
