export default interface Payment {
    orderId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerPostcode: string;
    amount: number;
}