import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'

export class Dev_sessEntity {
    id: number = 0;
    time_srv: Date = new Date(Date.now());
    dev_number: string = '';
    dev_id: number = 0;
    level_akb: number = 0;
    sess_data: string = '';
    constructor() { }
}

export class Dev_sessTable {
    db: DBase;
    args: any;
    sess_code: string;
    constructor(_args: any, _sess_code: string) {
        this.db = getDB();
        this.args = _args;
        this.sess_code = _sess_code;
    }

    //Получение сессий устройства за определенный период

    /*async selectDevSess(): Promise<Dev_sessEntity[]>{
        var start_date = new Date(this.args.sess_period_start).toISOString().slice(0, 19).replace('T', ' ');
        var end_date = new Date(this.args.sess_period_end).toISOString().slice(0, 19).replace('T', ' ');
        var db_res = await this.db.query("SELECT * FROM SelectDev_Sess ('"+this.args.dev_number+"', '"+start_date+"', '"+end_date+"')");
        var result: Dev_sessEntity[] = new Array();
        for (var r in db_res.rows) {
            //console.log(db_res.rows[r])
            result.push(db_res.rows[r]);
        }
        console.log(result);
        return result;
    }*/

    async selectDevSess() {

        var dev_sess: any = {
            id: 0,
            time_dev: '',
            time_srv: '',
            dev_number: '',
            dev_id: 0,
            level_akb: 0.0,
            sess_data: ''
        };


        var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах  
        //console.log(dateTimeToSQL(new Date (this.args.sess_period_start)));
        var start_date = dateTimeToSQL(new Date(this.args.sess_period_start));
        var end_date = dateTimeToSQL(new Date(this.args.sess_period_end));
        var db_res = await this.db.query("SELECT * FROM SelectDev_Sess ('" + this.args.dev_number + "', '" + start_date + "', '" + end_date + "')");
        // console.log('db_res.rows', start_date);
        // console.log('db_res.rows', end_date);
        // console.log('db_res.rows', db_res.rows);

        var result: Dev_sessEntity[] = new Array();
        for (var i in db_res.rows) {
            dev_sess = {
                id: db_res.rows[i].id,
                time_dev: (new Date(db_res.rows[i].time_dev - tzoffset)).toISOString().slice(0, -8),
                time_srv: (new Date(db_res.rows[i].time_srv - tzoffset)).toISOString().slice(0, -8),
                dev_number: db_res.rows[i].dev_number,
                dev_id: db_res.rows[i].dev_id,
                level_akb: db_res.rows[i].level_akb,
                sess_data: db_res.rows[i].sess_data
            }

            //console.log(new Date(db_res.rows[i].time_dev - tzoffset));
            result.push(dev_sess);
        }
        //console.log(result);
        return result;
    }

    async selectFirstLastSess() {
        var dev_sess: any = {
            id: 0,
            time_dev: '',
            time_srv: '',
            dev_number: '',
            dev_id: 0,
            level_akb: 0.0,
            sess_data: ''
        };
        var db_res_last = await this.db.query("SELECT * FROM dev_sess where dev_number = '" + this.args.dev_number + "' order by id desc limit 1;"); //last
        //var db_res_first = await this.db.query("SELECT * FROM dev_sess where dev_number = '" + this.args.dev_number + "' order by id asc limit 1;"); //first
        var db_res_first = await this.db.query("SELECT dev_sess.* FROM dev_sess INNER JOIN control_dev_sess ON dev_sess.id = control_dev_sess.dev_sess_id " +
            "WHERE dev_sess.dev_number = '" + this.args.dev_number + "'");

        


        var result: Dev_sessEntity[] = new Array();
        for (var i in db_res_last.rows) {

            var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах
            //console.log(db_res_first.rows[i]);


            dev_sess = {
                id: db_res_last.rows[i].id,
                time_dev: (new Date(db_res_last.rows[i].time_dev - tzoffset)).toISOString().slice(0, -8),
                time_srv: (new Date(db_res_last.rows[i].time_srv - tzoffset)).toISOString().slice(0, -8),
                dev_number: db_res_last.rows[i].dev_number,
                dev_id: db_res_last.rows[i].dev_id,
                level_akb: db_res_last.rows[i].level_akb,
                sess_data: db_res_last.rows[i].sess_data
            }
            result.push(dev_sess);

            if (db_res_first.rows[i] !== undefined) {
                dev_sess = {
                    id: db_res_first.rows[i].id,
                    time_dev: (new Date(db_res_first.rows[i].time_dev - tzoffset)).toISOString().slice(0, -8),
                    time_srv: (new Date(db_res_first.rows[i].time_srv - tzoffset)).toISOString().slice(0, -8),
                    dev_number: db_res_first.rows[i].dev_number,
                    dev_id: db_res_first.rows[i].dev_id,
                    level_akb: db_res_first.rows[i].level_akb,
                    sess_data: db_res_first.rows[i].sess_data
                }
            }

            result.push(dev_sess);

        }
        return result;

    }

}
