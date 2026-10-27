import { Test, TestingModule } from '@nestjs/testing';
import { ZapatosController } from './zapatos.controller';
import { ZapatosService } from './zapatos.service';

describe('ZapatosController', () => {
  let controller: ZapatosController;
  const zapatosServiceMock = {
    crear: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZapatosController],
      providers: [
        {
          provide: ZapatosService,
          useValue: zapatosServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ZapatosController>(ZapatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
