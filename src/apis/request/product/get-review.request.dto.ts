export default interface GetReviewRequestDto {
    review_number: number;
    user_id: string;
    product_id: number;
    rates: number;
    review: string;
    writeDatetime: string;
}