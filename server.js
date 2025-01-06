const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017"
const dbName = "equipe"
let db
MongoClient.connect(url).then((client) => {
    try{
        console.log("Connexion avec success !");
        db = client.db(dbName)
    }catch{
        console.log("error :(");
    }
})

const express = require('express')
const app = express()

app.get('/eq', async (req,res)=>{
    const equi = await db.collection('player').find({}).toArray()
    res.send(equi)
})

app.listen(3000,()=>{
    console.log(`3000`)
})

