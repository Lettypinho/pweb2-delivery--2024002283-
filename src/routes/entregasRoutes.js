import { Router } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database.js';
import { PrismaEntregaRepository } from '../repositories/PrismaEntregaRepository.js';
import { PrismaMotoristaRepository } from '../repositories/PrismaMotoristaRepository.js';
import { EntregaService } from '../services/EntregaService.js';
import { MotoristaService } from '../services/MotoristaService.js';
import { EntregaController } from '../controllers/EntregaController.js';
import { MotoristaController } from '../controllers/MotoristaController.js';

export function montarRotasDeEntregas() {
  const entregaRepository = new PrismaEntregaRepository(prisma);
  const motoristaRepository = new PrismaMotoristaRepository(prisma);

  const entregaService = new EntregaService(
    entregaRepository,
    motoristaRepository,
  );

  const motoristaService = new MotoristaService(
    motoristaRepository,
    entregaRepository,
  );

  const entregaController = new EntregaController(
    entregaService,
    motoristaService,
  );

  const motoristaController = new MotoristaController(
    motoristaService,
  );

  const router = Router();

  router.get(
    '/entregas',
    entregaController.listar.bind(entregaController),
  );

  router.get(
    '/entregas/nova',
    entregaController.nova.bind(entregaController),
  );

  router.post(
    '/entregas',
    [
      body('descricao')
        .trim()
        .notEmpty()
        .withMessage('Informe a descrição.'),

      body('origem')
        .trim()
        .notEmpty()
        .withMessage('Informe a origem.'),

      body('destino')
        .trim()
        .notEmpty()
        .withMessage('Informe o destino.'),
    ],
    entregaController.registrar.bind(entregaController),
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
    [
      body('motoristaId')
        .notEmpty()
        .withMessage('Selecione um motorista.')
        .isInt({ min: 1 })
        .withMessage('Motorista inválido.'),
    ],
    entregaController.atribuirMotorista.bind(entregaController),
  );

  router.get(
    '/motoristas',
    motoristaController.listar.bind(motoristaController),
  );

  router.get(
    '/motoristas/novo',
    motoristaController.novo.bind(motoristaController),
  );

  router.post(
    '/motoristas',
    [
      body('nome')
        .trim()
        .notEmpty()
        .withMessage('Informe o nome.'),

      body('cpf')
        .trim()
        .notEmpty()
        .withMessage('Informe o CPF.'),
    ],
    motoristaController.cadastrar.bind(motoristaController),
  );

  router.use((erro, req, res, next) => {
    if (erro.status === 404) {
      return res.status(404).render('erro', {
        titulo: 'Não encontrado',
        status: 404,
        mensagem: erro.message,
      });
    }

    if (erro.status && erro.status < 500) {
      req.flash('erro', erro.message);

      return res.redirect(
        req.get('referer') || '/entregas',
      );
    }

    console.error(erro);

    return res.status(500).render('erro', {
      titulo: 'Erro interno',
      status: 500,
      mensagem: 'Ocorreu um erro interno no servidor.',
    });
  });

  return router;
}