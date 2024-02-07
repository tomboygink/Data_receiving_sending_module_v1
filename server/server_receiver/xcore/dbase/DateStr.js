"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time_to_datetime = exports.sqlToDateTime = exports.strToDateTime = exports.strToDate = exports.dateTimeToSQL = exports.dateTimeToStr = exports.dateToStr = void 0;
function dateToStr(dt) {
    var reti = '';
    if (dt.getDate() < 10) {
        reti += "0";
    }
    ;
    reti += dt.getDate();
    reti += '.';
    if ((dt.getMonth() + 1) < 10) {
        reti += "0";
    }
    ;
    reti += (dt.getMonth() + 1);
    reti += '.';
    return reti + dt.getFullYear();
}
exports.dateToStr = dateToStr;
function dateTimeToStr(dt) {
    var dt_str = dateToStr(dt) + ' ';
    if (dt.getHours() < 10) {
        dt_str += "0";
    }
    dt_str += dt.getHours();
    dt_str += ':';
    if (dt.getMinutes() < 10) {
        dt_str += "0";
    }
    dt_str += dt.getMinutes();
    dt_str += ':';
    if (dt.getSeconds() < 10) {
        dt_str += "0";
    }
    dt_str += dt.getSeconds();
    return dt_str;
}
exports.dateTimeToStr = dateTimeToStr;
function dateTimeToSQL(dt) {
    var reti = dt.getFullYear() + '-';
    if ((dt.getMonth() + 1) < 10) {
        reti += "0";
    }
    ;
    reti += (dt.getMonth() + 1);
    reti += '-';
    if (dt.getDate() < 10) {
        reti += "0";
    }
    ;
    reti += dt.getDate();
    reti += ' ';
    if (dt.getHours() < 10) {
        reti += "0";
    }
    reti += dt.getHours();
    reti += ':';
    if (dt.getMinutes() < 10) {
        reti += "0";
    }
    reti += dt.getMinutes();
    reti += ':';
    if (dt.getSeconds() < 10) {
        reti += "0";
    }
    reti += dt.getSeconds();
    return reti;
}
exports.dateTimeToSQL = dateTimeToSQL;
function strToDate(str_dt) {
    var dtx = str_dt.trim().split(".");
    if (dtx.length > 2) {
        var ret_dt = dtx[2].trim() + "-" + dtx[1].trim() + "-" + dtx[0].trim();
        var dres = Date.parse(ret_dt);
        if (Number.isNaN(ret_dt) === true)
            return null;
        return new Date(dres);
    }
    return null;
}
exports.strToDate = strToDate;
function strToDateTime(str_dt) {
    var ret_dt = null;
    var dt_str = '';
    var d_t_arr = str_dt.split(" ");
    if (d_t_arr.length > 0) {
        var dtx = d_t_arr[0].trim().split(".");
        if (dtx.length > 2) {
            dt_str += dtx[2].trim() + "-" + dtx[1].trim() + "-" + dtx[0].trim();
        }
    }
    if (d_t_arr.length > 1 && d_t_arr[1].trim() !== '') {
        dt_str += "T" + d_t_arr[1].trim();
    }
    else {
        dt_str += "T00:00:00";
    }
    ret_dt = Date.parse(dt_str);
    if (Number.isNaN(ret_dt) === true)
        return null;
    return ret_dt;
}
exports.strToDateTime = strToDateTime;
function sqlToDateTime(str_dt) {
    var ret_dt = null;
    var dt_str = '';
    var d_t_arr = str_dt.split(" ");
    if (d_t_arr.length > 0) {
        var dtx = d_t_arr[0].trim().split("-");
        if (dtx.length > 2) {
            dt_str += dtx[0].trim() + "-" + dtx[1].trim() + "-" + dtx[2].trim();
        }
    }
    if (d_t_arr.length > 1 && d_t_arr[1].trim() !== '') {
        dt_str += "T" + d_t_arr[1].trim();
    }
    else {
        dt_str += "T00:00:00";
    }
    ret_dt = Date.parse(dt_str);
    if (Number.isNaN(ret_dt) === true)
        return null;
    return ret_dt;
}
exports.sqlToDateTime = sqlToDateTime;
function time_to_datetime(times) {
    var tarr = times.split("/");
    if (tarr.length < 2) {
        return;
    }
    var tmarr = tarr[0].split(":");
    if (tmarr.length < 3) {
        return;
    }
    var dtarr = tarr[1].split(":");
    if (dtarr.length < 3) {
        return;
    }
    var YYYY = "20" + dtarr[2];
    if (isNaN(parseInt(YYYY))) {
        return null;
    }
    var MM = dtarr[1];
    if (isNaN(parseInt(MM))) {
        return null;
    }
    var DD = dtarr[0];
    if (isNaN(parseInt(DD))) {
        return null;
    }
    var hh = tmarr[0];
    if (isNaN(parseInt(hh))) {
        return null;
    }
    var mm = tmarr[1];
    if (isNaN(parseInt(mm))) {
        return null;
    }
    var ss = tmarr[2];
    if (isNaN(parseInt(ss))) {
        return null;
    }
    return YYYY + "-" + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
}
exports.time_to_datetime = time_to_datetime;
//# sourceMappingURL=DateStr.js.map