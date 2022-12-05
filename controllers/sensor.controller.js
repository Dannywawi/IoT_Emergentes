const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

/* CONTROLLERS SENSOR*/
const GetSensor = async (req, res, next) => {
    const { LocationId } = req.body;
    try {
        let allSensors = await prisma.sensor.findMany({
            where: {
                location_id: LocationId,
            }
        })
        res.status(200).json(allSensors);
    } catch (error) {
        throw error;
    }
}

const CreateSensor = async (req, res, next) => {
    try {
        const { locationId, sensorName, sensorCategory } = req.body;
        if (!locationId || !sensorName || !sensorCategory) res.status(401).json({message: 'Ingrese los datos necesarios'});
        let sensorExists = await CheckIfSensorExists(sensorName, locationId);
        if (!sensorExists) {
            let ApiKey = generateAPIKey(sensorName+locationId+sensorCategory);
            const newSensor = await prisma.sensor.create({
                data: {
                    location_id: locationId,
                    sensor_name: sensorName,
                    sensor_category: sensorCategory,
                    sensor_api_key: ApiKey,
                },
            });
            res.status(201).json({message: 'Sensor creado', newSensor});
        } else {
            res.status(403).json({message: 'Sensor ya existente'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

/* Verifica si sensor existe */
const CheckIfSensorExists = async (SensorName, LocationId) => {
    let sensorCount = await prisma.sensor.count(
        {
          where: {
            location_id: LocationId,
            sensor_name: SensorName,
          }
        })
    if (sensorCount === 0) {
        return false
    } else {
        return true
    }
}

 /* Generador de llave */
 const generateAPIKey = (Password) => {
    var api_key = bcrypt.hashSync(Password , 10);
    return api_key;
  }



/* CONTROLLERS SENSOR_DATA*/
const insertSensorData = async (req, res, next) => {
    try {
        const { sensorId, category, json_data } = req.body;
        if (!sensorId || !category || !json_data) res.status(401).json({message: 'Ingrese los datos necesarios'});
        if (category === 'temperatura') {
           json_data.map(async (item) => {
                await prisma.sensor_data.create({
                    data: {
                        sensor_id: sensorId,                        
                        sensor_t_celsius: item.tcelcius,
                        sensor_t_kelvin: item.tkelvin,
                    },
                });
            });
            res.status(201).json({message: `Datos ingresados`});
        } else if (category === 'luz') {
            json_data.map(async (item) => {
                await prisma.sensor_data.create({
                    data: {
                        sensor_id: sensorId,                        
                        sensor_luz_int: item.intensidad,
                        sensor_luz_nivel: item.nivel,
                    },
                });
            });
            res.status(201).json({message: `Datos ingresados`});
        } else {
            res.status(403).json({message: 'Category no encontrada'});
        }
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};

const getSensorData = async (req, res, next) => {
    try {
        const { sensor_id } = req.query;
        if (!sensor_id) res.status(401).json({message: 'Ingrese los datos necesarios'});
        const sensorIds = JSON.parse(sensor_id);
        console.log(sensorIds[0]);
        const sensorData = await prisma.sensor_data.findMany({
            select: {
                sensor_id: true,
                sensor_t_celsius: true,
                sensor_t_kelvin: true,
                sensor_luz_int: true,
                sensor_luz_nivel: true,                
            },
            where: {
                sensor_id: {
                    in: sensorIds,
                },
            },
        });
        res.status(200).json(sensorData);
    } catch (error) {
        res.status(500).json({message: 'Error:' + error})
        throw error;
    }
};
        


module.exports = {
    GetSensor,
    CreateSensor,
    insertSensorData,
    getSensorData,
}