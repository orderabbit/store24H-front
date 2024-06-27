import SaveOrderItemsRequestDto from "./save-order-items.request.dto";

export default interface SaveOrderListRequestDto {
    // orderId: string;
    userId: string;
    items: SaveOrderItemsRequestDto[];
}