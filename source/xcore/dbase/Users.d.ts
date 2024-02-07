import { DBase } from "./DBase";
export declare class UsersEntity {
    id: number;
    login: string;
    password: string;
    family: string;
    name: string;
    father: string;
    telephone: string;
    email: string;
    org_id: number;
    job_title_id: number;
    roles_ids: Object;
    user_data: Object;
    mail_code: string;
    act_mail: boolean;
    re_password_code: string;
    deleted: boolean;
    deleted_date: Date;
    created_at: Date;
    info: string;
    constructor();
}
export declare class UserTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string);
    selectUser(): Promise<UsersEntity[]>;
    selectUserBySessCode(): Promise<UsersEntity[]>;
    updateMail(): Promise<UsersEntity[]>;
    updateUser(): Promise<UsersEntity[]>;
    changePass(): Promise<UsersEntity[]>;
    selectUserLoginEmail(): Promise<UsersEntity[]>;
    forgPass(): Promise<UsersEntity[]>;
    selectAllUsers(): Promise<UsersEntity[]>;
    insertUser(): Promise<UsersEntity[]>;
    updateUserAdmin(): Promise<void>;
}
