// Promises are put into their own facade file so that they can be used without
// introducing a dependency on rxjs. They are re-exported through facade/async.
export { Promise };
export class PromiseWrapper {
    static resolve(obj) { return Promise.resolve(obj); }
    static reject(obj, _) { return Promise.reject(obj); }
    // Note: We can't rename this method into `catch`, as this is not a valid
    // method name in Dart.
    static catchError(promise, onError) {
        return promise.catch(onError);
    }
    static all(promises) {
        if (promises.length == 0)
            return Promise.resolve([]);
        return Promise.all(promises);
    }
    static then(promise, success, rejection) {
        return promise.then(success, rejection);
    }
    static wrap(computation) {
        return new Promise((res, rej) => {
            try {
                res(computation());
            }
            catch (e) {
                rej(e);
            }
        });
    }
    static scheduleMicrotask(computation) {
        PromiseWrapper.then(PromiseWrapper.resolve(null), computation, (_) => { });
    }
    static isPromise(obj) { return obj instanceof Promise; }
    static completer() {
        var resolve;
        var reject;
        var p = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        return { promise: p, resolve: resolve, reject: reject };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9mYWNhZGUvcHJvbWlzZS50cyJdLCJuYW1lcyI6WyJQcm9taXNlV3JhcHBlciIsIlByb21pc2VXcmFwcGVyLnJlc29sdmUiLCJQcm9taXNlV3JhcHBlci5yZWplY3QiLCJQcm9taXNlV3JhcHBlci5jYXRjaEVycm9yIiwiUHJvbWlzZVdyYXBwZXIuYWxsIiwiUHJvbWlzZVdyYXBwZXIudGhlbiIsIlByb21pc2VXcmFwcGVyLndyYXAiLCJQcm9taXNlV3JhcHBlci5zY2hlZHVsZU1pY3JvdGFzayIsIlByb21pc2VXcmFwcGVyLmlzUHJvbWlzZSIsIlByb21pc2VXcmFwcGVyLmNvbXBsZXRlciJdLCJtYXBwaW5ncyI6IkFBQUEsK0VBQStFO0FBQy9FLCtFQUErRTtBQUMvRSxTQUFRLE9BQU8sR0FBRTtBQVFqQjtJQUNFQSxPQUFPQSxPQUFPQSxDQUFJQSxHQUFNQSxJQUFnQkMsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFdEVELE9BQU9BLE1BQU1BLENBQUNBLEdBQVFBLEVBQUVBLENBQUNBLElBQWtCRSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUV4RUYseUVBQXlFQTtJQUN6RUEsdUJBQXVCQTtJQUN2QkEsT0FBT0EsVUFBVUEsQ0FBSUEsT0FBbUJBLEVBQ25CQSxPQUEyQ0E7UUFDOURHLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUVESCxPQUFPQSxHQUFHQSxDQUFDQSxRQUFlQTtRQUN4QkksRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDckRBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQy9CQSxDQUFDQTtJQUVESixPQUFPQSxJQUFJQSxDQUFPQSxPQUFtQkEsRUFBRUEsT0FBeUNBLEVBQzlEQSxTQUEyREE7UUFDM0VLLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVETCxPQUFPQSxJQUFJQSxDQUFJQSxXQUFvQkE7UUFDakNNLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBO1lBQzFCQSxJQUFJQSxDQUFDQTtnQkFDSEEsR0FBR0EsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLENBQUVBO1lBQUFBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNUQSxDQUFDQTtRQUNIQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNMQSxDQUFDQTtJQUVETixPQUFPQSxpQkFBaUJBLENBQUNBLFdBQXNCQTtRQUM3Q08sY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsV0FBV0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDNUVBLENBQUNBO0lBRURQLE9BQU9BLFNBQVNBLENBQUNBLEdBQVFBLElBQWFRLE1BQU1BLENBQUNBLEdBQUdBLFlBQVlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0lBRXRFUixPQUFPQSxTQUFTQTtRQUNkUyxJQUFJQSxPQUFPQSxDQUFDQTtRQUNaQSxJQUFJQSxNQUFNQSxDQUFDQTtRQUVYQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFTQSxHQUFHQSxFQUFFQSxHQUFHQTtZQUNuQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2QsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQ0EsQ0FBQ0E7UUFFSEEsTUFBTUEsQ0FBQ0EsRUFBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsRUFBRUEsT0FBT0EsRUFBRUEsT0FBT0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBQ0EsQ0FBQ0E7SUFDeERBLENBQUNBO0FBQ0hULENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQcm9taXNlcyBhcmUgcHV0IGludG8gdGhlaXIgb3duIGZhY2FkZSBmaWxlIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCB3aXRob3V0XG4vLyBpbnRyb2R1Y2luZyBhIGRlcGVuZGVuY3kgb24gcnhqcy4gVGhleSBhcmUgcmUtZXhwb3J0ZWQgdGhyb3VnaCBmYWNhZGUvYXN5bmMuXG5leHBvcnQge1Byb21pc2V9O1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb21pc2VDb21wbGV0ZXI8Uj4ge1xuICBwcm9taXNlOiBQcm9taXNlPFI+O1xuICByZXNvbHZlOiAodmFsdWU/OiBSIHwgUHJvbWlzZUxpa2U8Uj4pID0+IHZvaWQ7XG4gIHJlamVjdDogKGVycm9yPzogYW55LCBzdGFja1RyYWNlPzogc3RyaW5nKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUHJvbWlzZVdyYXBwZXIge1xuICBzdGF0aWMgcmVzb2x2ZTxUPihvYmo6IFQpOiBQcm9taXNlPFQ+IHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvYmopOyB9XG5cbiAgc3RhdGljIHJlamVjdChvYmo6IGFueSwgXyk6IFByb21pc2U8YW55PiB7IHJldHVybiBQcm9taXNlLnJlamVjdChvYmopOyB9XG5cbiAgLy8gTm90ZTogV2UgY2FuJ3QgcmVuYW1lIHRoaXMgbWV0aG9kIGludG8gYGNhdGNoYCwgYXMgdGhpcyBpcyBub3QgYSB2YWxpZFxuICAvLyBtZXRob2QgbmFtZSBpbiBEYXJ0LlxuICBzdGF0aWMgY2F0Y2hFcnJvcjxUPihwcm9taXNlOiBQcm9taXNlPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yOiAoZXJyb3I6IGFueSkgPT4gVCB8IFByb21pc2VMaWtlPFQ+KTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIHByb21pc2UuY2F0Y2gob25FcnJvcik7XG4gIH1cblxuICBzdGF0aWMgYWxsKHByb21pc2VzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKHByb21pc2VzLmxlbmd0aCA9PSAwKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgc3RhdGljIHRoZW48VCwgVT4ocHJvbWlzZTogUHJvbWlzZTxUPiwgc3VjY2VzczogKHZhbHVlOiBUKSA9PiBVIHwgUHJvbWlzZUxpa2U8VT4sXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdGlvbj86IChlcnJvcjogYW55LCBzdGFjaz86IGFueSkgPT4gVSB8IFByb21pc2VMaWtlPFU+KTogUHJvbWlzZTxVPiB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbihzdWNjZXNzLCByZWplY3Rpb24pO1xuICB9XG5cbiAgc3RhdGljIHdyYXA8VD4oY29tcHV0YXRpb246ICgpID0+IFQpOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXMoY29tcHV0YXRpb24oKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlaihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBzY2hlZHVsZU1pY3JvdGFzayhjb21wdXRhdGlvbjogKCkgPT4gYW55KTogdm9pZCB7XG4gICAgUHJvbWlzZVdyYXBwZXIudGhlbihQcm9taXNlV3JhcHBlci5yZXNvbHZlKG51bGwpLCBjb21wdXRhdGlvbiwgKF8pID0+IHt9KTtcbiAgfVxuXG4gIHN0YXRpYyBpc1Byb21pc2Uob2JqOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIFByb21pc2U7IH1cblxuICBzdGF0aWMgY29tcGxldGVyKCk6IFByb21pc2VDb21wbGV0ZXI8YW55PiB7XG4gICAgdmFyIHJlc29sdmU7XG4gICAgdmFyIHJlamVjdDtcblxuICAgIHZhciBwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzLCByZWopIHtcbiAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICByZWplY3QgPSByZWo7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge3Byb21pc2U6IHAsIHJlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0fTtcbiAgfVxufVxuIl19
