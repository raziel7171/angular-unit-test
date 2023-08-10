import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProductService } from './product.service';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClientTestingModule,
        ProductService,
        TokenService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
      ]
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('test for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(5);
      //con spyOn solo se crea el spy para ver una función en específico en este caso getToken
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // Act
      productService.getAllSimple().subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products`;
      const request = httpController.expectOne(url);
      const headers = request.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      request.flush(mockData);
    });
  });


  describe('test for getAll', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(5);
      // Act
      productService.getAll().subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products`;
      const request = httpController.expectOne(url);
      request.flush(mockData);
    });

    it('should return a product list with included taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 50, // 50 * .19 = 9.5
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -50, // -50 * .19 = 0
        },
      ];
      // Act
      productService.getAll().subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(9.5);
        expect(data[3].taxes).toEqual(0);
        expect(data[4].taxes).toEqual(0);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products`;
      const request = httpController.expectOne(url);
      request.flush(mockData);
    });

    it('should send query params', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      // Act
      productService.getAll(limit, offset).subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products?limit=${limit}&offset=${offset}`;
      const request = httpController.expectOne(url);
      request.flush(mockData);
      const params = request.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    })
  });

  describe('test for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      //data transfer object it's a partial object to be easier to carry on typed language like typescript, in this example we have updateDTO and createDTO in the backend you don't know or need the id of the user that's about to be created
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'descripcion',
        categoryId: 12
      }
      // Act
      productService.create({ ...dto }).subscribe(data => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products`;
      const request = httpController.expectOne(url);
      request.flush(mockData);
      expect(request.request.body).toEqual(dto);
      expect(request.request.method).toEqual('POST');
    })
  });

  describe('test for update', () => {
    it('should return the updated product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      //data transfer object it's a partial object to be easier to carry on typed language like typescript, in this example we have updateDTO and createDTO in the backend you don't know or need the id of the user that's about to be created
      const id = '1';
      const dto: UpdateProductDTO = {
        title: 'updated product',
        price: 150,
      }
      // Act
      productService.update(id, { ...dto }).subscribe(data => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products/${id}`;
      const request = httpController.expectOne(url);
      request.flush(mockData);
      expect(request.request.body).toEqual(dto);
      expect(request.request.method).toEqual('PUT');
    })
  });

  describe('test for delete', () => {
    it('should return true if the product is deleted', (doneFn) => {
      // Arrange
      const mockData = true;
      //data transfer object it's a partial object to be easier to carry on typed language like typescript, in this example we have updateDTO and createDTO in the backend you don't know or need the id of the user that's about to be created
      const id = '1';
      // Act
      productService.delete(id).subscribe(data => {
        // Assert
        expect(data).toBeTruthy();
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products/${id}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('DELETE');
      request.flush(mockData);
    })
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const productId = '1';
      // Act
      productService.getOne(productId).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/products/${productId}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('GET');
      request.flush(mockData);
    });

    it('should return the right message when the error status code is 404', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        // status: HttpStatusCode.NotFound either one it's correct
        status: 404,
        statusText: msgError
      };
      // Act
      productService.getOne(productId).subscribe(
        (data) => {
          //correct path we ain't testing this
          doneFn();
        },
        (error) => {
          // Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        });

      // httpConfig
      const url = `${environment.API_URL}/api/products/${productId}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('GET');
      request.flush(msgError, mockError);
    });

    it('should return the right message when the error status code is 409', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      });
      // httpConfig
      const url = `${environment.API_URL}/api/products/${productId}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('GET');
      request.flush(msgError, mockError);
    });

    it('should return the right message when the error status code is 401', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('No estas permitido');
          doneFn();
        }
      });
      // httpConfig
      const url = `${environment.API_URL}/api/products/${productId}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('GET');
      request.flush(msgError, mockError);
    });

    it('should return the right message when the error status is not catch within the if statement', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '502 message';
      const mockError = {
        status: HttpStatusCode.BadGateway,
        statusText: msgError
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        }
      });
      // httpConfig
      const url = `${environment.API_URL}/api/products/${productId}`;
      const request = httpController.expectOne(url);
      expect(request.request.method).toEqual('GET');
      request.flush(msgError, mockError);
    });
  });

});
