import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonComponent } from './person.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;
  //fixture es un ambiente para interactuar con el ambiente

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent]
    })
      .compileComponents();
    //compile components es asincrono intenta lanzar el componente

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    component.person = new Person('Jhon', 'Doe', 28, 80, 1.75);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Jhon" and all the other properties should match', () => {
    expect(component.person.name).toEqual('Jhon');
    expect(component.person.lastName).toEqual('Doe');
    expect(component.person.age).toEqual(28);
    expect(component.person.weight).toEqual(80);
    expect(component.person.height).toEqual(1.75);
    //en este caso no se necesita fixture.detectChanges(); ya que no estamos trayendo los datos desde el render si no desde la lógica del componente
  });

  it('should have <p> with text "parrafo"', () => {
    //native element es el elemento renderizado
    //debug element permite tomar elementos no desde la vista renderizada si no desde la lógica esto para ambientes
    //primero back y luego front o aquellos que no renderizan en un navegador convencional
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;
    //se puede lograr lo mismo con query al elemento pero de esta forma está más separado por así decir más agnostico
    //a la existencia del elemento y no depende de él totalmente
    expect(pElement?.textContent).toContain(component.person.height);
  });

  it('should have <h3> with text "Hola, {person.name}"', () => {
    //Arrange
    component.person = new Person('Jhonathan', 'Joestar', 30, 90, 1.85);
    const expectedMsg = `Hi ${component.person.name}`;
    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.queryAll(By.css('h3'))[1];
    //para acceder a un h3 en especifico estos se almacenan en una cola con queryAll y accedo al segundo con [1]
    const h3Element: HTMLElement = h3Debug.nativeElement;
    //Act
    //con esto le decimos al ambiente que revise los cambios hechos en este momento la nueva instancia de person en component
    fixture.detectChanges();
    //Assert
    expect(h3Element?.textContent).toEqual(expectedMsg);
  });

  it('should display a text with the calculated IMC when the button is clicked', () => {
    //Arrange
    const expectedMsg = 'overweight level 2';
    component.person = new Person('Joseph', 'Joestar', 30, 100, 1.75);
    const personDebug: DebugElement = fixture.debugElement;
    const buttonDebug: DebugElement = personDebug.query(By.css('button.btn-imc'));
    const buttonElement: HTMLElement = buttonDebug.nativeElement
    //Act
    component.calcIMC();
    fixture.detectChanges();
    //Assert
    expect(buttonElement?.textContent).toContain(expectedMsg);
  });

  it('should display a text with the calculated IMC when the button is clicked2', () => {
    //Arrange
    const expectedMsg = 'overweight level 3';
    component.person = new Person('Joseph', 'Joestar', 30, 150, 1.75);
    const personDebug: DebugElement = fixture.debugElement;
    const buttonDebug: DebugElement = personDebug.query(By.css('button.btn-imc'));
    const buttonElement: HTMLElement = buttonDebug.nativeElement
    //Act
    buttonDebug.triggerEventHandler('click', null);
    //trigger the click event unto the button debug element
    fixture.detectChanges();
    //Assert
    expect(buttonElement?.textContent).toContain(expectedMsg);
  });

  it('should raise selected event when person button its clicked', () => {
    //Arrange
    const expectedPerson = new Person('Jhonny', 'Joestar', 30, 150, 1.75);
    component.person = expectedPerson;
    const buttonDebug: DebugElement = fixture.debugElement.query(By.css('button.btn-choose-person'));

    let selectedPerson: Person | undefined;
    component.onSelected.subscribe(person => {
      selectedPerson = person;
    });
    //Act
    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    //Assert
    expect(selectedPerson).toEqual(expectedPerson);
  });
});

@Component({
  template: `<app-person [person]="person" (onSelected)="onSelected($event)"></app-person>`
})
class HostComponent {
  person = new Person('John', 'Doe', 20, 60, 1.60);
  selectedPerson: Person | undefined;

  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}

describe('Person component from HostComponent works as a foster parent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  //fixture es un ambiente para interactuar con el ambiente

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent]
    }).compileComponents();
    //compile components es asincrono intenta lanzar el componente

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    component.person = new Person('Jhon', 'Doe', 28, 80, 1.75);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display persons name', () => {
    //Arrange
    const expectedName = component.person.name;
    const h3Element = fixture.debugElement.query(By.css('app-person h3.personsName')).nativeElement;
    //Act
    fixture.detectChanges();
    //Assert
    expect(h3Element.textContent).toContain(expectedName);

  });
});
