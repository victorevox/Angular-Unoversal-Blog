export interface IUser {
    _id: any;
    profileImg: string;
    email: string;
    username: string;
    createdAt: string;
    banned: boolean;
    roles: [ USER_ROLE ];
}

export enum USER_ROLE {
    ADMIN = "admin",
    USER = "user"
}