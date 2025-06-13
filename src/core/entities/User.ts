export class User {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    public email: string,
    public password: string,
    public phone: string,
    public avatar: string,
    public status: 'active' | 'inactive',
    public role: 'student' | 'admin',
    public isDeleted: boolean = false,
  ) { }
}
