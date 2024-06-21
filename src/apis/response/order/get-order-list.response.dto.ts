import { Product } from "types/interface";
import ResponseDto from "../response.dto";

export interface OrderItem {
    itemId: number;
    title: string;
    productImageList: string[];
    category1: string;
    category2: string;
    category3: string;
    count: number;
    totalPrice: string;
  }
  
export default interface GetOrderListResponseDto extends ResponseDto {
    orderItems: Product[];
}