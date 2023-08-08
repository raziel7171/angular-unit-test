import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReversePipe } from './reverse.pipe';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ReversePipe', () => {

  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "roma" to "amor"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform("roma");

    expect(rta).toEqual("amor");
  });

  it('should transform "123" to "321"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform("123");

    expect(rta).toEqual("321");
  });

});

@Component({
  template: `
    <h5>{{'amor' | reverse}}</h5>
    <input type="text" [(ngModel)]="textInput">
    <h5 class="h5Dynamic">{{textInput | reverse}}</h5>
  `
})

class HostComponent {
  textInput = '';
};

describe('ReversePipe test from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, ReversePipe],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the h5 have the text "roma"', () => {
    const h5El = fixture.debugElement.query(By.css('h5')).nativeElement;
    const pipe = new ReversePipe();
    const rta = pipe.transform("amor");

    expect(h5El.textContent).toEqual(rta)
  });

  it('should the input apply reverse when being typed on and replace the content of the followed <p>', () => {
    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const h5El = fixture.debugElement.query(By.css('h5.h5Dynamic')).nativeElement;

    expect(h5El.textContent).toEqual('');
    const mockString = 'zapato';
    inputEl.value = mockString;
    const pipe = new ReversePipe();

    const reversedMockString = pipe.transform(mockString); //otapaz
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(h5El.textContent).toEqual(reversedMockString);
  });
});
