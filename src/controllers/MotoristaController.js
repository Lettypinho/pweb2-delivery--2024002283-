import { validationResult } from 'express-validator';

export class MotoristaController {
  constructor(service) {
    this.service = service;
  }

  async listar(req, res, next) {
    try {
      const motoristas = await this.service.listarMotoristas();

      res.status(200).render('motoristas/lista', {
        titulo: 'Motoristas',
        motoristas,
      });
    } catch (erro) {
      next(erro);
    }
  }

  novo(req, res) {
    res.status(200).render('motoristas/formulario', {
      titulo: 'Novo Motorista',
      dados: {},
      erros: [],
    });
  }

  async cadastrar(req, res, next) {
    try {
      const resultado = validationResult(req);

      if (!resultado.isEmpty()) {
        return res.status(400).render('motoristas/formulario', {
          titulo: 'Novo Motorista',
          dados: req.body,
          erros: resultado.array(),
        });
      }

      await this.service.cadastrarMotorista(req.body);

      req.flash('sucesso', 'Motorista cadastrado com sucesso.');
      return res.redirect('/motoristas');
    } catch (erro) {
      if (erro.status && erro.status < 500) {
        return res.status(erro.status).render(
          'motoristas/formulario',
          {
            titulo: 'Novo Motorista',
            dados: req.body,
            erros: [{ msg: erro.message }],
          },
        );
      }

      return next(erro);
    }
  }
}