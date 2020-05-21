'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var port = 3800

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/portafolio', { useFindAndModify: false, useNewUrlParser: true , useUnifiedTopology: true })
        .then(() => {
            console.log('conexkion a la base de datos establecida...')

            //Creacion del Sservidor
            app.listen(port, ()=>{
                console.log("Servidor corriendo correctamente en la url: localhost:3800")
            })
        })
        .catch(err => console.log(err))