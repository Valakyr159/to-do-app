import { Component, computed, signal, effect, Injector, inject } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/tasks.model'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  tasks = signal<Task[]>([]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ]
  })

  injector = inject(Injector);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage)
      this.tasks.set(tasks)
    }
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasks()
      console.log(tasks)
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }, { injector: this.injector})
  }

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })
  
  tasksLeft = computed (() => {
    const tasks = this.tasks();
    return tasks.filter(task => !task.completed).length
  })

  changeAddHandler() {
    if (this.newTaskCtrl.valid) {
      //trim() elimina espacios al inicio y al final
      const value = this.newTaskCtrl.value.trim();
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    this.addTask(newTask);
  }

  addTask(title:string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => 
      tasks.filter((task, position) => 
        position !== index))
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          };
        }
        return {
          ...task,
          editing: false
        };
      });
    });
  } 

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          };
        }
        return task
      });
    });
  } 
  /*
  completeTask(index: number) {
    this.tasks.update((tasks) => {
      // Encuentra la tarea por el índice y cambia su estado 'completed'.
      const updatedTasks = tasks.map((task, position) => {
        if (position === index) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return updatedTasks;
  });
  } 
  */

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter)
  }
 }