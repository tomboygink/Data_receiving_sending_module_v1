import { DBase, getDB } from "./DBase";
import { dateTimeToSQL } from '../../xcore/dbase/DateStr'

	export class Devs_groupsEntity {
	    id: number = 0;
	    parent_id: number = 0;
	    g_name: string = '';
	    latitude: string = '';
	    longitude: string = '';
	    org_id: number = 0;
	    org_num: number = 0;
	    deleted: boolean = false;
	    g_info: string = '';
	    constructor() { }
	}
	

	export class Devs_groupsTable {
	    db: DBase;
	    args: any;
	    sess_code: string;
	    constructor(_args: any, _sess_code: string) {
	        this.db = getDB();
	        this.args = _args;
	        this.sess_code = _sess_code;
	    }
	

	    //Добавление группы устройства 
	    async insertDevsGroups(): Promise<Devs_groupsEntity[]> {
	        var db_res = await this.db.query("SELECT AddDevs_Group(CAST ('" + this.args.parent_id + "' AS BIGINT), " +
	            "CAST('" + this.args.g_name + "' AS VARCHAR(250))," +
	            "CAST('" + this.args.latitude + "' AS VARCHAR(60)), " +
	            "CAST('" + this.args.longitude + "' AS VARCHAR(60)), " +
	            "CAST('" + this.args.org_id + "' AS BIGINT), " +
	            "CAST('" + this.args.ord_num + "' AS INTEGER), " +
	            "CAST('" + this.args.deleted + "' AS BOOLEAN), " +
	            "CAST('" + this.args.g_info + "' AS TEXT)) AS id");


				await this.db.query("SELECT AddScheme_Svg(" +
				"CAST (" + db_res.rows[0].id + " AS BIGINT), " +
				"CAST ('' AS TEXT), " +
				"CAST ('" + dateTimeToSQL(new Date(Date.now())) + "' AS TIMESTAMP)) AS id")

	        var result: Devs_groupsEntity[] = new Array();
	        for (var p in db_res.rows) { result.push(db_res.rows[p]); }
	        return result;
	    }
	

	    //Получение группы устройства 
	    async selectDevsGroups() {
	        var dev: any = {
	            id: 0,
	            group_dev_id: '',
	            number: '',
	            name: '',
	            latitude: '',
	            longitude: '',
	            sensors: '',
	            deleted: false,
	            info: '',
	            time: '',
				period_sess: 0,
	        };

	        var groups: any = {
	            group: {},
	            id: 0,
	            p_id: 0,
	            childs: new Array(),
	            devs: new Array(),
	            update: false,
				//тестово
				scheme_svg: ""
	        }
	        var devs = new Array();
	        var t;
	        if (this.args.users_w === true) {
	            //console.log("im admin")
	            //var roots_gr = await this.db.query("SELECT * FROM devs_groups WHERE parent_id=0 ");
				var roots_gr = await this.db.query("SELECT devs_groups.*, scheme_svg.svg FROM devs_groups INNER JOIN scheme_svg ON devs_groups.id = scheme_svg.id_devs_groups WHERE parent_id=0 ");

	            for (var i in roots_gr.rows) {
					//console.log(roots_gr.rows[i]);


	                var device = await (await this.db.query("SELECT * FROM devs WHERE group_dev_id = " + roots_gr.rows[i].id + " order by number asc")).rows;
	                devs = new Array();
	                for (var j in device) {
	                    var time_srv = await (await this.db.query("SELECT time_srv as time from dev_sess WHERE dev_number = '" + device[j].number + "' order by id desc limit 1;")).rows;
	                    var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах
	                    if (time_srv[0] === undefined) { t = null }
	                    else { t = (new Date(time_srv[0].time - tzoffset)).toISOString().slice(0, -8) }
	                    dev = {
	                        id: device[j].id,
	                        group_dev_id: device[j].group_dev_id,
	                        number: device[j].number,
	                        name: device[j].name,
	                        latitude: device[j].latitude,
	                        longitude: device[j].longitude,
	                        sensors: device[j].sensors,
	                        deleted: device[j].deleted,
	                        info: device[j].info,
	                        time: t,
							period_sess: device[j].period_sess
	                    }
	                    devs.push(dev);
	                }
	                groups.childs.push({
	                    group: roots_gr.rows[i],
	                    id: roots_gr.rows[i].id,
	                    p_id: roots_gr.rows[i].parent_id,
	                    childs: new Array(),
	                    devs: devs,
	                    update: false,
						scheme_svg: roots_gr.rows[i].scheme_svg
	                })
	            }
	            
	        }
	        else {
	            //console.log("im user")
	            //var roots_gr = await this.db.query("SELECT * FROM devs_groups WHERE parent_id=0 and org_id=" + this.args.org_id);
				var roots_gr = await this.db.query("SELECT devs_groups.*, scheme_svg.svg FROM devs_groups INNER JOIN scheme_svg on devs_groups.id = scheme_svg.id_devs_groups WHERE parent_id=0 AND org_id= " + this.args.org_id);
	            for (var i in roots_gr.rows) {
	                var device = await (await this.db.query("SELECT * FROM devs WHERE group_dev_id = " + roots_gr.rows[i].id  + " order by number asc")).rows;
	                devs = new Array();
	                for (var j in device) {
	                    var time_srv = await (await this.db.query("SELECT time_srv as time from dev_sess WHERE dev_number = '" + device[j].number + "' order by id desc limit 1;")).rows;
	                    var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах
	                    if (time_srv[0] === undefined) { t = null }
	                    else { t = (new Date(time_srv[0].time - tzoffset)).toISOString().slice(0, -8) }
	                    dev = {
	                        id: device[j].id,
	                        group_dev_id: device[j].group_dev_id,
	                        number: device[j].number,
	                        name: device[j].name,
	                        latitude: device[j].latitude,
	                        longitude: device[j].longitude,
	                        sensors: device[j].sensors,
	                        deleted: device[j].deleted,
	                        info: device[j].info,
	                        time: t,
							period_sess: device[j].period_sess
	                    }
	                    devs.push(dev);
	                }
	                groups.childs.push({
	                    group: roots_gr.rows[i],
	                    id: roots_gr.rows[i].id,
	                    p_id: roots_gr.rows[i].parent_id,
	                    childs: new Array(),
	                    devs: devs,
	                    update: false,
						scheme_svg: roots_gr.rows[i].scheme_svg

	                })
	            
	            }
	        }
	

	        for (var i in groups.childs) {
	            groups.childs[i].childs = await this._d_tree(groups.childs[i]);
	        }
	        var result = this.objToString(groups);
	        //console.log(result);
	        return result
	

	    }
	
	    //Преобразоватие в дерево 
	    async _d_tree(childs: any) {
	        var reti = new Array();
	        var dev: any = {
	            id: 0,
	            group_dev_id: '',
	            number: '',
	            name: '',
	            latitude: '',
	            longitude: '',
	            sensors: '',
	            deleted: false,
	            info: '',
	            time: '',
				period_sess: 0
	        };
	        
	        var t;
	        var devs = new Array();
	

			
	        
			var grs = await this.db.query("SELECT devs_groups.*, scheme_svg.svg FROM devs_groups INNER JOIN scheme_svg on devs_groups.id = scheme_svg.id_devs_groups WHERE parent_id=" + childs.id);
			
	        for (var i in grs.rows) {
	           // console.log(grs.rows[i].id + " " + grs.rows[i].g_name)
	            var device = await (await this.db.query("SELECT * FROM devs WHERE group_dev_id = " + grs.rows[i].id  + " order by number asc")).rows;
				
	            
	            var devs = new Array();
	

	            for (var j in device) {
	                var time_srv = await (await this.db.query("SELECT time_srv as time from dev_sess WHERE dev_number = '" + device[j].number + "' order by id desc limit 1;")).rows;
	                var tzoffset = (new Date()).getTimezoneOffset() * 60000; // смещение в миллисекундах
	                if (time_srv[0] === undefined) { t = null }
	                else { t = (new Date(time_srv[0].time - tzoffset)).toISOString().slice(0, -8) }
	                
	                dev = {
	                    id: device[j].id,
	                    group_dev_id: device[j].group_dev_id,
	                    number: device[j].number,
	                    name: device[j].name,
	                    latitude: device[j].latitude,
	                    longitude: device[j].longitude,
	                    sensors: device[j].sensors,
	                    deleted: device[j].deleted,
	                    info: device[j].info,
	                    time: t,
						period_sess:device[j].period_sess
	                }
	                devs.push(dev);
	            }
	

	            reti.push({
	                group: grs.rows[i],
	                id: grs.rows[i].id,
	                pid: grs.rows[i].parent_id,
	                childs: await this._d_tree(grs.rows[i]),
	                devs: devs,
	                updated: false,
					scheme_svg: grs.rows[i].scheme_svg
	            });
	        }
	        return reti;
	    }
	
	    objToString(obj: any, isArray?: boolean) {
	        var isArray = isArray || false; // что нужно вернуть - массив или объект
	

	        var sstr = "";
	        if (isArray) { sstr += "["; } else { sstr += "{"; }
	

	        var first = true;
	        for (var k in obj) {
	

	            if (typeof obj[k] == 'function') continue; // не включает методы - только JSON для переноса данных
	

	            if (first) {
	                first = false;
	            } else {
	                sstr += ',';
	            }
	

	

	            if (!isArray) { sstr += `"${k}":`; } // ключи для объекта
	

	            // значения
	            if (obj[k] === null) {
	                sstr += 'null'
	            } else if (Array.isArray(obj[k])) {
	                sstr += this.objToString(obj[k], true)
	            } else if ('object' == typeof obj[k]) {
	                sstr += this.objToString(obj[k], false)
	            } else if ('undefined' == typeof obj[k]) {
	                sstr += 'null'; //'undefined'
	            } else if ('string' == typeof obj[k]) {
	                sstr += `"${this.escStr(obj[k])}"`;
	            } else {
	                sstr += obj[k]
	            }
	

	        }
	        if (isArray) { sstr += "]"; } else { sstr += "}"; }
	        return sstr;
	    }
	    escStr(str: string): string {
	        var reti = str.replace(/[\\]/g, "\\\\");
	        reti = reti.replace(/["]/g, '\\"');
	        return reti;
	    }
	

	    //Редактирование группы 
	    async updateDevsGroups() {
	        //КОСТЫЛЬ НО ПРИЯТНО КОГДА РАБОТАЕТ
	

	        //Редактирование основной группы пользователем 
	        await this.db.query("SELECT * FROM UpdateDevs_Group(" +
	            "CAST (" + this.args.id + " AS BIGINT), " +
	            "CAST (" + this.args.parent_id + " AS BIGINT), " +
	            "CAST ('" + this.args.name + "' AS VARCHAR(250)), " +
	            "CAST ('" + this.args.latitude + "' AS VARCHAR(60)), " +
	            "CAST ('" + this.args.longitude + "' AS VARCHAR(60)), " +
	            "CAST (" + this.args.org_id + " AS BIGINT), " +
	            "CAST (" + this.args.ord_id + " AS INTEGER), " +
	            "CAST ('" + this.args.deleted + "' AS BOOLEAN), " +
	            "CAST ('" + this.args.info + "' AS TEXT))");
	

	

	        //Рекурсивный запрос на получение подгрупп 
	        var data = await this.db.query("with recursive temp1 (id, parent_id, g_name, latitude, longitude, org_id, ord_num, deleted, g_info, path) " +
	            "as (select t1.id, t1.parent_id, t1.g_name, t1.latitude, t1.longitude, t1.org_id, t1.ord_num, t1.deleted, t1.g_info, cast (t1.g_name as varchar (50)) as path " +
	            "from devs_groups t1 where id = " + this.args.id + " union " +
	            "select t2.id, t2.parent_id, t2.g_name, t2.latitude, t2.longitude, t2.org_id, t2.ord_num, t2.deleted, t2.g_info, cast (temp1.path || '->'|| t2.g_name as varchar(50)) " +
	            "from devs_groups t2 inner join temp1 on (temp1.id = t2.parent_id)) " +
	            "select * from temp1");
	

	        //обновление данных подгрупп и устройств
	        for (var i = 0; i < data.rows.length; i++) {
	            await this.db.query("update devs_groups set org_id = " + this.args.org_id + ", deleted = " + this.args.deleted + " where id = " + data.rows[i].id);
	

	            //Получение устройств
	            var data_dev = await this.db.query("SELECT * FROM Devs WHERE group_dev_id=" + data.rows[i].id  + " order by number asc");
	            //console.log(data_devgroup);
	            //редактирование устройств
	            for (var j = 0; j < data_dev.rows.length; j++) {
	                await this.db.query("UPDATE Devs SET " +
	                    "deleted = " + this.args.deleted + " WHERE id=" + data_dev.rows[j].id);
	            }
	        }
	    }
	}

