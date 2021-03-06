'use strict';

var ataqueModel = require('../../../models/ataque');
var ObjMilitarModel = require('../../../models/objetivoMilitar');
var auth = require('../../../lib/auth');

module.exports = function (router) {

    router.get('/:id', auth.isAuthenticated(), function (req, res, next) {

        var ataqueId = req.params.id;

        ataqueModel.find({_id: ataqueId}, function (err, user) {
            if (err) {
                return res.status(500).json({error: err}).end();
            }
            if (!user) {
                return res.status(404).end();
            }
            res.status(200).json(user).end();
        });

    });

    router.get('/', auth.isAuthenticated(), function (req, res, next) {

        ataqueModel.find({}, function (err, users) {
            if (err) {
                return res.status(500).json({error: err}).end();
            }
            res.status(200).json(users).end();
        });

    });

    router.post('/', auth.isAuthenticated(), function (req, res, next) {

        var data = req.body;
        
        var codigo = data.codObjMilitar;
        ObjMilitarModel.findOne({codigo: codigo}, function (err, ObjetivoToPost) {
            if (err) {
                return res.status(500).json({error: 'error al encontrar el codigo'}).end();
            }
            
            if(!ObjetivoToPost){
                
                res.status(404).json({error: 'No existe el codigo del Objetivo militar'}).end();
            }
            
            if (ObjetivoToPost){
                
                data.pExito = Math.round(Math.random()*100);
                
                if(data.pExito >= 80){
                    
                    data.mensaje = 'Ataque Perfecto';
                    
                } else if(data.pExito >= 40 && data.pExito < 80){
                    
                    data.mensaje = 'Ataque medio';
                    
                } else {
                    
                    data.mensaje = 'Ataque fallido';
                }
                var newAtaque = new ataqueModel(data);
                newAtaque.save(function (err, userCreated) {
                if (err) {
                    return res.status(500).json({error: err}).end();
                }
                res.status(201).json(userCreated).end();
                });   
            }
            
            
        });

        

    });

    router.put('/:id', auth.isAuthenticated(), function (req, res, next) {

        var data = req.body;
        var ataqueId = req.params.id;

        ataqueModel.findOne({_id: ataqueId}, function (err, ataqueToUpdate) {
            if (err) {
                return res.status(500).json({error: err}).end();
            }

            mapUserDataToUpdate(ataqueToUpdate, data);
            ataqueToUpdate.save(function (err, userCreated) {
                if (err) {
                    return res.status(500).json({error: err}).end();
                }
                res.status(201).json(userCreated).end();
            });
        });

    });

    router.delete('/:id', auth.isAuthenticated(), function (req, res) {

        var ataqueId = req.params.id;

        ataqueModel.remove({_id: ataqueId}, function (err) {
            if (err) {
                res.status(500).json({error: err}).end();
            }

            res.status(204).end();
        });

    });

    function mapUserDataToUpdate(ataqueToUpdate, data) {

        ataqueToUpdate.nombre = data.nombre || ataqueToUpdate.nombre;
        ataqueToUpdate.apellido = data.apellido || ataqueToUpdate.apellido;
        ataqueToUpdate.nivelMilitar = data.nivelMilitar || ataqueToUpdate.nivelMilitar;
        ataqueToUpdate.edad = data.edad || ataqueToUpdate.edad;
        ataqueToUpdate.habilitado = data.habilitado || ataqueToUpdate.habilitado;

        return ataqueToUpdate;

    };

};
