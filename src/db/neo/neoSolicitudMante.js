const neo4j = require('neo4j-driver');

// npm install --save neo4j-driver
// node example.js
const driver = neo4j.driver('bolt://34.200.219.199:7687',
    neo4j.auth.basic('neo4j', 'wingnuts-qualification-elbow'),
    {/* encrypted: 'ENCRYPTION_OFF' */ });

const params = { "limit": "10" };
const session = driver.session({ database: "neo4j" });

async function getAulas(){

    return session.run(`
        MATCH(tomas:Aula) RETURN tomas.codigo
        `)
}

async function getComputadores(codigoAula) {
    try {
        const response = await session.run(
            `MATCH(aula:Aula{codigo:${codigoAula}})<-[:PERTENECE]-(computador:Computador)RETURN computador`)
        
        let computers = []
        for (const record of response.records) {
            const id = record._fields[0].properties.id.low
            computers.push(id)
        }
        return computers;
    }
    catch (error) {
        console.error(error);
    };

}

async function hacerSolicitudDeMantenimiento(computerId,descripcion){

    return session.run(`MATCH(Computador:Computador{id:${computerId}}) SET Computador.solicitudManteimiento = '${descripcion}'`)
    
}


module.exports = {
    getAulas,
    getComputadores,
    hacerSolicitudDeMantenimiento
}
