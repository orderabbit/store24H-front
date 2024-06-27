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
    titleImage: string[];
    productImageList: string[];
    secondaryProductImageList: string[];
    reviewList: any;
    purchaseDate?: string;
    writeDatetime: string;
    userId: string;
    orderId: string;
    orderList: any;
    orderDatetime: string;
    items: any;
}