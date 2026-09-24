export class EntregaRepository {
  constructor(memoria) {
    this.memoria = memoria;
  }

  salvar(dados) {
    const id = this.memoria.proximoId++;
    const entrega = { id, ...dados };
    this.memoria.registros.set(id, entrega);
    return entrega;
  }

  todas() {
    return [...this.memoria.registros.values()];
  }

  porId(id) {
    return this.memoria.registros.get(id);
  }

  encontrarAtiva(descricao, origem, destino) {
    return this.todas().find(
      (entrega) =>
        entrega.descricao === descricao &&
        entrega.origem === origem &&
        entrega.destino === destino &&
        entrega.status !== 'ENTREGUE' &&
        entrega.status !== 'CANCELADA',
    );
  }
}
