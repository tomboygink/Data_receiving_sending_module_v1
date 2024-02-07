import { DBase, getDB } from "./DBase";

export class DevsEntity {
    id: number = 0;
    group_dev_id: number = 0;
    number: string = '';
    name: string = '';
    period_sess: number = 0;
    latitude: string = '';
    longitude: string = '';
    sensors: Object = {};
    info: string = '';

    constructor() { }
}

export class DevsTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }
    //Добавление устройства
    async insertDevs(): Promise<DevsEntity[]> {
        var data = await this.db.query("SELECT number FROM devs WHERE number = '" + this.args.number + "'");
        if (data.rows.length === 0 || data.rows[0].number !== this.args.number) {

            var db_res = await this.db.query("SELECT AddDevs(CAST(" + this.args.group_dev_id + " AS BIGINT), " +
                "CAST('" + this.args.number + "' AS VARCHAR(80))," +
                "CAST('" + this.args.name + "' AS VARCHAR(250))," +
                "CAST('" + this.args.latitude + "' AS VARCHAR(60))," +
                "CAST('" + this.args.longitude + "' AS VARCHAR(60))," +
                "CAST('" + this.args.sensors + "' AS JSON)," +
                "CAST(" + this.args.deleted + " AS BOOLEAN)," +
                "CAST('" + this.args.info + "' AS TEXT),"+
                "CAST('" + this.args.period_sess + "' AS BIGINT)) AS id");
            var result: DevsEntity[] = new Array();
            for (var p in db_res.rows) { result.push(db_res.rows[p]); }
            return result;
        }

    };

    async delete_duplicate(){
        await this.db.query("delete from devs WHERE id NOT IN (select MIN(id) from devs group by number);");
    }

    //Получение устройств по группе устройства при нажатии 
    async selectDevs(): Promise<DevsEntity[]> {
        var db_res = await this.db.query("SELECT * FROM SelectDevs('" + this.args.dev_group_id + "')");
        var result: DevsEntity[] = new Array();
        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
        return result;
    }

    //Редактирование устройства
    async updateDevs() {
        await this.db.query("SELECT * FROM UpdateDevs(" +
            "CAST (" + this.args.id + " AS BIGINT), " +
            "CAST (" + this.args.group_dev_id + " AS BIGINT), " +
            "CAST ('" + this.args.number + "' AS VARCHAR(80)), " +
            "CAST ('" + this.args.name + "' AS VARCHAR(250)), " +
            "CAST ('" + this.args.latitude + "' AS VARCHAR(60)), " +
            "CAST ('" + this.args.longitude + "' AS VARCHAR(60)), " +
            "CAST ('" + this.args.sensors + "' AS JSON), " +
            "CAST ('" + this.args.deleted + "' AS BOOLEAN), " +
            "CAST ('" + this.args.info + "' AS TEXT),"+
            "CAST ('" + this.args.period_sess + "' AS BIGINT))");
    }
}