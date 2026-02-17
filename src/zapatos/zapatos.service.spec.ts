import { Test, TestingModule } from '@nestjs/testing';
import { ZapatosService } from './zapatos.service';

describe('ZapatosService', () => {
  let service: ZapatosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZapatosService],
    }).compile();

    service = module.get<ZapatosService>(ZapatosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
