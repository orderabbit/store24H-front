import { Payment } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetPaymentResponseDto extends ResponseDto{
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    customerPostcode: string;
    amount: number;
}