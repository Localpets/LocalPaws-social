export class UserAdapterFront {
  constructor (user) {
    this.id = user.user_id
    this.email = user.email
    this.firstName = user.first_name
    this.lastName = user.last_name
    this.role = user.role
  }
}
