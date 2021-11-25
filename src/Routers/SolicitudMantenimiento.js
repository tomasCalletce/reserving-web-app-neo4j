
const express = require('express')
const router = express.Router()


const Aula = require('../db/mongo/models/Aula')
const neoSolicitud = require('../db/neo/neoSolicitudMante')


router.get('/getInfo', (req, res) => {

})

router.get('/Solicitud',async (req, res) => {

    try {

        const neoAulas = await neoSolicitud.getAulas()
        const codigos = []

        neoAulas.records.forEach(record => {
            codigos.push(record._fields[0].low)
        });

        res.render('SolicitudMante',{
            aulas : codigos
        })

    } catch(e){
        console.log(e)
    }
   
})

router.post('/solicitar', async (req, res) => {
    const info  = req.body
    console.log(info)
    
    try {
        
    const neoRespo = await neoSolicitud.hacerSolicitudDeMantenimiento(info.idComputador,info.solicitud)
    console.log(neoRespo)

    } catch (e) {
        console.log(e)
    }

})

router.post('/getComputadores',async (req, res) => {
    const info = req.body
    console.log(info)

    try {

        const neoComputadores = await neoSolicitud.getComputadores(info.aula)

        res.send(neoComputadores)

    } catch (e) {
        res.status(404)
        console.log(e)
    }
    
})


router.delete('/finalizarServicio', (req, res) => {
    console.log('borrar el de mantenimiento de la tabla de la clase y editar al de mantenimiento como disponible')
    //BORRAR EL ATRIBUTO DE MANTENIMIENTO DE LA TABLA DE LA CLASE, PUES YA NO VA A HABER PERSONAL ALLÁ
})



module.exports = router