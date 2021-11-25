const express = require('express')
const router = express.Router()




const Aula = require('../db/mongo/models/Aula')
const AsistenteTecnico = require('../db/mongo/models/AsistenteTecnico')
const neoMain = require('../db/neo/neoAdmin')


router.get('/admin', (req, res) => {
    res.render('admin')
})

router.post('/crearComputador', async (req, res) => {
    const info = req.body;

    try {

    const computador = await neoMain.addComputador(info.id,info.GPU,info.CPU,info.RAM,info.aula)
    console.log(computador)

    } catch (error) {
        console.log(error)
    }


})
router.post('/crearAula', async(req, res) => {
    const info = req.body;
    console.log(info)
    
    try {

        const aulaNeo = await neoMain.addAula(info.aula,info.cupoMaximo,info.idAsistente)
        console.log(aulaNeo)

    } catch (error) {
        console.log(error)
    }
  

})
router.post('/crearAsistenteTecnico', async(req, res) => {
    const info = req.body;
    console.log(info)


    try {

        const addAsistenteTecnico = await neoMain.addAsistenteTecnico(info.idAsistente,info.nombre,info.correo,info.celular)
        console.log(addAsistenteTecnico)

    } catch (error) {
        console.log(error)
        res.send(false)
    }

   
})

module.exports = router