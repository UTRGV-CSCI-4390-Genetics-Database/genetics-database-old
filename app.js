const express = require('express');
var fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000
const path = require('path');
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))  
app.set('view engine', 'ejs');
const Client = require('pg').Client;

const client = new Client({
    user: 'genetics_user',
    password: '***REMOVED***',
    host: '***REMOVED***',
    database: 'genetics'
});

async function disconnect()
{  console.log('szlag mnie trafi')
    client.end(function(err) {
    console.log('client has disconnected. gdzie')
    if (err) {
      console.log('error during disconnection', err.stack)
    }
  })
} 
async function read(text){
    try {
    const results = await client.query(text);
    return results.rows[0].count;
    }
    catch(e){
        return [];
    }
}

async function readRow(text){
    try {
    const results = await client.query(text);
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function connect() {
    try {
        await client.connect();
        console.log('Connected to Data Base');
    }
    catch(e) {
        console.error(`Failed to connect ${e}`);
    }
}

var newObj = {};
var request_to_db = [];

const oneRequst = function(obj){
    var temp1 = "";
    var temp2  = "";
    for (let [key, value] of Object.entries(obj)){
        temp1 = `SELECT COUNT(*) FROM ${key} WHERE `
        var tempObj = {};
        tempObj['Total']=  -2;
        for(let[key1, value1] of Object.entries(obj[key])){
            var tempArr = [0, 0, 0, 0];
            if(value1[0] =='text' || value1[0] =='char(1)'){
                if(value1[1] != ''){
                tempArr[0] = value1[1];
                temp2 = `${key1}` + " = '"+value1[1]+"'"
                temp = temp1+temp2;
                request_to_db.push(temp);
                tempArr[1]=temp2;
                tempArr[3]=request_to_db.length;
                tempObj[key1] = tempArr;
                tempObj['Total']=  -1;
                }
            }
            else if(value1[0] =='boolean'){
                if(value1[1] == true){
                tempArr[0] = value1[1];
                temp2 = `${key1}` + " = true";
                temp = temp1+temp2;
                request_to_db.push(temp);
                tempArr[1]=temp2;
                tempArr[3]= request_to_db.length;
                tempObj[key1] =tempArr;
                tempObj['Total']=  -1;
                }
            }
            else if(value1[0] =='integer' || value1[0] =='smallint' || value1[0] =='real' || value1[0] =='bigint'){
                if(value1[1] < value1[2]){
                tempArr[0] = value1[1];
                temp2 = `${key1} BETWEEN ${value1[1]} AND ${value1[2]}`;
                temp = temp1+temp2;
                request_to_db.push(temp);
                tempArr[1]=temp2;
                tempArr[2]=value1[2];
                tempArr[3]=request_to_db.length;
                tempObj[key1] = tempArr;
                tempObj['Total']=  -1;
                }
            }
            else if(value1[0] == 'date'){
                if(value1[1] < value1[2]){
                tempArr[0] = value1[1];
                temp2 = `${key1} BETWEEN '${value1[1]}' AND '${value1[2]}'`;
                temp = temp1+temp2;
                request_to_db.push(temp);
                tempArr[1]=temp2;
                tempArr[2]=value1[2];
                tempArr[3]=request_to_db.length;
                tempObj[key1] = tempArr;
                tempObj['Total']=  -1;
                }
            }
        }
        newObj[key]=tempObj;
    }
    return request_to_db
}

const putResultsToNewObje = function(arr, obj){
    for (let [key, value] of Object.entries(obj)){
        for(let[key1, value1] of Object.entries(obj[key])){
            if(value1[3] != 0){
                var i = value1[3];
                value1[3] = arr[i-1];
            }

        }
    }
    
} 

const totalFromTabel = function(obj){
    var arr = [];
    for (let [key, value] of Object.entries(obj)){
        var str = "";
        if(value['Total'] == -2){
            arr.push("")
        }
        else{
            str = `SELECT COUNT(*) FROM ${key} WHERE `;
            if(key == 'psychiatric_disorders' || key == 'medical_history'){
                for(let[key1, value1] of Object.entries(obj[key])){
                        if(value1[1]){
                            str += key + "." + value1[1] + " OR ";
                        }   
                    }
                    arr.push(str.substring(0, str.length - 3));   
                }                      
            else{
                for(let[key1, value1] of Object.entries(obj[key])){
                    if(value1[1]){
                        str += key + "." + value1[1] + " AND ";
                    }
                }
                arr.push(str.substring(0, str.length - 4));
            }
        }
    }
    return arr;
}    
 

const totalFromTabelRusults = function(arr, obj){
    obj.individuals.Total = arr[0];
    obj.projects.Total = arr[1];
    obj.project_enrollments.Total = arr[2];
    obj.demographics.Total = arr[3];
    obj.biological_measurements.Total = arr[4];
    obj.psychiatric_disorders.Total = arr[5];
    obj.medical_history.Total = arr[6];
    obj.markers.Total = arr[7];
}

app.get('/', function(req, res){
    res.sendFile(`${__dirname }/public/index.html`);
})

app.post('/results', async function(req, res){
    var obj = req.body.obj;
    var req_to_db = oneRequst(JSON.parse(obj)); 
    //console.log(req_to_db);
    for(i = 0; i < req_to_db.length; i++){
        req_to_db[i] = await read(req_to_db[i]);
    }
    //console.log(newObj);
    putResultsToNewObje(req_to_db, newObj);
    var r_to_db = totalFromTabel(newObj)
       for(i = 0; i < r_to_db.length; i++){
        if(r_to_db[i] != ""){
            req_to_db[i] = await read(r_to_db[i]);
        }
        else{
            req_to_db[i] = -7;
        }
    }
    totalFromTabelRusults(req_to_db, newObj);
    //console.log(r_to_db);
    res.render('pages/index', {
        searchArry: r_to_db,
        to_ejs: newObj,
    });

});
app.get('/new', function(req, res){
    res.sendFile(`${__dirname}/public/new.html`);
  });
const columName = function(str){
    str = str.substring(7, str.length);
    arr = str.split("FROM");
    str = arr[0];
    arr = str.split(", ");
    for(i = 0; i < arr.length; i++){
        str = arr[i];
        temp = str.split(".");
        arr[i]=temp[1];
    }
    return arr;
}
col = ["sex", "name"]
app.post('/table', async function(req, res){
    var query = req.body.obj;
    //query1 = "SELECT sex, name FROM individuals WHERE sex = 'M' AND is_genotyped = false"
    console.log(query)
    var table = await readRow(query);
    console.log(table.length);
    console.log(table[1])
    //res.send('gotowe');
     res.render('pages/table.ejs', {rows: table, columns: columName(query)});  
});
connect()

app.listen(PORT, function(){
    console.log(`severe started on port ${PORT}`)
})