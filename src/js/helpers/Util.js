Util = {
  extend: function () {
    for (let i = 1; i < arguments.length; i++) {
      for (const key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }

    return arguments[0];
  },

  isInteger: function (n) {
    return typeof (n) == 'number' && parseInt(n) === n;
  },

  log10: function (val) {
    return Math.log(val) / Math.LN10;
  }
};
