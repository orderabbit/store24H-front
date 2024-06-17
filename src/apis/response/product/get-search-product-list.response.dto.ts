import { ResponseDto } from "apis/response";
import ProductListItem from "types/interface/product-list-item.interface";


export default interface GetSearchProductListResponseDto extends ResponseDto{
    searchList: ProductListItem[];
}