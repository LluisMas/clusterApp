import { User } from '../user/user';
import { Assignment } from '../assignment/assignment';

export class Submission {
  _id: string;
  submitted: Date;
  name: string;
  status: number;
  author: User;
  assignment: Assignment;
  file: string;
  jobId: number;
  originalName: string;
  executionTime: number;
  results: [boolean];
  outputs: [string];

  constructor (values: object = {}) {
    Object.assign(this as any, values);
  }

  getState () {
    switch (this.status) {
      case 0: return ['No empezado', 'mat-row'];
      case 1: return ['En cola', 'mat-row'];
      case 2: return ['En ejecución', 'mat-row'];
      case 3: return ['Correcto', 'mat-row make-green'];
      case 4: return ['Incorrecto', 'mat-row make-red'];
      case 5: return ['Cancelado', 'mat-row make-red'];
    }
  }

}
