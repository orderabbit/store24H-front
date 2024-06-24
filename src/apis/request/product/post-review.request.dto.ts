export default interface PostReviewRequestDto {
    reviewNumber: number;
    userId: string;
    productId: number;
    rates: number;
    review: string;
    writeDatetime: string;
}