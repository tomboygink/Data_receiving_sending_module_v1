import { DBase, getDB } from "./DBase";
import crypto from 'crypto';
import { CONFIG } from '../../xcore/config';
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'


export class UsersEntity {
    id: number = 0;
    login: string = '';
    password: string = '';
    family: string = '';
    name: string = '';
    father: string = '';
    telephone: string = '';
    email: string = '';
    org_id: number = 0;
    job_title_id: number = 0;
    roles_ids: Object = {};
    user_data: Object = {};
    mail_code: string = '';
    act_mail: boolean = false;
    re_password_code: string = '';
    deleted: boolean = false;
    deleted_date: Date = null;
    created_at: Date = new Date(Date.now());
    info: string = '';
    constructor() { }
}

export class UserTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }

    //Поиск пользователя по логину и паролю
    async selectUser(): Promise<UsersEntity[]> {
        var db_res = await this.db.query("SELECT * FROM SelectUser ('" + this.args.login + "', '" + crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.password).digest('hex') + "')");
        var result: UsersEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //Поиск пользователя по коду сессии 
    async selectUserBySessCode(): Promise<UsersEntity[]> {
        var db_res = await this.db.query("SELECT * FROM SelectUserBySessCode ('" + this.args.code + "')");
        var result: UsersEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //Обновление данных по email
    async updateMail(): Promise<UsersEntity[]> {
        //Получаем актуальные данные
        var db_res = await this.db.query("SELECT * FROM SelectUserBySessCode ('" + this.sess_code + "')");
        //генерируем код из бд
        var code = crypto.createHmac('sha256', CONFIG.server.key_code).update(db_res.rows[0].login + "_" + db_res.rows[0].email).digest('hex');
        //Проверяем код с полученным
        if (code !== this.args.code) {
            result = [];
        }
        else {
            //обновление email
            var db_res = await this.db.query("SELECT * FROM UpdateUserEmail('" + this.args.code + "', '" + this.sess_code + "')");
            //Получение актуальных данных
            db_res = await this.db.query("SELECT * FROM SelectUserBySessCode ('" + this.sess_code + "')");
            var result: UsersEntity[] = new Array();
            for (var r in db_res.rows) {
                result.push(db_res.rows[r]);
            }
        }
        return result

    }

    //Изменение данных пользователя 
    async updateUser(): Promise<UsersEntity[]> {
        var db_res = await this.db.query("SELECT * FROM UpdateUser('" + this.args.login + "','" +
            this.args.family + "','" + this.args.name + "','" + this.args.father + "','" + this.args.telephone + "','" + this.args.email + "','" + this.args.info + "')");
        db_res = await this.db.query("SELECT * FROM SelectUserBySessCode ('" + this.sess_code + "')");

        var result: UsersEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;

    }

    //Изменения пароля из панели управления
    async changePass(): Promise<UsersEntity[]> {

        //генерация нового пароля 
        var pass = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.new_password).digest('hex');
        //генерация нового кода
        var re_pass_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + pass).digest('hex');
        //изменение re_pass_code
        await this.db.query("SELECT * FROM UpdateRePassCode ('" + this.args.login + "','" + re_pass_code + "')");
        //изменение пароля 
        await this.db.query("SELECT * FROM ChangePass('" + this.args.login + "','" + pass + "')");
        //Получение актуальных данных

        var db_res = await this.db.query("SELECT * FROM SelectUserBySessCode ('" + this.sess_code + "')");
        var result: UsersEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //Получение пользователя для смены пароля "Забыли пароль"
    async selectUserLoginEmail(): Promise<UsersEntity[]> {
        var data = '';
        if (this.args.email !== undefined) {
            data = this.args.email;
        }
        if (this.args.login !== undefined) {
            data = this.args.login;
        }


        var db_res = await this.db.query("SELECT * FROM SelectUserLoginEmail ('" + data + "')");
        var result: UsersEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //Забыли пароль
    async forgPass(): Promise<UsersEntity[]> {
        //обновление пароля шифрование нового пароля
        //получение актуальных данных
        //изменение re_pass_code //генерируется из email и пароля (нового) 

        //Генерация пароля
        var pass = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.new_password).digest('hex');
        //генерация нового кода re_pass_code
        var re_pass_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + pass).digest('hex');
        //Изменение re_pass_code и пароля
        await this.db.query("SELECT * FROM ForgPass ('" + this.args.login + "','" + pass + "','" + re_pass_code + "')");

        var result: UsersEntity[] = new Array();
        return result;
    }

    //Получение всех пользователей 
    async selectAllUsers():Promise<UsersEntity[]>{
        var db_res = await this.db.query("SELECT * FROM SelectAllUsers()");
        var result:UsersEntity[] = new Array();
        for (var r in db_res.rows){
            result.push(db_res.rows[r]);
        }
        return result;
        
    }

    //Добавление нового пользователя 
    async insertUser(): Promise<UsersEntity[]> {
        var pass = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.password).digest('hex');
        var re_pass_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + pass).digest('hex');
        var mail_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + this.args.email).digest('hex');
        var access = '';
        //users_r = 1
        //users_w = 2
        if(this.args.users_r === false && this.args.users_w === false)
        {
            access = '{\"roles\":[1]}';
        }
        if(this.args.users_r === true && this.args.users_w === false)
        {
            access = '{\"roles\":[1]}';
        }
        if(this.args.users_r === false && this.args.users_w === true)
        {
            access = '{\"roles\":[1,2]}';
        }
        if(this.args.users_r === true && this.args.users_w === true)
        {
            access = '{\"roles\":[1,2]}';
        }
        
        var db_res = await this.db.query("SELECT AddUser(CAST ('" + this.args.login + "' AS VARCHAR(250)), " +
        "CAST ('" + pass + "' AS VARCHAR(250)), CAST ('" + this.args.family + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.name + "' AS VARCHAR(150)), CAST ('" + this.args.father + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.telephone + "' AS VARCHAR(50)), CAST ('" + this.args.email + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.id_org + "' AS BIGINT), CAST ('" + this.args.id_job + "' AS BIGINT), " +
        "CAST ('"+access+"' AS JSON), CAST ('{\"user_data\":[]}' AS JSON)," +
        "CAST ('" + mail_code + "' AS VARCHAR(250)), CAST ('false' AS BOOLEAN)," +
        "CAST ('" + re_pass_code + "' AS VARCHAR(250)), CAST ('false' AS BOOLEAN)," +
        "CAST (null AS TIMESTAMP), CAST('" + dateTimeToSQL(new Date(Date.now())) + "' AS TIMESTAMP), " +
        "CAST ('" + this.args.info + "' AS TEXT)) as id");
        var result: UsersEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Обновление данных пользователя администратором
    async updateUserAdmin()
    {
        
        var pass = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.new_password).digest('hex');
        var mail_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + this.args.email).digest('hex');
        var re_pass_code = crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.login + "_" + pass).digest('hex');
        var access = '';
        //users_r = 1
        //users_w = 2
        if(this.args.users_r === false && this.args.users_w === false)
        {
            access = '{\"roles\":[1]}';
        }
        if(this.args.users_r === true && this.args.users_w === false)
        {
            access = '{\"roles\":[1]}';
        }
        if(this.args.users_r === false && this.args.users_w === true)
        {
            access = '{\"roles\":[1,2]}';
        }
        if(this.args.users_r === true && this.args.users_w === true)
        {
            access = '{\"roles\":[1,2]}';
        }

        await this.db.query("SELECT * FROM UpdateUserAdmin(CAST ('" + this.args.login + "' AS VARCHAR(250)), " +
        "CAST ('" + pass + "' AS VARCHAR(250)), CAST ('" + this.args.family + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.name + "' AS VARCHAR(150)), CAST ('" + this.args.father + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.telephone + "' AS VARCHAR(50)), CAST ('" + this.args.email + "' AS VARCHAR(150)), " +
        "CAST ('" + this.args.id_org + "' AS BIGINT), CAST ('" + this.args.id_job + "' AS BIGINT), " +
        "CAST ('"+access+"' AS JSON), " +
        "CAST ('" + mail_code + "' AS VARCHAR(250)), " +
        "CAST ('" + re_pass_code + "' AS VARCHAR(250)), CAST ('"+this.args.deleted+"' AS BOOLEAN)," +
        "CAST ('" + this.args.info + "' AS TEXT))");
    }

}