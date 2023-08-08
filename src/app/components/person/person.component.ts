import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() person: Person = new Person('', '', 0, 0, 0);
  @Output() onSelected = new EventEmitter<Person>();
  imc = '';
  ngOnInit(): void {

  }

  calcIMC() {
    this.imc = this.person.calcIMC();
  }

  onClicked() {
    this.onSelected.emit(this.person);
  }

}
