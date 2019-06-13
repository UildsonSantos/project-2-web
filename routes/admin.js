const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

require('../models/Postagem')
const Postagem = mongoose.model('postagens')

const {estaLogado} = require('../helpers/eAdmin')


router.get('/postagens', estaLogado,  (req, res) => {
  Postagem.find().sort({date: 'desc'}).then((postagens) => {
    res.render('/postagens/index', {postagens:postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })
})

router.get('/postagens/add', estaLogado, (req, res) => {
  res.render('admin/addpostagens')
})

router.get('/postagens/edit:id', estaLogado, (req, res) => {

    Postagem.findOne({_id: req.params.id}).then((postagens) => {
      res.render('admin/editpostagens', {postagens: postagens})

    }).catch((err) => {
        req.flash('error_msg', 'essa postagem nao existe')
        res.redirect('/postagens')
    })

  })


router.post('/postagens/edit', estaLogado, (req, res) => {
    var erros = []
  if(!req.body.msg || typeof req.body.msg == undefined || req.body.msg == null ){
    // fazer uma validação
      req.body.msg = 'postagem vazia'
      erros.push({texto: "Nenhuma postagem"})
      //res.render("postagens/index", {erros: erros})

  }
      Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.msg = req.body.msg
          //  ,endImagen: req.body.endImagem

          postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/postagens")
          }).catch((err) => {
              req.flash('error_msg', 'erro ao salvar a edição da postagem')
              res.redirect('/postagens')
          })

      }).catch((err) => {
          req.flash('error_msg', 'erro ao editar a postagem')
          res.redirect('/postagens')
      })


  })
router.post('/postagens/deletar', estaLogado, (req, res) => {
    Postagem.remove({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso!")
      res.redirect('/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem')
        res.redirect('/postagens')
    })

})


router.post('/postagens/nova', estaLogado, (req, res) => {
    var erros = []

    if(!req.body.msg || typeof req.body.msg == undefined || req.body.msg == null ){
      // fazer uma validação
        erros.push({texto: "Nenhuma postagem"})
        res.render("admin/addpostagens", {erros: erros})
    }else {

          const novaPostagem = {
            msg: req.body.msg
          }

          new Postagem(novaPostagem).save().then(() => {
          req.flash("success_msg", "Salvo com sucesso!")
          console.log('Postagem salva com sucesso!');
          res.redirect("/postagens")

          }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar Postagem!")
            console.log('Erro ao salvar Postagem');
            res.redirect("/postagens")
          })
    }
})



module.exports = router;
