import { AppError } from '../utils/AppError.js';

export class MotoristaService {
  constructor(motoristaRepository, entregaRepository) {
    this.motoristaRepository = motoristaRepository;
    this.entregaRepository = entregaRepository;
  }

  async cadastrarMotorista({ nome, cpf, placaVeiculo }) {
    if (!nome || !cpf) {
      throw new AppError(400, 'informe nome e cpf');
    }

    const motoristaExistente =
      await this.motoristaRepository.buscarPorCpf(cpf);

    if (motoristaExistente) {
      throw new AppError(409, 'já existe um motorista com esse CPF');
    }

    return this.motoristaRepository.criar({
      nome,
      cpf,
      placaVeiculo: placaVeiculo || null,
      status: 'ATIVO',
    });
  }

  async listarMotoristas() {
    return this.motoristaRepository.listarTodos();
  }

  async obterOuFalhar(id) {
    const motorista =
      await this.motoristaRepository.buscarPorId(id);

    if (!motorista) {
      throw new AppError(404, 'motorista não existe');
    }

    return motorista;
  }

  async listarEntregasDoMotorista(id, status) {
    await this.obterOuFalhar(id);

    const filtros = {
      motoristaId: id,
    };

    if (status) {
      filtros.status = status;
    }

    return this.entregaRepository.listarTodos(filtros);
  }
}