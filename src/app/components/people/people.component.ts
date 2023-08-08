import { Component } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {

  people: Person[] = [
    new Person('David', 'Bowie', 44, 70, 1.75),
    new Person('Jimmy', 'Hendrix', 28, 68, 1.80),
    new Person('Prince', 'Rogers', 35, 78, 1.82),
    new Person('Daryl', 'Hall', 52, 68, 1.70),
    new Person('John', 'Oates', 55, 76, 1.78),
    new Person('Billy', 'Idol', 44, 75, 1.68),
    new Person('Phil', 'Collins', 44, 79, 1.73),
  ];

  selectedPerson: Person | null = null;

  constructor() { }

  choosePerson(person: Person) {
    this.selectedPerson = person;
  }
}
