import { create } from "zustand";

interface ProductStore {
    productId: string;
    title: string;
    content: string;
    link: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    userId: string;
    productImageFileList: File[];
    setProductId: (productId: string) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setLink: (link: string) => void;
    setImage: (image: string) => void;
    setLowPrice: (lowPrice: string) => void;
    setCategory1: (category1: string) => void;
    setCategory2: (category2: string) => void;
    setUserId: (userId: string) => void;
    setProductImageFileList: (productImageFileList: File[]) => void;
    resetProduct: () => void;
};

const useProductStore = create<ProductStore>(set => ({
    productId: '',
    title: '',
    content: '',
    link: '',
    image: '',
    lowPrice: '',
    category1: '',
    category2: '',
    userId: '',
    productImageFileList: [],
    setProductId: (productId) => set(state => ({ ...state, productId})),
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    setLink: (link) => set(state => ({ ...state, link})),
    setImage: (image) => set(state => ({ ...state, image})),
    setLowPrice: (lowPrice) => set(state => ({ ...state, lowPrice})),
    setCategory1: (category1) => set(state => ({ ...state, category1})),
    setCategory2: (category2) => set(state => ({ ...state, category2})),
    setUserId: (userId) => set(state => ({ ...state, userId})),
    setProductImageFileList: (productImageFileList) => set(state => ({ ...state, productImageFileList})),
    resetProduct: () => set(state => ({ ...state,
        productId: '',
        title: '',
        content: '',
        link: '',
        image: '',
        lowPrice: '',
        category1: '',
        category2: '',
        userId: '',
        boardImageFileList: []}))
}));

export default useProductStore;