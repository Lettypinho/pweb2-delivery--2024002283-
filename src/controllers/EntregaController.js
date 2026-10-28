import { validationResult } from 'express-validator';

export class EntregaController {
  constructor(service, motoristaService) {
    this.service = service;
    this.motoristaService = motoristaService;
  }

  async listar(req, res, next) {
    try {
      const entregas = await this.service.listarEntregas(
        req.query.status,
      );

      res.status(200).render('entregas/lista', {
        titulo: 'Entregas',
        entregas,
        statusSelecionado: req.query.status || '',
      });
    } catch (erro) {
      next(erro);
    }
  }

  nova(req, res) {
    res.status(200).render('entregas/formulario', {
      titulo: 'Nova Entrega',
      dados: {},
      erros: [],
    });
  }

  async registrar(req, res, next) {
    try {
      const resultado = validationResult(req);

      if (!resultado.isEmpty()) {
        return res.status(400).render('entregas/formulario', {
          titulo: 'Nova Entrega',
          dados: req.body,
          erros: resultado.array(),
        });
      }

      await this.service.registrarNovaEntrega(req.body);

      req.flash('sucesso', 'Entrega criada com sucesso.');
      return res.redirect('/entregas');
    } catch (erro) {
      if (erro.status && erro.status < 500) {
        return res.status(erro.status).render('entregas/formulario', {
          titulo: 'Nova Entrega',
          dados: req.body,
          erros: [{ msg: erro.message }],
        });
      }

      return next(erro);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const entrega = await this.service.obterOuFalhar(
        Number(req.params.id),
      );

      const motoristas =
        await this.motoristaService.listarMotoristas();

      res.status(200).render('entregas/detalhe', {
        titulo: `Entrega #${entrega.id}`,
        entrega,
        motoristas,
      });
    } catch (erro) {
      next(erro);
    }
  }

  async avancar(req, res, next) {
    try {
      await this.service.avancarStatus(Number(req.params.id));

      req.flash('sucesso', 'Status da entrega atualizado.');
      res.redirect(`/entregas/${req.params.id}`);
    } catch (erro) {
      next(erro);
    }
  }

  async cancelar(req, res, next) {
    try {
      await this.service.cancelarEntrega(Number(req.params.id));

      req.flash('sucesso', 'Entrega cancelada com sucesso.');
      res.redirect(`/entregas/${req.params.id}`);
    } catch (erro) {
      next(erro);
    }
  }

  async atribuirMotorista(req, res, next) {
    try {
      await this.service.atribuirMotorista(
        Number(req.params.id),
        Number(req.body.motoristaId),
      );

      req.flash('sucesso', 'Motorista atribuído com sucesso.');
      res.redirect(`/entregas/${req.params.id}`);
    } catch (erro) {
      next(erro);
    }
  }
}