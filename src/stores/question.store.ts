import { create } from "zustand";

interface QuestionStore {
    title : string;
    content : string;
    userId : string;
    type: string;
    email :string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setUserId : (userId : string) => void;
    setType : (type : string) => void;
    setEmail : (email : string) => void;
    resetBoard: () => void;
};

const useQuestionStore = create<QuestionStore>(set => ({
    title: '',
    content: '',
    userId : '',
    type : '',
    email : '',
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    setUserId : (userId) => set(state => ({...state,userId})),
    setType : (type) => set(state => ({...state,type})),
    setEmail : (email) => set(state => ({...state,email})),
    resetBoard: () => set(state => ({ ...state, title: '', content: '', userId: '',type:'',email:''
         }))
}));

export default useQuestionStore;