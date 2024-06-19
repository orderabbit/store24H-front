import { create } from "zustand";

interface AnswerStore {
    title: string;
    content: string;
    userId : string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setUserId : (userId : string) => void;
    resetBoard: () => void;
};

const useAnswerStore = create<AnswerStore>(set => ({
    title: '',
    content: '',
    userId : '',
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    setUserId : (userId) => set(state => ({...state,userId})),
    resetBoard: () => set(state => ({ ...state, title: '', content: '', userId: ''
         }))
}));

export default useAnswerStore;