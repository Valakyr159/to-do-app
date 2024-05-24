import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  
  welcome = 'Hola!';
  
  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componentes',
    'Crear servicio'
  ]);
  
  name = signal('Javier');
  age = 18;
  disabled = true;
  img = 'https://w3schools.com/howto/img_avatar.png';
  person = signal({
    name: 'Valentina',
    age: 19,
    avatar: 'https://w3schools.com/howto/img_avatar.png'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });

  nameCtrl = new FormControl('Nombre', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

//capturar el valor del color input desde la lógica
  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value)
    })
  }

  clickHandler() {
    alert('Hola')
  };

  dblclickHandler() {
    alert('Hiciste doble click')
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.name.set(newValue)
  }

  changeNameHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    })
  }

  changeAgeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    })
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  keydownReactiveHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const newValueReactive = input.value;
    this.name.set(newValueReactive);
  }
}
