const bcrypt = require("bcryptjs")
const salt = 2

async function encriptar(valor) {
    return bcrypt.hashSync(valor,salt)
}

async function comparar(valor, criptografado) {
    return bcrypt.compareSync(valor,criptografado)
}
module.exports = {encriptar,comparar}