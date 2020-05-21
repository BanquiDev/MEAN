'use strict'

var Project = require('../models/project')
var fs = require('fs')
var path = require('path')

var controller = {
    test: function(req, res){
        return res.status(200).send({
            message:"soy el metodo test"
        })
    },
    home: function(req, res){
        return res.status(200).send({
            message: "soy la home"
        })
    },
    saveProject: function (req, res){
        var project = new Project()
        
        var params = req.body
        project.name = params.name
        project.description = params.description
        project.category = params.category
        project.year = params.year
        project.langs = params.langs
        project.image = null

        project.save((err, projectStored)=>{
            if(err) return res.status(500).send({message: 'Error al guardar el documento'})

            if(!projectStored) return res.status(404).send({message: "No se ha podido guardado el proyecto"})

            return res.status(200).send({project: projectStored})
        })
    },

    getProject: function (req, res){
        var projectId = req.params.id
        if(projectId == null) return res.status(404).send({message: "el Proyecto no existe"})

        Project.findById(projectId, (err, project)=>{

            if(err) return res.status(500).send({message: "error al devolver los datos"})

            if(!project) return res.status(404).send({message: "el projecto no existe"})

            return res.status(200).send({project})
        })
    },
    getProjects: function (req, res){

        Project.find().sort('-year').exec((err, projects)=>{

            if(err) return res.status(500).send({message: "error al devolver los datos"})

            if(!projects) return res.status(404).send({message: 'no hay proyectos para mostrar'})

            return res.status(200).send({projects})
        })
    },
    updateProject: function (req, res){
        var projectId = req.params.id
        var update = req.body

        Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated)=>{
            
            if(err) return res.status(500).send({message: "error al actualizar"})

            if(!projectUpdated) return res.status(404).send({message:"no existe el projecto"})

            return res.status(200).send({project: projectUpdated})
        })
    },
    deleteProject: function(req, res){
        var projectId = req.params.id

        Project.findByIdAndDelete(projectId, (err, projectRemoved) =>{
            if(err) res.status(500).send({message: 'no se ha podido borrar'})

            if(!projectRemoved) res.status(404).send({message: 'no se puede eliminiar'})

            return res.status(200).send({ project: projectRemoved})
        })
    },
    uploadImage: function(req, res){
        var projectId = req.params.id
        var message = "imagen no subida"

        if(req.files){
            var filePath = req.files.image.path
            var fileSplit = filePath.split('\\')
            var fileName = fileSplit[1]
            var extSplit = fileName.split('\.')
            var fileExt = extSplit[1]

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){

                Project.findByIdAndUpdate(projectId, {image:fileName}, {new:true}, (err, projectUpdated)=>{
                    if(err) return res.status(500).send({message: 'la imagen no se ha subido'})

                    if(!projectUpdated) return res.status(404).send({message: 'la imagen no existe'})

                    return res.status(200).send({ project: projectUpdated})
                })
            
            }else{
                fs.unlink(filePath, (err) =>{
                    return res.status(200).send({message: 'la extension no es valida'})
                } )
            }    
            
        }else{
            return res.status(200).send({message: message})
        }
    },
    getImageFile: function(req, res){
        var file = req.params.image
        var path_file = './uploads/'+file

        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(200).send({message:"no existe la imagen"})
            }
        })
    }

}

module.exports = controller