import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from "../dbase/DateStr"

import crypto from 'crypto';
import { CONFIG } from '../../xcore/config';

export class SessionsEntity {
    id: number = 0;
    uid: number = 0;
    expires: Date = null;
    created_at: Date = new Date(Date.now());
    sess_code: string = '';
    sess_data: Object = { "data": [] };

    constructor() { }
}

export class SessionsTable {
    db: DBase;
    args: any;

    constructor(_args: any) {
        this.db = getDB();
        this.args = _args;

    }

    //--------------------------------------------------------------------------------------Добавление сессии
    async insertSess() {

        var db = await this.db.query("SELECT * FROM SelectUser ('" + this.args.login + "', '" + crypto.createHmac('sha256', CONFIG.server.key_code).update(this.args.password).digest('hex') + "')");
        
       
        if (db.rows.length !== 0) {
            const date = new Date;
            date.setDate(date.getDate() + 15);
            // получаем id для записи 
            var id_q = await this.db.query("SELECT max(id) FROM sessions");
            var id: number = 0;
            //если записей в Sessions не было то присваеваем 1
            if (id_q.rows[0].max === null) { id++; }
            //иначе к последней записи добавляем 1 
            else { id = parseInt(id_q.rows[0].max) + 1 }

            var sess = crypto.createHmac('sha256', CONFIG.server.key_code).update(id + "_" + dateTimeToSQL(date) + "_" + db.rows[0].selectiduser).digest('hex');
            //записываем в Sessions
            await this.db.query("SELECT addusersession (CAST (" + db.rows[0].id + " AS INTEGER), CAST ('" + dateTimeToSQL(date) +
                "' AS TIMESTAMP), CAST ('" + dateTimeToSQL(new Date(Date.now())) + "' AS TIMESTAMP), CAST('" + sess + "' AS VARCHAR(250)), CAST('{\"data\":[]}' AS JSON));");
            return sess;
        }
        return '';
    }

    //--------------------------------------------------------------------------------------Получение сессии из базы данных
    async selectSessCode(): Promise<SessionsEntity[]> {
        var db_res = await this.db.query("SELECT * FROM SelectSessCode ('" + this.args.code + "')");
        var result: SessionsEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //--------------------------------------------------------------------------------------Удаление сессии при выходе
    async deleteSess() {
        await this.db.query("SELECT DeleteSessions('" + this.args.sess_id + "')");
    }


}
