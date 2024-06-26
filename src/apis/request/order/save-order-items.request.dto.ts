export default interface SaveOrderItemsRequestDto {
    productId: number;
    title: string;
    productImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    count: number;
}