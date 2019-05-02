import { Subject } from '../subject/subject';

export class Assignment {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  subject: Subject;

  constructor (values: object = {}) {
    Object.assign(this as any, values);
  }

  getState () {
    const currentDate  = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(24, 60, 60);

    if (start > currentDate) {
      return ['No iniciada', 'orange'];
    } else if (end <= currentDate) {
      return ['Finalizada', 'red'];
    } else {
      return ['En curso', 'green'];
    }
  }
}