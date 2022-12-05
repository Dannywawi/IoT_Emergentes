const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const adminController = require('../controllers/admin.controller')
const companyController = require('../controllers/company.controller')
const locationController = require('../controllers/location.controller')
const sensorController = require('../controllers/sensor.controller')

/* Creador de administrador */
router.post('/create_admin', adminController.CreateAdmin)

/* COMPANY ENDPOINTS */
router.post('/create_company', companyController.CreateCompany)
router.get('/get_companies', auth.isAuth, companyController.GetCompanies)


/* LOCATION ENDPOINTS */
router.post('/create_location', auth.checkApiKey, locationController.CreateLocation)
router.get('/get_locations', auth.checkApiKey, locationController.GetLocation)


/* SENSOR ENDPOINTS */
router.post('/create_sensor', auth.checkApiKey, sensorController.CreateSensor)
router.get('/get_sensors', auth.checkApiKey, sensorController.GetSensor)
router.post('/sensor_data', auth.checkSensorApiKey, sensorController.insertSensorData)
router.get('/sensor_data', auth.checkApiKey, sensorController.getSensorData)

module.exports = router
