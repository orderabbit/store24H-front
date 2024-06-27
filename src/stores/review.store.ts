import { create } from 'zustand';

interface ReviewStore {
  productId: string;
  content: string;
  userId: string;
  setProductId: (productId: string) => void;
  setContent: (content: string) => void;
  setUserId: (userId: string) => void;
  resetContent: () => void;
}

const useReviewStore = create<ReviewStore>((set) => ({
  productId: '',
  content: '',
  userId: '',
  setProductId: (productId) => set((state) => ({ ...state, productId })),
  setContent: (content) => set((state) => ({ ...state, content })),
  setUserId: (userId) => set((state) => ({ ...state, userId })),
  resetContent: () =>
    set((state) => ({
      ...state,
      productId: '',
      content: '',
      userId: '',
    })),
}));

export default useReviewStore;
