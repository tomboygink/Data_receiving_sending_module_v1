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
exports.Dev_sessTable = exports.Dev_sessEntity = void 0;
var DBase_1 = require("./DBase");
var DateStr_1 = require("../../xcore/dbase/DateStr");
var Dev_sessEntity = (function () {
    function Dev_sessEntity() {
        this.id = 0;
        this.time_srv = new Date(Date.now());
        this.dev_number = '';
        this.dev_id = 0;
        this.level_akb = 0;
        this.sess_data = '';
    }
    return Dev_sessEntity;
}());
exports.Dev_sessEntity = Dev_sessEntity;
var Dev_sessTable = (function () {
    function Dev_sessTable(_args, _sess_code) {
        this.db = (0, DBase_1.getDB)();
        this.args = _args;
        this.sess_code = _sess_code;
    }
    Dev_sessTable.prototype.selectDevSess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dev_sess, tzoffset, start_date, end_date, db_res, result, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dev_sess = {
                            id: 0,
                            time_dev: '',
                            time_srv: '',
                            dev_number: '',
                            dev_id: 0,
                            level_akb: 0.0,
                            sess_data: ''
                        };
                        tzoffset = (new Date()).getTimezoneOffset() * 60000;
                        start_date = (0, DateStr_1.dateTimeToSQL)(new Date(this.args.sess_period_start));
                        end_date = (0, DateStr_1.dateTimeToSQL)(new Date(this.args.sess_period_end));
                        return [4, this.db.query("SELECT * FROM SelectDev_Sess ('" + this.args.dev_number + "', '" + start_date + "', '" + end_date + "')")];
                    case 1:
                        db_res = _a.sent();
                        result = new Array();
                        for (i in db_res.rows) {
                            dev_sess = {
                                id: db_res.rows[i].id,
                                time_dev: (new Date(db_res.rows[i].time_dev - tzoffset)).toISOString().slice(0, -8),
                                time_srv: (new Date(db_res.rows[i].time_srv - tzoffset)).toISOString().slice(0, -8),
                                dev_number: db_res.rows[i].dev_number,
                                dev_id: db_res.rows[i].dev_id,
                                level_akb: db_res.rows[i].level_akb,
                                sess_data: db_res.rows[i].sess_data
                            };
                            result.push(dev_sess);
                        }
                        return [2, result];
                }
            });
        });
    };
    Dev_sessTable.prototype.selectFirstLastSess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dev_sess, db_res_last, db_res_first, result, i, tzoffset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dev_sess = {
                            id: 0,
                            time_dev: '',
                            time_srv: '',
                            dev_number: '',
                            dev_id: 0,
                            level_akb: 0.0,
                            sess_data: ''
                        };
                        return [4, this.db.query("SELECT * FROM dev_sess where dev_number = '" + this.args.dev_number + "' order by id desc limit 1;")];
                    case 1:
                        db_res_last = _a.sent();
                        return [4, this.db.query("SELECT dev_sess.* FROM dev_sess INNER JOIN control_dev_sess ON dev_sess.id = control_dev_sess.dev_sess_id " +
                                "WHERE dev_sess.dev_number = '" + this.args.dev_number + "'")];
                    case 2:
                        db_res_first = _a.sent();
                        result = new Array();
                        for (i in db_res_last.rows) {
                            tzoffset = (new Date()).getTimezoneOffset() * 60000;
                            dev_sess = {
                                id: db_res_last.rows[i].id,
                                time_dev: (new Date(db_res_last.rows[i].time_dev - tzoffset)).toISOString().slice(0, -8),
                                time_srv: (new Date(db_res_last.rows[i].time_srv - tzoffset)).toISOString().slice(0, -8),
                                dev_number: db_res_last.rows[i].dev_number,
                                dev_id: db_res_last.rows[i].dev_id,
                                level_akb: db_res_last.rows[i].level_akb,
                                sess_data: db_res_last.rows[i].sess_data
                            };
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
                                };
                            }
                            result.push(dev_sess);
                        }
                        return [2, result];
                }
            });
        });
    };
    return Dev_sessTable;
}());
exports.Dev_sessTable = Dev_sessTable;
//# sourceMappingURL=Dev_sess.js.map