# IoT_Emergentes

Integrantes: Maximiliano Sanders - Danny Ortega

## ENPOINTS

### Admin Endpoints

POST -> /api/v1/createAdmin 

Parametros:

* username (string)
* password (String)

### Company Endpoints

POST -> /api/v1/create_company 

Parametros:

* companyName (string)


GET -> /api/v1/get_companies 

Parametros:

* companyName (string)

### Location Endpoints

POST -> /api/v1/create_location 

Parametros:

* companyId (int)
* locationName (string)
* locationCountry (string)
* locationCity (string)


GET -> /api/v1/get_locations

Parametros:

* companyId (int)

### Sensor Endpoints

POST -> /api/v1/create_sensor

Parametros:

* locationId (int)
* sensorName (string)
* sensorCategory (string)


GET -> /api/v1/get_sensors

Parametros:

* locationId (int)


POST -> /api/v1/sensor_data

Parametros:

* sensorId (int)
* sensorCategory (string)
* json_data (JSON)


GET -> /api/v1/sensor_data

Parametros:

* sensor_id (int)
