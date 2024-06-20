export default interface SaveCartRequestDto {
    productId: string;
    title: string;
    productImageList: string[];
    lowPrice: string;
    totalPrice: number;
    category1: string;
    category2: string;
    category3: string;
    count: number;
}