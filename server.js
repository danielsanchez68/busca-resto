const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const Restaurante = mongoose.model('restaurantes', { });
const Barrio = mongoose.model('barrios', { });

const config = require('./config.js')

var baseConectada = false

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/version', (req,res) => {
    res.json({version: config.VERSION})
})

app.post('/datos', (req,res) => {
    let { distancia, posicion } = req.body

    if(baseConectada) {
        let distanciaEnMetros = Number(distancia)
        let coordenadasActuales = posicion.reverse()
    
        //console.log(distanciaEnMetros, coordenadasActuales)
        Barrio.findOne({ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: coordenadasActuales } } } },(error, barrio) => {
            //console.log('Barrio:', barrio.properties.barrio)
            Restaurante.find({ geometry: { $nearSphere: { $geometry: { type: "Point", coordinates: coordenadasActuales }, $maxDistance: distanciaEnMetros } } },(error, restaurantes) => {
                res.json({ restaurantes, barrio: barrio.properties.barrio })
            }).lean()
        }).lean()
    }
    else res.json({error: 'Base de datos no disponible'});
})

const PORT = process.env.PORT || 8080

mongoose.connect(config.STR_CNX,
    {useNewUrlParser: true, useUnifiedTopology: true}, error => {
        if(error) throw new Error('Error en conexión de Base de datos ' + JSON.stringify(error))

        console.log('Base de datos conectada!')
        baseConectada = true

        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${PORT}`)
        })
        server.on('error', error => console.log(`Error en servidor ${error}`))
})
