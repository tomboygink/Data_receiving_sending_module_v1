import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'


export class OrgsEntity {
    id: number = 0;
    name: string = '';
    full_name: string = '';
    inn: string = '';
    address: string = '';
    latitude: string = '';
    longitude: string = '';
    created_at: Date = new Date(Date.now());
    info: string = '';

    constructor() { }
}


export class OrgsTable {
    db: DBase;
    args: any;
    sess_code: string;

    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }

    //Добавление организации
    async insertOrgs(): Promise<OrgsEntity[]> {
        var db_res = await this.db.query("SELECT AddOrgs(CAST ('" + this.args.name + "' AS VARCHAR(250)), "+
        "CAST ('" + this.args.full_name + "' AS VARCHAR(400)), "+
        "CAST ('" + this.args.inn + "' AS VARCHAR(50)), "+
        "CAST ('" + this.args.address + "' AS VARCHAR(400)), "+
        "CAST ('" + this.args.latitude + "' AS VARCHAR(60)), "+
        "CAST ('" + this.args.longitude + "' AS VARCHAR(60)), "+
        "CAST ('" + dateTimeToSQL(new Date(Date.now())) + "' AS TIMESTAMP),"+
        "CAST ('" + this.args.info + "' AS TEXT)) AS id");
        var result: OrgsEntity[] = new Array();
        for (var r in db_res.rows) {
            result.push(db_res.rows[r]);
        }
        return result;
    }

    //Получение всех организаций 
    async selectOrgs(): Promise<OrgsEntity[]> {
        var db_res = await this.db.query("SELECT * FROM SelectOrgs()");
        var result: OrgsEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Редактирование организации 
    async updateOrgs(){
        await this.db.query("SELECT * FROM UpdateOrgs(" +
        "CAST (" + this.args.id + " AS BIGINT), " +
        "CAST ('" + this.args.name + "' AS VARCHAR(250)), " +
        "CAST ('" + this.args.full_name + "' AS VARCHAR(400)), " +
        "CAST ('" + this.args.inn + "' AS VARCHAR(50)), " +
        "CAST ('" + this.args.address + "' AS VARCHAR(400)), " +
        "CAST ('" + this.args.latitude + "' AS VARCHAR(60)), " +
        "CAST ('" + this.args.longitude + "' AS VARCHAR(60)), " +
        "CAST ('" + this.args.info + "' AS TEXT))");
    }

}


