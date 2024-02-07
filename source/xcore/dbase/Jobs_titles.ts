import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'


export class Jobs_titlesEntity{
    id:number = 0;
    org_id:number = 0;
    name:string = '';
    created_at:Date =  new Date(Date.now());
    info:string = '';

    constructor(){}
}

export class Jobs_titlesTable{
    db: DBase;
    args: any;
    sess_code: string;

    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }
    //Получение должностей организации 
    async selectJobs_title():Promise<Jobs_titlesEntity[]>{
        var db_res = await this.db.query("SELECT * FROM SelectJobs_titles("+this.args.id_org+")");
        var result: Jobs_titlesEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Добавление должности в организацию 
    async insertJobs_title():Promise<Jobs_titlesEntity[]>{
        var db_res = await this.db.query("SELECT addJobs_titles(CAST ("+this.args.id_org+" AS BIGINT), "+
        "CAST ('"+this.args.job_title+"' AS VARCHAR(250)), "+
        "CAST ('" + dateTimeToSQL(new Date(Date.now())) + "' AS TIMESTAMP), "+
        "CAST ('"+this.args.info+"' AS TEXT)) AS id");
        var result: Jobs_titlesEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    async  updateJobs_title()
    {
        await this.db.query("SELECT * FROM UpdateJobs_titles(" +
        "CAST (" + this.args.id + " AS BIGINT), " +
        "CAST (" + this.args.org_id + " AS BIGINT), " +
        "CAST ('" + this.args.name + "' AS VARCHAR(250)), " +
        "CAST ('" + this.args.info + "' AS TEXT))");
    }
}