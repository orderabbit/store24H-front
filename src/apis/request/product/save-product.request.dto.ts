export default interface SaveProductRequestDto {
    productId: number;
    title: string;
    link: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    count: number;
}