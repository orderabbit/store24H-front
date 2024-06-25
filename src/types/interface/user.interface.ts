export default interface User {
    userId: string;
    password: string;
    email: string;
    nickname: string;
    profileImage: string | null;
    role: string;
    socialUser: boolean;
}