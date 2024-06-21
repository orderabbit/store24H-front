export default interface Product {
    productId: number;
    title: string;
    content: string;
    lowPrice: string;
    totalPrice: string;
    category1: string;
    category2: string;
    category3: string;
    count: number;
    productImageList: string[];
    secondaryProductImageList: string[];
    purchaseDate?: string;
    writeDatetime: string;
    userId: string;
    orderId: string;
    orderDatetime: string;
}