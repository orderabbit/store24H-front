import Answer from "types/interface/answer.interface";
import Review from "types/interface/review.interface";
import { ResponseCode, ResponseMessage } from "types/enums";
import Question from "types/interface/question.interface";
import { Product } from "types/interface";

export default interface ResponseDto{
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    customerPostcode: string;
    amount: string;
    searchList: Product[];
    answer : Answer[];
    review : Review[];
    questions : Question[];
    message: ResponseMessage;
    success: boolean;
    status: string;
    code: string;
    data: any;
    
}