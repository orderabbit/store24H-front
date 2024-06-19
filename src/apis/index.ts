import axios, { AxiosResponse, formToJSON } from "axios";
import { SaveProductRequestDto } from "./request";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, SignInRequestDto, SignUpRequestDto, userIdCheckRequestDto } from "./request/auth";
import nicknameCheckRequestDto from "./request/auth/nickname-check.request.dto";
import { PatchNicknameRequestDto, PatchPasswordRequestDto } from "./request/user";
import { DeleteProductResponseDto, PostPaymentResponseDto, ResponseDto, SaveProductResponseDto, SearchMapResponseDto } from "./response";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, SignInResponseDto, SignUpResponseDto, userIdCheckResponseDto } from "./response/auth";
import nicknameCheckResponseDto from "./response/auth/nickname-check.response.dto";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, WithdrawalUserResponseDto } from "./response/user";
import {PatchAnswerRequestDto, PostAnswerRequestDto,GetAnswerRequestDto} from "./request/answer";
import {DeleteAnswerResponseDto, GetAllAnswerResponseDto, GetAnswerResponseDto,
    PatchAnswerResponseDto, PostAnswerResponseDto } from "./response/answer";
import {PatchQuestionRequestDto, PostQuestionRequestDto,GetQuestionRequestDto} from "./request/question";
import {DeleteQuestionResponseDto, GetAllQuestionResponseDto, GetQuestionResponseDto,
        PatchQuestionResponseDto, PostQuestionResponseDto } from "./response/question";



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

const DOMAIN = 'http://localhost:4040';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const SEARCH_MAP_URL = (query: string, lat: number, lng: number) => `${API_DOMAIN}/map/search?query=${query}&lat=${lat}&lng=${lng}`;


const GET_ALL_ANSWER_URL = () => `${API_DOMAIN}/question/answer/list`;
const POST_ANSWER_URL = () => `${API_DOMAIN}/question/answer`;
const PATCH_ANSWER_URL = (answerId : number | string) => `${API_DOMAIN}/question/answer/${answerId}`;
const GET_ANSWER_URL = (answerId : number | string) => `${API_DOMAIN}/question/answer/detail/${answerId}`;
const DELETE_ANSWER_URL = (answerId : number | string) => `${API_DOMAIN}/question/answer/delete/${answerId}`;

const GET_ALL_QUESTION_URL = () => `${API_DOMAIN}/question/list`;
const POST_QUESTION_URL = () => `${API_DOMAIN}/question`;
const PATCH_QUESTION_URL = (questionId : number | string) => `${API_DOMAIN}/question/${questionId}`;
const GET_QUESTION_URL = (questionId : number | string) => `${API_DOMAIN}/question/detail/${questionId}`;
const DELETE_QUESTION_URL = (questionId : number | string) => `${API_DOMAIN}/question/delete/${questionId}`;


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
const WIDTHDRAWAL_USER_URL = (userId: number | string) => `${API_DOMAIN}/user/withdrawal/${userId}`;

const POST_PRODUCT_URL = () => `${API_DOMAIN}/product/save`;
const GET_PRODUCT_LIST_URL = (userId: string) => `${API_DOMAIN}/product/list/${userId}`;
const DELETE_PRODUCT_URL = (productId: number) => `${API_DOMAIN}/product/delete/${productId}`;
const GET_PRODUCT_URL = (keyword: string) => `${API_DOMAIN}/product/search?keyword=${keyword}`;

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
};

export const GetProductListRequest = async (userId: string, accessToken: string): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(GET_PRODUCT_LIST_URL(userId), authorization(accessToken));
        return response;
    } catch (error) {
        console.error('Error fetching product list:', error);
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

export const DeleteProductRequest = async (productId: number, accessToken: string) => {
    const result = await axios.delete(DELETE_PRODUCT_URL(productId), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteProductResponseDto = response.data;
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

export const getAllAnswerRequest = async () => {
    const result = await axios.get(GET_ALL_ANSWER_URL())
    .then(response => {
        const responseBody : GetAllAnswerResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;

};

export const getAnswerRequest = async (answerId : number|string) => {
    const result = await axios.get(GET_ANSWER_URL(answerId))
    .then(response => {
        const responseBody: GetAnswerResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
    });
    return result;
};

export const postAnswerRequest = async (requestBody : PostAnswerRequestDto) => {
    const result = await axios.post(POST_ANSWER_URL(),requestBody)
    .then(response => {
        const responseBody: PostAnswerResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}


export const deleteAnswerRequest = async (answerId : number| string) => {
    const result = await axios.delete(DELETE_ANSWER_URL(answerId))
    .then(response => {
        const responseBody : DeleteAnswerResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.data;
        return responseBody;
    });
    return result;
};
export const patchAnswerRequest = async(answerId : number| string , requestBody: PatchAnswerRequestDto) => {
    const result = await axios.patch(PATCH_ANSWER_URL(answerId),requestBody)
    .then(response => {
        const responseBody : PatchAnswerResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

export const getAllQuestionRequest = async () => {
    const result = await axios.get(GET_ALL_QUESTION_URL())
    .then(response => {
        const responseBody : GetAllQuestionResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;

};

export const getQuestionRequest = async (questionId : number|string) => {
    const result = await axios.get(GET_QUESTION_URL(questionId))
    .then(response => {
        const responseBody: GetQuestionResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
    });
    return result;
};

export const postQuestionRequest = async (requestBody : PostQuestionRequestDto) => {
    const result = await axios.post(POST_QUESTION_URL(),requestBody)
    .then(response => {
        const responseBody: PostQuestionResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}


export const deleteQuestionRequest = async (questionId : number| string) => {
    const result = await axios.delete(DELETE_QUESTION_URL(questionId))
    .then(response => {
        const responseBody : DeleteQuestionResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.data;
        return responseBody;
    });
    return result;
};
export const patchQuestionRequest = async(questionId : number| string , requestBody: PatchQuestionRequestDto) => {
    const result = await axios.patch(PATCH_QUESTION_URL(questionId),requestBody)
    .then(response => {
        const responseBody : PatchQuestionResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}


