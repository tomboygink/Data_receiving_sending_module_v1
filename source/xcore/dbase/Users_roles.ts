import { DBase, getDB } from "./DBase";


export class Users_rolesEntity{
    id:number = 0;
    name:string = '';
    created_at:Date =  new Date(Date.now());
    info:string = '';

    constructor(){}
}