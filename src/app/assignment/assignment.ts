import { Subject } from '../subject/subject';

export class Assignment {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  subject: Subject;
}
