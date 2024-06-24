export default interface Review {
    reviewId: number | string;
    userId: string;
    content: string;
    writeDatetime: string;
    productId: string;
}