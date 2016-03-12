'use strict';var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var _global = (typeof window === 'undefined' ? lang_1.global : window);
/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * ## Example
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 */
exports.expect = _global.expect;
// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
Map.prototype['jasmineToString'] = function () {
    var m = this;
    if (!m) {
        return '' + m;
    }
    var res = [];
    m.forEach(function (v, k) { res.push(k + ":" + v); });
    return "{ " + res.join(',') + " }";
};
_global.beforeEach(function () {
    jasmine.addMatchers({
        // Custom handler for Map as Jasmine does not support it yet
        toEqual: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expected) {
                    return { pass: util.equals(actual, expected, [compareMap]) };
                }
            };
            function compareMap(actual, expected) {
                if (actual instanceof Map) {
                    var pass = actual.size === expected.size;
                    if (pass) {
                        actual.forEach(function (v, k) { pass = pass && util.equals(v, expected.get(k)); });
                    }
                    return pass;
                }
                else {
                    return undefined;
                }
            }
        },
        toBePromise: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && typeof actual.then === 'function';
                    return { pass: pass, get message() { return 'Expected ' + actual + ' to be a promise'; } };
                }
            };
        },
        toBeAnInstanceOf: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && actual instanceof expectedClass;
                    return {
                        pass: pass,
                        get message() {
                            return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                        }
                    };
                }
            };
        },
        toHaveText: function () {
            return {
                compare: function (actual, expectedText) {
                    var actualText = elementText(actual);
                    return {
                        pass: actualText == expectedText,
                        get message() { return 'Expected ' + actualText + ' to be equal to ' + expectedText; }
                    };
                }
            };
        },
        toHaveCssClass: function () {
            return { compare: buildError(false), negativeCompare: buildError(true) };
            function buildError(isNot) {
                return function (actual, className) {
                    return {
                        pass: dom_adapter_1.DOM.hasClass(actual, className) == !isNot,
                        get message() {
                            return "Expected " + actual.outerHTML + " " + (isNot ? 'not ' : '') + "to contain the CSS class \"" + className + "\"";
                        }
                    };
                };
            }
        },
        toHaveCssStyle: function () {
            return {
                compare: function (actual, styles) {
                    var allPassed;
                    if (lang_1.isString(styles)) {
                        allPassed = dom_adapter_1.DOM.hasStyle(actual, styles);
                    }
                    else {
                        allPassed = !collection_1.StringMapWrapper.isEmpty(styles);
                        collection_1.StringMapWrapper.forEach(styles, function (style, prop) {
                            allPassed = allPassed && dom_adapter_1.DOM.hasStyle(actual, prop, style);
                        });
                    }
                    return {
                        pass: allPassed,
                        get message() {
                            var expectedValueStr = lang_1.isString(styles) ? styles : JSON.stringify(styles);
                            return "Expected " + actual.outerHTML + " " + (!allPassed ? ' ' : 'not ') + "to contain the\n                      CSS " + (lang_1.isString(styles) ? 'property' : 'styles') + " \"" + expectedValueStr + "\"";
                        }
                    };
                }
            };
        },
        toContainError: function () {
            return {
                compare: function (actual, expectedText) {
                    var errorMessage = actual.toString();
                    return {
                        pass: errorMessage.indexOf(expectedText) > -1,
                        get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                    };
                }
            };
        },
        toThrowErrorWith: function () {
            return {
                compare: function (actual, expectedText) {
                    try {
                        actual();
                        return {
                            pass: false,
                            get message() { return "Was expected to throw, but did not throw"; }
                        };
                    }
                    catch (e) {
                        var errorMessage = e.toString();
                        return {
                            pass: errorMessage.indexOf(expectedText) > -1,
                            get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                        };
                    }
                }
            };
        },
        toImplement: function () {
            return {
                compare: function (actualObject, expectedInterface) {
                    var objProps = Object.keys(actualObject.constructor.prototype);
                    var intProps = Object.keys(expectedInterface.prototype);
                    var missedMethods = [];
                    intProps.forEach(function (k) {
                        if (!actualObject.constructor.prototype[k])
                            missedMethods.push(k);
                    });
                    return {
                        pass: missedMethods.length == 0,
                        get message() {
                            return 'Expected ' + actualObject + ' to have the following methods: ' +
                                missedMethods.join(", ");
                        }
                    };
                }
            };
        }
    });
});
function elementText(n) {
    var hasNodes = function (n) {
        var children = dom_adapter_1.DOM.childNodes(n);
        return children && children.length > 0;
    };
    if (n instanceof Array) {
        return n.map(elementText).join("");
    }
    if (dom_adapter_1.DOM.isCommentNode(n)) {
        return '';
    }
    if (dom_adapter_1.DOM.isElementNode(n) && dom_adapter_1.DOM.tagName(n) == 'CONTENT') {
        return elementText(Array.prototype.slice.apply(dom_adapter_1.DOM.getDistributedNodes(n)));
    }
    if (dom_adapter_1.DOM.hasShadowRoot(n)) {
        return elementText(dom_adapter_1.DOM.childNodesAsList(dom_adapter_1.DOM.getShadowRoot(n)));
    }
    if (hasNodes(n)) {
        return elementText(dom_adapter_1.DOM.childNodesAsList(n));
    }
    return dom_adapter_1.DOM.getText(n);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvdGVzdGluZy9tYXRjaGVycy50cyJdLCJuYW1lcyI6WyJjb21wYXJlTWFwIiwibWVzc2FnZSIsImJ1aWxkRXJyb3IiLCJlbGVtZW50VGV4dCJdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFDMUQscUJBQStCLDBCQUEwQixDQUFDLENBQUE7QUFDMUQsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUFvRmhFLElBQUksT0FBTyxHQUFnQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxhQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFFN0Y7Ozs7OztHQU1HO0FBQ1EsY0FBTSxHQUFxQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBR3JFLGtFQUFrRTtBQUNsRSx3Q0FBd0M7QUFDeEMsaUVBQWlFO0FBQ2pFLG9CQUFvQjtBQUNwQixHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7SUFDakMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUksQ0FBQyxTQUFJLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsTUFBTSxDQUFDLE9BQUssR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBSSxDQUFDO0FBQ2hDLENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDakIsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUNsQiw0REFBNEQ7UUFDNUQsT0FB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QUNBO1FBQ3pCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDakVBLENBQUNBO0lBRURBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxpQkFBR0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM5Q0EsQ0FBQ0E7SUFFREEsTUFBTUEsQ0FBQ0EsaUJBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBQ3hCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7Z2xvYmFsLCBpc1N0cmluZ30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuLyoqXG4gKiBKYXNtaW5lIG1hdGNoZXJzIHRoYXQgY2hlY2sgQW5ndWxhciBzcGVjaWZpYyBjb25kaXRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nTWF0Y2hlcnMgZXh0ZW5kcyBqYXNtaW5lLk1hdGNoZXJzIHtcbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgdmFsdWUgdG8gYmUgYSBgUHJvbWlzZWAuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0JlUHJvbWlzZSd9XG4gICAqL1xuICB0b0JlUHJvbWlzZSgpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFeHBlY3QgdGhlIHZhbHVlIHRvIGJlIGFuIGluc3RhbmNlIG9mIGEgY2xhc3MuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0JlQW5JbnN0YW5jZU9mJ31cbiAgICovXG4gIHRvQmVBbkluc3RhbmNlT2YoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgZWxlbWVudCB0byBoYXZlIGV4YWN0bHkgdGhlIGdpdmVuIHRleHQuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVUZXh0J31cbiAgICovXG4gIHRvSGF2ZVRleHQoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCB0aGUgZWxlbWVudCB0byBoYXZlIHRoZSBnaXZlbiBDU1MgY2xhc3MuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVDc3NDbGFzcyd9XG4gICAqL1xuICB0b0hhdmVDc3NDbGFzcyhleHBlY3RlZDogYW55KTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXhwZWN0IHRoZSBlbGVtZW50IHRvIGhhdmUgdGhlIGdpdmVuIENTUyBzdHlsZXMuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVDc3NTdHlsZSd9XG4gICAqL1xuICB0b0hhdmVDc3NTdHlsZShleHBlY3RlZDogYW55KTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXhwZWN0IGEgY2xhc3MgdG8gaW1wbGVtZW50IHRoZSBpbnRlcmZhY2Ugb2YgdGhlIGdpdmVuIGNsYXNzLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqXG4gICAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL21hdGNoZXJzLnRzIHJlZ2lvbj0ndG9JbXBsZW1lbnQnfVxuICAgKi9cbiAgdG9JbXBsZW1lbnQoZXhwZWN0ZWQ6IGFueSk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEV4cGVjdCBhbiBleGNlcHRpb24gdG8gY29udGFpbiB0aGUgZ2l2ZW4gZXJyb3IgdGV4dC5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgdGVzdGluZy90cy9tYXRjaGVycy50cyByZWdpb249J3RvQ29udGFpbkVycm9yJ31cbiAgICovXG4gIHRvQ29udGFpbkVycm9yKGV4cGVjdGVkOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFeHBlY3QgYSBmdW5jdGlvbiB0byB0aHJvdyBhbiBlcnJvciB3aXRoIHRoZSBnaXZlbiBlcnJvciB0ZXh0IHdoZW4gZXhlY3V0ZWQuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b1Rocm93RXJyb3JXaXRoJ31cbiAgICovXG4gIHRvVGhyb3dFcnJvcldpdGgoZXhwZWN0ZWRNZXNzYWdlOiBhbnkpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbnZlcnQgdGhlIG1hdGNoZXJzLlxuICAgKi9cbiAgbm90OiBOZ01hdGNoZXJzO1xufVxuXG52YXIgX2dsb2JhbDogamFzbWluZS5HbG9iYWxQb2xsdXRlciA9IDxhbnk+KHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93KTtcblxuLyoqXG4gKiBKYXNtaW5lIG1hdGNoaW5nIGZ1bmN0aW9uIHdpdGggQW5ndWxhciBtYXRjaGVycyBtaXhlZCBpbi5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvbWF0Y2hlcnMudHMgcmVnaW9uPSd0b0hhdmVUZXh0J31cbiAqL1xuZXhwb3J0IHZhciBleHBlY3Q6IChhY3R1YWw6IGFueSkgPT4gTmdNYXRjaGVycyA9IDxhbnk+X2dsb2JhbC5leHBlY3Q7XG5cblxuLy8gU29tZSBNYXAgcG9seWZpbGxzIGRvbid0IHBvbHlmaWxsIE1hcC50b1N0cmluZyBjb3JyZWN0bHksIHdoaWNoXG4vLyBnaXZlcyB1cyBiYWQgZXJyb3IgbWVzc2FnZXMgaW4gdGVzdHMuXG4vLyBUaGUgb25seSB3YXkgdG8gZG8gdGhpcyBpbiBKYXNtaW5lIGlzIHRvIG1vbmtleSBwYXRjaCBhIG1ldGhvZFxuLy8gdG8gdGhlIG9iamVjdCA6LShcbk1hcC5wcm90b3R5cGVbJ2phc21pbmVUb1N0cmluZyddID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtID0gdGhpcztcbiAgaWYgKCFtKSB7XG4gICAgcmV0dXJuICcnICsgbTtcbiAgfVxuICB2YXIgcmVzID0gW107XG4gIG0uZm9yRWFjaCgodiwgaykgPT4geyByZXMucHVzaChgJHtrfToke3Z9YCk7IH0pO1xuICByZXR1cm4gYHsgJHtyZXMuam9pbignLCcpfSB9YDtcbn07XG5cbl9nbG9iYWwuYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgamFzbWluZS5hZGRNYXRjaGVycyh7XG4gICAgLy8gQ3VzdG9tIGhhbmRsZXIgZm9yIE1hcCBhcyBKYXNtaW5lIGRvZXMgbm90IHN1cHBvcnQgaXQgeWV0XG4gICAgdG9FcXVhbDogZnVuY3Rpb24odXRpbCwgY3VzdG9tRXF1YWxpdHlUZXN0ZXJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHtwYXNzOiB1dGlsLmVxdWFscyhhY3R1YWwsIGV4cGVjdGVkLCBbY29tcGFyZU1hcF0pfTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gY29tcGFyZU1hcChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gICAgICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICB2YXIgcGFzcyA9IGFjdHVhbC5zaXplID09PSBleHBlY3RlZC5zaXplO1xuICAgICAgICAgIGlmIChwYXNzKSB7XG4gICAgICAgICAgICBhY3R1YWwuZm9yRWFjaCgodiwgaykgPT4geyBwYXNzID0gcGFzcyAmJiB1dGlsLmVxdWFscyh2LCBleHBlY3RlZC5nZXQoaykpOyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB0b0JlUHJvbWlzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkQ2xhc3MpIHtcbiAgICAgICAgICB2YXIgcGFzcyA9IHR5cGVvZiBhY3R1YWwgPT09ICdvYmplY3QnICYmIHR5cGVvZiBhY3R1YWwudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgICAgICByZXR1cm4ge3Bhc3M6IHBhc3MsIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gJ0V4cGVjdGVkICcgKyBhY3R1YWwgKyAnIHRvIGJlIGEgcHJvbWlzZSc7IH19O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b0JlQW5JbnN0YW5jZU9mOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWRDbGFzcykge1xuICAgICAgICAgIHZhciBwYXNzID0gdHlwZW9mIGFjdHVhbCA9PT0gJ29iamVjdCcgJiYgYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcztcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFzczogcGFzcyxcbiAgICAgICAgICAgIGdldCBtZXNzYWdlKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJ0V4cGVjdGVkICcgKyBhY3R1YWwgKyAnIHRvIGJlIGFuIGluc3RhbmNlIG9mICcgKyBleHBlY3RlZENsYXNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcblxuICAgIHRvSGF2ZVRleHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZFRleHQpIHtcbiAgICAgICAgICB2YXIgYWN0dWFsVGV4dCA9IGVsZW1lbnRUZXh0KGFjdHVhbCk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhc3M6IGFjdHVhbFRleHQgPT0gZXhwZWN0ZWRUZXh0LFxuICAgICAgICAgICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiAnRXhwZWN0ZWQgJyArIGFjdHVhbFRleHQgKyAnIHRvIGJlIGVxdWFsIHRvICcgKyBleHBlY3RlZFRleHQ7IH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b0hhdmVDc3NDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge2NvbXBhcmU6IGJ1aWxkRXJyb3IoZmFsc2UpLCBuZWdhdGl2ZUNvbXBhcmU6IGJ1aWxkRXJyb3IodHJ1ZSl9O1xuXG4gICAgICBmdW5jdGlvbiBidWlsZEVycm9yKGlzTm90KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhY3R1YWwsIGNsYXNzTmFtZSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXNzOiBET00uaGFzQ2xhc3MoYWN0dWFsLCBjbGFzc05hbWUpID09ICFpc05vdCxcbiAgICAgICAgICAgIGdldCBtZXNzYWdlKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYEV4cGVjdGVkICR7YWN0dWFsLm91dGVySFRNTH0gJHtpc05vdCA/ICdub3QgJyA6ICcnfXRvIGNvbnRhaW4gdGhlIENTUyBjbGFzcyBcIiR7Y2xhc3NOYW1lfVwiYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB0b0hhdmVDc3NTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIHN0eWxlcykge1xuICAgICAgICAgIHZhciBhbGxQYXNzZWQ7XG4gICAgICAgICAgaWYgKGlzU3RyaW5nKHN0eWxlcykpIHtcbiAgICAgICAgICAgIGFsbFBhc3NlZCA9IERPTS5oYXNTdHlsZShhY3R1YWwsIHN0eWxlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsbFBhc3NlZCA9ICFTdHJpbmdNYXBXcmFwcGVyLmlzRW1wdHkoc3R5bGVzKTtcbiAgICAgICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChzdHlsZXMsIChzdHlsZSwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgICBhbGxQYXNzZWQgPSBhbGxQYXNzZWQgJiYgRE9NLmhhc1N0eWxlKGFjdHVhbCwgcHJvcCwgc3R5bGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhc3M6IGFsbFBhc3NlZCxcbiAgICAgICAgICAgIGdldCBtZXNzYWdlKCkge1xuICAgICAgICAgICAgICB2YXIgZXhwZWN0ZWRWYWx1ZVN0ciA9IGlzU3RyaW5nKHN0eWxlcykgPyBzdHlsZXMgOiBKU09OLnN0cmluZ2lmeShzdHlsZXMpO1xuICAgICAgICAgICAgICByZXR1cm4gYEV4cGVjdGVkICR7YWN0dWFsLm91dGVySFRNTH0gJHshYWxsUGFzc2VkID8gJyAnIDogJ25vdCAnfXRvIGNvbnRhaW4gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgQ1NTICR7aXNTdHJpbmcoc3R5bGVzKSA/ICdwcm9wZXJ0eScgOiAnc3R5bGVzJ30gXCIke2V4cGVjdGVkVmFsdWVTdHJ9XCJgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcblxuICAgIHRvQ29udGFpbkVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWRUZXh0KSB7XG4gICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGFjdHVhbC50b1N0cmluZygpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXNzOiBlcnJvck1lc3NhZ2UuaW5kZXhPZihleHBlY3RlZFRleHQpID4gLTEsXG4gICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHsgcmV0dXJuICdFeHBlY3RlZCAnICsgZXJyb3JNZXNzYWdlICsgJyB0byBjb250YWluICcgKyBleHBlY3RlZFRleHQ7IH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b1Rocm93RXJyb3JXaXRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWRUZXh0KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGFjdHVhbCgpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgcGFzczogZmFsc2UsXG4gICAgICAgICAgICAgIGdldCBtZXNzYWdlKCkgeyByZXR1cm4gXCJXYXMgZXhwZWN0ZWQgdG8gdGhyb3csIGJ1dCBkaWQgbm90IHRocm93XCI7IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHBhc3M6IGVycm9yTWVzc2FnZS5pbmRleE9mKGV4cGVjdGVkVGV4dCkgPiAtMSxcbiAgICAgICAgICAgICAgZ2V0IG1lc3NhZ2UoKSB7IHJldHVybiAnRXhwZWN0ZWQgJyArIGVycm9yTWVzc2FnZSArICcgdG8gY29udGFpbiAnICsgZXhwZWN0ZWRUZXh0OyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgdG9JbXBsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsT2JqZWN0LCBleHBlY3RlZEludGVyZmFjZSkge1xuICAgICAgICAgIHZhciBvYmpQcm9wcyA9IE9iamVjdC5rZXlzKGFjdHVhbE9iamVjdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICAgICAgICAgIHZhciBpbnRQcm9wcyA9IE9iamVjdC5rZXlzKGV4cGVjdGVkSW50ZXJmYWNlLnByb3RvdHlwZSk7XG5cbiAgICAgICAgICB2YXIgbWlzc2VkTWV0aG9kcyA9IFtdO1xuICAgICAgICAgIGludFByb3BzLmZvckVhY2goKGspID0+IHtcbiAgICAgICAgICAgIGlmICghYWN0dWFsT2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZVtrXSkgbWlzc2VkTWV0aG9kcy5wdXNoKGspO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhc3M6IG1pc3NlZE1ldGhvZHMubGVuZ3RoID09IDAsXG4gICAgICAgICAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgYWN0dWFsT2JqZWN0ICsgJyB0byBoYXZlIHRoZSBmb2xsb3dpbmcgbWV0aG9kczogJyArXG4gICAgICAgICAgICAgICAgICAgICBtaXNzZWRNZXRob2RzLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZWxlbWVudFRleHQobikge1xuICB2YXIgaGFzTm9kZXMgPSAobikgPT4ge1xuICAgIHZhciBjaGlsZHJlbiA9IERPTS5jaGlsZE5vZGVzKG4pO1xuICAgIHJldHVybiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9O1xuXG4gIGlmIChuIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gbi5tYXAoZWxlbWVudFRleHQpLmpvaW4oXCJcIik7XG4gIH1cblxuICBpZiAoRE9NLmlzQ29tbWVudE5vZGUobikpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAoRE9NLmlzRWxlbWVudE5vZGUobikgJiYgRE9NLnRhZ05hbWUobikgPT0gJ0NPTlRFTlQnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRUZXh0KEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShET00uZ2V0RGlzdHJpYnV0ZWROb2RlcyhuKSkpO1xuICB9XG5cbiAgaWYgKERPTS5oYXNTaGFkb3dSb290KG4pKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRUZXh0KERPTS5jaGlsZE5vZGVzQXNMaXN0KERPTS5nZXRTaGFkb3dSb290KG4pKSk7XG4gIH1cblxuICBpZiAoaGFzTm9kZXMobikpIHtcbiAgICByZXR1cm4gZWxlbWVudFRleHQoRE9NLmNoaWxkTm9kZXNBc0xpc3QobikpO1xuICB9XG5cbiAgcmV0dXJuIERPTS5nZXRUZXh0KG4pO1xufVxuIl19
