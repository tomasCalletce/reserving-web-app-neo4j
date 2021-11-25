const neo4j = require('neo4j-driver');

// npm install --save neo4j-driver
// node example.js
const driver = neo4j.driver('bolt://34.200.219.199:7687',
    neo4j.auth.basic('neo4j', 'wingnuts-qualification-elbow'),
    {/* encrypted: 'ENCRYPTION_OFF' */ });

const params = { "limit": "10" };
const session = driver.session({ database: "neo4j" });


async function addAsistenteTecnico(id, nombre, correo, celular) {

    try {
        const list = await session.readTransaction(tx => {
            const info = tx.run(`MATCH(asistente:Asistente{id:${id}}) RETURN asistente
            `)
            return info
        })
        if (list.records.length == 0) {
            const asistentecreado = await session.writeTransaction(tx => {
                const info = tx.run(`
                    CREATE (asistente:Asistente{id:${id},nombre:'${nombre}',correo:'${correo}',celular:${celular}})
                    `)
                return info;
            })
            console.log(asistentecreado)
        }
        else if (list.records.length == 1) {
            await session.writeTransaction(tx => {
                tx.run(`
                        MATCH (a:Asistente {id: ${id}})
        SET a.id = ${id},
            a.nombre = ${nombre},
            a.correo=${correo},
            a.celular:${celular}
        RETURN a
                        `)
            })
        }
    } catch (e) {
        console.log(e + "sizas")
    }


}

async function addAula(codigo, cupoMaximo, idAsistenteTecnico) {
    try {
        const list = await session.readTransaction(tx => {
            const info = tx.run(`MATCH(Aula{codigo:${codigo}}) RETURN Aula
            `)
            return info
        })
        if (list.records.length == 0) {
            const aulaCreada = await session.writeTransaction(tx => {
                const info = tx.run(`
                    CREATE (aula:Aula{codigo:${codigo},cupoMaximo:'${cupoMaximo}',idAsistenteTecnico:'${idAsistenteTecnico}'})
                    `)
                return info
            })
            console.log("Aula Creada: " + aulaCreada.toString())

            const relacionAulaAsistente = await session.writeTransaction(tx => {
                return tx.run(`
                    MATCH(Aula{codigo:${codigo}}),
                    (Asistente{id:${idAsistenteTecnico}})
                    CREATE(Aula)-[:ASISTIDA]->(Asistente)
                    `)
            })
            console.log(relacionAulaAsistente)
        }
        else if (list.records.length == 1) {
            const updateAula = await session.writeTransaction(tx => {
                return tx.run(`
                        MATCH (a:Aula {codigo: ${codigo}})
        SET a.codigo = ${codigo},
            a.cupoMaximo=${cupoMaximo},
            a.idAsistenteTecnico=${idAsistenteTecnico}
        RETURN a
                        `)
            })
            console.log(updateAula)
        }
    } catch (e) {
        console.log(e + "sizas")
    }
}


async function addComputador(idComputador, tipoGPU, tipoCPU, GBRAM, aula_Codigo) {
    try {
        const list = await session.readTransaction(tx => {
            const info = tx.run(`MATCH(computador:Computador{id:${idComputador}}) RETURN computador
            `)
            return info
        })

        if (list.records.length == 0) {
            const computadorCreado = await session.writeTransaction(tx => {
                return tx.run(`
                    CREATE (computador:Computador{id:${idComputador},tipoGPU:'${tipoGPU}',tipoCPU:'${tipoCPU}',GBRAM:${GBRAM}})
                    `)
            })
            console.log('computadorCreado: ' + computadorCreado)
            const relacionComputador = await session.writeTransaction(tx => {
                return tx.run(`
                    MATCH(computador:Computador{id:${idComputador}}),
                    (aula:Aula{codigo:${aula_Codigo}})
                    CREATE(computador)-[:PERTENECE]->(aula)
                    `)
            })
            console.log(relacionComputador)

        }
        else if (list.records.length == 1) {
            const updateComputador = await session.writeTransaction(tx => {
                return tx.run(`
                        MATCH (c:Computador {id: ${idComputador}})
        SET c.id = ${idComputador},
            c.tipoGPU = '${tipoGPU}',
            c.GBRAM=${GBRAM},
            c.tipoCPU='${tipoCPU}'
        RETURN c
                        `)
            })
            console.log(updateComputador)
        }

    } catch (e) {
        console.log(e + 'sizas')
    }
}

module.exports = {
    addAsistenteTecnico,
    addAula,
    addComputador
}

