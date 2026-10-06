import { Router } from 'express';
import { Database } from '../database/Database.js';
import { EntregaRepository } from '../repositories/EntregaRepository.js';
import { MotoristaRepository } from '../repositories/MotoristaRepository.js';
import { EntregaService } from '../services/EntregaService.js';
import { MotoristaService } from '../services/MotoristaService.js';
import { EntregaController } from '../controllers/EntregaController.js';
import { MotoristaController } from '../controllers/MotoristaController.js';

export function montarRotasDeEntregas() {
  const database = new Database();

  const entregaRepository = new EntregaRepository(database);
  const motoristaRepository = new MotoristaRepository(database);

  const entregaService = new EntregaService(
    entregaRepository,
    motoristaRepository,
  );

  const motoristaService = new MotoristaService(
    motoristaRepository,
    entregaRepository,
  );

  const entregaController = new EntregaController(entregaService);
  const motoristaController = new MotoristaController(motoristaService);

  const router = Router();

  router.post(
    '/entregas',
    entregaController.registrar.bind(entregaController),
  );

  router.get(
    '/entregas',
    entregaController.listar.bind(entregaController),
  );

  router.get(
    '/entregas/:id/historico',
    entregaController.historico.bind(entregaController),
  );

  router.get(
    '/entregas/:id',
    entregaController.obterPorId.bind(entregaController),
  );

  router.patch(
    '/entregas/:id/avancar',
    entregaController.avancar.bind(entregaController),
  );

  router.patch(
    '/entregas/:id/cancelar',
    entregaController.cancelar.bind(entregaController),
  );

  router.patch(
    '/entregas/:id/atribuir',
    entregaController.atribuirMotorista.bind(entregaController),
  );

  router.post(
    '/motoristas',
    motoristaController.cadastrar.bind(motoristaController),
  );

  router.get(
    '/motoristas',
    motoristaController.listar.bind(motoristaController),
  );

  router.get(
    '/motoristas/:id/entregas',
    motoristaController.listarEntregas.bind(motoristaController),
  );

  router.get(
    '/motoristas/:id',
    motoristaController.obterPorId.bind(motoristaController),
  );

  router.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({
      erro: erro.message || 'erro interno no servidor',
    });
  });

  return router;
}