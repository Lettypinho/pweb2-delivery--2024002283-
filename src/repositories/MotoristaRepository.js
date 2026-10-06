export class MotoristaRepository {
  constructor(database) {
    this.database = database;
  }

  listarTodos() {
    return [...this.database.motoristas.values()];
  }

  buscarPorId(id) {
    return this.database.motoristas.get(id) || null;
  }

  buscarPorCpf(cpf) {
    return (
      this.listarTodos().find(
        (motorista) => motorista.cpf === cpf,
      ) || null
    );
  }

  criar(dados) {
    const id = this.database.proximoMotoristaId++;

    const motorista = {
      id,
      ...dados,
    };

    this.database.motoristas.set(id, motorista);

    return motorista;
  }
}