export default interface PostProductRequestDto {
    productId: string;
    title: string;
    content: string;
    link: string;
    image: string;
    productImageList: string[];
    lowPrice: string;
    category1: string;
    category2: string;
};