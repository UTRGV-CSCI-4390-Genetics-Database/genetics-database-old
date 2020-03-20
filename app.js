const express = require('express');
var fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))

const Client = require('pg').Client;
const client1 = new Client({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    database: 'jerzy'
});

const client = new Client({
    user: 'genetics_user',
    password: '***REMOVED***',
    host: '***REMOVED***',
    database: 'genetics'
});

const saveToPublicFolder = function(person, callback){
    fs.writeFile('./public/data.json', JSON.stringify(person), callback);
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
var dataBaseRequest = [];

const oneRequst = function(obj){
    var temp  = "";
    for (let [key, value] of Object.entries(obj)){
        var tempObj = {};
        for(let[key1, value1] of Object.entries(obj[key])){
            var tempArr = Array(4);
            if(value1[0] =='text' || value1[0] =='char(1)'){
                if(value1[1] != ''){
                tempArr[0] = value1[1];
                temp = `SELECT COUNT(*) FROM ${key} WHERE ${key1} ` + "= '"+value1[1]+"'"
                dataBaseRequest.push(temp);
                tempArr[1]=temp;
                tempArr[3]=dataBaseRequest.length;
                tempObj[key1] = tempArr;
                }
            }
            else if(value1[0] =='boolean'){
                if(value1[1] == true){
                tempArr[0] = value1[1];
                temp = `SELECT COUNT(*) FROM ${key} WHERE ${key1}` + "= true";
                dataBaseRequest.push(temp);
                tempArr[1]=temp;
                tempArr[3]= dataBaseRequest.length;
                tempObj[key1] =tempArr;
                }
            }
            else if(value1[0] =='integer' || value1[0] =='smallint' || value1[0] =='real' || value1[0] =='bigint'){
                if(value1[1] < value1[2]){
                tempArr[0] = value1[1];
                temp = `SELECT COUNT(*) FROM ${key} WHERE ${key1} BETWEEN ${value1[1]} AND ${value1[2]}`;
                dataBaseRequest.push(temp);
                tempArr[1]=temp;
                tempArr[2]=value1[2];
                tempArr[3]=dataBaseRequest.length;
                tempObj[key1] = tempArr;
                }
            }
            else if(value1[0] == 'date'){
                if(value1[1] < value1[2]){
                tempArr[0] = value1[1];
                temp = `SELECT COUNT(*) FROM ${key} WHERE ${key1}` + " BETWEEN '"+value1[1]+"' AND '"+value1[2]+"'";
                dataBaseRequest.push(temp);
                tempArr[1]=temp;
                tempArr[2]=value1[2];
                tempArr[3]=dataBaseRequest.length;
                tempObj[key1] = tempArr;
                }
            }
        }
        tempObj['Total']= Array(4);
        newObj[key]=tempObj;
    }
}

const putResultsToNewObje = function(arr, obj){
    for (let [key, value] of Object.entries(obj)){
        for(let[key1, value1] of Object.entries(obj[key])){
            if(value1[3] != null){
                var i = value1[3];
                value1[3] = arr[i-1];
            }

        }
    }
} 

const totalFromTabel = function(arr, obj){
    arr = [];
    str = {}
    for (let [key, value] of Object.entries(obj)){
        str = key;
        for(let[key1, value1] of Object.entries(obj[key])){
            if(value1[1] != null){
                str += value1[1];
            }
        }
    arr.push(str);
    }
}

app.get('/', function(req, res){
    res.sendFile(`${__dirname }/public/index.html`);
})

app.post('/', async function(req, res){
    dataBaseRequest = [];
    var obj = req.body;
    oneRequst(obj); 
    for(i = 0; i < dataBaseRequest.length; i++){
        dataBaseRequest[i] = await read(dataBaseRequest[i]);
       
    }
    console.log('wszystko gotowe')
    putResultsToNewObje(dataBaseRequest, newObj);
    totalFromTabel(dataBaseRequest, newObj);
    console.log(newObj);
     console.log(dataBaseRequest);
   });
app.get('/results', function(req, res){
    res.sendFile(`${__dirname}/public/results.html`);
  });

app.listen(PORT, function(){console.log(`severe started on port ${PORT}`)});

app.get('/new', async function(req, res){
    for(i = 0; i < dataBaseRequest.length; i++){
        console.log(await read(dataBaseRequest[i]));
    }
    res.send('spokojnie tylko spokojnie')
 })
connect()
