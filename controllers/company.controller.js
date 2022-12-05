const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

/* CONTROLLERS */

const CreateCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) res.status(404).json({message: 'Ingrese nombre de la compañia'});
        let company_api = generateAPIKey(companyName)
        const companyExists = await checkIfCompanyExists(companyName);
        if (companyExists) res.status(404).json({message: 'Compañia ya existente'});
        else {
            const newCompany = await prisma.company.create({
            data: {
                company_name: companyName,
                company_api_key: company_api,
            }
            })
            res.status(200).json({message: 'Compañia creada', newCompany});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const GetCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany()
        res.status(200).json({companies})
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

 /* Generador de llave */
 const generateAPIKey = (Password) => {
    var api_key = bcrypt.hashSync(Password , 10);
    return api_key;
  }
  
   /* Verifica si la compañia existe */
  const checkIfCompanyExists = async (Name) => {
      const company = await prisma.company.count({
          where: {
              company_name: Name,
          }
      })
      if (company > 0) return true;
      else return false;
  }

module.exports = {
    CreateCompany,
    GetCompanies
}
