import Answer from "types/interface/answer.interface";
import { ResponseCode, ResponseMessage } from "types/enums";

export default interface ResponseDto{
    answer : Answer[];
    message: ResponseMessage;
    success: boolean;
    status: string;
    data: any;
}