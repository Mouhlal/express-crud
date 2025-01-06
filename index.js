const express = require("express")

const app = express();
const port = 3000;


let equipes = require("./equipes.json")

app.get("/equipes", (req, res) => {
    res.json(`Liste des equipes : ${equipes}`)
})

app.get('/equipes/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    const equipe = equipes.find((u)=>u.id === id)
    res.json(equipe)
})

app.get('/hello',(req,res)=>{
    res.send('Hello World ')
})

app.listen(3000 , ()=>{
    console.log(`LE port est http://localhost:${port}`)
})


app.get('/',(req,res)=>{
    res.send(equipes);
})


app.use(express.json())


app.post('/equipes',(req,res)=>{
        equipes.push(req.body)
        res.send(equipes)
   
})

app.delete('/equipes/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    equipes = equipes.filter(eq=> eq.id !== id)
    res.send(equipes)
})

app.put('/equipes/:id',async (req,res)=>{
    const id = parseInt(req.params.id)
    const ep = equipes.find(eq=>eq.id === id)
    ep.id = req.body.id
    ep.nom = req.body.nom
   res.send(equipes)
})

