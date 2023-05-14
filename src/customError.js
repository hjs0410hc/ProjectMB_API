class HTTPError extends Error {
    constructor(code,message) {
        super(message);
        this.code=code;
    }
  }  

  class HTTPPropertyError extends HTTPError {
    constructor(code,message,property) {
        super(code,message);
        this.property=property;
    }
  }  

module.exports = {HTTPError,HTTPPropertyError};