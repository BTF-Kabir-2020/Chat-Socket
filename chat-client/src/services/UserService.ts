// src/services/UserService.ts

class UserService {
  private users: string[] = [];

  setUsers(users: string[]) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }
}

export default new UserService();
