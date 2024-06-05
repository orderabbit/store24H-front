import axios, { AxiosResponse } from "axios";
import { SearchMapResponseDto } from "./response/map";

const DOMAIN = 'http://localhost:4040';
const API_DOMAIN = `${DOMAIN}/api/v1`;

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver' | 'google') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SEARCH_MAP_URL = (query: string, lat: number, lng: number) =>
    `${API_DOMAIN}/map/search?query=${query}&lat=${lat}&lng=${lng}`;


export const SearchMapRequest = async (query: string, lat: number, lng: number): Promise<SearchMapResponseDto> => {
    try {
        const response = await axios.get<SearchMapResponseDto>(SEARCH_MAP_URL(query, lat, lng), {});
        return response.data;
    } catch (error) {
        console.error('Error fetching map data:', error);
        throw error;
    }
};