export class EntregaController {
  constructor(service) {
    this.service = service;
  }

  async registrar(req, res, next) {
    try {
      const entrega = await this.service.registrarNovaEntrega(req.body || {});
      res.status(201).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const entregas = await this.service.listarEntregas(req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const entrega = await this.service.obterOuFalhar(
        Number(req.params.id),
      );
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  async avancar(req, res, next) {
    try {
      const entrega = await this.service.avancarStatus(
        Number(req.params.id),
      );
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  async cancelar(req, res, next) {
    try {
      const entrega = await this.service.cancelarEntrega(
        Number(req.params.id),
      );
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  async historico(req, res, next) {
    try {
      const historico = await this.service.obterHistorico(
        Number(req.params.id),
      );
      res.status(200).json(historico);
    } catch (erro) {
      next(erro);
    }
  }

  async atribuirMotorista(req, res, next) {
    try {
      const entrega = await this.service.atribuirMotorista(
        Number(req.params.id),
        Number(req.body.motoristaId),
      );

      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }
}