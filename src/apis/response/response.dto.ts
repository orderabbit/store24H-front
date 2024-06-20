import Answer from "types/interface/answer.interface";
import { ResponseCode, ResponseMessage } from "types/enums";
<<<<<<< HEAD
import Question from "types/interface/question.interface";
=======
import ProductListItem from "types/interface/product-list-item.interface";
import { Product } from "types/interface";
>>>>>>> 54e8ad46bb364ce8abe4900687bbde0ffc16af87

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