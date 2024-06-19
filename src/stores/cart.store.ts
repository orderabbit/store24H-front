import create from "zustand";

interface Product {
    productId: string;
    title: string;
    link: string;
    image: string;
    lowPrice: string;
    category1: string;
    category2: string;
    userId: string;
}
interface CartStore {
    products: Product[];
    addProduct: (product: Product) => void;
    removeProduct: (productId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    products: [],
    addProduct: (product) =>
        set((state) => {
            const existingProduct = state.products.find((p) => p.productId === product.productId);
            if (existingProduct) {
                return {
                    products: state.products.map((p) =>
                        p.productId === product.productId
                            ? { ...p }
                            : p
                    ),
                };
            } else {
                return { products: [...state.products, product] };
            }
        }),
    removeProduct: (productId) =>
        set((state) => ({
            products: state.products.filter((product) => product.productId !== productId),
        })),
    clearCart: () => set({ products: [] }),
}));
