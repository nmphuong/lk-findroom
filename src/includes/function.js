class Function {
  async lowerCaseFunction ( object ) {
    for(var i in object) {
      if (i != 'password' && i != "image") {
        if (typeof object[i] == 'string') {
          object[i] = object[i].toLowerCase()
        } else if (typeof object[i] == 'object') {
          this.lowerCaseFunction(object[i])
        }
      }
    }
    return object
  }
}
module.exports = new Function();
