export default interface GetReviewRequestDto {
    reviewNumber: number;
    userId: string;
    productId: number;
    rates: number;
    review: string;
    writeDatetime: string;
}