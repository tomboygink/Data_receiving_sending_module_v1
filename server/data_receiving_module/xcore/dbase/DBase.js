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
exports.DBase = exports.endDB = exports.getDB = void 0;
var pg_1 = require("pg");
var config_1 = require("../config");
var DB_HOST = 'localhost';
var DB_PORT = 5432;
var DB_USER = 'postgres';
var DB_PASSWORD = '000000';
var DB_NAME = 'program_dt';
function getDB() {
    if (DBase._DB === null) {
        DBase._DB = new DBase();
    }
    return DBase._DB;
}
exports.getDB = getDB;
function endDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (DBase._DB === null || DBase._DB.pool === null)
                        return [2, false];
                    return [4, DBase._DB.pool.end()];
                case 1:
                    _a.sent();
                    return [2, true];
            }
        });
    });
}
exports.endDB = endDB;
var DBase = (function () {
    function DBase() {
        this.pool = null;
        this.pool = new pg_1.Pool(config_1.CONFIG.server.db);
    }
    DBase.prototype.NOW = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, qres, fres;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        return [4, client.query('SELECT NOW()')];
                    case 2:
                        qres = _a.sent();
                        client.release();
                        fres = new Date(Date.parse(qres.rows[0].now));
                        return [2, fres];
                }
            });
        });
    };
    DBase.prototype.query = function (SQL, args) {
        return __awaiter(this, void 0, void 0, function () {
            var client, reti;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        return [4, client.query(SQL, args)];
                    case 2:
                        reti = _a.sent();
                        client.release();
                        return [2, reti];
                }
            });
        });
    };
    DBase._DB = null;
    return DBase;
}());
exports.DBase = DBase;
//# sourceMappingURL=DBase.js.map