const neo4j = require('neo4j-driver');

// npm install --save neo4j-driver
// node example.js
const driver = neo4j.driver('bolt://34.200.219.199:7687',
    neo4j.auth.basic('neo4j', 'wingnuts-qualification-elbow'),
    {/* encrypted: 'ENCRYPTION_OFF' */ });

const params = { "limit": "10" };
const session = driver.session({ database: "neo4j" });



async function Register(codigo, nombre, correo, contraseña) {

    return session.run(
        `CREATE(usuario:Usuario{codigo:${codigo},nombre:'${nombre}',correo:'${correo}',contraseña:'${contraseña}'})`
        )
}

module.exports = {
    Register
}

