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
exports.Dev_povsTable = exports.Dev_povsEntity = void 0;
var DBase_1 = require("./DBase");
var DateStr_1 = require("../../xcore/dbase/DateStr");
var Dev_povsEntity = (function () {
    function Dev_povsEntity() {
        this.id = 0;
        this.dev_id = 0;
        this.dev_number = '';
        this.start_povs = null;
        this.end_povs = null;
        this.old_dev_povs = 0;
    }
    return Dev_povsEntity;
}());
exports.Dev_povsEntity = Dev_povsEntity;
var Dev_povsTable = (function () {
    function Dev_povsTable(_args, _sess_code) {
        this.db = (0, DBase_1.getDB)();
        this.args = _args;
        this.sess_code = _sess_code;
    }
    Dev_povsTable.prototype.insertDev_povs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db_res, result, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.db.query("SELECT AddDev_Povs(" +
                            "CAST (" + this.args.dev_id + " AS BIGINT)," +
                            "CAST ('" + this.args.dev_number + "' AS VARCHAR(80)), " +
                            "CAST ('" + (0, DateStr_1.dateTimeToSQL)(new Date(this.args.start_povs)) + "' AS TIMESTAMP), " +
                            "CAST ('" + (0, DateStr_1.dateTimeToSQL)(new Date(this.args.end_povs)) + "' AS TIMESTAMP), " +
                            "CAST ('" + this.args.old_dev_povs + "' AS BIGINT)) AS id")];
                    case 1:
                        db_res = _a.sent();
                        result = new Array();
                        for (p in db_res.rows) {
                            result.push(db_res.rows[p]);
                        }
                        return [2, result];
                }
            });
        });
    };
    Dev_povsTable.prototype.selectDev_povs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dev_povs, db_res, tzoffset, result, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dev_povs = {
                            id: 0,
                            dev_id: 0,
                            dev_number: '',
                            start_povs: '',
                            end_povs: '',
                            old_dev_povs: 0
                        };
                        return [4, this.db.query("SELECT * FROM SelectDev_Povs('" +
                                this.args.id + "', '" + this.args.dev_number + "')")];
                    case 1:
                        db_res = _a.sent();
                        tzoffset = (new Date()).getTimezoneOffset() * 60000;
                        result = new Array();
                        for (i in db_res.rows) {
                            dev_povs = {
                                id: db_res.rows[i].id,
                                dev_id: db_res.rows[i].dev_id,
                                dev_number: db_res.rows[i].dev_number,
                                start_povs: (new Date(db_res.rows[i].start_povs - tzoffset)).toISOString().slice(0, -8),
                                end_povs: (new Date(db_res.rows[i].end_povs - tzoffset)).toISOString().slice(0, -8),
                                old_dev_povs: db_res.rows[i].old_dev_povs,
                            };
                            result.push(dev_povs);
                        }
                        return [2, result];
                }
            });
        });
    };
    return Dev_povsTable;
}());
exports.Dev_povsTable = Dev_povsTable;
//# sourceMappingURL=Dev_Povs.js.map