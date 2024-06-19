export default interface SaveCartRequestDto {
    productId: string;
    title: string;
    productImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
    count: number;
}