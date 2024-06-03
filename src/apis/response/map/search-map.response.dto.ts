import ResponseDto from "../response.dto";

export default interface SearcgMapResponseDto extends ResponseDto {
    documents: {
        place_name: string;
        address_name: string;
        road_address_name: string;
        x: number;
        y: number;
    }[];
    
}