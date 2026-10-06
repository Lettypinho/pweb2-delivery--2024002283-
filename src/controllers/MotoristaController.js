export class MotoristaController {
  constructor(service) {
    this.service = service;
  }

  cadastrar(req, res, next) {
    try {
      const motorista =
        this.service.cadastrarMotorista(req.body || {});

      res.status(201).json(motorista);
    } catch (erro) {
      next(erro);
    }
  }

  listar(req, res, next) {
    try {
      const motoristas =
        this.service.listarMotoristas();

      res.status(200).json(motoristas);
    } catch (erro) {
      next(erro);
    }
  }

  obterPorId(req, res, next) {
    try {
      const motorista =
        this.service.obterOuFalhar(
          Number(req.params.id),
        );

      res.status(200).json(motorista);
    } catch (erro) {
      next(erro);
    }
  }

  listarEntregas(req, res, next) {
    try {
      const entregas =
        this.service.listarEntregasDoMotorista(
          Number(req.params.id),
          req.query.status,
        );

      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  }
}