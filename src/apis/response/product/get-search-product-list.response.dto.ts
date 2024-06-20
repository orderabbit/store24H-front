import { ResponseDto } from "apis/response";
import { Product } from "types/interface";
import ProductListItem from "types/interface/product-list-item.interface";


export default interface GetSearchProductListResponseDto extends ResponseDto{
    searchList: Product[];
}