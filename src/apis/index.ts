import axios, { AxiosResponse } from "axios";
import { SaveProductResponseDto, SearchMapResponseDto } from "./response";
import { SaveProductRequestDto } from "./request";

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const DOMAIN = 'http://localhost:4040';
const API_DOMAIN = `${DOMAIN}/api/v1`;

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver' | 'google') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SEARCH_MAP_URL = (query: string, lat: number, lng: number) =>
    `${API_DOMAIN}/map/search?query=${query}&lat=${lat}&lng=${lng}`;
const GET_PRODUCT_URL = (keyword: string) => `${API_DOMAIN}/product/search?keyword=${keyword}`;
const POST_PRODUCT_URL = () => `${API_DOMAIN}/product/save`;
const GET_PRODUCT_LIST_URL = (userId: string) => `${API_DOMAIN}/product/list/${userId}`;


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

export const PostProductRequest = async (formData: SaveProductRequestDto): Promise<SaveProductResponseDto> => {
    try {
        const response = await axios.post(POST_PRODUCT_URL(), formData, {});
        return response.data;
    } catch (error) {
        console.error('Error posting product data:', error);
        throw error;
    }
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