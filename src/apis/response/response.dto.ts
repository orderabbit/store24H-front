import Answer from "types/interface/answer.interface";
import { ResponseCode, ResponseMessage } from "types/enums";
import Question from "types/interface/question.interface";
import { Product } from "types/interface";

export default interface ResponseDto{
    searchList: Product[];
    answer : Answer[];
    questions : Question[];
    message: ResponseMessage;
    success: boolean;
    status: string;
    code: string;
    data: any;
    
}