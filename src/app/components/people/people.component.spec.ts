import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from 'src/app/models/person.model';
import { By } from '@angular/platform-browser';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of app-person components', () => {
    //Arrange
    component.people = [
      new Person('David', 'Bowie', 44, 70, 1.75),
      new Person('Jimmy', 'Hendrix', 28, 68, 1.80),
      new Person('Prince', 'Rogers', 35, 78, 1.82),
    ];
    //Act
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    //Assert
    expect(debugElement.length).toEqual(3);
  });

  it('should raise selected event when clicked and the name+lastname of the first person should match the selected one', () => {
    //Arrange
    component.people = [
      new Person('David', 'Bowie', 44, 70, 1.75),
      new Person('Jimmy', 'Hendrix', 28, 68, 1.80),
      new Person('Prince', 'Rogers', 35, 78, 1.82),
    ];
    fixture.detectChanges();
    const btnElement = fixture.debugElement.query(By.css('app-person .btn-choose-person'));
    //Act
    btnElement.triggerEventHandler('click');
    fixture.detectChanges();
    //the operator ">" selects the first adjacent children of the query in this case if ul contains many li would match them and if one of those li contains another ul li without the ">" they would get matched to
    //so in other words ">" gives more precision to match the first child 
    const liPersonsNameElement = fixture.debugElement.query(By.css('.selectedPersonClass ul > li')).nativeElement;
    //Assert
    expect(component.people[0]).toEqual(component.selectedPerson!);
    expect(liPersonsNameElement.textContent).toContain(component.selectedPerson?.name + ' ' + component.selectedPerson?.lastName);
  });
});