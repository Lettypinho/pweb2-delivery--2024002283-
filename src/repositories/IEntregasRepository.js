/**
 * Contrato do Repository de Entregas.
 *
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: {status?: string, motoristaId?: number}) => Object[]} listarTodos
 * @property {(id: number) => Object|null} buscarPorId
 * @property {(dados: Object) => Object} criar
 * @property {(id: number, dados: Object) => Object|null} atualizar
 */

export {};