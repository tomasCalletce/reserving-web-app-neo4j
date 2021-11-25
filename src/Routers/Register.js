const express = require('express');
const router = express.Router();


const Usuario = require('../db/mongo/models/Usuario')
const neoRegister = require('../db/neo/neoRegister')


router.get('/registro', (req, res) => {
    res.render('Registro')
})

router.post('/registrate', async (req, res) => {
    const user = req.body
  
    try{

        const neoUser = await neoRegister.Register(user.codigo,user.nombre,user.email,user.password)
        console.log(neoUser)
        res.send("done")
        
    }catch{
        console.log('Failed to create user')
    }

})







module.exports = router