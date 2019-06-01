export class User {
  _id: string;
  email: string;
  dni: string;
  role: string;
  name: string;
  subjects: any[];
  changedPass: boolean;

  constructor (values: object = {}) {
    Object.assign(this as any, values);
  }
}
