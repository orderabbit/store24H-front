export default interface PostProductRequestDto {
    productId: string;
    title: string;
    content: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    productImageList: string[];
    secondaryProductImageList: string[];
};