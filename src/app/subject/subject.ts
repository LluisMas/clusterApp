import {User} from '../user/user';

export class Subject {
  _id: string;
  name: string;
  year: number;
  professor: User;
  students: [User];
}

