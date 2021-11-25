const express = require('express')
const router = express.Router()


const Aula = require('../db/mongo/models/Aula')
const neoBuscarTecnico = require('../db/neo/neoNuscarTecnico')

router.get('/buscarTecnico', async (req, res) => {

    try {

        const neoAulas = await neoBuscarTecnico.getAulas()
        const codigos = []

        neoAulas.records.forEach(record => {
            codigos.push(record._fields[0].low)
        });

        res.render('buscarTecnico',{
            aulas : codigos
        })
        
    } catch (e) {
        console.log(res)
    }
    
})

router.post('/getAsistente',async (req,res)=>{
    const info = req.body
    console.log(info)


    try {

        const neoAsistente = await neoBuscarTecnico.buscarTecnicoPorAula(info.aula)
        const aula = neoAsistente.records[0]._fields[0].properties;

        res.send({
            Nombre : aula.nombre,
            text : `cell : ${aula.celular} <br>
            correo: ${aula.correo}`
        })
    
    } catch (e) {
        console.log(e)
    }
})


module.exports = router;