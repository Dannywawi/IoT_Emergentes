const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const CreateAdmin = async (request, response) => {
  var username = request.body.username 
  var password = request.body.password 
  var validationInput = ValidateInput(username, password)
  if ( validationInput ) {

    let validationUserExists = await CheckIfUserExists(username)
    
    if ( !validationUserExists ) {

      let createUser = await CreateUser(username, password)
      response.status(200).json({response: "Usuario creado"})
    } else {
      
      response.status(403).json({response: "El usuario ya existe en la base de datos"})
    }
  } else {
    console.log("Validation False")
    response.status(400).json({response: "Bad request"})
  }
}

/* Verificar campos de la cuenta */
const ValidateInput = (username, password) => {
  if (username && password) {
    if (typeof username !== "string") {
      return false
    } else if (typeof username !== "string") {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}


/* Verificar si la cuenta ya existe */
const CheckIfUserExists = async (username) => {
  let usersCount = await prisma.admin.count(
        {
          where: {
            username: username
          }
        })
  if (usersCount !== 0) {
    return true
  } else {
    return false
  }
}

/* Crear usuario */
const CreateUser = async (username, password) => {
  let createData = {username: username, password: password}
  let adminCreate = await prisma.admin.create( {data: createData })
  return adminCreate
}

module.exports = {
  CreateAdmin,
}
