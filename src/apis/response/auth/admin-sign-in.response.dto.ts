import ResponseDto from "../response.dto";

export default interface AdminSignInResponseDto extends ResponseDto {
    token: string;
    expirationTime: number;
}