export class MotoristaController {
  constructor(service) {
    this.service = service;
  }

  async cadastrar(req, res, next) {
    try {
      const motorista = await this.service.cadastrarMotorista(
        req.body || {},
      );
      res.status(201).json(motorista);
    } catch (erro) {
      next(erro);
    }
  }

  async listar(req, res, next) {
    try {
      const motoristas = await this.service.listarMotoristas();
      res.status(200).json(motoristas);
    } catch (erro) {
      next(erro);
    }
  }

  async obterPorId(req, res, next) {
    try {
      const motorista = await this.service.obterOuFalhar(
        Number(req.params.id),
      );
      res.status(200).json(motorista);
    } catch (erro) {
      next(erro);
    }
  }

  async listarEntregas(req, res, next) {
    try {
      const entregas =
        await this.service.listarEntregasDoMotorista(
          Number(req.params.id),
          req.query.status,
        );

      res.status(200).json(entregas);
    } catch (erro) {
      next(erro);
    }
  }
}