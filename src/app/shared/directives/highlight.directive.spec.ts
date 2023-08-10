import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';
import { FormsModule } from '@angular/forms';

@Component({
  template: `
    <h5 highlight>Default</h5>
    <p highlight="yellow">amarillo</p>
    <h5>parrafo</h5>
    <input type="text" [(ngModel)]="color" [highlight]="color">
  `
})

class HostComponent {
  color = 'pink';
};

describe('HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, HighlightDirective],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 elements using the "highlight" directive', () => {
    // const elements = fixture.debugElement.queryAll(By.css('*[highlight]'));
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highlight])'));

    expect(elements.length).toEqual(3);
    expect(elementsWithout.length).toEqual(2);
  });

  it('should the elements match the bgColor of the directive', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    expect(elements[0].nativeElement.style.backgroundColor).toEqual('gray');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
  });

  it('should the first element be defaultColor', () => {
    const firstElement = fixture.debugElement.queryAll(By.directive(HighlightDirective))[0];
    const directive = firstElement.injector.get(HighlightDirective);
    expect(firstElement.nativeElement.style.backgroundColor).toEqual(directive.defaultColor);
  });

  it('should bind <input /> and dinamically change the bgColor', () => {
    const inputDebug = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;
    //es importante especificar el tipado de HTMLInputElement para darle las propiedades de un input y con ello
    //dispatchEvent para injectarle eventos en este caso "input" de entrada escrita de usuario

    expect(inputElement.style.backgroundColor).toEqual('pink');

    inputElement.value = 'red';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputElement.style.backgroundColor).toEqual('red');
    expect(component.color).toEqual('red');
  });
});

