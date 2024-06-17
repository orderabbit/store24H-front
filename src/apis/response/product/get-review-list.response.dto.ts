import { ResponseDto } from "apis/response";
import { Review } from "types/interface";


export default interface GetReviewListResponseDto extends ResponseDto {
    reviewList: Review[];
}