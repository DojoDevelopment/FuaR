module.exports = {

     isEmail : function(input){ //valid email

    return new RegExp(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/).test(input);

  }, isNumber : function(input){ // only numbers

    return new RegExp(/^[0-9]*$/).test(input);

  }, isString : function(input){ //letters and spaces

    return new RegExp(/^[a-zA-Z\s'"()\[\]]*$/).test(input);

  }, isWord : function(input){ //letters no spaces

    return new RegExp(/^[a-zA-Z]*$/).test(input);

  }, isAlphaNumeric : function(input){ //letters numbers and spaces

    return new RegExp(/^[a-zA-Z0-9_]*$/).test(input);

  }, isPassword : function(input){ //letters, numbers, underscore, 6, 72 characters

    return new RegExp(/^[a-zA-Z0-9_]{6,72}$/).test(input);

  }, isBoolean : function(input){ //true or false

    return new RegExp(/^(true|false)$/).test(input);

  }, noWedges : function(input){ // doesn't allow wedges ><

    return new RegExp(/^[a-zA-Z\s\[\]()\/`~\-_:.,'"!@#$%^&*]*$/).test(input)

  }, isDateTime : function(input){ //date time utc

    return new RegExp(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/).match(input);

  },  sanitizeForm : function(array){
    for (var i = 0; i < array.length; i++){
      array[i] = String(array[i]).replace(/<script\b[^>]*>(.*?)<\/script>/i, '').trim();
    }
    return array;
  }, sanitizeObj : function(obj){
    Object.keys(obj).forEach(function(key) {
      obj[key] = String(obj[key]).replace(/<script\b[^>]*>(.*?)<\/script>/g, '').trim();
    });
    return obj;
  }



}