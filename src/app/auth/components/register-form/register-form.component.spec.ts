import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { asyncData, asyncError, clickToElement, getTextByTestId, mockObservable, query, setInputChecker, setInputValue } from 'src/testing';
import { generateOneUser } from 'src/app/models/user.mock';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['create', 'isAvailableByEmail']);
    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: true }));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should nameField be invalid', () => {
    component.nameField?.setValue('');
    expect(component.nameField?.invalid).withContext('empty name').toBeTruthy();
  });

  it('should emailField be invalid', () => {
    component.emailField?.setValue('este no es un correo');
    expect(component.emailField?.invalid).withContext('not an email').toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid).withContext('empty email').toBeTruthy();
  });

  it('should passwordField be invalid', () => {
    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('password under six characters').toBeTruthy();

    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty password').toBeTruthy();

    component.passwordField?.setValue('asdasdasd');
    expect(component.passwordField?.invalid).withContext('password has no numbers').toBeTruthy();
  });

  it('should confirmPasswordField be invalid', () => {
    component.confirmPasswordField?.setValue('');
    expect(component.confirmPasswordField?.invalid).withContext('empty confirmPasswordField').toBeTruthy();

    component.confirmPasswordField?.setValue('12345');
    expect(component.confirmPasswordField?.invalid).withContext('confirmPassword under six characters').toBeTruthy();

    component.confirmPasswordField?.setValue('asdasdasd');
    expect(component.confirmPasswordField?.invalid).withContext('confirmPassword has no numbers').toBeTruthy();

    //patch value es la forma correcta para llenar un formulario reactivo
    component.form.patchValue({
      name: 'Bruce',
      email: 'banner@gamma.com',
      password: 'asdasd123', //note the passwords aren't matching
      confirmPassword: 'asdasd12',
      checkTerms: true,
    })
    expect(component.passwordField?.value != component.confirmPasswordField?.value).withContext(`should be diff: ${component.passwordField?.value} != ${component.confirmPasswordField?.value}`).toBeTrue();
    expect(component.form.invalid).withContext('confirmPasswordField doesnt match passwordField').toBeTruthy();
  });

  it('should the form be invalid because of CheckTerms', () => {
    //patch value es la forma correcta para llenar un formulario reactivo
    component.form.patchValue({
      name: 'Bruce',
      email: 'banner@gamma.com',
      password: 'asd12345',
      confirmPassword: 'asd12345',
      checkTerms: false,
    })
    expect(component.form.invalid).toBeTruthy();
  });

  it('should emailField be invalid from UI', () => {
    const inputElement: HTMLInputElement = query(fixture, 'input#email').nativeElement;

    inputElement.value = 'este no es un correo';
    inputElement.dispatchEvent(new Event('input')); //es necesario conservar el input para digitar el valor
    inputElement.dispatchEvent(new Event('blur')); //blur es el evento cuando se clickea o se quita el focus del input o el elemento
    fixture.detectChanges();
    expect(component.emailField?.invalid).withContext('not an email').toBeTruthy();
    expect(getTextByTestId(fixture, 'emailFormat-Error')).toContain("*It's not a email");

    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.emailField?.invalid).withContext('empty email').toBeTruthy();
    expect(getTextByTestId(fixture, 'emailRequired-Error')).toContain('*Required');
  });

  it('should emailField be invalid if already exist from UI', fakeAsync(() => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({ isAvailable: false }));
    setInputValue(fixture, 'input#email', 'correo@correo.com');
    tick();
    fixture.detectChanges();
    expect(component.emailField?.invalid).withContext('email must already exist').toBeTruthy();
    expect(userService.isAvailableByEmail).toHaveBeenCalledWith('correo@correo.com');
    expect(getTextByTestId(fixture, 'emailNotAvailable-Error')).toContain('*This email is already in use');
  }));

  it('should nameField be invalid from UI', () => {
    setInputValue(fixture, 'input#name', ''); //shortened the input and blur events from the test
    fixture.detectChanges();
    expect(component.nameField?.invalid).withContext('empty name').toBeTruthy();
    expect(getTextByTestId(fixture, 'nameRequired-Error')).toContain('*Required');
  });

  it('should passwordField be invalid from UI', () => {
    setInputValue(fixture, 'input#password', '12345');
    fixture.detectChanges();
    expect(component.passwordField?.invalid).withContext('password under six characters').toBeTruthy();
    expect(getTextByTestId(fixture, 'passwordMinlength-Error')).toContain('*Should be greater 6');

    setInputValue(fixture, 'input#password', '');
    fixture.detectChanges();
    expect(component.passwordField?.invalid).withContext('empty password').toBeTruthy();
    expect(getTextByTestId(fixture, 'passwordRequired-Error')).toContain('*Required');

    setInputValue(fixture, 'input#password', 'asdasdasd');
    fixture.detectChanges();
    expect(component.passwordField?.invalid).withContext('password has no numbers').toBeTruthy();
    expect(getTextByTestId(fixture, 'passwordInvalid_password-Error')).toContain('*Should contain numbers');
  });

  it('should confirmPasswordField be invalid from UI', () => {
    setInputValue(fixture, 'input#confirmPassword', '');
    fixture.detectChanges();
    expect(component.confirmPasswordField?.invalid).withContext('empty confirmPasswordField').toBeTruthy();
    expect(getTextByTestId(fixture, 'confirmPasswordRequired-Error')).toContain('*Required');

    setInputValue(fixture, 'input#password', 'asdasd123');
    setInputValue(fixture, 'input#confirmPassword', 'asdasd12');
    fixture.detectChanges();
    expect(component.passwordField?.value != component.confirmPasswordField?.value).withContext(`should be diff: ${component.passwordField?.value} != ${component.confirmPasswordField?.value}`).toBeTrue();
    expect(component.form.invalid).withContext('confirmPasswordField doesnt match passwordField').toBeTruthy();
    expect(getTextByTestId(fixture, 'confirmPasswordMatch_password-Error')).toContain('*Not matching');
  });

  it('should the form be invalid because of CheckTerms from UI', () => {
    component.form.patchValue({
      name: 'Bruce',
      email: 'banner@gamma.com',
      password: 'asd12345',
      confirmPassword: 'asd12345',
    })

    let inputElement: HTMLInputElement = query(fixture, 'input#terms').nativeElement;
    inputElement.checked = false;
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.checkTermsField?.invalid).withContext('terms is invalid because of unchecked').toBeTruthy();
    expect(inputElement.checked).withContext('element checkbox is false').toBeFalse();
    expect(component.form.invalid).withContext('form is invalid because of unchecked terms').toBeTrue();
  });

  it('should send the form successfully', () => {
    //Arrange
    component.form.patchValue({
      name: 'Bruce',
      email: 'banner@gamma.com',
      password: 'asd12345',
      confirmPassword: 'asd12345',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(mockObservable(mockUser));

    //Act
    component.register(new Event('submit'));
    //Assert
    expect(component.form.valid).withContext('form must be valid').toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  });

  it('should send the form successfully and change the status init=> loading => success', fakeAsync(() => {
    //Arrange
    expect(component.status).toEqual('init');
    component.form.patchValue({
      name: 'Bruce',
      email: 'banner@gamma.com',
      password: 'asd12345',
      confirmPassword: 'asd12345',
      checkTerms: true,
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));

    //Act
    component.register(new Event('submit'));
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    //Assert
    expect(component.status).toEqual('success');
    expect(component.form.valid).withContext('form must be valid').toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should send the form successfully from UI', fakeAsync(() => {
    //Arrange
    expect(component.status).toEqual('init');
    const mockUser = generateOneUser();
    setInputValue(fixture, 'input#name', mockUser.name);
    setInputValue(fixture, 'input#email', mockUser.email);
    setInputValue(fixture, 'input#password', mockUser.password);
    setInputValue(fixture, 'input#confirmPassword', mockUser.password);
    setInputChecker(fixture, 'input#terms', true);

    userService.create.and.returnValue(asyncData(mockUser));
    //Act
    // clickToElement(fixture, 'register-button', true);
    query(fixture, 'form').triggerEventHandler('ngSubmit', new Event('submit')); //we can click on the submit button or act on the form and trigger the submit event like when we hit enter
    fixture.detectChanges();
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    //Assert
    expect(component.status).toEqual('success');
    expect(component.form.valid).withContext('form must be valid').toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should show all form inputs invalid and show that are empty and are required', () => {
    //Act
    clickToElement(fixture, 'register-button', true);
    fixture.detectChanges();
    //Assert
    expect(getTextByTestId(fixture, 'nameRequired-Error')).toContain('*Required');
    expect(getTextByTestId(fixture, 'emailRequired-Error')).toContain('*Required');
    expect(getTextByTestId(fixture, 'passwordRequired-Error')).toContain('*Required');
    expect(getTextByTestId(fixture, 'confirmPasswordRequired-Error')).toContain('*Required');
    expect(query(fixture, 'input#terms').nativeElement.checked).withContext('element checkbox is false').toBeFalse();
    expect(component.form.invalid).withContext('form is invalid because of unchecked terms').toBeTrue();
  });

  it('should fail on the create Observable after a succesfull form init=>loading=>error', fakeAsync(() => {
    //Arrange
    expect(component.status).toEqual('init');
    const mockUser = generateOneUser();
    setInputValue(fixture, 'input#name', mockUser.name);
    setInputValue(fixture, 'input#email', mockUser.email);
    setInputValue(fixture, 'input#password', mockUser.password);
    setInputValue(fixture, 'input#confirmPassword', mockUser.password);
    setInputChecker(fixture, 'input#terms', true);

    const mockError = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });

    userService.create.and.returnValue(asyncError(mockError));
    //Act
    query(fixture, 'form').triggerEventHandler('ngSubmit', new Event('submit'));
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    //Assert
    expect(component.status).toEqual('error');
    expect(component.form.valid).withContext('form must be valid').toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
    expect(component.register).toThrowError();
  }));

});
