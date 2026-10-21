function formatarEntrega(entrega) {
  if (!entrega) {
    return null;
  }

  const { historico, ...dados } = entrega;

  return {
    ...dados,
    historico: historico.map((evento) => ({
      data: evento.data.toISOString(),
      descricao: evento.descricao,
    })),
  };
}

export class PrismaEntregaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async criar(dados) {
    const { historico = [], ...dadosEntrega } = dados;

    const entrega = await this.prisma.entrega.create({
      data: {
        ...dadosEntrega,
        historico: {
          create: historico,
        },
      },
      include: {
        historico: {
          orderBy: { id: 'asc' },
        },
      },
    });

    return formatarEntrega(entrega);
  }

  async listarTodos(filtros = {}) {
    const where = {};

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.motoristaId !== undefined) {
      where.motoristaId = filtros.motoristaId;
    }

    const entregas = await this.prisma.entrega.findMany({
      where,
      include: {
        historico: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return entregas.map(formatarEntrega);
  }

  async buscarPorId(id) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id },
      include: {
        historico: {
          orderBy: { id: 'asc' },
        },
      },
    });

    return formatarEntrega(entrega);
  }

  async atualizar(id, dados) {
    const { historico, ...dadosEntrega } = dados;

    const data = {
      ...dadosEntrega,
    };

    if (historico) {
      data.historico = {
        deleteMany: {},
        create: historico,
      };
    }

    const entrega = await this.prisma.entrega.update({
      where: { id },
      data,
      include: {
        historico: {
          orderBy: { id: 'asc' },
        },
      },
    });

    return formatarEntrega(entrega);
  }

  async encontrarAtiva(descricao, origem, destino) {
    const entrega = await this.prisma.entrega.findFirst({
      where: {
        descricao,
        origem,
        destino,
        status: {
          notIn: ['ENTREGUE', 'CANCELADA'],
        },
      },
      include: {
        historico: {
          orderBy: { id: 'asc' },
        },
      },
    });

    return formatarEntrega(entrega);
  }

  async salvar(dados) {
    return this.criar(dados);
  }

  async todas() {
    return this.listarTodos();
  }

  async porId(id) {
    return this.buscarPorId(id);
  }
}