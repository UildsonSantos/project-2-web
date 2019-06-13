const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', (req, res) => {
  res.render('usuarios/registro');
});

router.post("/registro", (req, res) => {
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
    // fazer uma validação
    erros.push({texto: "Nome invalido"})
    console.log('senha invalido')

  }

  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null ){
    // fazer uma validação
    erros.push({texto: "email invalido"})
    console.log('email invalido')
  }

  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null ){
    // fazer uma validação
    erros.push({texto: "texto invalido"})
    console.log('senha invalido')
  }

  if(req.body.senha.lenght < 4 ){
    // fazer uma validação
    erros.push({texto: 'senha muito curta'})
    console.log('senha menor 4')
  }

  if(req.body.senha != typeof req.body.senha2){
    // fazer uma validação
      erros.push({texto: 'senhas são diferentes'})
  }

if(erros.lenght > 0){
  console.log('erros > 1')
  res.render("usuarios/registro", {erros: erros})
  console.log('erros > 0')

}else {

  Usuario.findOne({email: req.body.email}).then((usuario) => {
    if(usuario){
      req.flash('error_msg', 'usuario existente')
      res.redirect("/usuarios/registro")
    }else {
      const novoUsuario = new Usuario({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        eAdmin: 1

      })

      bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {

            if(erro){
              req.flash('error_msg','erro durante salvamento')
              console.log('erro durante salvamento')
              res.redirect('/')
            }
            novoUsuario.senha = hash

            novoUsuario.save().then(() => {
              req.flash('success_msg','criado com sucesso')
              console.log('criado com sucesso')
                res.redirect('/usuarios/login')
            })
          })
      })
    }
  }).catch((err) => {
    console.log('erro interno')
    res.redirect("/")
  })
}

})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})



router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true
  })(req, res, next)


})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('error_msg','Deslogado com sucesso!')
  res.redirect('/')
})

module.exports = router;
