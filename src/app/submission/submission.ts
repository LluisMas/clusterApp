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
}
