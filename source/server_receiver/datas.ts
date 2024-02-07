//импорт базы данных

import { time_to_datetime, dateTimeToSQL, dateTimeToStr } from "../xcore/dbase/DateStr"
import net from "net";
import { CONFIG } from "../xcore/config"


global.sess_arr = [];



global.check = false;




export class ServerData {

    data_str: string;
    s_ind: number;
    data_arr: Array<string>;
    client: net.Socket;

    constructor(_data_str: string, _s_ind: number) {
        this.data_str = _data_str;
        this.s_ind = _s_ind;
        this.data_arr = [];
    }



    async Run() {

        try {
            console.log(this.s_ind, "\x1b[0m >> " + this.data_str);
            //разбираем строку формата csv
            var dt_arr_0 = this.data_str.split(",");

            for (var d in dt_arr_0) {
                if (dt_arr_0[d].trim() != '') {
                    this.data_arr.push(dt_arr_0[d].trim());
                }
            }


            //Ошибка данных для парсера
            if (this.data_arr.length <= 2) {
                console.log(this.s_ind, "\x1b[31m >>", this.data_str);
                return;
            }

            //Парсер данных 
            //time 
            var TIME = time_to_datetime(this.data_arr[1]);
            this.data_arr[0] = "-";
            this.data_arr[1] = "-";

            //number 
            var NUMBER = null;
            var NUMBER_I = this.data_arr.indexOf("Number");
            this.data_arr[NUMBER_I] = "-";
            if (NUMBER_I > 0) {
                NUMBER = (this.data_arr[NUMBER_I + 1]).trim();
            }
            this.data_arr[NUMBER_I + 1] = "-";

            //akb 
            var AKB = null;
            var AKB_I = this.data_arr.indexOf("AKB");
            this.data_arr[AKB_I] = "-";
            if (AKB_I > 0) {
                AKB = (this.data_arr[AKB_I + 1]).trim();
            }
            this.data_arr[AKB_I + 1] = "-";

            //sensors
            var SENSORS = [];
            var SENSORS_I = this.data_arr.indexOf("Sensors");
            this.data_arr[SENSORS_I] = "-";
            if (SENSORS_I > 0) {
                for (var d in this.data_arr) {
                    if (this.data_arr[d].trim() !== '-' && !isNaN(Number(this.data_arr[d].trim()))) { SENSORS.push(Number(this.data_arr[d].trim())); }
                    else { if (this.data_arr[d].trim() !== '-') SENSORS.push("---"); }
                }
            }

            /*console.log(" ВРЕМЯ ", TIME);
            console.log(" НОМЕР УСТРОЙСТВА ",NUMBER);
            console.log(" ЗАРЯД УСТРОЙСТВА " ,AKB);
            console.log("Данные с сенсеров ", SENSORS);*/

            //ошибки парсера данных 
            var errors = false;
            var info_err = "";
            if (TIME == null) {
                info_err += "ВРЕМЯ НЕ СООТВЕТСВУЕТ ФОРМАТУ";
                errors = true;
            }
            if (NUMBER == null) {
                info_err += "ДАННОГО УСТРОЙСТВА НЕТ В БАЗЕ ДАННЫХ";
                errors = true;
            }
            if (AKB == null) {
                info_err += "УРОВЕНЬ ЗАРЯДА НЕ СООТВЕТСТВУЕТ ФОРМАТУ ИЛИ ОТСУТСТВУЕТ"
                errors = true;
            }
            if (SENSORS.length < 1) {
                info_err += "ДАННЫХ ПО СЕНСЕРАМ НА УСТРОЙСТВЕ НЕТ"
                errors = true;
            }
            if (SENSORS.indexOf("---") >= 0) {
                info_err += " ОШИБКА ДАННЫХ НА СЕНСОРАХ (ПРОВЕРЬТЕ КАК ПЕРЕДАЕТ УСТРОЙСТВО);";
                errors = true;
            }
            if (NUMBER == "1111") {
                info_err += "УСТРОЙСТВО РАБОТАЕТ НЕ ИСПРАВНО"
                errors = true;
            }
            if (errors) {
                console.log(this.s_ind, "\x1b[35m", this.data_str, info_err);
                return;
            }


            //объект с данными
            global.sess = {
                time: TIME,
                number: NUMBER,
                sensors: SENSORS,
                akb: AKB
            }

            //добавление объекта в массив
            global.sess_arr.push(sess)

            //Отправка на модуль приема
            this.sendData(global.sess_arr);
        }
        catch
        {
            info_err += "ПРОИЗОШЛА ФАТАЛЬНАЯ ОШИБКА"
        }

    }

    //отправка данных 
    sendData(sess_arr: any) {

        // var date = new Date;
        // console.log("Секунды: " + date.getSeconds());
        // console.log("Количество данных " + sess_arr.length)
        // console.log("global.check " + global.check)

        //успешное подключение и отправка
        this.client = net.createConnection({
            host: CONFIG.data_receiving_module.host,
            port: CONFIG.data_receiving_module.port
        }, () => {
            this.client.write("{\"sess_arr\":" + JSON.stringify(global.sess_arr)+"}");
            console.log("\x1b[32m Данные успешно отправлены на модуль приема данных\x1b[37m");
        });

        //при неудачной попытке передачи данных 
        this.client.on('error', (error) => {
            console.log("\x1b[31m Модуль приема данных не запущен или ошибка передачи данных\x1b[37m");
            if (global.check === false)
                setTimeout(() => {
                    global.check = true;
                    setTimeout(() => {
                        global.check = false;
                        this.sendData(sess_arr)
                    }, 10000) // стоит 10 секунд, установить 5 минут 
                });
        });

        //получение данных от модуля приема данных 
        this.client.on('data', (data) => {
            console.log(Buffer.from(data).toString().trim())
        });

        //закрытие соединения
        this.client.on('end', () => {
            //очистка массиива 
            global.sess_arr.length = 0;
            //console.log("Количество данных " + sess_arr.length)
        });
    }

}