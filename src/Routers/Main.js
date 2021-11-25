
//main -----> reserva computadores
const express = require('express');
const router = express.Router();


const Aula = require('../db/mongo/models/Aula')
const neoMain = require('../db/neo/neoMain')


router.post('/getDisponibles', async (req, res) => {

    const body = req.body;
    const disponibles = await neoMain.getComputadoresDisponibles(body.aula,body.hora.substring(1,2));

    try{
        res.send(disponibles);
    }catch(e){
        console.log(e);
        console.log("error in get times")
    }
        
})



router.get('/Main', async (req, res) => {
    let horario = [];
    for (let index = 10; index < 20; index++) {
        horario.push(index + '-' + (index + 1))
    }

    try{

        const neoAulas = await neoMain.getAulas()
        const codigos = []
        neoAulas.records.forEach(record => {
            codigos.push(record._fields[0].low)
        });

        res.render('reservarComputadora', {
            usuario: "tomascaell",
            aulas : codigos,
            horario
        })

    }catch(e){
        console.log("Failed to get aulas number " + e)
    }

})


router.post('/reservar', async (req, res) => {
    const info = req.body
    console.log(info)
    const user = "tomascalletce@gmail.com"
    
    try{

        const respo = await neoMain.hacerReserva(user,info.id,info.hora.substring(0,2))
        console.log(respo)

    }catch(e){
        console.log("failed to create Reserva " + e)
    }

})

router.post('/getSPECS', async (req, res) => {
    const info = req.body;
    console.log(info)

    const neoCompu = await neoMain.getComputadorById(info.id) 
    const compu = neoCompu.records[0]._fields[0].properties
    console.log(compu)

    try{
        
        res.send({ text: `GPU: ${compu.tipoCPU}<br> 
        CPU: ${compu.tipoGPU}<br>
        GBRAM : ${compu.GBRAM}  
        ` 
        })
       
    }catch{
        console.log("failed to get specs of computer")
    }
})






module.exports = router