import { AppError } from '../utils/AppError.js';

export class EntregaService {
  constructor(repository) {
    this.repository = repository;
  }

  registrarNovaEntrega({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      throw new AppError(400, 'informe descricao, origem e destino');
    }
    if (origem === destino) {
      throw new AppError(400, 'origem e destino não podem ser o mesmo lugar');
    }
    if (this.repository.encontrarAtiva(descricao, origem, destino)) {
      throw new AppError(409, 'já existe uma entrega ativa igual a essa');
    }

    return this.repository.salvar({
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [{ data: new Date().toISOString(), descricao: 'entrega registrada' }],
    });
  }

  listarEntregas(status) {
    const entregas = this.repository.todas();
    return status ? entregas.filter((entrega) => entrega.status === status) : entregas;
  }

  obterOuFalhar(id) {
    const entrega = this.repository.porId(id);
    if (!entrega) {
      throw new AppError(404, 'entrega não existe');
    }
    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.obterOuFalhar(id);

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

    entrega.status = novoStatus;
    entrega.historico.push({ data: new Date().toISOString(), descricao: `status agora é ${novoStatus}` });
    return entrega;
  }

  cancelarEntrega(id) {
    const entrega = this.obterOuFalhar(id);
    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new AppError(422, 'não dá pra cancelar uma entrega já finalizada');
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({ data: new Date().toISOString(), descricao: 'entrega cancelada' });
    return entrega;
  }

  obterHistorico(id) {
    return this.obterOuFalhar(id).historico;
  }
}
