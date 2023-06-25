
class RegExpCreator {

  constructor(options) {
    this.opt = Object.assign({}, {
      // 'diacritics': false,
      // 'synonyms': {},
      // 'accuracy': 'exactly',
      'caseSensitive': false,
      // 'ignoreJoiners': false,
      // 'ignorePunctuation': [],
      // 'wildcards': 'disabled'
    }, options);
  }
  create(str) {
    str = this.escapeStr(str);
    str = this.createMergedBlanksRegExp(str);
    str = this.createAccuracyRegExp(str);
    return new RegExp(str, `gm${this.opt.caseSensitive ? '' : 'i'}`);
  }
  sortByLength(arry) {
    return arry.sort((a, b) => a.length === b.length ?
      // sort a-z for same length elements
      (a > b ? 1 : -1) :
      b.length - a.length
    );
  }

  escapeStr(str) {
    // eslint-disable-next-line no-useless-escape
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
  createMergedBlanksRegExp(str) {
    return str.replace(/[\s]+/gmi, '[\\s]+');
  }
  createAccuracyRegExp(str) {
    return `(^|\\s)(${str})(?=$|\\s)`;
  }
}

export default RegExpCreator;
