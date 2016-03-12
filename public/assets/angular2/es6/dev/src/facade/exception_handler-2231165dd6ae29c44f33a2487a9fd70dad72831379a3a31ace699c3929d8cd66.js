import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { WrappedException } from 'angular2/src/facade/exceptions';
import { isListLikeIterable } from 'angular2/src/facade/collection';
class _ArrayLogger {
    constructor() {
        this.res = [];
    }
    log(s) { this.res.push(s); }
    logError(s) { this.res.push(s); }
    logGroup(s) { this.res.push(s); }
    logGroupEnd() { }
    ;
}
/**
 * Provides a hook for centralized exception handling.
 *
 * The default implementation of `ExceptionHandler` prints error messages to the `Console`. To
 * intercept error handling,
 * write a custom exception handler that replaces this default as appropriate for your app.
 *
 * ### Example
 *
 * ```javascript
 *
 * class MyExceptionHandler implements ExceptionHandler {
 *   call(error, stackTrace = null, reason = null) {
 *     // do something with the exception
 *   }
 * }
 *
 * bootstrap(MyApp, [provide(ExceptionHandler, {useClass: MyExceptionHandler})])
 *
 * ```
 */
export class ExceptionHandler {
    constructor(_logger, _rethrowException = true) {
        this._logger = _logger;
        this._rethrowException = _rethrowException;
    }
    static exceptionToString(exception, stackTrace = null, reason = null) {
        var l = new _ArrayLogger();
        var e = new ExceptionHandler(l, false);
        e.call(exception, stackTrace, reason);
        return l.res.join("\n");
    }
    call(exception, stackTrace = null, reason = null) {
        var originalException = this._findOriginalException(exception);
        var originalStack = this._findOriginalStack(exception);
        var context = this._findContext(exception);
        this._logger.logGroup(`EXCEPTION: ${this._extractMessage(exception)}`);
        if (isPresent(stackTrace) && isBlank(originalStack)) {
            this._logger.logError("STACKTRACE:");
            this._logger.logError(this._longStackTrace(stackTrace));
        }
        if (isPresent(reason)) {
            this._logger.logError(`REASON: ${reason}`);
        }
        if (isPresent(originalException)) {
            this._logger.logError(`ORIGINAL EXCEPTION: ${this._extractMessage(originalException)}`);
        }
        if (isPresent(originalStack)) {
            this._logger.logError("ORIGINAL STACKTRACE:");
            this._logger.logError(this._longStackTrace(originalStack));
        }
        if (isPresent(context)) {
            this._logger.logError("ERROR CONTEXT:");
            this._logger.logError(context);
        }
        this._logger.logGroupEnd();
        // We rethrow exceptions, so operations like 'bootstrap' will result in an error
        // when an exception happens. If we do not rethrow, bootstrap will always succeed.
        if (this._rethrowException)
            throw exception;
    }
    /** @internal */
    _extractMessage(exception) {
        return exception instanceof WrappedException ? exception.wrapperMessage : exception.toString();
    }
    /** @internal */
    _longStackTrace(stackTrace) {
        return isListLikeIterable(stackTrace) ? stackTrace.join("\n\n-----async gap-----\n") :
            stackTrace.toString();
    }
    /** @internal */
    _findContext(exception) {
        try {
            if (!(exception instanceof WrappedException))
                return null;
            return isPresent(exception.context) ? exception.context :
                this._findContext(exception.originalException);
        }
        catch (e) {
            // exception.context can throw an exception. if it happens, we ignore the context.
            return null;
        }
    }
    /** @internal */
    _findOriginalException(exception) {
        if (!(exception instanceof WrappedException))
            return null;
        var e = exception.originalException;
        while (e instanceof WrappedException && isPresent(e.originalException)) {
            e = e.originalException;
        }
        return e;
    }
    /** @internal */
    _findOriginalStack(exception) {
        if (!(exception instanceof WrappedException))
            return null;
        var e = exception;
        var stack = exception.originalStack;
        while (e instanceof WrappedException && isPresent(e.originalException)) {
            e = e.originalException;
            if (e instanceof WrappedException && isPresent(e.originalException)) {
                stack = e.originalStack;
            }
        }
        return stack;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uX2hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbl9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIl9BcnJheUxvZ2dlciIsIl9BcnJheUxvZ2dlci5jb25zdHJ1Y3RvciIsIl9BcnJheUxvZ2dlci5sb2ciLCJfQXJyYXlMb2dnZXIubG9nRXJyb3IiLCJfQXJyYXlMb2dnZXIubG9nR3JvdXAiLCJfQXJyYXlMb2dnZXIubG9nR3JvdXBFbmQiLCJFeGNlcHRpb25IYW5kbGVyIiwiRXhjZXB0aW9uSGFuZGxlci5jb25zdHJ1Y3RvciIsIkV4Y2VwdGlvbkhhbmRsZXIuZXhjZXB0aW9uVG9TdHJpbmciLCJFeGNlcHRpb25IYW5kbGVyLmNhbGwiLCJFeGNlcHRpb25IYW5kbGVyLl9leHRyYWN0TWVzc2FnZSIsIkV4Y2VwdGlvbkhhbmRsZXIuX2xvbmdTdGFja1RyYWNlIiwiRXhjZXB0aW9uSGFuZGxlci5fZmluZENvbnRleHQiLCJFeGNlcHRpb25IYW5kbGVyLl9maW5kT3JpZ2luYWxFeGNlcHRpb24iLCJFeGNlcHRpb25IYW5kbGVyLl9maW5kT3JpZ2luYWxTdGFjayJdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFRLE1BQU0sMEJBQTBCO09BQzNELEVBQWdCLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQWMsa0JBQWtCLEVBQUMsTUFBTSxnQ0FBZ0M7QUFFOUU7SUFBQUE7UUFDRUMsUUFBR0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFLbEJBLENBQUNBO0lBSkNELEdBQUdBLENBQUNBLENBQU1BLElBQVVFLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ3ZDRixRQUFRQSxDQUFDQSxDQUFNQSxJQUFVRyxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM1Q0gsUUFBUUEsQ0FBQ0EsQ0FBTUEsSUFBVUksSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDNUNKLFdBQVdBLEtBQUdLLENBQUNBOztBQUNqQkwsQ0FBQ0E7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSDtJQUNFTSxZQUFvQkEsT0FBWUEsRUFBVUEsaUJBQWlCQSxHQUFZQSxJQUFJQTtRQUF2REMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBS0E7UUFBVUEsc0JBQWlCQSxHQUFqQkEsaUJBQWlCQSxDQUFnQkE7SUFBR0EsQ0FBQ0E7SUFFL0VELE9BQU9BLGlCQUFpQkEsQ0FBQ0EsU0FBY0EsRUFBRUEsVUFBVUEsR0FBUUEsSUFBSUEsRUFBRUEsTUFBTUEsR0FBV0EsSUFBSUE7UUFDcEZFLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLFlBQVlBLEVBQUVBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3ZDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFVQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN0Q0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDMUJBLENBQUNBO0lBRURGLElBQUlBLENBQUNBLFNBQWNBLEVBQUVBLFVBQVVBLEdBQVFBLElBQUlBLEVBQUVBLE1BQU1BLEdBQVdBLElBQUlBO1FBQ2hFRyxJQUFJQSxpQkFBaUJBLEdBQUdBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDL0RBLElBQUlBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDdkRBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBRTNDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxjQUFjQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUV2RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcERBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1lBQ3JDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxREEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBO1FBQzdDQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSx1QkFBdUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDMUZBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxzQkFBc0JBLENBQUNBLENBQUNBO1lB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S0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDcENBLE9BQU9BLENBQUNBLFlBQVlBLGdCQUFnQkEsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUN2RUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtZQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsZ0JBQWdCQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDMUJBLENBQUNBO1FBQ0hBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2ZBLENBQUNBO0FBQ0hSLENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgcHJpbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBpc0xpc3RMaWtlSXRlcmFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmNsYXNzIF9BcnJheUxvZ2dlciB7XG4gIHJlczogYW55W10gPSBbXTtcbiAgbG9nKHM6IGFueSk6IHZvaWQgeyB0aGlzLnJlcy5wdXNoKHMpOyB9XG4gIGxvZ0Vycm9yKHM6IGFueSk6IHZvaWQgeyB0aGlzLnJlcy5wdXNoKHMpOyB9XG4gIGxvZ0dyb3VwKHM6IGFueSk6IHZvaWQgeyB0aGlzLnJlcy5wdXNoKHMpOyB9XG4gIGxvZ0dyb3VwRW5kKCl7fTtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIGhvb2sgZm9yIGNlbnRyYWxpemVkIGV4Y2VwdGlvbiBoYW5kbGluZy5cbiAqXG4gKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgRXhjZXB0aW9uSGFuZGxlcmAgcHJpbnRzIGVycm9yIG1lc3NhZ2VzIHRvIHRoZSBgQ29uc29sZWAuIFRvXG4gKiBpbnRlcmNlcHQgZXJyb3IgaGFuZGxpbmcsXG4gKiB3cml0ZSBhIGN1c3RvbSBleGNlcHRpb24gaGFuZGxlciB0aGF0IHJlcGxhY2VzIHRoaXMgZGVmYXVsdCBhcyBhcHByb3ByaWF0ZSBmb3IgeW91ciBhcHAuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKlxuICogY2xhc3MgTXlFeGNlcHRpb25IYW5kbGVyIGltcGxlbWVudHMgRXhjZXB0aW9uSGFuZGxlciB7XG4gKiAgIGNhbGwoZXJyb3IsIHN0YWNrVHJhY2UgPSBudWxsLCByZWFzb24gPSBudWxsKSB7XG4gKiAgICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIGV4Y2VwdGlvblxuICogICB9XG4gKiB9XG4gKlxuICogYm9vdHN0cmFwKE15QXBwLCBbcHJvdmlkZShFeGNlcHRpb25IYW5kbGVyLCB7dXNlQ2xhc3M6IE15RXhjZXB0aW9uSGFuZGxlcn0pXSlcbiAqXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEV4Y2VwdGlvbkhhbmRsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9sb2dnZXI6IGFueSwgcHJpdmF0ZSBfcmV0aHJvd0V4Y2VwdGlvbjogYm9vbGVhbiA9IHRydWUpIHt9XG5cbiAgc3RhdGljIGV4Y2VwdGlvblRvU3RyaW5nKGV4Y2VwdGlvbjogYW55LCBzdGFja1RyYWNlOiBhbnkgPSBudWxsLCByZWFzb246IHN0cmluZyA9IG51bGwpOiBzdHJpbmcge1xuICAgIHZhciBsID0gbmV3IF9BcnJheUxvZ2dlcigpO1xuICAgIHZhciBlID0gbmV3IEV4Y2VwdGlvbkhhbmRsZXIobCwgZmFsc2UpO1xuICAgIGUuY2FsbChleGNlcHRpb24sIHN0YWNrVHJhY2UsIHJlYXNvbik7XG4gICAgcmV0dXJuIGwucmVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBjYWxsKGV4Y2VwdGlvbjogYW55LCBzdGFja1RyYWNlOiBhbnkgPSBudWxsLCByZWFzb246IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICB2YXIgb3JpZ2luYWxFeGNlcHRpb24gPSB0aGlzLl9maW5kT3JpZ2luYWxFeGNlcHRpb24oZXhjZXB0aW9uKTtcbiAgICB2YXIgb3JpZ2luYWxTdGFjayA9IHRoaXMuX2ZpbmRPcmlnaW5hbFN0YWNrKGV4Y2VwdGlvbik7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLl9maW5kQ29udGV4dChleGNlcHRpb24pO1xuXG4gICAgdGhpcy5fbG9nZ2VyLmxvZ0dyb3VwKGBFWENFUFRJT046ICR7dGhpcy5fZXh0cmFjdE1lc3NhZ2UoZXhjZXB0aW9uKX1gKTtcblxuICAgIGlmIChpc1ByZXNlbnQoc3RhY2tUcmFjZSkgJiYgaXNCbGFuayhvcmlnaW5hbFN0YWNrKSkge1xuICAgICAgdGhpcy5fbG9nZ2VyLmxvZ0Vycm9yKFwiU1RBQ0tUUkFDRTpcIik7XG4gICAgICB0aGlzLl9sb2dnZXIubG9nRXJyb3IodGhpcy5fbG9uZ1N0YWNrVHJhY2Uoc3RhY2tUcmFjZSkpO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQocmVhc29uKSkge1xuICAgICAgdGhpcy5fbG9nZ2VyLmxvZ0Vycm9yKGBSRUFTT046ICR7cmVhc29ufWApO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQob3JpZ2luYWxFeGNlcHRpb24pKSB7XG4gICAgICB0aGlzLl9sb2dnZXIubG9nRXJyb3IoYE9SSUdJTkFMIEVYQ0VQVElPTjogJHt0aGlzLl9leHRyYWN0TWVzc2FnZShvcmlnaW5hbEV4Y2VwdGlvbil9YCk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudChvcmlnaW5hbFN0YWNrKSkge1xuICAgICAgdGhpcy5fbG9nZ2VyLmxvZ0Vycm9yKFwiT1JJR0lOQUwgU1RBQ0tUUkFDRTpcIik7XG4gICAgICB0aGlzLl9sb2dnZXIubG9nRXJyb3IodGhpcy5fbG9uZ1N0YWNrVHJhY2Uob3JpZ2luYWxTdGFjaykpO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQoY29udGV4dCkpIHtcbiAgICAgIHRoaXMuX2xvZ2dlci5sb2dFcnJvcihcIkVSUk9SIENPTlRFWFQ6XCIpO1xuICAgICAgdGhpcy5fbG9nZ2VyLmxvZ0Vycm9yKGNvbnRleHQpO1xuICAgIH1cblxuICAgIHRoaXMuX2xvZ2dlci5sb2dHcm91cEVuZCgpO1xuXG4gICAgLy8gV2UgcmV0aHJvdyBleGNlcHRpb25zLCBzbyBvcGVyYXRpb25zIGxpa2UgJ2Jvb3RzdHJhcCcgd2lsbCByZXN1bHQgaW4gYW4gZXJyb3JcbiAgICAvLyB3aGVuIGFuIGV4Y2VwdGlvbiBoYXBwZW5zLiBJZiB3ZSBkbyBub3QgcmV0aHJvdywgYm9vdHN0cmFwIHdpbGwgYWx3YXlzIHN1Y2NlZWQuXG4gICAgaWYgKHRoaXMuX3JldGhyb3dFeGNlcHRpb24pIHRocm93IGV4Y2VwdGlvbjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2V4dHJhY3RNZXNzYWdlKGV4Y2VwdGlvbjogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gZXhjZXB0aW9uIGluc3RhbmNlb2YgV3JhcHBlZEV4Y2VwdGlvbiA/IGV4Y2VwdGlvbi53cmFwcGVyTWVzc2FnZSA6IGV4Y2VwdGlvbi50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbG9uZ1N0YWNrVHJhY2Uoc3RhY2tUcmFjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gaXNMaXN0TGlrZUl0ZXJhYmxlKHN0YWNrVHJhY2UpID8gKDxhbnlbXT5zdGFja1RyYWNlKS5qb2luKFwiXFxuXFxuLS0tLS1hc3luYyBnYXAtLS0tLVxcblwiKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2UudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmRDb250ZXh0KGV4Y2VwdGlvbjogYW55KTogYW55IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCEoZXhjZXB0aW9uIGluc3RhbmNlb2YgV3JhcHBlZEV4Y2VwdGlvbikpIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIGlzUHJlc2VudChleGNlcHRpb24uY29udGV4dCkgPyBleGNlcHRpb24uY29udGV4dCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbmRDb250ZXh0KGV4Y2VwdGlvbi5vcmlnaW5hbEV4Y2VwdGlvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXhjZXB0aW9uLmNvbnRleHQgY2FuIHRocm93IGFuIGV4Y2VwdGlvbi4gaWYgaXQgaGFwcGVucywgd2UgaWdub3JlIHRoZSBjb250ZXh0LlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluZE9yaWdpbmFsRXhjZXB0aW9uKGV4Y2VwdGlvbjogYW55KTogYW55IHtcbiAgICBpZiAoIShleGNlcHRpb24gaW5zdGFuY2VvZiBXcmFwcGVkRXhjZXB0aW9uKSkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgZSA9IGV4Y2VwdGlvbi5vcmlnaW5hbEV4Y2VwdGlvbjtcbiAgICB3aGlsZSAoZSBpbnN0YW5jZW9mIFdyYXBwZWRFeGNlcHRpb24gJiYgaXNQcmVzZW50KGUub3JpZ2luYWxFeGNlcHRpb24pKSB7XG4gICAgICBlID0gZS5vcmlnaW5hbEV4Y2VwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmRPcmlnaW5hbFN0YWNrKGV4Y2VwdGlvbjogYW55KTogYW55IHtcbiAgICBpZiAoIShleGNlcHRpb24gaW5zdGFuY2VvZiBXcmFwcGVkRXhjZXB0aW9uKSkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgZSA9IGV4Y2VwdGlvbjtcbiAgICB2YXIgc3RhY2sgPSBleGNlcHRpb24ub3JpZ2luYWxTdGFjaztcbiAgICB3aGlsZSAoZSBpbnN0YW5jZW9mIFdyYXBwZWRFeGNlcHRpb24gJiYgaXNQcmVzZW50KGUub3JpZ2luYWxFeGNlcHRpb24pKSB7XG4gICAgICBlID0gZS5vcmlnaW5hbEV4Y2VwdGlvbjtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgV3JhcHBlZEV4Y2VwdGlvbiAmJiBpc1ByZXNlbnQoZS5vcmlnaW5hbEV4Y2VwdGlvbikpIHtcbiAgICAgICAgc3RhY2sgPSBlLm9yaWdpbmFsU3RhY2s7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9XG59XG4iXX0=
