export default interface PatchProductRequestDto {
    productId: string;
    title: string;
    content: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    productImageList: string[];
    secondaryProductImageList: string[];
};