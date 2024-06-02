import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./response";
import { SearchMapResponseDto } from "./response/map";

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

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver' | 'google') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SEARCH_MAP_URL = (query: string) => `${API_DOMAIN}/map/search?query=${query}`;


export const SearchMapRequest = async (query: string): Promise<SearchMapResponseDto> => {
    try {
        const response = await axios.get<SearchMapResponseDto>(SEARCH_MAP_URL(query));
        return response.data;
    } catch (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }
}