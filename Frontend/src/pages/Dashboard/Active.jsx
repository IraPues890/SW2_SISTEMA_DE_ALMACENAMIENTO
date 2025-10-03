export class Active {
    constructor(name, size, date) {
    /**
    * @param {string} name
    * @param {string} size
    * @param {string} date
    */
    this.name = name
    this.size = size
    this.date = date
  }
  get getName(){
    return this.name
  }
  get getSize(){
    return this.size
  }
  get getDate(){
    return this.date
  }
}