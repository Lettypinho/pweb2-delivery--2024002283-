export class EntregaController {
  constructor(service) {
    this.service = service;
  }

  registrar(req, res, next) {
    try {
      const entrega = this.service.registrarNovaEntrega(req.body || {});
      res.status(201).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  listar(req, res, next) {
    try {
      const entregas = this.service.listarEntregas(req.query.status);
      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  }

  obterPorId(req, res, next) {
    try {
      const entrega = this.service.obterOuFalhar(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  avancar(req, res, next) {
    try {
      const entrega = this.service.avancarStatus(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  cancelar(req, res, next) {
    try {
      const entrega = this.service.cancelarEntrega(Number(req.params.id));
      res.status(200).json(entrega);
    } catch (erro) {
      next(erro);
    }
  }

  historico(req, res, next) {
    try {
      const historico = this.service.obterHistorico(Number(req.params.id));
      res.status(200).json(historico);
    } catch (erro) {
      next(erro);
    }
  }
}
