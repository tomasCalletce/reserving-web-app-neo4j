const neo4j = require('neo4j-driver');

// npm install --save neo4j-driver
// node example.js
const driver = neo4j.driver('bolt://34.200.219.199:7687',
    neo4j.auth.basic('neo4j', 'wingnuts-qualification-elbow'),
    {/* encrypted: 'ENCRYPTION_OFF' */ });

const params = { "limit": "10" };
const session = driver.session({ database: "neo4j" });

async function buscarTecnicoPorAula(codigoAula) {
    
    return  session.readTransaction(tx => {
            const info = tx.run(`MATCH(aula:Aula{codigo:${codigoAula}})-[:ASISTIDA]->(asistente) RETURN asistente
            `)
            return info
        })
        //console.log(list.records[0]._fields[0].properties)

}


async function getAulas(){

    return session.run(`
        MATCH(tomas:Aula) RETURN tomas.codigo
        `)
}

module.exports = {
    buscarTecnicoPorAula,
    getAulas
}
