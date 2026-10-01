import { Router } from 'express';
import { Database } from '../database/Database.js';;
import { EntregaRepository } from '../repositories/EntregaRepository.js';
import { EntregaService } from '../services/EntregaService.js';
import { EntregaController } from '../controllers/EntregaController.js';

export function montarRotasDeEntregas() {
  const database = new Database();
  const repository = new EntregaRepository(database);
  const service = new EntregaService(repository);
  const controller = new EntregaController(service);

  const router = Router();

  router.post('/entregas', controller.registrar.bind(controller));
  router.get('/entregas', controller.listar.bind(controller));
  router.get('/entregas/:id/historico', controller.historico.bind(controller));
  router.get('/entregas/:id', controller.obterPorId.bind(controller));
  router.patch('/entregas/:id/avancar', controller.avancar.bind(controller));
  router.patch('/entregas/:id/cancelar', controller.cancelar.bind(controller));

  router.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message || 'erro interno no servidor' });
  });

  return router;
}
