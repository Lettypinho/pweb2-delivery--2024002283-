export class Database {
  constructor() {
    this.entregas = new Map();
    this.motoristas = new Map();

    this.proximoEntregaId = 1;
    this.proximoMotoristaId = 1;
  }
}