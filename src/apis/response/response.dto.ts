import { ResponseCode, ResponseMessage } from "types/enums";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    status: string;
    data: any;
}