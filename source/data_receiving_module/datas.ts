//импорт базы данных
import { DBase, getDB } from "../xcore/dbase/DBase"
import { time_to_datetime, dateTimeToSQL } from "../xcore/dbase/DateStr"

export class ReceivingData {
    data: string;
    db: DBase;


    constructor(_data: string) {
        this.data = _data;
        this.db = getDB();
    }

    //Сохранение данных в базу данных 
    async saveSqlData() {
        try {
            console.log("================================================================");
            console.log("SAVING DATA TO POSTGRE SQL")

            //парсинг данных в формат JSON
            var sess_json = JSON.parse(this.data);
            var errors = false;
            var err_info = '';

            //ЦИКЛ 
            for (var i = 0; i < sess_json.sess_arr.length; i++) {

                var info = JSON.stringify(sess_json.sess_arr[i]);

                
                //console.log(info);
                

                var query_devs = await this.db.query("SELECT * FROM devs WHERE number = '" + sess_json.sess_arr[i].number + "'");
                if (query_devs.rows.length === 0) {
                    console.log("ДАННОЕ УСТРОЙСТВО ОТСУТСВУЕТ В БАЗЕ ДАННЫХ");
                    await this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('ERROR', '" + info + "', 'ДАННОЕ УСТРОЙСТВО ОТСУТСВУЕТ В БАЗЕ ДАННЫХ')");
                    errors = true;
                }

                //если устройство есть в бд
                if (errors == false) {

                    //console.log(query_devs[0].sensors["s"].length," ", sensors.length);

                    //Если количество переданных данных больше чем в базе данных
                    if (query_devs.rows[0].sensors["s"].length < sess_json.sess_arr[i].sensors.length) {
                        // console.log("ПРИНЯТО БОЛЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ(ВОЗМОЖНА ПОТЕРЯ ДАННЫХ)");
                        err_info = "ПРИНЯТО БОЛЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ(ВОЗМОЖНА ПОТЕРЯ ДАННЫХ)";
                        await this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'ПРИНЯТО БОЛЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ(ВОЗМОЖНА ПОТЕРЯ ДАННЫХ)')");
                        errors = true;
                    }
                    //Если количество переданных данных меньше чем в базе данных
                    if (query_devs.rows[0].sensors["s"].length > sess_json.sess_arr[i].sensors.length) {
                        //console.log("ПРИНЯТО МЕНЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ");
                        err_info = "ПРИНЯТО МЕНЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ";
                        await this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'ПРИНЯТО МЕНЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ')");
                        errors = true;
                    }

                    if (errors) {
                        //console.log(err_info);
                        console.log("\x1b[33m", info , err_info,"\x1b[37m");
                    }



                    //время сервера
                    //var srv_time = new Date().getFullYear() +"-"+ new Date().getMonth() +"-"+ new Date().getDate()+" "+new Date().getHours() + ":" + new Date().getMinutes() +":"+ new Date().getSeconds();

                    var srv_time = dateTimeToSQL(new Date(Date.now()));

                    //json для глубины и данных 
                    var obj = query_devs.rows[0].sensors["s"];

                    //console.log("ДАТЧИКОВ", obj.length);


                    //создание json с глубиной и данными по сенсерам
                    var s = '{"s":[';
                    for (var j = 0; j < obj.length; j++) {
                        if (j !== obj.length - 1) {
                            if (sess_json.sess_arr[i].sensors.length > j) { s += '{"depth":"' + obj[j].depth + '", "data":"' + sess_json.sess_arr[i].sensors[j] + '"},' }
                            else { s += '{"depth":"' + obj[i].depth + '", "data":"0.0"},' }
                        }
                        else {
                            if (sess_json.sess_arr[i].sensors.length > j ) { s += '{"depth":"' + obj[i].depth + '", "data":"' + sess_json.sess_arr[i].sensors[j] + '"}' }
                            else { s += '{"depth":"' + obj[i].depth + '", "data":"0.0"}' }
                        }
                    }
                    s += ']}';

                    //console.log("JSON TO SQL ", s);
                    //сохранение сессии в бд

                    var sess_data_sql = await this.db.query("INSERT INTO dev_sess (time_dev, time_srv, dev_number, dev_id, level_akb, sess_data) VALUES ('" + sess_json.sess_arr[i].time + "', '" + srv_time + "', '" + query_devs.rows[0].number + "', " + query_devs.rows[0].id + ", " + sess_json.sess_arr[i].akb + ", '" + s + "') RETURNING id");

                    //console.log(sess_data_sql.rows);

                    if (sess_data_sql.rows[0].id == 0 || sess_data_sql == null || sess_data_sql == undefined) {
                        await this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'НЕ МОГУ СОЗДАТЬ СЕСИИЮ ДЛЯ ПРИЕМА ДАННЫХ')");
                        console.log("\x1b[33m", info, 'НЕ МОГУ СОЗДАТЬ СЕСИИЮ ДЛЯ ПРИЕМА ДАННЫХ "\x1b[37m');
                    }
                    console.log();
                }
            }

        }
        catch (error) {
            console.log(error)
        }




    }
}