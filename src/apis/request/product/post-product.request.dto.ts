export default interface PostProductRequestDto {
    productId: number;
    title: string;
    content: string;
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    productImageList: string[];
    secondaryProductImageList: string[];
};