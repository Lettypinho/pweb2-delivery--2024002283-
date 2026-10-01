export class EntregaRepository {
  constructor(database) {
    this.database = database;
  }

  salvar(dados) {
  const id = this.database.proximoEntregaId++;
  const entrega = { id, ...dados };

  this.database.entregas.set(id, entrega);

  return entrega;
}

  todas() {
    return [...this.database.entregas.values()];
  }

  porId(id) {
    return this.database.entregas.get(id) || null;
  }

  encontrarAtiva(descricao, origem, destino) {
    return (
      this.todas().find(
        (entrega) =>
          entrega.descricao === descricao &&
          entrega.origem === origem &&
          entrega.destino === destino &&
          entrega.status !== 'ENTREGUE' &&
          entrega.status !== 'CANCELADA',
      ) || null
    );
  }
}