import { create } from "zustand";

interface ProductStore {
    productId: string;
    title: string;
    content: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    category3: string;
    userId: string;
    productImageFileList: File[];
    secondaryProductImageFileList: File[];
    setProductId: (productId: string) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setImage: (image: string) => void;
    setLowPrice: (lowPrice: string) => void;
    setCategory1: (category1: string) => void;
    setCategory2: (category2: string) => void;
    setCategory3: (category3: string) => void;
    setUserId: (userId: string) => void;
    setProductImageFileList: (productImageFileList: File[]) => void;
    setSecondaryProductImageFileList: (secondaryProductImageFileList: File[]) => void;
    resetProduct: () => void;
};

const useProductStore = create<ProductStore>(set => ({
    productId: '',
    title: '',
    content: '',
    image: '',
    lowPrice: '',
    category1: '',
    category2: '',
    category3: '',
    userId: '',
    productImageFileList: [],
    secondaryProductImageFileList: [],
    setProductId: (productId) => set(state => ({ ...state, productId})),
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    setImage: (image) => set(state => ({ ...state, image})),
    setLowPrice: (lowPrice) => set(state => ({ ...state, lowPrice})),
    setCategory1: (category1) => set(state => ({ ...state, category1})),
    setCategory2: (category2) => set(state => ({ ...state, category2})),
    setCategory3: (category3) => set(state => ({ ...state, category3})),
    setUserId: (userId) => set(state => ({ ...state, userId})),
    setProductImageFileList: (productImageFileList) => set(state => ({ ...state, productImageFileList})),
    setSecondaryProductImageFileList: (secondaryProductImageFileList) => set(state => ({ ...state, secondaryProductImageFileList})),
    resetProduct: () => set(state => ({ ...state,
        productId: '',
        title: '',
        content: '',
        image: '',
        lowPrice: '',
        category1: '',
        category2: '',
        category3: '',
        userId: '',
        boardImageFileList: []}))
}));

export default useProductStore;