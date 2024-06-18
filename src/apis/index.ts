import axios, { AxiosResponse } from "axios";
import { SaveCartRequestDto, SaveOrderListRequestDto } from "./request";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, SignInRequestDto, SignUpRequestDto, userIdCheckRequestDto } from "./request/auth";
import nicknameCheckRequestDto from "./request/auth/nickname-check.request.dto";
import { PatchNicknameRequestDto, PatchPasswordRequestDto, PasswordRecoveryRequestDto } from "./request/user";
import { DeleteCartResponseDto, GetOrderListResponseDto, PostPaymentResponseDto, ResponseDto, SaveCartResponseDto, SearchMapResponseDto } from "./response";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, SignInResponseDto, SignUpResponseDto, userIdCheckResponseDto } from "./response/auth";
import nicknameCheckResponseDto from "./response/auth/nickname-check.response.dto";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, WithdrawalUserResponseDto, PasswordRecoveryResponseDto } from "./response/user";
import { ResponseBody } from "types";
import { PatchProductRequestDto, PostProductRequestDto, PostReviewRequestDto } from "./request/product";
const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const responseHandler = <T>(response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
};

const errorHandler = (error: any) => {
    if (!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
};

const DOMAIN = 'http://3.35.30.191:4040';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const FILE_DOMAIN = `${DOMAIN}/file`;
const multipartFormData = { headers: { 'Url-Type': 'multipart/form-data' } };

const SEARCH_MAP_URL = (query: string, lat: number, lng: number) => `${API_DOMAIN}/map/search?query=${query}&lat=${lat}&lng=${lng}`;

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver' | 'google') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/userId-check`;
const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/auth/nickname-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const GET_USER_URL = (userId: string) => `${API_DOMAIN}/user/${userId}`;
const PATCH_PASSWORD_URL = (userId: string) => `${API_DOMAIN}/user/change-password/${userId}`;
const RECOVER_PASSWORD_URL = () => `${API_DOMAIN}/user/recovery-password`;
const WIDTHDRAWAL_USER_URL = (userId: number | string) => `${API_DOMAIN}/user/withdrawal/${userId}`;

const POST_CART_URL = () => `${API_DOMAIN}/cart/save`;
const GET_CART_LIST_URL = (userId: string) => `${API_DOMAIN}/cart/list/${userId}`;
const DELETE_CART_URL = (productId: number) => `${API_DOMAIN}/cart/delete/${productId}`;
const GET_SEARCH_PRODUCT_URL = (keyword: string) => `${API_DOMAIN}/cart/search?keyword=${keyword}`;

const POST_PAYMENT_URL = () => `${API_DOMAIN}/payment/savePaymentInfo`;

const POST_ORDER_LIST_URL = () => `${API_DOMAIN}/orders/saveOrderInfo`;
const GET_ORDER_LIST_URL = (userId: string) => `${API_DOMAIN}/orders/list/${userId}`;

const POST_PRODUCT_URL = () => `${API_DOMAIN}/product`;
const PATCH_PRODUCT_URL = (productId: number | string) => `${API_DOMAIN}/product/${productId}`;
const GET_PRODUCT_URL = (productId: number | string, type: string) => `${API_DOMAIN}/product/detail/${productId}?type=${type}`;
const DELETE_PRODUCT_URL = (productId: number | string) => `${API_DOMAIN}/product/delete/${productId}`;
const POST_REVIEW_URL = (productId: number | string) => `${API_DOMAIN}/product/${productId}/review`;
const GET_SEARCH_PRODUCT_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/product/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

export const SearchMapRequest = async (query: string, lat: number, lng: number): Promise<SearchMapResponseDto> => {
    try {
        const response = await axios.get<SearchMapResponseDto>(SEARCH_MAP_URL(query, lat, lng), {});
        return response.data;
    } catch (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }
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

export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const getUserRequest = async (userId: string, accessToken: string) => {
    
    const result = await axios.get(GET_USER_URL(userId), authorization(accessToken))
        .then(response => {
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchPasswordRequest = async (userId: string, requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL(userId), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const withdrawUserRequest = async (userId: number | string, accessToken: string) => {
    const result = await axios.delete(WIDTHDRAWAL_USER_URL(userId), authorization(accessToken))
        .then(response => {
            const responseBody: WithdrawalUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.data;
            return responseBody;
        });
    return result;
};

export const recoveryPasswordRequest = async (requestBody: PasswordRecoveryRequestDto): Promise<ResponseBody<PasswordRecoveryResponseDto>> => {
    try {
        const response = await axios.post(RECOVER_PASSWORD_URL(), requestBody);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const PostCartRequest = async (formData: SaveCartRequestDto, accessToken: string): Promise<SaveCartResponseDto> => {
    const result = await axios.post(POST_CART_URL(), formData, authorization(accessToken))
        .then(response => {
            const responseBody: SaveCartResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetProductListRequest = async (userId: string, accessToken: string): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(GET_CART_LIST_URL(userId), authorization(accessToken));
        return response;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};

export const GetListProductRequest = async (keyword: string): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(GET_SEARCH_PRODUCT_URL(keyword), {});
        return response;
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
};

export const DeleteCartRequest = async (productId: number, accessToken: string) => {
    const result = await axios.delete(DELETE_CART_URL(productId), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteCartResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
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

export const postOrderListRequest = async (orderData: SaveOrderListRequestDto): Promise<ResponseDto | null> => {
    try {
        const response = await axios.post<ResponseDto>(POST_ORDER_LIST_URL(), orderData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as ResponseDto;
        }
        return null;
    }
};

export const getOrderListRequest = async (userId: string): Promise<GetOrderListResponseDto | null> => {
    try {
        const response = await axios.get<GetOrderListResponseDto>(GET_ORDER_LIST_URL(userId));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as GetOrderListResponseDto;
        }
        return null;
    }
};

export const PostProductRequest = async (formData: PostProductRequestDto, accessToken: string) => {
    const result = await axios.post(POST_PRODUCT_URL(), formData, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const PatchProductRequest = async (productId: number | string, formData: PatchProductRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PRODUCT_URL(productId), formData, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const GetProductRequest = async (productId: number | string, type: string) => {
    const result = await axios.get(GET_PRODUCT_URL(productId, type))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const DeleteProductRequest = async (productId: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_PRODUCT_URL(productId), authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const PostReviewRequest = async (productId: number | string, formData: PostReviewRequestDto, accessToken: string) => {
    const result = await axios.post(POST_REVIEW_URL(productId), formData, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const GetSearchProductListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_PRODUCT_LIST_URL(searchWord, preSearchWord))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
};