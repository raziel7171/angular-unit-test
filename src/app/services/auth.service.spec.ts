import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return a token', (doneFn) => {
      // Arrange
      const mockData: Auth = { access_token: 'Token1212' };
      const email = 'test@mail.com';
      const password = '123456';
      // Act
      authService.login(email, password).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/auth/login`;
      const request = httpController.expectOne(url);
      expect(request.request.body).toEqual({ email, password });
      expect(request.request.method).toEqual('POST');
      request.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      // Arrange
      const mockData: Auth = { access_token: 'Token1212' };
      const email = 'test@mail.com';
      const password = '123456';
      spyOn(tokenService, 'saveToken').and.callThrough();
      // Act
      authService.login(email, password).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith('Token1212');
        doneFn();
      });

      // httpConfig
      const url = `${environment.API_URL}/api/auth/login`;
      const request = httpController.expectOne(url);
      expect(request.request.body).toEqual({ email, password });
      expect(request.request.method).toEqual('POST');
      request.flush(mockData);
    });
  });


});
