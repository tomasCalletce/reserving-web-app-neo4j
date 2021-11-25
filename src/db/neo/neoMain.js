const neo4j = require('neo4j-driver');

// npm install --save neo4j-driver
// node example.js
const driver = neo4j.driver('bolt://34.200.219.199:7687',
    neo4j.auth.basic('neo4j', 'wingnuts-qualification-elbow'),
    {/* encrypted: 'ENCRYPTION_OFF' */ });

const params = { "limit": "10" };
const session = driver.session({ database: "neo4j" });

async function getComputadoresDisponibles(aula, hora) {
    try {
        const list = await session.readTransaction(tx => {
            const info = tx.run(
            `
            MATCH(aula:Aula{codigo:${aula}})<-[:PERTENECE]-(computador:Computador),
            (computador)<-[r:RESERVA]-(usuario:Usuario)
            WHERE NOT (r.hora=${hora})
            RETURN r.hora, computador`
            )
            return info
        })

        const arr = []
        for (const reserva of list.records) {
            const idComputador = reserva._fields[1].properties.id.low
            arr.push(idComputador)
        }
        return arr


    } catch (error) {
        console.error(error);
    };
}

async function getComputadorById(idComputador) {

    try {
        return session.readTransaction(tx => {
            return tx.run(
            `MATCH(computador:Computador{id:${idComputador}}) RETURN computador
            `)
        })

    } catch (error) {
        console.error(error);
    };

}

async function getAulas(){

    return session.run(`
        MATCH(tomas:Aula) RETURN tomas.codigo
        `)
}

async function hacerReserva(correo, idComputador, hora) {
 
    return session.run(
               ` MATCH(usuario:Usuario{correo:'${correo}'}),
               (computador:Computador{id:${idComputador}})
               CREATE(usuario)-[:RESERVA{hora:${hora}}]->(computador)
               `)
        
}   


module.exports = {
    getAulas,
    getComputadoresDisponibles,
    getComputadorById,
    hacerReserva
}
