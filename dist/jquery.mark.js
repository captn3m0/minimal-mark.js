/*!***************************************************
* mark.js v9.0.0
* https://markjs.io/
* Copyright (c) 2014–2023, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global.Mark = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var DOMIterator = /*#__PURE__*/function () {
    function DOMIterator(ctx) {
      _classCallCheck(this, DOMIterator);
      /**
       * The context of the instance. Either a DOM element, an array of DOM
       * elements, a NodeList or a selector
       * @type {HTMLElement|HTMLElement[]|NodeList|string}
       * @access protected
       */
      this.ctx = ctx;
    }
    _createClass(DOMIterator, [{
      key: "getContexts",
      value:
      /**
       * Returns all contexts filtered by duplicates (even nested)
       * @return {HTMLElement[]} - An array containing DOM contexts
       * @access protected
       */
      function getContexts() {
        var ctx,
          filteredCtx = [];
        if (typeof this.ctx === 'undefined' || !this.ctx) {
          // e.g. null
          ctx = [];
        } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
          ctx = Array.prototype.slice.call(this.ctx);
        } else if (Array.isArray(this.ctx)) {
          ctx = this.ctx;
        } else if (typeof this.ctx === 'string') {
          ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
        } else {
          // e.g. HTMLElement or element inside iframe
          ctx = [this.ctx];
        }
        // filter duplicate text nodes
        ctx.forEach(function (ctx) {
          var isDescendant = filteredCtx.filter(function (contexts) {
            return contexts.contains(ctx);
          }).length > 0;
          if (filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
            filteredCtx.push(ctx);
          }
        });
        return filteredCtx;
      }

      /**
       * Creates a NodeIterator on the specified context
       * @see {@link https://developer.mozilla.org/en/docs/Web/API/NodeIterator}
       * @param {HTMLElement} ctx - The context DOM element
       * @param {DOMIterator~whatToShow} whatToShow
       * @param {DOMIterator~filterCb} filter
       * @return {NodeIterator}
       * @access protected
       */
    }, {
      key: "createIterator",
      value: function createIterator(ctx, whatToShow, filter) {
        return document.createNodeIterator(ctx, whatToShow, filter, false);
      }

      /**
       * @typedef {DOMIterator~getIteratorNodeReturn}
       * @type {object.<string>}
       * @property {HTMLElement} prevNode - The previous node or null if there is
       * no
       * @property {HTMLElement} node - The current node
       */
      /**
       * Returns the previous and current node of the specified iterator
       * @param {NodeIterator} itr - The iterator
       * @return {DOMIterator~getIteratorNodeReturn}
       * @access protected
       */
    }, {
      key: "getIteratorNode",
      value: function getIteratorNode(itr) {
        var prevNode = itr.previousNode();
        var node;
        if (prevNode === null) {
          node = itr.nextNode();
        } else {
          node = itr.nextNode() && itr.nextNode();
        }
        return {
          prevNode: prevNode,
          node: node
        };
      }

      /**
       * Iterates through all nodes in the specified context and handles iframe
       * nodes at the correct position
       * @param {DOMIterator~whatToShow} whatToShow
       * @param {HTMLElement} ctx - The context
       * @param  {DOMIterator~forEachNodeCallback} eachCb - Each callback
       * @param {DOMIterator~filterCb} filterCb - Filter callback
       * @param {DOMIterator~forEachNodeEndCallback} doneCb - End callback
       * @access protected
       */
    }, {
      key: "iterateThroughNodes",
      value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
        var _this = this;
        var itr = this.createIterator(ctx, whatToShow, filterCb);
        var elements = [],
          node,
          prevNode,
          retrieveNodes = function retrieveNodes() {
            var _this$getIteratorNode = _this.getIteratorNode(itr);
            prevNode = _this$getIteratorNode.prevNode;
            node = _this$getIteratorNode.node;
            return node;
          };
        while (retrieveNodes()) {
          // it's faster to call the each callback in an array loop
          // than in this while loop
          elements.push(node);
        }
        elements.forEach(function (node) {
          eachCb(node);
        });
        doneCb();
      }

      /**
       * Callback for each node
       * @callback DOMIterator~forEachNodeCallback
       * @param {HTMLElement} node - The DOM text node element
       */
      /**
       * Callback if all contexts were handled
       * @callback DOMIterator~forEachNodeEndCallback
       */
      /**
       * Iterates over all contexts and initializes
       * {@link DOMIterator#iterateThroughNodes iterateThroughNodes} on them
       * @param {DOMIterator~whatToShow} whatToShow
       * @param  {DOMIterator~forEachNodeCallback} each - Each callback
       * @param {DOMIterator~filterCb} filter - Filter callback
       * @param {DOMIterator~forEachNodeEndCallback} done - End callback
       * @access public
       */
    }, {
      key: "forEachNode",
      value: function forEachNode(whatToShow, each, filter) {
        var _this2 = this;
        var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
        var contexts = this.getContexts();
        var open = contexts.length;
        if (!open) {
          done();
        }
        contexts.forEach(function (ctx) {
          var ready = function ready() {
            _this2.iterateThroughNodes(whatToShow, ctx, each, filter, function () {
              if (--open <= 0) {
                // call end all contexts were handled
                done();
              }
            });
          };
          // wait for iframes to avoid recursive calls, otherwise this would
          // perhaps reach the recursive function call limit with many nodes
          ready();
        });
      }

      /**
       * Callback to filter nodes. Can return e.g. NodeFilter.FILTER_ACCEPT or
       * NodeFilter.FILTER_REJECT
       * @see {@link http://tinyurl.com/zdczmm2}
       * @callback DOMIterator~filterCb
       * @param {HTMLElement} node - The node to filter
       */
      /**
       * @typedef DOMIterator~whatToShow
       * @see {@link http://tinyurl.com/zfqqkx2}
       * @type {number}
       */
    }], [{
      key: "matches",
      value: function matches(element, selector) {
        var selectors = typeof selector === 'string' ? [selector] : selector,
          fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
        if (fn) {
          var match = false;
          selectors.every(function (sel) {
            if (fn.call(element, sel)) {
              match = true;
              return false;
            }
            return true;
          });
          return match;
        } else {
          // may be false e.g. when el is a textNode
          return false;
        }
      }
    }]);
    return DOMIterator;
  }();

  var RegExpCreator = /*#__PURE__*/function () {
    function RegExpCreator(options) {
      _classCallCheck(this, RegExpCreator);
      this.opt = _extends({}, {
        // 'diacritics': false,
        // 'synonyms': {},
        // 'accuracy': 'exactly',
        'caseSensitive': false
        // 'ignoreJoiners': false,
        // 'ignorePunctuation': [],
        // 'wildcards': 'disabled'
      }, options);
    }
    _createClass(RegExpCreator, [{
      key: "create",
      value: function create(str) {
        str = this.escapeStr(str);
        str = this.createMergedBlanksRegExp(str);
        str = this.createAccuracyRegExp(str);
        return new RegExp(str, "gm".concat(this.opt.caseSensitive ? '' : 'i'));
      }
    }, {
      key: "sortByLength",
      value: function sortByLength(arry) {
        return arry.sort(function (a, b) {
          return a.length === b.length ?
          // sort a-z for same length elements
          a > b ? 1 : -1 : b.length - a.length;
        });
      }
    }, {
      key: "escapeStr",
      value: function escapeStr(str) {
        // eslint-disable-next-line no-useless-escape
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      }
    }, {
      key: "createMergedBlanksRegExp",
      value: function createMergedBlanksRegExp(str) {
        return str.replace(/[\s]+/gmi, '[\\s]+');
      }
    }, {
      key: "createAccuracyRegExp",
      value: function createAccuracyRegExp(str) {
        return "(^|\\s)(".concat(str, ")(?=$|\\s)");
      }
    }]);
    return RegExpCreator;
  }();

  /**
   * Marks search terms in DOM elements
   * @example
   * new Mark(document.querySelector('.context')).mark('lorem ipsum');
   * @example
   * new Mark(document.querySelector('.context')).markRegExp(/lorem/gmi);
   * @example
   * new Mark('.context').markRanges([{start:10,length:0}]);
   */
  var Mark = /*#__PURE__*/function () {
    /**
     * @param {HTMLElement|HTMLElement[]|NodeList|string} ctx - The context DOM
     * element, an array of DOM elements, a NodeList or a selector
     */
    function Mark(ctx) {
      _classCallCheck(this, Mark);
      /**
       * The context of the instance. Either a DOM element, an array of DOM
       * elements, a NodeList or a selector
       * @type {HTMLElement|HTMLElement[]|NodeList|string}
       * @access protected
       */
      this.ctx = ctx;
      /**
       * Specifies if the current browser is a IE (necessary for the node
       * normalization bug workaround). See {@link Mark#unwrapMatches}
       * @type {boolean}
       * @access protected
       */
      this.ie = false;
      var ua = window.navigator.userAgent;
      if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
        this.ie = true;
      }
    }

    /**
     * Options defined by the user. They will be initialized from one of the
     * public methods. See {@link Mark#mark}, {@link Mark#markRegExp},
     * {@link Mark#markRanges} and {@link Mark#unmark} for option properties.
     * @type {object}
     * @param {object} [val] - An object that will be merged with defaults
     * @access protected
     */
    _createClass(Mark, [{
      key: "opt",
      get: function get() {
        return this._opt;
      }

      /**
       * An instance of DOMIterator
       * @type {DOMIterator}
       * @access protected
       */,
      set: function set(val) {
        this._opt = _extends({}, {
          'element': '',
          'className': '',
          'exclude': [],
          'iframes': false,
          'iframesTimeout': 5000,
          'separateWordSearch': true,
          'acrossElements': false,
          'ignoreGroups': 0,
          'each': function each() {},
          'noMatch': function noMatch() {},
          'filter': function filter() {
            return true;
          },
          'done': function done() {},
          'debug': false,
          'log': window.console
        }, val);
      }
    }, {
      key: "iterator",
      get: function get() {
        // always return new instance in case there were option changes
        return new DOMIterator(this.ctx);
      }

      /**
       * Logs a message if log is enabled
       * @param {string} msg - The message to log
       * @param {string} [level="debug"] - The log level, e.g. <code>warn</code>
       * <code>error</code>, <code>debug</code>
       * @access protected
       */
    }, {
      key: "log",
      value: function log(msg) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';
        var log = this.opt.log;
        if (!this.opt.debug) {
          return;
        }
        if (_typeof(log) === 'object' && typeof log[level] === 'function') {
          log[level]("mark.js: ".concat(msg));
        }
      }

      /**
       * @typedef Mark~separatedKeywords
       * @type {object.<string>}
       * @property {array.<string>} keywords - The list of keywords
       * @property {number} length - The length
       */
      /**
       * Returns a list of keywords dependent on whether separate word search
       * was defined. Also it filters empty keywords
       * @param {array} sv - The array of keywords
       * @return {Mark~separatedKeywords}
       * @access protected
       */
    }, {
      key: "getSeparatedKeywords",
      value: function getSeparatedKeywords(sv) {
        var _this = this;
        var stack = [];
        sv.forEach(function (kw) {
          if (!_this.opt.separateWordSearch) {
            if (kw.trim() && stack.indexOf(kw) === -1) {
              stack.push(kw);
            }
          } else {
            kw.split(' ').forEach(function (kwSplitted) {
              if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
                stack.push(kwSplitted);
              }
            });
          }
        });
        return {
          // sort because of https://git.io/v6USg
          'keywords': stack.sort(function (a, b) {
            return b.length - a.length;
          }),
          'length': stack.length
        };
      }

      /**
       * Check if a value is a number
       * @param {number|string} value - the value to check;
       * numeric strings allowed
       * @return {boolean}
       * @access protected
       */
    }, {
      key: "isNumeric",
      value: function isNumeric(value) {
        // http://stackoverflow.com/a/16655847/145346
        // eslint-disable-next-line eqeqeq
        return Number(parseFloat(value)) == value;
      }

      /**
       * @typedef Mark~rangeObject
       * @type {object}
       * @property {number} start - The start position within the composite value
       * @property {number} length - The length of the string to mark within the
       * composite value.
       */

      /**
       * @typedef Mark~setOfRanges
       * @type {object[]}
       * @property {Mark~rangeObject}
       */
      /**
       * Returns a processed list of integer offset indexes that do not overlap
       * each other, and remove any string values or additional elements
       * @param {Mark~setOfRanges} array - unprocessed raw array
       * @return {Mark~setOfRanges} - processed array with any invalid entries
       * removed
       * @throws Will throw an error if an array of objects is not passed
       * @access protected
       */
    }, {
      key: "checkRanges",
      value: function checkRanges(array) {
        var _this2 = this;
        // start and length indexes are included in an array of objects
        // [{start: 0, length: 1}, {start: 4, length: 5}]
        // quick validity check of the first entry only
        if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== '[object Object]') {
          this.log('markRanges() will only accept an array of objects');
          this.opt.noMatch(array);
          return [];
        }
        var stack = [];
        var last = 0;
        array
        // ensure there is no overlap in start & end offsets
        .sort(function (a, b) {
          return a.start - b.start;
        }).forEach(function (item) {
          var _this2$callNoMatchOnI = _this2.callNoMatchOnInvalidRanges(item, last),
            start = _this2$callNoMatchOnI.start,
            end = _this2$callNoMatchOnI.end,
            valid = _this2$callNoMatchOnI.valid;
          if (valid) {
            // preserve item in case there are extra key:values within
            item.start = start;
            item.length = end - start;
            stack.push(item);
            last = end;
          }
        });
        return stack;
      }

      /**
       * @typedef Mark~validObject
       * @type {object}
       * @property {number} start - The start position within the composite value
       * @property {number} end - The calculated end position within the composite
       * value.
       * @property {boolean} valid - boolean value indicating that the start and
       * calculated end range is valid
       */
      /**
       * Initial validation of ranges for markRanges. Preliminary checks are done
       * to ensure the start and length values exist and are not zero or non-
       * numeric
       * @param {Mark~rangeObject} range - the current range object
       * @param {number} last - last index of range
       * @return {Mark~validObject}
       * @access protected
       */
    }, {
      key: "callNoMatchOnInvalidRanges",
      value: function callNoMatchOnInvalidRanges(range, last) {
        var start,
          end,
          valid = false;
        if (range && typeof range.start !== 'undefined') {
          start = parseInt(range.start, 10);
          end = start + parseInt(range.length, 10);
          // ignore overlapping values & non-numeric entries
          if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
            valid = true;
          } else {
            this.log('Ignoring invalid or overlapping range: ' + "".concat(JSON.stringify(range)));
            this.opt.noMatch(range);
          }
        } else {
          this.log("Ignoring invalid range: ".concat(JSON.stringify(range)));
          this.opt.noMatch(range);
        }
        return {
          start: start,
          end: end,
          valid: valid
        };
      }

      /**
       * Check valid range for markRanges. Check ranges with access to the context
       * string. Range values are double checked, lengths that extend the mark
       * beyond the string length are limitied and ranges containing only
       * whitespace are ignored
       * @param {Mark~rangeObject} range - the current range object
       * @param {number} originalLength - original length of the context string
       * @param {string} string - current content string
       * @return {Mark~validObject}
       * @access protected
       */
    }, {
      key: "checkWhitespaceRanges",
      value: function checkWhitespaceRanges(range, originalLength, string) {
        var end,
          valid = true,
          // the max value changes after the DOM is manipulated
          max = string.length,
          // adjust offset to account for wrapped text node
          offset = originalLength - max,
          start = parseInt(range.start, 10) - offset;
        // make sure to stop at max
        start = start > max ? max : start;
        end = start + parseInt(range.length, 10);
        if (end > max) {
          end = max;
          this.log("End range automatically set to the max value of ".concat(max));
        }
        if (start < 0 || end - start < 0 || start > max || end > max) {
          valid = false;
          this.log("Invalid range: ".concat(JSON.stringify(range)));
          this.opt.noMatch(range);
        } else if (string.substring(start, end).replace(/\s+/g, '') === '') {
          valid = false;
          // whitespace only; even if wrapped it is not visible
          this.log('Skipping whitespace only range: ' + JSON.stringify(range));
          this.opt.noMatch(range);
        }
        return {
          start: start,
          end: end,
          valid: valid
        };
      }

      /**
       * @typedef Mark~getTextNodesDict
       * @type {object.<string>}
       * @property {string} value - The composite value of all text nodes
       * @property {object[]} nodes - An array of objects
       * @property {number} nodes.start - The start position within the composite
       * value
       * @property {number} nodes.end - The end position within the composite
       * value
       * @property {HTMLElement} nodes.node - The DOM text node element
       */

      /**
       * Callback
       * @callback Mark~getTextNodesCallback
       * @param {Mark~getTextNodesDict}
       */
      /**
       * Calls the callback with an object containing all text nodes (including
       * iframe text nodes) with start and end positions and the composite value
       * of them (string)
       * @param {Mark~getTextNodesCallback} cb - Callback
       * @access protected
       */
    }, {
      key: "getTextNodes",
      value: function getTextNodes(cb) {
        var _this3 = this;
        var val = '',
          nodes = [];
        this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function (node) {
          nodes.push({
            start: val.length,
            end: (val += node.textContent).length,
            node: node
          });
        }, function (node) {
          if (_this3.matchesExclude(node.parentNode)) {
            return NodeFilter.FILTER_REJECT;
          } else {
            return NodeFilter.FILTER_ACCEPT;
          }
        }, function () {
          cb({
            value: val,
            nodes: nodes
          });
        });
      }

      /**
       * Checks if an element matches any of the specified exclude selectors. Also
       * it checks for elements in which no marks should be performed (e.g.
       * script and style tags) and optionally already marked elements
       * @param  {HTMLElement} el - The element to check
       * @return {boolean}
       * @access protected
       */
    }, {
      key: "matchesExclude",
      value: function matchesExclude(el) {
        return DOMIterator.matches(el, this.opt.exclude.concat([
        // ignores the elements itself, not their childrens (selector *)
        'script', 'style', 'title', 'head', 'html']));
      }

      /**
       * Wraps the instance element and class around matches that fit the start and
       * end positions within the node
       * @param  {HTMLElement} node - The DOM text node
       * @param  {number} start - The position where to start wrapping
       * @param  {number} end - The position where to end wrapping
       * @return {HTMLElement} Returns the splitted text node that will appear
       * after the wrapped text node
       * @access protected
       */
    }, {
      key: "wrapRangeInTextNode",
      value: function wrapRangeInTextNode(node, start, end) {
        var hEl = !this.opt.element ? 'mark' : this.opt.element,
          startNode = node.splitText(start),
          ret = startNode.splitText(end - start);
        var repl = document.createElement(hEl);
        repl.setAttribute('data-markjs', 'true');
        if (this.opt.className) {
          repl.setAttribute('class', this.opt.className);
        }
        repl.textContent = startNode.textContent;
        startNode.parentNode.replaceChild(repl, startNode);
        return ret;
      }

      /**
       * @typedef Mark~wrapRangeInMappedTextNodeDict
       * @type {object.<string>}
       * @property {string} value - The composite value of all text nodes
       * @property {object[]} nodes - An array of objects
       * @property {number} nodes.start - The start position within the composite
       * value
       * @property {number} nodes.end - The end position within the composite
       * value
       * @property {HTMLElement} nodes.node - The DOM text node element
       */
      /**
       * Each callback
       * @callback Mark~wrapMatchesEachCallback
       * @param {HTMLElement} node - The wrapped DOM element
       * @param {number} lastIndex - The last matching position within the
       * composite value of text nodes
       */

      /**
       * Filter callback
       * @callback Mark~wrapMatchesFilterCallback
       * @param {HTMLElement} node - The matching text node DOM element
       */
      /**
       * Determines matches by start and end positions using the text node
       * dictionary even across text nodes and calls
       * {@link Mark#wrapRangeInTextNode} to wrap them
       * @param  {Mark~wrapRangeInMappedTextNodeDict} dict - The dictionary
       * @param  {number} start - The start position of the match
       * @param  {number} end - The end position of the match
       * @param  {Mark~wrapMatchesFilterCallback} filterCb - Filter callback
       * @param  {Mark~wrapMatchesEachCallback} eachCb - Each callback
       * @access protected
       */
    }, {
      key: "wrapRangeInMappedTextNode",
      value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
        var _this4 = this;
        // iterate over all text nodes to find the one matching the positions
        dict.nodes.every(function (n, i) {
          var sibl = dict.nodes[i + 1];
          if (typeof sibl === 'undefined' || sibl.start > start) {
            if (!filterCb(n.node)) {
              return false;
            }
            // map range from dict.value to text node
            var s = start - n.start,
              e = (end > n.end ? n.end : end) - n.start,
              startStr = dict.value.substr(0, n.start),
              endStr = dict.value.substr(e + n.start);
            n.node = _this4.wrapRangeInTextNode(n.node, s, e);
            // recalculate positions to also find subsequent matches in the
            // same text node. Necessary as the text node in dict now only
            // contains the splitted part after the wrapped one
            dict.value = startStr + endStr;
            dict.nodes.forEach(function (k, j) {
              if (j >= i) {
                if (dict.nodes[j].start > 0 && j !== i) {
                  dict.nodes[j].start -= e;
                }
                dict.nodes[j].end -= e;
              }
            });
            end -= e;
            eachCb(n.node.previousSibling, n.start);
            if (end > n.end) {
              start = n.end;
            } else {
              return false;
            }
          }
          return true;
        });
      }

      /**
      * @param {HTMLElement} node - The text node where the match occurs
      * @param {number} pos - The current position of the match within the node
      * @param {number} len - The length of the current match within the node
      * @param {Mark~wrapMatchesEachCallback} eachCb
      */
    }, {
      key: "wrapGroups",
      value: function wrapGroups(node, pos, len, eachCb) {
        node = this.wrapRangeInTextNode(node, pos, pos + len);
        eachCb(node.previousSibling);
        return node;
      }

      /**
       * Separate groups
       * @param {HTMLElement} node - The text node where the match occurs
       * @param {array} match - The current match
       * @param {number} matchIdx - The start of the match based on ignoreGroups
       * @param {Mark~wrapMatchesFilterCallback} filterCb
       * @param {Mark~wrapMatchesEachCallback} eachCb
       */
    }, {
      key: "separateGroups",
      value: function separateGroups(node, match, matchIdx, filterCb, eachCb) {
        var matchLen = match.length;
        for (var i = 1; i < matchLen; i++) {
          var pos = node.textContent.indexOf(match[i]);
          if (match[i] && pos > -1 && filterCb(match[i], node)) {
            node = this.wrapGroups(node, pos, match[i].length, eachCb);
          }
        }
        return node;
      }

      /**
       * Filter callback before each wrapping
       * @callback Mark~wrapMatchesFilterCallback
       * @param {string} match - The matching string
       * @param {HTMLElement} node - The text node where the match occurs
       */
      /**
       * Callback for each wrapped element
       * @callback Mark~wrapMatchesEachCallback
       * @param {HTMLElement} element - The marked DOM element
       */

      /**
       * Callback on end
       * @callback Mark~wrapMatchesEndCallback
       */
      /**
       * Wraps the instance element and class around matches within single HTML
       * elements in all contexts
       * @param {RegExp} regex - The regular expression to be searched for
       * @param {number} ignoreGroups - A number indicating the amount of RegExp
       * matching groups to ignore
       * @param {Mark~wrapMatchesFilterCallback} filterCb
       * @param {Mark~wrapMatchesEachCallback} eachCb
       * @param {Mark~wrapMatchesEndCallback} endCb
       * @access protected
       */
    }, {
      key: "wrapMatches",
      value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this5 = this;
        var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
        this.getTextNodes(function (dict) {
          dict.nodes.forEach(function (node) {
            node = node.node;
            var match;
            while ((match = regex.exec(node.textContent)) !== null && match[matchIdx] !== '') {
              if (_this5.opt.separateGroups && match.length !== 1) {
                node = _this5.separateGroups(node, match, matchIdx, filterCb, eachCb);
              } else {
                if (!filterCb(match[matchIdx], node)) {
                  continue;
                }
                var pos = match.index;
                if (matchIdx !== 0) {
                  for (var i = 1; i < matchIdx; i++) {
                    pos += match[i].length;
                  }
                }
                node = _this5.wrapGroups(node, pos, match[matchIdx].length, eachCb);
              }
              // reset index of last match as the node changed and the
              // index isn't valid anymore http://tinyurl.com/htsudjd
              regex.lastIndex = 0;
            }
          });
          endCb();
        });
      }

      /**
       * Callback for each wrapped element
       * @callback Mark~wrapMatchesAcrossElementsEachCallback
       * @param {HTMLElement} element - The marked DOM element
       */
      /**
       * Filter callback before each wrapping
       * @callback Mark~wrapMatchesAcrossElementsFilterCallback
       * @param {string} match - The matching string
       * @param {HTMLElement} node - The text node where the match occurs
       */

      /**
       * Callback on end
       * @callback Mark~wrapMatchesAcrossElementsEndCallback
       */
      /**
       * Wraps the instance element and class around matches across all HTML
       * elements in all contexts
       * @param {RegExp} regex - The regular expression to be searched for
       * @param {number} ignoreGroups - A number indicating the amount of RegExp
       * matching groups to ignore
       * @param {Mark~wrapMatchesAcrossElementsFilterCallback} filterCb
       * @param {Mark~wrapMatchesAcrossElementsEachCallback} eachCb
       * @param {Mark~wrapMatchesAcrossElementsEndCallback} endCb
       * @access protected
       */
    }, {
      key: "wrapMatchesAcrossElements",
      value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
        var _this6 = this;
        var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
        this.getTextNodes(function (dict) {
          var match;
          while ((match = regex.exec(dict.value)) !== null && match[matchIdx] !== '') {
            // calculate range inside dict.value
            var start = match.index;
            if (matchIdx !== 0) {
              for (var i = 1; i < matchIdx; i++) {
                start += match[i].length;
              }
            }
            var end = start + match[matchIdx].length;
            // note that dict will be updated automatically, as it'll change
            // in the wrapping process, due to the fact that text
            // nodes will be splitted
            _this6.wrapRangeInMappedTextNode(dict, start, end, function (node) {
              return filterCb(match[matchIdx], node);
            }, function (node, lastIndex) {
              regex.lastIndex = lastIndex;
              eachCb(node);
            });
          }
          endCb();
        });
      }

      /**
       * Callback for each wrapped element
       * @callback Mark~wrapRangeFromIndexEachCallback
       * @param {HTMLElement} element - The marked DOM element
       * @param {Mark~rangeObject} range - the current range object; provided
       * start and length values will be numeric integers modified from the
       * provided original ranges.
       */
      /**
       * Filter callback before each wrapping
       * @callback Mark~wrapRangeFromIndexFilterCallback
       * @param {HTMLElement} node - The text node which includes the range
       * @param {Mark~rangeObject} range - the current range object
       * @param {string} match - string extracted from the matching range
       * @param {number} counter - A counter indicating the number of all marks
       */

      /**
       * Callback on end
       * @callback Mark~wrapRangeFromIndexEndCallback
       */
      /**
       * Wraps the indicated ranges across all HTML elements in all contexts
       * @param {Mark~setOfRanges} ranges
       * @param {Mark~wrapRangeFromIndexFilterCallback} filterCb
       * @param {Mark~wrapRangeFromIndexEachCallback} eachCb
       * @param {Mark~wrapRangeFromIndexEndCallback} endCb
       * @access protected
       */
    }, {
      key: "wrapRangeFromIndex",
      value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
        var _this7 = this;
        this.getTextNodes(function (dict) {
          var originalLength = dict.value.length;
          ranges.forEach(function (range, counter) {
            var _this7$checkWhitespac = _this7.checkWhitespaceRanges(range, originalLength, dict.value),
              start = _this7$checkWhitespac.start,
              end = _this7$checkWhitespac.end,
              valid = _this7$checkWhitespac.valid;
            if (valid) {
              _this7.wrapRangeInMappedTextNode(dict, start, end, function (node) {
                return filterCb(node, range, dict.value.substring(start, end), counter);
              }, function (node) {
                eachCb(node, range);
              });
            }
          });
          endCb();
        });
      }

      /**
       * Unwraps the specified DOM node with its content (text nodes or HTML)
       * without destroying possibly present events (using innerHTML) and normalizes
       * the parent at the end (merge splitted text nodes)
       * @param  {HTMLElement} node - The DOM node to unwrap
       * @access protected
       */
    }, {
      key: "unwrapMatches",
      value: function unwrapMatches(node) {
        var parent = node.parentNode;
        var docFrag = document.createDocumentFragment();
        while (node.firstChild) {
          docFrag.appendChild(node.removeChild(node.firstChild));
        }
        parent.replaceChild(docFrag, node);
        if (!this.ie) {
          // use browser's normalize method
          parent.normalize();
        } else {
          // custom method (needs more time)
          this.normalizeTextNode(parent);
        }
      }

      /**
       * Normalizes text nodes. It's a workaround for the native normalize method
       * that has a bug in IE (see attached link). Should only be used in IE
       * browsers as it's slower than the native method.
       * @see {@link http://tinyurl.com/z5asa8c}
       * @param {HTMLElement} node - The DOM node to normalize
       * @access protected
       */
    }, {
      key: "normalizeTextNode",
      value: function normalizeTextNode(node) {
        if (!node) {
          return;
        }
        if (node.nodeType === 3) {
          while (node.nextSibling && node.nextSibling.nodeType === 3) {
            node.nodeValue += node.nextSibling.nodeValue;
            node.parentNode.removeChild(node.nextSibling);
          }
        } else {
          this.normalizeTextNode(node.firstChild);
        }
        this.normalizeTextNode(node.nextSibling);
      }

      /**
       * Callback for each marked element
       * @callback Mark~markEachCallback
       * @param {HTMLElement} element - The marked DOM element
       */
      /**
       * Callback if there were no matches
       * @callback Mark~markNoMatchCallback
       * @param {RegExp} term - The search term that was not found
       */
      /**
       * Callback when finished
       * @callback Mark~commonDoneCallback
       * @param {number} totalMatches - The number of marked elements
       */
      /**
       * @typedef Mark~commonOptions
       * @type {object.<string>}
       * @property {string} [element="mark"] - HTML element tag name
       * @property {string} [className] - An optional class name
       * @property {string[]} [exclude] - An array with exclusion selectors.
       * Elements matching those selectors will be ignored
       * @property {boolean} [iframes=false] - Whether to search inside iframes
       * @property {number} [iframesTimeout=5000] - Maximum ms to wait for a load
       * event of an iframe
       * @property {boolean} [acrossElements=false] - Whether to find matches
       * across HTML elements. By default, only matches within single HTML
       * elements will be found
       * @property {Mark~markEachCallback} [each]
       * @property {Mark~markNoMatchCallback} [noMatch]
       * @property {Mark~commonDoneCallback} [done]
       * @property {boolean} [debug=false] - Whether to log messages
       * @property {object} [log=window.console] - Where to log messages (only if
       * debug is true)
       */
      /**
       * Callback if there were no matches
       * @callback Mark~markRegExpNoMatchCallback
       * @param {RegExp} regexp - The regular expression
       */
      /**
       * Callback to filter matches
       * @callback Mark~markRegExpFilterCallback
       * @param {HTMLElement} textNode - The text node which includes the match
       * @param {string} match - The matching string for the RegExp
       * @param {number} counter - A counter indicating the number of all marks
       */

      /**
       * These options also include the common options from
       * {@link Mark~commonOptions}
       * @typedef Mark~markRegExpOptions
       * @type {object.<string>}
       * @property {number} [ignoreGroups=0] - A number indicating the amount of
       * RegExp matching groups to ignore
       * @property {boolean} [separateGroups] - Whether to mark each regular
       * expression group as a separate match
       * @property {Mark~markRegExpNoMatchCallback} [noMatch]
       * @property {Mark~markRegExpFilterCallback} [filter]
       */
      /**
       * Marks a custom regular expression
       * @param  {RegExp} regexp - The regular expression
       * @param  {Mark~markRegExpOptions} [opt] - Optional options object
       * @access public
       */
    }, {
      key: "markRegExp",
      value: function markRegExp(regexp, opt) {
        var _this8 = this;
        this.opt = opt;
        this.log("Searching with expression \"".concat(regexp, "\""));
        var totalMatches = 0,
          fn = 'wrapMatches';
        var eachCb = function eachCb(element) {
          totalMatches++;
          _this8.opt.each(element);
        };
        if (this.opt.acrossElements) {
          fn = 'wrapMatchesAcrossElements';
        }
        this[fn](regexp, this.opt.ignoreGroups, function (match, node) {
          return _this8.opt.filter(node, match, totalMatches);
        }, eachCb, function () {
          if (totalMatches === 0) {
            _this8.opt.noMatch(regexp);
          }
          _this8.opt.done(totalMatches);
        });
      }

      /**
       * Callback to filter matches
       * @callback Mark~markFilterCallback
       * @param {HTMLElement} textNode - The text node which includes the match
       * @param {string} match - The matching term
       * @param {number} totalCounter - A counter indicating the number of all
       * marks
       * @param {number} termCounter - A counter indicating the number of marks
       * for the specific match
       */

      /**
       * These options also include the common options from
       * {@link Mark~commonOptions} and the options from
       * {@link RegExpCreator~options}
       * @typedef Mark~markOptions
       * @type {object.<string>}
       * @property {boolean} [separateWordSearch=true] - Whether to search for
       * each word separated by a blank instead of the complete term
       * @property {Mark~markFilterCallback} [filter]
       */
      /**
       * Marks the specified search terms
       * @param {string|string[]} [sv] - Search value, either a search string or an
       * array containing multiple search strings
       * @param  {Mark~markOptions} [opt] - Optional options object
       * @access public
       */
    }, {
      key: "mark",
      value: function mark(sv, opt) {
        var _this9 = this;
        this.opt = opt;
        var totalMatches = 0,
          fn = 'wrapMatches';
        var _this$getSeparatedKey = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv),
          kwArr = _this$getSeparatedKey.keywords,
          kwArrLen = _this$getSeparatedKey.length,
          handler = function handler(kw) {
            // async function calls as iframes are async too
            var regex = new RegExpCreator(_this9.opt).create(kw);
            var matches = 0;
            _this9.log("Searching with expression \"".concat(regex, "\""));
            _this9[fn](regex, 1, function (term, node) {
              return _this9.opt.filter(node, kw, totalMatches, matches);
            }, function (element) {
              matches++;
              totalMatches++;
              _this9.opt.each(element);
            }, function () {
              if (matches === 0) {
                _this9.opt.noMatch(kw);
              }
              if (kwArr[kwArrLen - 1] === kw) {
                _this9.opt.done(totalMatches);
              } else {
                handler(kwArr[kwArr.indexOf(kw) + 1]);
              }
            });
          };
        if (this.opt.acrossElements) {
          fn = 'wrapMatchesAcrossElements';
        }
        if (kwArrLen === 0) {
          this.opt.done(totalMatches);
        } else {
          handler(kwArr[0]);
        }
      }

      /**
       * Callback for each marked element
       * @callback Mark~markRangesEachCallback
       * @param {HTMLElement} element - The marked DOM element
       * @param {array} range - array of range start and end points
       */
      /**
       * Callback if a processed range is invalid, out-of-bounds, overlaps another
       * range, or only matches whitespace
       * @callback Mark~markRangesNoMatchCallback
       * @param {Mark~rangeObject} range - a range object
       */
      /**
       * Callback to filter matches
       * @callback Mark~markRangesFilterCallback
       * @param {HTMLElement} node - The text node which includes the range
       * @param {array} range - array of range start and end points
       * @param {string} match - string extracted from the matching range
       * @param {number} counter - A counter indicating the number of all marks
       */

      /**
       * These options also include the common options from
       * {@link Mark~commonOptions} without the each and noMatch callback
       * @typedef Mark~markRangesOptions
       * @type {object.<string>}
       * @property {Mark~markRangesEachCallback} [each]
       * @property {Mark~markRangesNoMatchCallback} [noMatch]
       * @property {Mark~markRangesFilterCallback} [filter]
       */
      /**
       * Marks an array of objects containing a start with an end or length of the
       * string to mark
       * @param  {Mark~setOfRanges} rawRanges - The original (preprocessed)
       * array of objects
       * @param  {Mark~markRangesOptions} [opt] - Optional options object
       * @access public
       */
    }, {
      key: "markRanges",
      value: function markRanges(rawRanges, opt) {
        var _this10 = this;
        this.opt = opt;
        var totalMatches = 0,
          ranges = this.checkRanges(rawRanges);
        if (ranges && ranges.length) {
          this.log('Starting to mark with the following ranges: ' + JSON.stringify(ranges));
          this.wrapRangeFromIndex(ranges, function (node, range, match, counter) {
            return _this10.opt.filter(node, range, match, counter);
          }, function (element, range) {
            totalMatches++;
            _this10.opt.each(element, range);
          }, function () {
            _this10.opt.done(totalMatches);
          });
        } else {
          this.opt.done(totalMatches);
        }
      }

      /**
       * Removes all marked elements inside the context with their HTML and
       * normalizes the parent at the end
       * @param  {Mark~commonOptions} [opt] - Optional options object without each,
       * noMatch and acrossElements properties
       * @access public
       */
    }, {
      key: "unmark",
      value: function unmark(opt) {
        var _this11 = this;
        this.opt = opt;
        var sel = this.opt.element ? this.opt.element : '*';
        sel += '[data-markjs]';
        if (this.opt.className) {
          sel += ".".concat(this.opt.className);
        }
        this.log("Removal selector \"".concat(sel, "\""));
        this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function (node) {
          _this11.unwrapMatches(node);
        }, function (node) {
          var matchesSel = DOMIterator.matches(node, sel),
            matchesExclude = _this11.matchesExclude(node);
          if (!matchesSel || matchesExclude) {
            return NodeFilter.FILTER_REJECT;
          } else {
            return NodeFilter.FILTER_ACCEPT;
          }
        }, this.opt.done);
      }
    }]);
    return Mark;
  }();

  $.fn.mark = function (sv, opt) {
    new Mark(this.get()).mark(sv, opt);
    return this;
  };
  $.fn.markRegExp = function (regexp, opt) {
    new Mark(this.get()).markRegExp(regexp, opt);
    return this;
  };
  $.fn.markRanges = function (ranges, opt) {
    new Mark(this.get()).markRanges(ranges, opt);
    return this;
  };
  $.fn.unmark = function (opt) {
    new Mark(this.get()).unmark(opt);
    return this;
  };

  return $;

})));
