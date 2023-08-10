import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';
import { ProductService } from 'src/app/services/product.service';
import { ValueService } from 'src/app/services/value.service';
import { generateManyProducts } from 'src/app/models/product.mock';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ProductComponent } from '../product/product.component';
import { asyncData, asyncError, mockObservable } from 'src/testing';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getPromiseValue']);
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ValueService, useValue: valueServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>; //lo va a reemplazar pero igual se necesita inicializar
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;

    //si deseo delegar la creación de los mocks en cada prueba, muevo (o copio para reemplazar) el código de abajo para cada prueba
    const productsMock = generateManyProducts(5);
    productService.getAll.and.returnValues(mockObservable(productsMock));
    fixture.detectChanges(); //ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('test for getAllProducts', () => {

    it('should return product list from service', () => {
      //Arrange
      const productsMock = generateManyProducts(20);
      const currentProductsCount = component.products.length + productsMock.length;
      productService.getAll.and.returnValue(mockObservable(productsMock));
      //Act
      //a good practice is not to call the method directly but if this is set to be called with a button it should be tested by triggering the click event in the test
      // component.getAllProducts();
      fixture.debugElement.query(By.css('.btn-getAllProducts')).triggerEventHandler('click');
      fixture.detectChanges();
      //Assert
      //we are concatenating the first 5 products of the beforeEach plus the 20 of this test
      expect(component.products.length).toEqual(currentProductsCount);
    });

    it('should change the status "loading" => "success" mid process of the function', fakeAsync(() => {
      //Arrange
      const productsMock = generateManyProducts(20);
      //of nos retorna un observable pero necesitamos retornar el observable con demora para checkear el estado en mitad del proceso de la funcion se usa DEFER
      productService.getAll.and.returnValue(asyncData(productsMock));
      //Act
      //debemos implementar FakeAsync para controlar los pasos de este
      // component.getAllProducts();
      fixture.debugElement.query(By.css('.btn-getAllProducts')).triggerEventHandler('click');
      fixture.detectChanges();

      //Assert            
      expect(component.status).toEqual('loading');
      //para cada FakeAsync debe de tener un tick para avanzar en él
      tick(); //ejecuta los procesos pendientes: exec, obs, setTimeout, promise
      fixture.detectChanges();
      expect(component.status).toEqual('success');
      expect(productService.getAll).toHaveBeenCalled();

    }));

    it('should change the status "loading" => "error" mid process of the function and the error status', fakeAsync(() => {
      //Arrange
      const mockError = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });
      //resolve resuelve la solicitud pero en este caso necesitamos lanzar un error, lo hacemos con REJECT
      productService.getAll.and.returnValue(asyncError(mockError));
      //Act
      //a good practice is not to call the method directly but if this is set to be called with a button it should be tested by triggering the click event in the test
      // component.getAllProducts();
      fixture.debugElement.query(By.css('.btn-getAllProducts')).triggerEventHandler('click');
      fixture.detectChanges();

      //Assert            
      expect(component.status).toEqual('loading');
      //por el setTimeOut tenemos que forzarle el tiempo que ejecutara el tick, recuerda no usar setTimeOut
      tick(4000);
      fixture.detectChanges();
      expect(component.status).toEqual('error');
      expect(component.getAllProducts).toThrowError();

    }));
  });

  describe('test for callPromise', () => {
    it('should call for a promise', async () => {
      //Arrange
      const mockMessage = 'mock promise';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMessage)); //force a promise to be returned
      //Act
      await component.callPromise();
      fixture.detectChanges();
      //Assert
      expect(component.rta).toEqual(mockMessage);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "mock promise" into <p> when the button with the function is clicked', fakeAsync(() => {
      //Arrange
      const mockMessage = 'mock promise';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMessage));
      const btnDebug = fixture.debugElement.query(By.css('.btn-promise'));
      //Act
      btnDebug.triggerEventHandler('click');
      tick();
      fixture.detectChanges();
      const pElement = fixture.debugElement.query(By.css('.rta-promise')).nativeElement;
      //Assert
      expect(pElement.textContent).toEqual(mockMessage);
    }));
  });
});
