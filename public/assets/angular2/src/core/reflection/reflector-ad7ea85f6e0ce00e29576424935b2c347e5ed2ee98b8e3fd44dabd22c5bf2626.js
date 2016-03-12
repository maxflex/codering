'use strict';var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
/**
 * Reflective information about a symbol, including annotations, interfaces, and other metadata.
 */
var ReflectionInfo = (function () {
    function ReflectionInfo(annotations, parameters, factory, interfaces, propMetadata) {
        this.annotations = annotations;
        this.parameters = parameters;
        this.factory = factory;
        this.interfaces = interfaces;
        this.propMetadata = propMetadata;
    }
    return ReflectionInfo;
})();
exports.ReflectionInfo = ReflectionInfo;
/**
 * Provides access to reflection data about symbols. Used internally by Angular
 * to power dependency injection and compilation.
 */
var Reflector = (function () {
    function Reflector(reflectionCapabilities) {
        /** @internal */
        this._injectableInfo = new collection_1.Map();
        /** @internal */
        this._getters = new collection_1.Map();
        /** @internal */
        this._setters = new collection_1.Map();
        /** @internal */
        this._methods = new collection_1.Map();
        this._usedKeys = null;
        this.reflectionCapabilities = reflectionCapabilities;
    }
    Reflector.prototype.isReflectionEnabled = function () { return this.reflectionCapabilities.isReflectionEnabled(); };
    /**
     * Causes `this` reflector to track keys used to access
     * {@link ReflectionInfo} objects.
     */
    Reflector.prototype.trackUsage = function () { this._usedKeys = new collection_1.Set(); };
    /**
     * Lists types for which reflection information was not requested since
     * {@link #trackUsage} was called. This list could later be audited as
     * potential dead code.
     */
    Reflector.prototype.listUnusedKeys = function () {
        var _this = this;
        if (this._usedKeys == null) {
            throw new exceptions_1.BaseException('Usage tracking is disabled');
        }
        var allTypes = collection_1.MapWrapper.keys(this._injectableInfo);
        return allTypes.filter(function (key) { return !collection_1.SetWrapper.has(_this._usedKeys, key); });
    };
    Reflector.prototype.registerFunction = function (func, funcInfo) {
        this._injectableInfo.set(func, funcInfo);
    };
    Reflector.prototype.registerType = function (type, typeInfo) {
        this._injectableInfo.set(type, typeInfo);
    };
    Reflector.prototype.registerGetters = function (getters) { _mergeMaps(this._getters, getters); };
    Reflector.prototype.registerSetters = function (setters) { _mergeMaps(this._setters, setters); };
    Reflector.prototype.registerMethods = function (methods) { _mergeMaps(this._methods, methods); };
    Reflector.prototype.factory = function (type) {
        if (this._containsReflectionInfo(type)) {
            var res = this._getReflectionInfo(type).factory;
            return lang_1.isPresent(res) ? res : null;
        }
        else {
            return this.reflectionCapabilities.factory(type);
        }
    };
    Reflector.prototype.parameters = function (typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
            var res = this._getReflectionInfo(typeOrFunc).parameters;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.parameters(typeOrFunc);
        }
    };
    Reflector.prototype.annotations = function (typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
            var res = this._getReflectionInfo(typeOrFunc).annotations;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.annotations(typeOrFunc);
        }
    };
    Reflector.prototype.propMetadata = function (typeOrFunc) {
        if (this._injectableInfo.has(typeOrFunc)) {
            var res = this._getReflectionInfo(typeOrFunc).propMetadata;
            return lang_1.isPresent(res) ? res : {};
        }
        else {
            return this.reflectionCapabilities.propMetadata(typeOrFunc);
        }
    };
    Reflector.prototype.interfaces = function (type) {
        if (this._injectableInfo.has(type)) {
            var res = this._getReflectionInfo(type).interfaces;
            return lang_1.isPresent(res) ? res : [];
        }
        else {
            return this.reflectionCapabilities.interfaces(type);
        }
    };
    Reflector.prototype.getter = function (name) {
        if (this._getters.has(name)) {
            return this._getters.get(name);
        }
        else {
            return this.reflectionCapabilities.getter(name);
        }
    };
    Reflector.prototype.setter = function (name) {
        if (this._setters.has(name)) {
            return this._setters.get(name);
        }
        else {
            return this.reflectionCapabilities.setter(name);
        }
    };
    Reflector.prototype.method = function (name) {
        if (this._methods.has(name)) {
            return this._methods.get(name);
        }
        else {
            return this.reflectionCapabilities.method(name);
        }
    };
    /** @internal */
    Reflector.prototype._getReflectionInfo = function (typeOrFunc) {
        if (lang_1.isPresent(this._usedKeys)) {
            this._usedKeys.add(typeOrFunc);
        }
        return this._injectableInfo.get(typeOrFunc);
    };
    /** @internal */
    Reflector.prototype._containsReflectionInfo = function (typeOrFunc) { return this._injectableInfo.has(typeOrFunc); };
    Reflector.prototype.importUri = function (type) { return this.reflectionCapabilities.importUri(type); };
    return Reflector;
})();
exports.Reflector = Reflector;
function _mergeMaps(target, config) {
    collection_1.StringMapWrapper.forEach(config, function (v, k) { return target.set(k, v); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0b3IudHMiXSwibmFtZXMiOlsiUmVmbGVjdGlvbkluZm8iLCJSZWZsZWN0aW9uSW5mby5jb25zdHJ1Y3RvciIsIlJlZmxlY3RvciIsIlJlZmxlY3Rvci5jb25zdHJ1Y3RvciIsIlJlZmxlY3Rvci5pc1JlZmxlY3Rpb25FbmFibGVkIiwiUmVmbGVjdG9yLnRyYWNrVXNhZ2UiLCJSZWZsZWN0b3IubGlzdFVudXNlZEtleXMiLCJSZWZsZWN0b3IucmVnaXN0ZXJGdW5jdGlvbiIsIlJlZmxlY3Rvci5yZWdpc3RlclR5cGUiLCJSZWZsZWN0b3IucmVnaXN0ZXJHZXR0ZXJzIiwiUmVmbGVjdG9yLnJlZ2lzdGVyU2V0dGVycyIsIlJlZmxlY3Rvci5yZWdpc3Rlck1ldGhvZHMiLCJSZWZsZWN0b3IuZmFjdG9yeSIsIlJlZmxlY3Rvci5wYXJhbWV0ZXJzIiwiUmVmbGVjdG9yLmFubm90YXRpb25zIiwiUmVmbGVjdG9yLnByb3BNZXRhZGF0YSIsIlJlZmxlY3Rvci5pbnRlcmZhY2VzIiwiUmVmbGVjdG9yLmdldHRlciIsIlJlZmxlY3Rvci5zZXR0ZXIiLCJSZWZsZWN0b3IubWV0aG9kIiwiUmVmbGVjdG9yLl9nZXRSZWZsZWN0aW9uSW5mbyIsIlJlZmxlY3Rvci5fY29udGFpbnNSZWZsZWN0aW9uSW5mbyIsIlJlZmxlY3Rvci5pbXBvcnRVcmkiLCJfbWVyZ2VNYXBzIl0sIm1hcHBpbmdzIjoiQUFBQSxxQkFBeUMsMEJBQTBCLENBQUMsQ0FBQTtBQUNwRSwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSwyQkFPTyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBTXhDOztHQUVHO0FBQ0g7SUFDRUEsd0JBQW1CQSxXQUFtQkEsRUFBU0EsVUFBb0JBLEVBQVNBLE9BQWtCQSxFQUMzRUEsVUFBa0JBLEVBQVNBLFlBQXFDQTtRQURoRUMsZ0JBQVdBLEdB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Q0EsQ0FBQ0E7SUFDdkZwQixnQkFBQ0E7QUFBREEsQ0FBQ0EsQUF0SUQsSUFzSUM7QUF0SVksaUJBQVMsWUFzSXJCLENBQUE7QUFFRCxvQkFBb0IsTUFBcUIsRUFBRSxNQUFpQztJQUMxRXFCLDZCQUFnQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsVUFBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBS0EsT0FBQUEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBaEJBLENBQWdCQSxDQUFDQSxDQUFDQTtBQUMvREEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgc3RyaW5naWZ5fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtcbiAgTGlzdFdyYXBwZXIsXG4gIE1hcCxcbiAgTWFwV3JhcHBlcixcbiAgU2V0LFxuICBTZXRXcmFwcGVyLFxuICBTdHJpbmdNYXBXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1NldHRlckZuLCBHZXR0ZXJGbiwgTWV0aG9kRm59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybVJlZmxlY3Rpb25DYXBhYmlsaXRpZXN9IGZyb20gJy4vcGxhdGZvcm1fcmVmbGVjdGlvbl9jYXBhYmlsaXRpZXMnO1xuZXhwb3J0IHtTZXR0ZXJGbiwgR2V0dGVyRm4sIE1ldGhvZEZufSBmcm9tICcuL3R5cGVzJztcbmV4cG9ydCB7UGxhdGZvcm1SZWZsZWN0aW9uQ2FwYWJpbGl0aWVzfSBmcm9tICcuL3BsYXRmb3JtX3JlZmxlY3Rpb25fY2FwYWJpbGl0aWVzJztcblxuLyoqXG4gKiBSZWZsZWN0aXZlIGluZm9ybWF0aW9uIGFib3V0IGEgc3ltYm9sLCBpbmNsdWRpbmcgYW5ub3RhdGlvbnMsIGludGVyZmFjZXMsIGFuZCBvdGhlciBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlZmxlY3Rpb25JbmZvIHtcbiAgY29uc3RydWN0b3IocHVibGljIGFubm90YXRpb25zPzogYW55W10sIHB1YmxpYyBwYXJhbWV0ZXJzPzogYW55W11bXSwgcHVibGljIGZhY3Rvcnk/OiBGdW5jdGlvbixcbiAgICAgICAgICAgICAgcHVibGljIGludGVyZmFjZXM/OiBhbnlbXSwgcHVibGljIHByb3BNZXRhZGF0YT86IHtba2V5OiBzdHJpbmddOiBhbnlbXX0pIHt9XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYWNjZXNzIHRvIHJlZmxlY3Rpb24gZGF0YSBhYm91dCBzeW1ib2xzLiBVc2VkIGludGVybmFsbHkgYnkgQW5ndWxhclxuICogdG8gcG93ZXIgZGVwZW5kZW5jeSBpbmplY3Rpb24gYW5kIGNvbXBpbGF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgUmVmbGVjdG9yIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5qZWN0YWJsZUluZm8gPSBuZXcgTWFwPGFueSwgUmVmbGVjdGlvbkluZm8+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldHRlcnMgPSBuZXcgTWFwPHN0cmluZywgR2V0dGVyRm4+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldHRlcnMgPSBuZXcgTWFwPHN0cmluZywgU2V0dGVyRm4+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX21ldGhvZHMgPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kRm4+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VzZWRLZXlzOiBTZXQ8YW55PjtcbiAgcmVmbGVjdGlvbkNhcGFiaWxpdGllczogUGxhdGZvcm1SZWZsZWN0aW9uQ2FwYWJpbGl0aWVzO1xuXG4gIGNvbnN0cnVjdG9yKHJlZmxlY3Rpb25DYXBhYmlsaXRpZXM6IFBsYXRmb3JtUmVmbGVjdGlvbkNhcGFiaWxpdGllcykge1xuICAgIHRoaXMuX3VzZWRLZXlzID0gbnVsbDtcbiAgICB0aGlzLnJlZmxlY3Rpb25DYXBhYmlsaXRpZXMgPSByZWZsZWN0aW9uQ2FwYWJpbGl0aWVzO1xuICB9XG5cbiAgaXNSZWZsZWN0aW9uRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucmVmbGVjdGlvbkNhcGFiaWxpdGllcy5pc1JlZmxlY3Rpb25FbmFibGVkKCk7IH1cblxuICAvKipcbiAgICogQ2F1c2VzIGB0aGlzYCByZWZsZWN0b3IgdG8gdHJhY2sga2V5cyB1c2VkIHRvIGFjY2Vzc1xuICAgKiB7QGxpbmsgUmVmbGVjdGlvbkluZm99IG9iamVjdHMuXG4gICAqL1xuICB0cmFja1VzYWdlKCk6IHZvaWQgeyB0aGlzLl91c2VkS2V5cyA9IG5ldyBTZXQoKTsgfVxuXG4gIC8qKlxuICAgKiBMaXN0cyB0eXBlcyBmb3Igd2hpY2ggcmVmbGVjdGlvbiBpbmZvcm1hdGlvbiB3YXMgbm90IHJlcXVlc3RlZCBzaW5jZVxuICAgKiB7QGxpbmsgI3RyYWNrVXNhZ2V9IHdhcyBjYWxsZWQuIFRoaXMgbGlzdCBjb3VsZCBsYXRlciBiZSBhdWRpdGVkIGFzXG4gICAqIHBvdGVudGlhbCBkZWFkIGNvZGUuXG4gICAqL1xuICBsaXN0VW51c2VkS2V5cygpOiBhbnlbXSB7XG4gICAgaWYgKHRoaXMuX3VzZWRLZXlzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdVc2FnZSB0cmFja2luZyBpcyBkaXNhYmxlZCcpO1xuICAgIH1cbiAgICB2YXIgYWxsVHlwZXMgPSBNYXBXcmFwcGVyLmtleXModGhpcy5faW5qZWN0YWJsZUluZm8pO1xuICAgIHJldHVybiBhbGxUeXBlcy5maWx0ZXIoa2V5ID0+ICFTZXRXcmFwcGVyLmhhcyh0aGlzLl91c2VkS2V5cywga2V5KSk7XG4gIH1cblxuICByZWdpc3RlckZ1bmN0aW9uKGZ1bmM6IEZ1bmN0aW9uLCBmdW5jSW5mbzogUmVmbGVjdGlvbkluZm8pOiB2b2lkIHtcbiAgICB0aGlzLl9pbmplY3RhYmxlSW5mby5zZXQoZnVuYywgZnVuY0luZm8pO1xuICB9XG5cbiAgcmVnaXN0ZXJUeXBlKHR5cGU6IFR5cGUsIHR5cGVJbmZvOiBSZWZsZWN0aW9uSW5mbyk6IHZvaWQge1xuICAgIHRoaXMuX2luamVjdGFibGVJbmZvLnNldCh0eXBlLCB0eXBlSW5mbyk7XG4gIH1cblxuICByZWdpc3RlckdldHRlcnMoZ2V0dGVyczoge1trZXk6IHN0cmluZ106IEdldHRlckZufSk6IHZvaWQgeyBfbWVyZ2VNYXBzKHRoaXMuX2dldHRlcnMsIGdldHRlcnMpOyB9XG5cbiAgcmVnaXN0ZXJTZXR0ZXJzKHNldHRlcnM6IHtba2V5OiBzdHJpbmddOiBTZXR0ZXJGbn0pOiB2b2lkIHsgX21lcmdlTWFwcyh0aGlzLl9zZXR0ZXJzLCBzZXR0ZXJzKTsgfVxuXG4gIHJlZ2lzdGVyTWV0aG9kcyhtZXRob2RzOiB7W2tleTogc3RyaW5nXTogTWV0aG9kRm59KTogdm9pZCB7IF9tZXJnZU1hcHModGhpcy5fbWV0aG9kcywgbWV0aG9kcyk7IH1cblxuICBmYWN0b3J5KHR5cGU6IFR5cGUpOiBGdW5jdGlvbiB7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5zUmVmbGVjdGlvbkluZm8odHlwZSkpIHtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9nZXRSZWZsZWN0aW9uSW5mbyh0eXBlKS5mYWN0b3J5O1xuICAgICAgcmV0dXJuIGlzUHJlc2VudChyZXMpID8gcmVzIDogbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVmbGVjdGlvbkNhcGFiaWxpdGllcy5mYWN0b3J5KHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIHBhcmFtZXRlcnModHlwZU9yRnVuYzogLypUeXBlKi8gYW55KTogYW55W10ge1xuICAgIGlmICh0aGlzLl9pbmplY3RhYmxlSW5mby5oYXModHlwZU9yRnVuYykpIHtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9nZXRSZWZsZWN0aW9uSW5mbyh0eXBlT3JGdW5jKS5wYXJhbWV0ZXJzO1xuICAgICAgcmV0dXJuIGlzUHJlc2VudChyZXMpID8gcmVzIDogW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmxlY3Rpb25DYXBhYmlsaXRpZXMucGFyYW1ldGVycyh0eXBlT3JGdW5jKTtcbiAgICB9XG4gIH1cblxuICBhbm5vdGF0aW9ucyh0eXBlT3JGdW5jOiAvKlR5cGUqLyBhbnkpOiBhbnlbXSB7XG4gICAgaWYgKHRoaXMuX2luamVjdGFibGVJbmZvLmhhcyh0eXBlT3JGdW5jKSkge1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX2dldFJlZmxlY3Rpb25JbmZvKHR5cGVPckZ1bmMpLmFubm90YXRpb25zO1xuICAgICAgcmV0dXJuIGlzUHJlc2VudChyZXMpID8gcmVzIDogW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuYW5ub3RhdGlvbnModHlwZU9yRnVuYyk7XG4gICAgfVxuICB9XG5cbiAgcHJvcE1ldGFkYXRhKHR5cGVPckZ1bmM6IC8qVHlwZSovIGFueSk6IHtba2V5OiBzdHJpbmddOiBhbnlbXX0ge1xuICAgIGlmICh0aGlzLl9pbmplY3RhYmxlSW5mby5oYXModHlwZU9yRnVuYykpIHtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9nZXRSZWZsZWN0aW9uSW5mbyh0eXBlT3JGdW5jKS5wcm9wTWV0YWRhdGE7XG4gICAgICByZXR1cm4gaXNQcmVzZW50KHJlcykgPyByZXMgOiB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVmbGVjdGlvbkNhcGFiaWxpdGllcy5wcm9wTWV0YWRhdGEodHlwZU9yRnVuYyk7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJmYWNlcyh0eXBlOiBUeXBlKTogYW55W10ge1xuICAgIGlmICh0aGlzLl9pbmplY3RhYmxlSW5mby5oYXModHlwZSkpIHtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9nZXRSZWZsZWN0aW9uSW5mbyh0eXBlKS5pbnRlcmZhY2VzO1xuICAgICAgcmV0dXJuIGlzUHJlc2VudChyZXMpID8gcmVzIDogW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZmxlY3Rpb25DYXBhYmlsaXRpZXMuaW50ZXJmYWNlcyh0eXBlKTtcbiAgICB9XG4gIH1cblxuICBnZXR0ZXIobmFtZTogc3RyaW5nKTogR2V0dGVyRm4ge1xuICAgIGlmICh0aGlzLl9nZXR0ZXJzLmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldHRlcnMuZ2V0KG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLmdldHRlcihuYW1lKTtcbiAgICB9XG4gIH1cblxuICBzZXR0ZXIobmFtZTogc3RyaW5nKTogU2V0dGVyRm4ge1xuICAgIGlmICh0aGlzLl9zZXR0ZXJzLmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldHRlcnMuZ2V0KG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLnNldHRlcihuYW1lKTtcbiAgICB9XG4gIH1cblxuICBtZXRob2QobmFtZTogc3RyaW5nKTogTWV0aG9kRm4ge1xuICAgIGlmICh0aGlzLl9tZXRob2RzLmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21ldGhvZHMuZ2V0KG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLm1ldGhvZChuYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRSZWZsZWN0aW9uSW5mbyh0eXBlT3JGdW5jKSB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl91c2VkS2V5cykpIHtcbiAgICAgIHRoaXMuX3VzZWRLZXlzLmFkZCh0eXBlT3JGdW5jKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2luamVjdGFibGVJbmZvLmdldCh0eXBlT3JGdW5jKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRhaW5zUmVmbGVjdGlvbkluZm8odHlwZU9yRnVuYykgeyByZXR1cm4gdGhpcy5faW5qZWN0YWJsZUluZm8uaGFzKHR5cGVPckZ1bmMpOyB9XG5cbiAgaW1wb3J0VXJpKHR5cGU6IFR5cGUpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5yZWZsZWN0aW9uQ2FwYWJpbGl0aWVzLmltcG9ydFVyaSh0eXBlKTsgfVxufVxuXG5mdW5jdGlvbiBfbWVyZ2VNYXBzKHRhcmdldDogTWFwPGFueSwgYW55PiwgY29uZmlnOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259KTogdm9pZCB7XG4gIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChjb25maWcsICh2LCBrKSA9PiB0YXJnZXQuc2V0KGssIHYpKTtcbn1cbiJdfQ==
