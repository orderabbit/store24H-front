export default interface SaveCartRequestDto {
    productId: string;
    title: string;
    productImageList: string[];
    secondaryProductImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    count: number;
}