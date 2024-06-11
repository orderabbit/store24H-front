import axios, { AxiosResponse } from "axios";
import { PostPaymentResponseDto, ResponseDto, SaveProductResponseDto, SearchMapResponseDto } from "./response";
import { SaveProductRequestDto } from "./request";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, SignInRequestDto, SignUpRequestDto, userIdCheckRequestDto } from "./request/auth";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, SignInResponseDto, SignUpResponseDto, userIdCheckResponseDto } from "./response/auth";
import nicknameCheckRequestDto from "./request/auth/nickname-check.request.dto";
import nicknameCheckResponseDto from "./response/auth/nickname-check.response.dto";
import { GetSignInUserResponseDto } from "./response/user";

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const DOMAIN = 'http://localhost:4040';
const API_DOMAIN = `${DOMAIN}/api/v1`;


const responseHandler = <T>(response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
};

const errorHandler = (error: any) => {
    if (!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
};

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver' | 'google') => `${API_DOMAIN}/auth/oauth2/${type}`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/userId-check`;
const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/auth/nickname-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

const SEARCH_MAP_URL = (query: string, lat: number, lng: number) =>
    `${API_DOMAIN}/map/search?query=${query}&lat=${lat}&lng=${lng}`;
const GET_PRODUCT_URL = (keyword: string) => `${API_DOMAIN}/product/search?keyword=${keyword}`;
const POST_PRODUCT_URL = () => `${API_DOMAIN}/product/save`;
const GET_PRODUCT_LIST_URL = (userId: string) => `${API_DOMAIN}/product/list/${userId}`;

const POST_PAYMENT_URL = () => `${API_DOMAIN}/payment/savePaymentInfo`;

export const SearchMapRequest = async (query: string, lat: number, lng: number): Promise<SearchMapResponseDto> => {
    try {
        const response = await axios.get<SearchMapResponseDto>(SEARCH_MAP_URL(query, lat, lng), {});
        return response.data;
    } catch (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }
};

export const GetProductRequest = async (keyword: string): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(GET_PRODUCT_URL(keyword), {});
        return response;
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
};

export const PostProductRequest = async (formData: SaveProductRequestDto, accessToken: string): Promise<SaveProductResponseDto> => {
    const result = await axios.post(POST_PRODUCT_URL(), formData, authorization(accessToken))
        .then(response => {
            const responseBody: SaveProductResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const GetProductListRequest = async (userId: string, accessToken: string): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(GET_PRODUCT_LIST_URL(userId), authorization(accessToken));
        return response;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
}

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const SnsSignInRequest = async (requestBody: SignInRequestDto, type: 'kakao' | 'naver' | 'google') => {
    const result = await axios.post(SNS_SIGN_IN_URL(type), requestBody)
        .then(responseHandler<SignInRequestDto>)
        .catch(errorHandler);
    return result;
};

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;
};

export const signupRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler);
    return result;
};

export const userIdCheckRequest = async (requestBody: userIdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<userIdCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const nicknameCheckRequest = async (requestBody: nicknameCheckRequestDto) => {
    const result = await axios.post(NICKNAME_CHECK_URL(), requestBody)
        .then(responseHandler<nicknameCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

export const postPaymentRequest = async (paymentData: any) => {
    const result = await axios.post(POST_PAYMENT_URL(), paymentData)
        .then(response => {
            const responseBody: PostPaymentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
  };
