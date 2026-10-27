import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ZapatosService } from './zapatos.service';

describe('ZapatosService', () => {
  let service: ZapatosService;
  const prismaMock = {
    categoria: {
      findUnique: jest.fn(),
    },
    stockTalla: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    zapato: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(prismaMock)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZapatosService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ZapatosService>(ZapatosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
