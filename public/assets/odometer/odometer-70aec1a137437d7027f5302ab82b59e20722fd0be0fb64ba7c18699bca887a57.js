(function() {
  var COUNT_FRAMERATE, COUNT_MS_PER_FRAME, DIGIT_FORMAT, DIGIT_HTML, DIGIT_SPEEDBOOST, DURATION, FORMAT_MARK_HTML, FORMAT_PARSER, FRAMERATE, FRAMES_PER_VALUE, MS_PER_FRAME, MutationObserver, Odometer, RIBBON_HTML, TRANSITION_END_EVENTS, TRANSITION_SUPPORT, VALUE_HTML, _jQueryWrapped, _old, addClass, createFromHTML, fractionalPart, now, ref, ref1, removeClass, requestAnimationFrame, round, transitionCheckStyles, trigger, truncate, wrapJQuery,
    slice = [].slice;

  VALUE_HTML = '<span class="odometer-value"></span>';

  RIBBON_HTML = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + VALUE_HTML + '</span></span>';

  DIGIT_HTML = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + RIBBON_HTML + '</span></span>';

  FORMAT_MARK_HTML = '<span class="odometer-formatting-mark"></span>';

  DIGIT_FORMAT = '(,ddd).dd';

  FORMAT_PARSER = /^\(?([^)]*)\)?(?:(.)(d+))?$/;

  FRAMERATE = 30;

  DURATION = 2000;

  COUNT_FRAMERATE = 20;

  FRAMES_PER_VALUE = 2;

  DIGIT_SPEEDBOOST = .5;

  MS_PER_FRAME = 1000 / FRAMERATE;

  COUNT_MS_PER_FRAME = 1000 / COUNT_FRAMERATE;

  TRANSITION_END_EVENTS = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';

  transitionCheckStyles = document.createElement('div').style;

  TRANSITION_SUPPORT = (transitionCheckStyles.transition != null) || (transitionCheckStyles.webkitTransition != null) || (transitionCheckStyles.mozTransition != null) || (transitionCheckStyles.oTransition != null);

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  createFromHTML = function(html) {
    var el;
    el = document.createElement('div');
    el.innerHTML = html;
    return el.children[0];
  };

  removeClass = function(el, name) {
    return el.className = el.className.replace(new RegExp("(^| )" + (name.split(' ').join('|')) + "( |$)", 'gi'), ' ');
  };

  addClass = function(el, name) {
    removeClass(el, name);
    return el.className += " " + name;
  };

  trigger = function(el, name) {
    var evt;
    if (document.createEvent != null) {
      evt = document.createEvent('HTMLEvents');
      evt.initEvent(name, true, true);
      return el.dispatchEvent(evt);
    }
  };

  now = function() {
    var ref, ref1;
    return (ref = (ref1 = window.performance) != null ? typeof ref1.now === "function" ? ref1.now() : void 0 : void 0) != null ? ref : +(new Date);
  };

  round = function(val, precision) {
    if (precision == null) {
      precision = 0;
    }
    if (!precision) {
      return Math.round(val);
    }
    val *= Math.pow(10, precision);
    val += 0.5;
    val = Math.floor(val);
    return val /= Math.pow(10, precision);
  };

  truncate = function(val) {
    if (val < 0) {
      return Math.ceil(val);
    } else {
      return Math.floor(val);
    }
  };

  fractionalPart = function(val) {
    return val - round(val);
  };

  _jQueryWrapped = false;

  (wrapJQuery = function() {
    var l, len, property, ref, results;
    if (_jQueryWrapped) {
      return;
    }
    if (window.jQuery != null) {
      _jQueryWrapped = true;
      ref = ['html', 'text'];
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        property = ref[l];
        results.push((function(property) {
          var old;
          old = window.jQuery.fn[property];
          return window.jQuery.fn[property] = function(val) {
            var ref1;
            if ((val == null) || (((ref1 = this[0]) != null ? ref1.odometer : void 0) == null)) {
              return old.apply(this, arguments);
            }
            return this[0].odometer.update(val);
          };
        })(property));
      }
      return results;
    }
  })();

  setTimeout(wrapJQuery, 0);

  Odometer = (function() {
    function Odometer(options) {
      var base, e, error, k, l, len, property, ref, ref1, ref2, v;
      this.options = options;
      this.el = this.options.el;
      if (this.el.odometer != null) {
        return this.el.odometer;
      }
      this.el.odometer = this;
      ref = Odometer.options;
      for (k in ref) {
        v = ref[k];
        if (this.options[k] == null) {
          this.options[k] = v;
        }
      }
      if ((base = this.options).duration == null) {
        base.duration = DURATION;
      }
      this.MAX_VALUES = ((this.options.duration / MS_PER_FRAME) / FRAMES_PER_VALUE) | 0;
      this.resetFormat();
      this.value = this.cleanValue((ref1 = this.options.value) != null ? ref1 : '');
      this.renderInside();
      this.render();
      try {
        ref2 = ['innerHTML', 'innerText', 'textContent'];
        for (l = 0, len = ref2.length; l < len; l++) {
          property = ref2[l];
          if (this.el[property] != null) {
            (function(_this) {
              return (function(property) {
                return Object.defineProperty(_this.el, property, {
                  get: function() {
                    var ref3;
                    if (property === 'innerHTML') {
                      return _this.inside.outerHTML;
                    } else {
                      return (ref3 = _this.inside.innerText) != null ? ref3 : _this.inside.textContent;
                    }
                  },
                  set: function(val) {
                    return _this.update(val);
                  }
                });
              });
            })(this)(property);
          }
        }
      } catch (error) {
        e = error;
        this.watchForMutations();
      }
      this;
    }

    Odometer.prototype.renderInside = function() {
      this.inside = document.createElement('div');
      this.inside.className = 'odometer-inside';
      this.el.innerHTML = '';
      return this.el.appendChild(this.inside);
    };

    Odometer.prototype.watchForMutations = function() {
      var e, error;
      if (MutationObserver == null) {
        return;
      }
      try {
        if (this.observer == null) {
          this.observer = new MutationObserver((function(_this) {
            return function(mutations) {
              var newVal;
              newVal = _this.el.innerText;
              _this.renderInside();
              _this.render(_this.value);
              return _this.update(newVal);
            };
          })(this));
        }
        this.watchMutations = true;
        return this.startWatchingMutations();
      } catch (error) {
        e = error;
      }
    };

    Odometer.prototype.startWatchingMutations = function() {
      if (this.watchMutations) {
        return this.observer.observe(this.el, {
          childList: true
        });
      }
    };

    Odometer.prototype.stopWatchingMutations = function() {
      var ref;
      return (ref = this.observer) != null ? ref.disconnect() : void 0;
    };

    Odometer.prototype.cleanValue = function(val) {
      var ref;
      if (typeof val === 'string') {
        val = val.replace((ref = this.format.radix) != null ? ref : '.', '<radix>');
        val = val.replace(/[.,]/g, '');
        val = val.replace('<radix>', '.');
        val = parseFloat(val, 10) || 0;
      }
      return round(val, this.format.precision);
    };

    Odometer.prototype.bindTransitionEnd = function() {
      var event, l, len, ref, renderEnqueued, results;
      if (this.transitionEndBound) {
        return;
      }
      this.transitionEndBound = true;
      renderEnqueued = false;
      ref = TRANSITION_END_EVENTS.split(' ');
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        event = ref[l];
        results.push(this.el.addEventListener(event, (function(_this) {
          return function() {
            if (renderEnqueued) {
              return true;
            }
            renderEnqueued = true;
            setTimeout(function() {
              _this.render();
              renderEnqueued = false;
              return trigger(_this.el, 'odometerdone');
            }, 0);
            return true;
          };
        })(this), false));
      }
      return results;
    };

    Odometer.prototype.resetFormat = function() {
      var format, fractional, parsed, precision, radix, ref, ref1, repeating;
      format = (ref = this.options.format) != null ? ref : DIGIT_FORMAT;
      format || (format = 'd');
      parsed = FORMAT_PARSER.exec(format);
      if (!parsed) {
        throw new Error("Odometer: Unparsable digit format");
      }
      ref1 = parsed.slice(1, 4), repeating = ref1[0], radix = ref1[1], fractional = ref1[2];
      precision = (fractional != null ? fractional.length : void 0) || 0;
      return this.format = {
        repeating: repeating,
        radix: radix,
        precision: precision
      };
    };

    Odometer.prototype.render = function(value) {
      var classes, cls, l, len, match, newClasses, theme;
      if (value == null) {
        value = this.value;
      }
      this.stopWatchingMutations();
      this.resetFormat();
      this.inside.innerHTML = '';
      theme = this.options.theme;
      classes = this.el.className.split(' ');
      newClasses = [];
      for (l = 0, len = classes.length; l < len; l++) {
        cls = classes[l];
        if (!cls.length) {
          continue;
        }
        if (match = /^odometer-theme-(.+)$/.exec(cls)) {
          theme = match[1];
          continue;
        }
        if (/^odometer(-|$)/.test(cls)) {
          continue;
        }
        newClasses.push(cls);
      }
      newClasses.push('odometer');
      if (!TRANSITION_SUPPORT) {
        newClasses.push('odometer-no-transitions');
      }
      if (theme) {
        newClasses.push("odometer-theme-" + theme);
      } else {
        newClasses.push("odometer-auto-theme");
      }
      this.el.className = newClasses.join(' ');
      this.ribbons = {};
      this.formatDigits(value);
      return this.startWatchingMutations();
    };

    Odometer.prototype.formatDigits = function(value) {
      var digit, l, len, len1, m, ref, ref1, valueDigit, valueString, wholePart;
      this.digits = [];
      if (this.options.formatFunction) {
        valueString = this.options.formatFunction(value);
        ref = valueString.split('').reverse();
        for (l = 0, len = ref.length; l < len; l++) {
          valueDigit = ref[l];
          if (valueDigit.match(/0-9/)) {
            digit = this.renderDigit();
            digit.querySelector('.odometer-value').innerHTML = valueDigit;
            this.digits.push(digit);
            this.insertDigit(digit);
          } else {
            this.addSpacer(valueDigit);
          }
        }
      } else {
        wholePart = !this.format.precision || !fractionalPart(value) || false;
        ref1 = value.toString().split('').reverse();
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          digit = ref1[m];
          if (digit === '.') {
            wholePart = true;
          }
          this.addDigit(digit, wholePart);
        }
      }
    };

    Odometer.prototype.update = function(newValue) {
      var diff;
      newValue = this.cleanValue(newValue);
      if (!(diff = newValue - this.value)) {
        return;
      }
      removeClass(this.el, 'odometer-animating-up odometer-animating-down odometer-animating');
      if (diff > 0) {
        addClass(this.el, 'odometer-animating-up');
      } else {
        addClass(this.el, 'odometer-animating-down');
      }
      this.stopWatchingMutations();
      this.animate(newValue);
      this.startWatchingMutations();
      setTimeout((function(_this) {
        return function() {
          _this.el.offsetHeight;
          return addClass(_this.el, 'odometer-animating');
        };
      })(this), 0);
      return this.value = newValue;
    };

    Odometer.prototype.renderDigit = function() {
      return createFromHTML(DIGIT_HTML);
    };

    Odometer.prototype.insertDigit = function(digit, before) {
      if (before != null) {
        return this.inside.insertBefore(digit, before);
      } else if (!this.inside.children.length) {
        return this.inside.appendChild(digit);
      } else {
        return this.inside.insertBefore(digit, this.inside.children[0]);
      }
    };

    Odometer.prototype.addSpacer = function(chr, before, extraClasses) {
      var spacer;
      spacer = createFromHTML(FORMAT_MARK_HTML);
      spacer.innerHTML = chr;
      if (extraClasses) {
        addClass(spacer, extraClasses);
      }
      return this.insertDigit(spacer, before);
    };

    Odometer.prototype.addDigit = function(value, repeating) {
      var chr, digit, ref, resetted;
      if (repeating == null) {
        repeating = true;
      }
      if (value === '-') {
        return this.addSpacer(value, null, 'odometer-negation-mark');
      }
      if (value === '.') {
        return this.addSpacer((ref = this.format.radix) != null ? ref : '.', null, 'odometer-radix-mark');
      }
      if (repeating) {
        resetted = false;
        while (true) {
          if (!this.format.repeating.length) {
            if (resetted) {
              throw new Error("Bad odometer format without digits");
            }
            this.resetFormat();
            resetted = true;
          }
          chr = this.format.repeating[this.format.repeating.length - 1];
          this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1);
          if (chr === 'd') {
            break;
          }
          this.addSpacer(chr);
        }
      }
      digit = this.renderDigit();
      digit.querySelector('.odometer-value').innerHTML = value;
      this.digits.push(digit);
      return this.insertDigit(digit);
    };

    Odometer.prototype.animate = function(newValue) {
      if (!TRANSITION_SUPPORT || this.options.animation === 'count') {
        return this.animateCount(newValue);
      } else {
        return this.animateSlide(newValue);
      }
    };

    Odometer.prototype.animateCount = function(newValue) {
      var cur, diff, last, start, tick;
      if (!(diff = +newValue - this.value)) {
        return;
      }
      start = last = now();
      cur = this.value;
      return (tick = (function(_this) {
        return function() {
          var delta, dist, fraction;
          if ((now() - start) > _this.options.duration) {
            _this.value = newValue;
            _this.render();
            trigger(_this.el, 'odometerdone');
            return;
          }
          delta = now() - last;
          if (delta > COUNT_MS_PER_FRAME) {
            last = now();
            fraction = delta / _this.options.duration;
            dist = diff * fraction;
            cur += dist;
            _this.render(Math.round(cur));
          }
          if (requestAnimationFrame != null) {
            return requestAnimationFrame(tick);
          } else {
            return setTimeout(tick, COUNT_MS_PER_FRAME);
          }
        };
      })(this))();
    };

    Odometer.prototype.getDigitCount = function() {
      var i, l, len, max, value, values;
      values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      for (i = l = 0, len = values.length; l < len; i = ++l) {
        value = values[i];
        values[i] = Math.abs(value);
      }
      max = Math.max.apply(Math, values);
      return Math.ceil(Math.log(max + 1) / Math.log(10));
    };

    Odometer.prototype.getFractionalDigitCount = function() {
      var i, l, len, parser, parts, value, values;
      values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      parser = /^\-?\d*\.(\d*?)0*$/;
      for (i = l = 0, len = values.length; l < len; i = ++l) {
        value = values[i];
        values[i] = value.toString();
        parts = parser.exec(values[i]);
        if (parts == null) {
          values[i] = 0;
        } else {
          values[i] = parts[1].length;
        }
      }
      return Math.max.apply(Math, values);
    };

    Odometer.prototype.resetDigits = function() {
      this.digits = [];
      this.ribbons = [];
      this.inside.innerHTML = '';
      return this.resetFormat();
    };

    Odometer.prototype.animateSlide = function(newValue) {
      var base, boosted, cur, diff, digitCount, digits, dist, end, fractionalCount, frame, frames, i, incr, j, l, len, len1, len2, m, mark, n, numEl, o, oldValue, p, ref, ref1, results, start;
      oldValue = this.value;
      fractionalCount = this.getFractionalDigitCount(oldValue, newValue);
      if (fractionalCount) {
        newValue = newValue * Math.pow(10, fractionalCount);
        oldValue = oldValue * Math.pow(10, fractionalCount);
      }
      if (!(diff = newValue - oldValue)) {
        return;
      }
      this.bindTransitionEnd();
      digitCount = this.getDigitCount(oldValue, newValue);
      digits = [];
      boosted = 0;
      for (i = l = 0, ref = digitCount; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        start = truncate(oldValue / Math.pow(10, digitCount - i - 1));
        end = truncate(newValue / Math.pow(10, digitCount - i - 1));
        dist = end - start;
        if (Math.abs(dist) > this.MAX_VALUES) {
          frames = [];
          incr = dist / (this.MAX_VALUES + this.MAX_VALUES * boosted * DIGIT_SPEEDBOOST);
          cur = start;
          while ((dist > 0 && cur < end) || (dist < 0 && cur > end)) {
            frames.push(Math.round(cur));
            cur += incr;
          }
          if (frames[frames.length - 1] !== end) {
            frames.push(end);
          }
          boosted++;
        } else {
          frames = (function() {
            results = [];
            for (var m = start; start <= end ? m <= end : m >= end; start <= end ? m++ : m--){ results.push(m); }
            return results;
          }).apply(this);
        }
        for (i = n = 0, len = frames.length; n < len; i = ++n) {
          frame = frames[i];
          frames[i] = Math.abs(frame % 10);
        }
        digits.push(frames);
      }
      this.resetDigits();
      ref1 = digits.reverse();
      for (i = o = 0, len1 = ref1.length; o < len1; i = ++o) {
        frames = ref1[i];
        if (!this.digits[i]) {
          this.addDigit(' ', i >= fractionalCount);
        }
        if ((base = this.ribbons)[i] == null) {
          base[i] = this.digits[i].querySelector('.odometer-ribbon-inner');
        }
        this.ribbons[i].innerHTML = '';
        if (diff < 0) {
          frames = frames.reverse();
        }
        for (j = p = 0, len2 = frames.length; p < len2; j = ++p) {
          frame = frames[j];
          numEl = document.createElement('div');
          numEl.className = 'odometer-value';
          numEl.innerHTML = frame;
          this.ribbons[i].appendChild(numEl);
          if (j === frames.length - 1) {
            addClass(numEl, 'odometer-last-value');
          }
          if (j === 0) {
            addClass(numEl, 'odometer-first-value');
          }
        }
      }
      if (start < 0) {
        this.addDigit('-');
      }
      mark = this.inside.querySelector('.odometer-radix-mark');
      if (mark != null) {
        mark.parent.removeChild(mark);
      }
      if (fractionalCount) {
        return this.addSpacer(this.format.radix, this.digits[fractionalCount - 1], 'odometer-radix-mark');
      }
    };

    return Odometer;

  })();

  Odometer.options = (ref = window.odometerOptions) != null ? ref : {};

  setTimeout(function() {
    var base, k, ref1, results, v;
    if (window.odometerOptions) {
      ref1 = window.odometerOptions;
      results = [];
      for (k in ref1) {
        v = ref1[k];
        results.push((base = Odometer.options)[k] != null ? base[k] : base[k] = v);
      }
      return results;
    }
  }, 0);

  Odometer.init = function() {
    var el, elements, l, len, ref1, results, value;
    if (document.querySelectorAll == null) {
      return;
    }
    elements = document.querySelectorAll(Odometer.options.selector || '.odometer');
    results = [];
    for (l = 0, len = elements.length; l < len; l++) {
      el = elements[l];
      value = (ref1 = el.innerText) != null ? ref1 : el.textContent;
      if (Odometer.options.from !== void 0) {
        el.odometer = new Odometer({
          el: el,
          value: Odometer.options.from
        });
        results.push(el.innerHTML = value);
      } else {
        results.push(el.odometer = new Odometer({
          el: el,
          value: value
        }));
      }
    }
    return results;
  };

  if ((((ref1 = document.documentElement) != null ? ref1.doScroll : void 0) != null) && (document.createEventObject != null)) {
    _old = document.onreadystatechange;
    document.onreadystatechange = function() {
      if (document.readyState === 'complete' && Odometer.options.auto !== false) {
        Odometer.init();
      }
      return _old != null ? _old.apply(this, arguments) : void 0;
    };
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (Odometer.options.auto !== false) {
        return Odometer.init();
      }
    }, false);
  }

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function() {
      return Odometer;
    });
  } else if (typeof exports === !'undefined') {
    module.exports = Odometer;
  } else {
    window.Odometer = Odometer;
  }

}).call(this);
