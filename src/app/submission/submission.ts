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

  constructor (values: object = {}) {
    Object.assign(this as any, values);
  }

  getState () {
    switch (this.status) {
      case 0: return ['No empezado', ''];
      case 1: return ['En cola', ''];
      case 2: return ['En ejecución', ''];
      case 3: return ['Correcto', 'make-green'];
      case 4: return ['Incorrecto', 'make-red'];
      case 5: return ['Cancelado', 'make-red'];
    }
  }

}
