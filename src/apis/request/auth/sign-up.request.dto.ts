export default interface SignUpRequestDto {
    userId: string;
    nickname: string;
    password: string;
    email: string;
    certificationNumber: string;
    name : string;
    gender : string;
    agreedPersonal: boolean;
};