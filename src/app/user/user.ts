export class User {
  _id: string;
  email: string;
  dni: string;
  role: string;
  name: string;
  subjects: any[];

  constructor (values: object = {}) {
    Object.assign(this as any, values);
  }
}
