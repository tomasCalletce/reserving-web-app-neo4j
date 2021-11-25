const express = require('express')
const router = express.Router()
const dbFuncs = require('../db/db')


const Usuario = require('../db/mongo/models/Usuario')
const neoLogin = require('../db/neo/NeoLogin')

router.get('/login', (req, res) => {
    res.render('Ingreso', {
        title: "SZS"
    })

})

 router.post('/auth',async (req, res) => {
    const user = req.body
    try{

        const neoResponce = await neoLogin.logIn(user.username,user.password)
        if(neoResponce.records.length == 0){
            res.send(null)
        }else{
            res.send(false)
        }
        
        
    }catch(e){
        console.log(e)
        res.status(404)
    }
    

})







module.exports = router