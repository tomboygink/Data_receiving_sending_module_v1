import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from './DateStr'

export class Control_Dev_SessEntity {
    id: number = 0;
    dev_sess_id: number = 0;
    dev_id: number = 0;
    dev_number: string = '0';
    constructor() { }
}

export class Control_dev_sessTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }

    //Добавление контрольной сессии
    async insertControl_dev_sess(): Promise<Control_Dev_SessEntity[]> {
        var db_res = await this.db.query("SELECT AddControl_Dev_Sess(" +
            "CAST (" + this.args.dev_sess_id + " AS BIGINT), " +
            "CAST (" + this.args.dev_id + " AS BIGINT), " +
            "CAST ('" + this.args.dev_number + "' AS VARCHAR(80))) AS id");
        var result: Control_Dev_SessEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Удаление контрольной сессии 
    async deleteControl_dev_sess()
    {
        await this.db.query("DELETE FROM control_dev_sess WHERE dev_sess_id = ('" + this.args.id + "')");

    }
}