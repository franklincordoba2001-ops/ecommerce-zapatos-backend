import { Test, TestingModule } from '@nestjs/testing';
import { ZapatosController } from './zapatos.controller';

describe('ZapatosController', () => {
  let controller: ZapatosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZapatosController],
    }).compile();

    controller = module.get<ZapatosController>(ZapatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
