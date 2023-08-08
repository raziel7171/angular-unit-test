import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

// inyeccion de dependencias
describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    //getvalue it's in an array because can be many functions to be spyed on
    const spyService = jasmine.createSpyObj('ValueService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spyService }
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should return "my value" from the real service', () => {
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);
    expect(masterService.getValue()).toBe('my value');
  });

  // La responsabilidad es ejecutar el getValue del valueService desde Master pero no comprobar el contenido de este

  it('should return "other value" from the fake object', () => {
    const fakeObject = { getValue: () => 'fake from object' }
    const masterService = new MasterService(fakeObject as ValueService);
    //tambien podemos definirlo como un servicio Fake aparte, dependiendo de la necesidad 
    //y la complejidad de la función inyectada escoge tu veneno
    //recuerda llama el getValue de master que en si llama el getValue de la dependencia inyectada
    expect(masterService.getValue()).toBe('fake from object');
  });

  it('should call getValue from ValueService as a spy and return "fake value"', () => {
    //se define un spy para valga la redundancia espiar vigilar que se llamen funciones de un servicio
    //este está en un arreglo por que se puede envíar a zonear varios al mismo tiempo
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');
    const masterService = new MasterService(valueServiceSpy);
    expect(masterService.getValue()).toBe('fake value'); //si se cambiace el método de masterService quemando el retorno como "fake value" esta prueba retornaría correcta como un falso positivo
    expect(valueServiceSpy.getValue).toHaveBeenCalled(); //y esta desmentiría que se llamó el método interno por eso es efectivo el spy
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });

});
