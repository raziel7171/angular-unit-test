import { FormControl, FormGroup } from "@angular/forms";
import { MyValidators } from "./validators";
import { UserService } from "../services/user.service";
import { mockObservable } from "src/testing";

describe('Test for MyValidators', () => {

    describe('test for validPassword', () => {
        it('should return null when password is valid', () => {
            //Arrange
            const control = new FormControl();
            control.setValue('asd12345');
            //Act
            const rta = MyValidators.validPassword(control);
            //Assert
            expect(rta).toBeNull();
        });

        it('should return { invalid_password: true } when password is NOT valid', () => {
            //Arrange
            const control = new FormControl();
            control.setValue('asdasdasd');
            //Act
            const rta = MyValidators.validPassword(control);
            //Assert
            expect(rta?.invalid_password).toBeTrue();
        });
    });

    describe('test for matchPassword', () => {
        it('should return null when matchPassword are equals', () => {
            //Arrange
            const group = new FormGroup({
                password: new FormControl('asd123123'),
                confirmPassword: new FormControl('asd123123'),
            })
            //Act
            const rta = MyValidators.matchPasswords(group);
            //Assert
            expect(rta).toBeNull();
        });

        it('should return { match_password: true } when matchPassword arent equals', () => {
            //Arrange
            const group = new FormGroup({
                password: new FormControl('asd123123'),
                confirmPassword: new FormControl('asd123'),
            })
            //Act
            const rta = MyValidators.matchPasswords(group);
            //Assert
            expect(rta?.match_password).toBeTrue();
        });

        it('should return Error when one or both password parameters are missing', () => {
            //Arrange
            const group = new FormGroup({
                password: new FormControl('asd123123'),
                //DO NOT UNCOMMENT confirmPassword: new FormControl('asd123'),
            })
            //Act
            //Se engloba la funcion en una funcion flecha para ser comparada directamente
            const fn = () => {
                MyValidators.matchPasswords(group)
            };
            //Assert
            expect(fn).toThrow(new Error('matchPasswords: fields not found in formGroup parameter'));
        });
    });

    describe('test for validateEmailAsync', () => {
        it('should return null if the email doesnt exist', (doneFn) => {
            //Arrange
            const mockUserService: jasmine.SpyObj<UserService> = jasmine.createSpyObj(UserService, ['isAvailableByEmail']);
            mockUserService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: true }));
            //Act
            const control = new FormControl('coso@coso.com');
            const validator = MyValidators.validateEmailAsync(mockUserService); //validateEmailAsync retorna una funcion pero igual necesita control como parametro para el servicio
            //se le injecta el form control con el email para el servicio de la siguiente sección del código
            validator(control).subscribe((rta) => {
                //Assert
                expect(rta).toBeNull();
                doneFn();
            });
        })
        it('should return { not_available=true } if the email already exist', (doneFn) => {
            //Arrange
            const mockUserService: jasmine.SpyObj<UserService> = jasmine.createSpyObj(UserService, ['isAvailableByEmail']);
            mockUserService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: false }));
            //Act
            const control = new FormControl('coso@coso.com');
            const validator = MyValidators.validateEmailAsync(mockUserService);
            validator(control).subscribe((rta) => {
                //Assert
                expect(rta?.not_available).toBeTrue();
                doneFn();
            });
        })
    });
});