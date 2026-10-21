import { AppError } from '../utils/AppError.js';

export class EntregaService {
  constructor(entregaRepository, motoristaRepository) {
    this.entregaRepository = entregaRepository;
    this.motoristaRepository = motoristaRepository;
  }

  async registrarNovaEntrega({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new AppError(400, 'informe descricao, origem e destino');
    }

    if (origem === destino) {
      throw new AppError(400, 'origem e destino não podem ser o mesmo lugar');
    }

    const entregaAtiva = await this.entregaRepository.encontrarAtiva(
      descricao,
      origem,
      destino,
    );

    if (entregaAtiva) {
      throw new AppError(409, 'já existe uma entrega ativa igual a essa');
    }

    return this.entregaRepository.criar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [
        {
          data: new Date().toISOString(),
          descricao: 'entrega registrada',
        },
      ],
    });
  }

  async listarEntregas(status) {
    return this.entregaRepository.listarTodos(
      status ? { status } : {},
    );
  }

  async obterOuFalhar(id) {
    const entrega = await this.entregaRepository.buscarPorId(id);

    if (!entrega) {
      throw new AppError(404, 'entrega não existe');
    }

    return entrega;
  }

  async avancarStatus(id) {
    const entrega = await this.obterOuFalhar(id);

    let novoStatus;

    switch (entrega.status) {
      case 'CRIADA':
        novoStatus = 'EM_TRANSITO';
        break;

      case 'EM_TRANSITO':
        novoStatus = 'ENTREGUE';
        break;

      default:
        throw new AppError(422, 'essa entrega não pode mais avançar');
    }

    const historico = [
      ...entrega.historico,
      {
        data: new Date().toISOString(),
        descricao: `status agora é ${novoStatus}`,
      },
    ];

    return this.entregaRepository.atualizar(id, {
      status: novoStatus,
      historico,
    });
  }

  async cancelarEntrega(id) {
    const entrega = await this.obterOuFalhar(id);

    if (
      entrega.status === 'ENTREGUE' ||
      entrega.status === 'CANCELADA'
    ) {
      throw new AppError(
        422,
        'não dá pra cancelar uma entrega já finalizada',
      );
    }

    const historico = [
      ...entrega.historico,
      {
        data: new Date().toISOString(),
        descricao: 'entrega cancelada',
      },
    ];

    return this.entregaRepository.atualizar(id, {
      status: 'CANCELADA',
      historico,
    });
  }

  async obterHistorico(id) {
    const entrega = await this.obterOuFalhar(id);
    return entrega.historico;
  }

  async atribuirMotorista(id, motoristaId) {
    const entrega = await this.obterOuFalhar(id);

    if (entrega.status !== 'CRIADA') {
      throw new AppError(
        422,
        'motorista só pode ser atribuído a uma entrega CRIADA',
      );
    }

    const motorista =
      await this.motoristaRepository.buscarPorId(motoristaId);

    if (!motorista) {
      throw new AppError(404, 'motorista não existe');
    }

    if (motorista.status !== 'ATIVO') {
      throw new AppError(422, 'motorista está INATIVO');
    }

    const historico = [
      ...entrega.historico,
      {
        data: new Date().toISOString(),
        descricao: `motorista ${motoristaId} atribuído à entrega`,
      },
    ];

    return this.entregaRepository.atualizar(id, {
      motoristaId,
      historico,
    });
  }
}