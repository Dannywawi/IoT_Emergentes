const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

/* CONTROLLERS */
const GetLocation = async (req, res, next) => {
    const { companyId } = req.body;
    try {
        let allLocations = await prisma.location.findMany({
            where: {
                company_id: companyId,
            }
        })
        res.status(200).json(allLocations);
    } catch (error) {
        throw error;
    }
}


const CreateLocation = async (req, res, next) => {
    try {
        const { companyId, locationName, locationCountry, locationCity } = req.body;
        if (! locationCity || !locationCountry || !locationName) res.status(401).json({message: 'Ingrese los datos necesarios'});
        let locationExists = await CheckIfLocationExists(locationName, companyId.company_id);
        if (!locationExists) {
            const newLocation = await prisma.location.create({
                data: {
                    location_city: locationCity,
                    location_country: locationCountry,
                    location_name: locationName,
                    company_id: parseInt(companyId),
                },
            });
            res.status(201).json({message: 'Localizacion creada', newLocation});
        } else {
            res.status(403).json({message: 'Location ya existente'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

/* Verifica si la localizacion existe */
const CheckIfLocationExists = async (Name, CompanyId) => {
    let locationsCount = await prisma.location.count(
        {
          where: {
            location_name: Name,
            company_id: CompanyId,
          }
        })
    if (locationsCount === 0) {
        return false
    } else {
        return true
    }
}

module.exports = {
    GetLocation,
    CreateLocation
}