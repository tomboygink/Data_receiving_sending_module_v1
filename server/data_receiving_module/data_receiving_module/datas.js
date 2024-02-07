"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivingData = void 0;
var DBase_1 = require("../xcore/dbase/DBase");
var DateStr_1 = require("../xcore/dbase/DateStr");
var ReceivingData = (function () {
    function ReceivingData(_data) {
        this.data = _data;
        this.db = (0, DBase_1.getDB)();
    }
    ReceivingData.prototype.saveSqlData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sess_json, errors, err_info, i, info, query_devs, srv_time, obj, s, j, sess_data_sql, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        console.log("================================================================");
                        console.log("SAVING DATA TO POSTGRE SQL");
                        sess_json = JSON.parse(this.data);
                        errors = false;
                        err_info = '';
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < sess_json.sess_arr.length)) return [3, 13];
                        info = JSON.stringify(sess_json.sess_arr[i]);
                        return [4, this.db.query("SELECT * FROM devs WHERE number = '" + sess_json.sess_arr[i].number + "'")];
                    case 2:
                        query_devs = _a.sent();
                        if (!(query_devs.rows.length === 0)) return [3, 4];
                        console.log("ДАННОЕ УСТРОЙСТВО ОТСУТСВУЕТ В БАЗЕ ДАННЫХ");
                        return [4, this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('ERROR', '" + info + "', 'ДАННОЕ УСТРОЙСТВО ОТСУТСВУЕТ В БАЗЕ ДАННЫХ')")];
                    case 3:
                        _a.sent();
                        errors = true;
                        _a.label = 4;
                    case 4:
                        if (!(errors == false)) return [3, 12];
                        if (!(query_devs.rows[0].sensors["s"].length < sess_json.sess_arr[i].sensors.length)) return [3, 6];
                        err_info = "ПРИНЯТО БОЛЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ(ВОЗМОЖНА ПОТЕРЯ ДАННЫХ)";
                        return [4, this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'ПРИНЯТО БОЛЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ(ВОЗМОЖНА ПОТЕРЯ ДАННЫХ)')")];
                    case 5:
                        _a.sent();
                        errors = true;
                        _a.label = 6;
                    case 6:
                        if (!(query_devs.rows[0].sensors["s"].length > sess_json.sess_arr[i].sensors.length)) return [3, 8];
                        err_info = "ПРИНЯТО МЕНЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ";
                        return [4, this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'ПРИНЯТО МЕНЬШЕ ДАННЫХ С СЕНСЕРОВ, ЧЕМ В БАЗЕ ДАННЫХ')")];
                    case 7:
                        _a.sent();
                        errors = true;
                        _a.label = 8;
                    case 8:
                        if (errors) {
                            console.log("\x1b[33m", info, err_info, "\x1b[37m");
                        }
                        srv_time = (0, DateStr_1.dateTimeToSQL)(new Date(Date.now()));
                        obj = query_devs.rows[0].sensors["s"];
                        s = '{"s":[';
                        for (j = 0; j < obj.length; j++) {
                            if (j !== obj.length - 1) {
                                if (sess_json.sess_arr[i].sensors.length > j) {
                                    s += '{"depth":"' + obj[j].depth + '", "data":"' + sess_json.sess_arr[i].sensors[j] + '"},';
                                }
                                else {
                                    s += '{"depth":"' + obj[i].depth + '", "data":"0.0"},';
                                }
                            }
                            else {
                                if (sess_json.sess_arr[i].sensors.length > j) {
                                    s += '{"depth":"' + obj[i].depth + '", "data":"' + sess_json.sess_arr[i].sensors[j] + '"}';
                                }
                                else {
                                    s += '{"depth":"' + obj[i].depth + '", "data":"0.0"}';
                                }
                            }
                        }
                        s += ']}';
                        return [4, this.db.query("INSERT INTO dev_sess (time_dev, time_srv, dev_number, dev_id, level_akb, sess_data) VALUES ('" + sess_json.sess_arr[i].time + "', '" + srv_time + "', '" + query_devs.rows[0].number + "', " + query_devs.rows[0].id + ", " + sess_json.sess_arr[i].akb + ", '" + s + "') RETURNING id")];
                    case 9:
                        sess_data_sql = _a.sent();
                        if (!(sess_data_sql.rows[0].id == 0 || sess_data_sql == null || sess_data_sql == undefined)) return [3, 11];
                        return [4, this.db.query("INSERT INTO info_log (msg_type, log, info) VALUES ('WARNING', '" + info + "', 'НЕ МОГУ СОЗДАТЬ СЕСИИЮ ДЛЯ ПРИЕМА ДАННЫХ')")];
                    case 10:
                        _a.sent();
                        console.log("\x1b[33m", info, 'НЕ МОГУ СОЗДАТЬ СЕСИИЮ ДЛЯ ПРИЕМА ДАННЫХ "\x1b[37m');
                        _a.label = 11;
                    case 11:
                        console.log();
                        _a.label = 12;
                    case 12:
                        i++;
                        return [3, 1];
                    case 13: return [3, 15];
                    case 14:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3, 15];
                    case 15: return [2];
                }
            });
        });
    };
    return ReceivingData;
}());
exports.ReceivingData = ReceivingData;
//# sourceMappingURL=datas.js.map