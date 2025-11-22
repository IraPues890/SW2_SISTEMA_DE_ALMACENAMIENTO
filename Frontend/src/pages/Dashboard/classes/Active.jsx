export class Active {
    constructor(name, size, date, status = 'En línea') {
    /**
    * @param {string} name
    * @param {string} size
    * @param {string} date
    * @param {string} status
    */
    this.name = name
    this.size = size
    this.date = date
    this.status = status
  }
  get getName(){
    return this.name
  }
  get getSize(){
    return this.size
  }
  // Alias para compatibilidad: algunos componentes esperan `getSpace`
  get getSpace(){
    return this.size
  }
  get getDate(){
    return this.date
  }
  get getStatus(){
    return this.status
  }
}