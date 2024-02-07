import { Pool, QueryResult } from 'pg';
export declare function getDB(): DBase;
export declare function endDB(): Promise<boolean>;
export declare class DBase {
    static _DB: DBase;
    pool: Pool;
    constructor();
    NOW(): Promise<Date>;
    query(SQL: string, args?: any): Promise<QueryResult<any>>;
}
