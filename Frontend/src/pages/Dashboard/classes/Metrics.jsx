export class Metrics {
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
  // Alias para compatibilidad con componentes que usan `getName`
  get getName(){
    return this.label
  }
}