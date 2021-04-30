Util = {
  isInteger: function (n) {
    return typeof (n) == 'number' && parseInt(n) === n;
  },

  log10: function (val) {
    return Math.log(val) / Math.LN10;
  }
};
