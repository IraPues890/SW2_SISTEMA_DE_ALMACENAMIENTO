
export class User {
  constructor(name, position, role) {
    /**
    * @param {string} name
    * @param {string} position
    * @param {string} role
    */
    this.name = name
    this.position = position
    this.role = role
  }
  get getName(){
    return this.name
  }
  get getPosicion(){
    return this.position
  }
  get getRole(){
    return this.role
  }
}