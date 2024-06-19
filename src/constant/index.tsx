export const MAIN_PATH = () => '/';
export const TEST_PATH = () => '/test';
export const PRODUCT_PATH = () => '/product';
export const SEARCH_LIST_PATH = () => '/product/list';
export const USER_PATH = (userId: string) => `/user/${userId}`;
export const PASSWORD_PATH = (userId: string) => `/user/change-password/${userId}`;
export const SIGNIN_PATH = () => '/signin';
export const SIGNUP_PATH = () => '/signup';
export const SEARCH_MAP_PATH = () => '/map';
export const PAYMENT_PATH = () => '/payment';
<<<<<<< HEAD
export const UPDATE_PATH = (Number: number | string) => `update/${Number}`;
export const WRITE_PATH = () => `write`;
=======
export const SEARCH_PATH = (searchWord: string) => `/product/search/${searchWord}`;
export const DETAIL_PATH = (Number: string | number) => `/product/detail/${Number}`;
export const WRITE_PATH = () => '/product/write';
export const UPDATE_PATH = (Number: string | number) => `/product/update/${Number}`;
export const DELETE_PATH = (Number: string | number) => `/product/delete/${Number}`;
>>>>>>> c66924b2dee4c32e87d0c732939068061fe5b4a0
