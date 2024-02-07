import { Pool, Client, QueryResult } from 'pg';
import { CONFIG } from '../config';
import { dateTimeToSQL, dateTimeToStr } from './DateStr';

const DB_HOST = 'localhost';
const DB_PORT = 5432;
const DB_USER = 'postgres';
const DB_PASSWORD = '000000';
const DB_NAME = 'program_dt';


export function getDB():DBase{
    if(DBase._DB === null){ DBase._DB = new DBase(); }
    return DBase._DB;
}

export async function endDB():Promise<boolean>{
    if(DBase._DB === null || DBase._DB.pool === null) return false;
    await DBase._DB.pool.end();
    return true;
}

export class DBase{

    static _DB:DBase = null;

    pool:Pool = null;

    constructor(){
        this.pool = new Pool(CONFIG.server.db)
    }

    async NOW(){
        var client = await this.pool.connect() // получаем клиента из пула
        var qres:QueryResult = await client.query('SELECT NOW()') // делаем запрос
        client.release() // возвращаем клиента обратно в пул
        var fres = new Date(Date.parse(qres.rows[0].now));
        //console.log(`${qres.rows[0].now} -> ${fres} -> ${fres.getHours()}:${fres.getMinutes()}:${fres.getSeconds()}`);
        //console.log(dateTimeToStr(fres), dateTimeToSQL(fres));
        return fres;
    }

    async query(SQL:string, args?:any){
        var client = await this.pool.connect();
        var reti:QueryResult = await client.query(SQL, args);
        client.release();
        return reti;
    }


}

