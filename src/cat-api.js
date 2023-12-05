import axios from "axios";

const API_KEY = "live_o2QfDNMnojrh4DA92ctwC2cLbSqKwBmW0djy3PrRHN4JNkyJgUoHiTX96j93XSkf";
const BASE_URL = 'https://api.thecatapi.com/v1';
const END_POINT_BREEDS = 'breeds';
const END_POINT_IMAGES = 'images/search';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export function fetchBreeds() {
    return axios.get(`${BASE_URL}/${END_POINT_BREEDS}`);
}

export function fetchCatByBreed(breedId) {
    return axios.get(`${BASE_URL}/${END_POINT_IMAGES}?breed_ids=${breedId}`);
}