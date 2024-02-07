import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'

export class Dev_povsEntity {
    id: number = 0;
    dev_id: number = 0;
    dev_number: string = '';
    start_povs: Date = null;
    end_povs: Date = null;
    old_dev_povs: number = 0;
    constructor() { }
}

export class Dev_povsTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }

    //Добавление/Обновление поверочного интервала 
    async insertDev_povs(): Promise<Dev_povsEntity[]> {
        var db_res = await this.db.query("SELECT AddDev_Povs(" +
            "CAST (" + this.args.dev_id + " AS BIGINT)," +
            "CAST ('" + this.args.dev_number + "' AS VARCHAR(80)), " +
            "CAST ('" + dateTimeToSQL(new Date(this.args.start_povs)) + "' AS TIMESTAMP), " +
            "CAST ('" + dateTimeToSQL(new Date(this.args.end_povs)) + "' AS TIMESTAMP), " +
            "CAST ('" + this.args.old_dev_povs + "' AS BIGINT)) AS id");
        var result: Dev_povsEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Выбор поверочного интервала
    async selectDev_povs(): Promise<Dev_povsEntity[]> {
        var dev_povs: any = {
            id: 0,
            dev_id: 0,
            dev_number: '',
            start_povs: '',
            end_povs: '',
            old_dev_povs: 0
        };


        var db_res = await this.db.query("SELECT * FROM SelectDev_Povs('" +
            this.args.id + "', '" + this.args.dev_number + "')");

        var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах  

        var result: Dev_povsEntity[] = new Array();
        for (var i in db_res.rows) {

            dev_povs = {
                id: db_res.rows[i].id,
                dev_id: db_res.rows[i].dev_id,
                dev_number: db_res.rows[i].dev_number,
                start_povs: (new Date(db_res.rows[i].start_povs - tzoffset)).toISOString().slice(0, -8),
                end_povs: (new Date(db_res.rows[i].end_povs - tzoffset)).toISOString().slice(0, -8),
                old_dev_povs: db_res.rows[i].old_dev_povs,
            }
            result.push(dev_povs);
        }

        return result;
    }
}
