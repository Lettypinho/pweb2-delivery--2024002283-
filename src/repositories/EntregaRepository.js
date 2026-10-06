export class EntregaRepository {
  constructor(database) {
    this.database = database;
  }

  criar(dados) {
    const id = this.database.proximoEntregaId++;
    const entrega = { id, ...dados };

    this.database.entregas.set(id, entrega);

    return entrega;
  }

  listarTodos() {
    return [...this.database.entregas.values()];
  }

  buscarPorId(id) {
    return this.database.entregas.get(id) || null;
  }

  atualizar(id, dados) {
    const entrega = this.buscarPorId(id);

    if (!entrega) {
      return null;
    }

    Object.assign(entrega, dados);

    return entrega;
  }

  encontrarAtiva(descricao, origem, destino) {
    return (
      this.listarTodos().find(
        (entrega) =>
          entrega.descricao === descricao &&
          entrega.origem === origem &&
          entrega.destino === destino &&
          entrega.status !== 'ENTREGUE' &&
          entrega.status !== 'CANCELADA',
      ) || null
    );
  }

  // Métodos mantidos temporariamente para compatibilidade
  // com o código da Atividade 05.
  salvar(dados) {
    return this.criar(dados);
  }

  todas() {
    return this.listarTodos();
  }

  porId(id) {
    return this.buscarPorId(id);
  }
}