const express = require('express');
const app=express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospital_management';

let db

let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('expire');
const { connect } = require('mongodb');

MongoClient.connect(url, (err,client)=>{
        if(err) return console.log(err);
        db=client.db(dbName);
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
});

//get hospitaldetails
app.get('/hospitaldetails', middleware.checkToken,(req,res)=>{
    console.log("Fetching data from Hospital Collection");
    var data=db.collection('hospital').find().toArray()
    .then(result=>res.json(result));

});

//get ventilatordetails
app.get('/ventilatordetails', middleware.checkToken,(req,res)=>{
    console.log("Ventilators Information");
    var data=db.collection('ventilators').find().toArray()
    .then(result=>res.json(result));

});

//search ventilators bt its status
app.post('/searchventbystatus',middleware.checkToken,(re,res)=>{
    var status=req.body.status;
    console.log(status);
    var data=db.collection('ventilators')
    .find({'status':status }).toArray().then(result=>res.json(result));

});

//search ventilators by its name
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('ventilators')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.josn(result));

});

//search hospital by its name
app.post('/searchhospbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('hospital')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.josn(result));
});

//update ventilator details
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('ventilators').updateOne(ventid,newvalues,function(err,result){
        if(err) throw err;
        res.json('one document updated');
    });
});

//adding ventilator details
app.put('/addventilator',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var insert={hId:hId,ventilatorId:ventilatorId,status:status,name:name};
    console.log(insert);
    db.collection('ventilators').insertOne(insert,function(err,response){
        if(err) throw err;
        res.send("inserted succesfully");
        console.log("one document inserted");
    });
});

//delete ventilators details by ventilatorId
app.post('/deleteventbyId',middleware.checkToken,(req,res)=>{
    var delet={ventilatorId: req.body.ventilatorId};
    console.log(delet);
    db.collection('ventilators').deleteOne(delet,function(err,response){
        if(err) throw err;
        res.send("deleted succesfully");
        console.log("one document deleted");
    });
});

app.listen(3002);