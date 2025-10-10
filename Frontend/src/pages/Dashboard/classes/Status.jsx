export class Status {
  constructor(label, value) {
    /**
    * @param {string} label
    * @param {string} value
    */
    this.label = label
    this.value = value
  }
  get getLabel(){
    return this.label
  }
  get getValue(){
    return this.value
  }
}