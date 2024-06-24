import { ResponseDto } from "apis/response";

export default interface PostReviewResponseDto extends ResponseDto {
    review: string;
    rates: number;
}