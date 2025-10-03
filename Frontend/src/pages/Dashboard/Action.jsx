export class Action {
  constructor(label, icon, title) {
    /**
    * @param {string} label
    * @param {string} icon
    * @param {string} title
    */
    this.label = label
    this.icon = icon
    this.title = title
  }
  get getLabel(){
    return this.label
  }
  get getIcon(){
    return this.icon
  }
  get getTitle(){
    return this.title
  }
}