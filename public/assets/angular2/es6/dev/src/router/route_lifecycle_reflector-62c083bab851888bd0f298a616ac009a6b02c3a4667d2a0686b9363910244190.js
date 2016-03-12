import { Type } from 'angular2/src/facade/lang';
import { CanActivate } from './lifecycle_annotations_impl';
import { reflector } from 'angular2/src/core/reflection/reflection';
export function hasLifecycleHook(e, type) {
    if (!(type instanceof Type))
        return false;
    return e.name in type.prototype;
}
export function getCanActivateHook(type) {
    var annotations = reflector.annotations(type);
    for (let i = 0; i < annotations.length; i += 1) {
        let annotation = annotations[i];
        if (annotation instanceof CanActivate) {
            return annotation.fn;
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfbGlmZWN5Y2xlX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9yb3V0ZXIvcm91dGVfbGlmZWN5Y2xlX3JlZmxlY3Rvci50cyJdLCJuYW1lcyI6WyJoYXNMaWZlY3ljbGVIb29rIiwiZ2V0Q2FuQWN0aXZhdGVIb29rIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLElBQUksRUFBWSxNQUFNLDBCQUEwQjtPQUNqRCxFQUFxQixXQUFXLEVBQUMsTUFBTSw4QkFBOEI7T0FDckUsRUFBQyxTQUFTLEVBQUMsTUFBTSx5Q0FBeUM7QUFFakUsaUNBQWlDLENBQXFCLEVBQUUsSUFBSTtJQUMxREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDMUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLElBQVNBLElBQUtBLENBQUNBLFNBQVNBLENBQUNBO0FBQ3hDQSxDQUFDQTtBQUVELG1DQUFtQyxJQUFJO0lBQ3JDQyxJQUFJQSxXQUFXQSxHQUFHQSxTQUFTQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM5Q0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDL0NBLElBQUlBLFVBQVVBLEdBQUdBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxZQUFZQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0Q0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDdkJBLENBQUNBO0lBQ0hBLENBQUNBO0lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0FBQ2RBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUeXBlLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1JvdXRlTGlmZWN5Y2xlSG9vaywgQ2FuQWN0aXZhdGV9IGZyb20gJy4vbGlmZWN5Y2xlX2Fubm90YXRpb25zX2ltcGwnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNMaWZlY3ljbGVIb29rKGU6IFJvdXRlTGlmZWN5Y2xlSG9vaywgdHlwZSk6IGJvb2xlYW4ge1xuICBpZiAoISh0eXBlIGluc3RhbmNlb2YgVHlwZSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIGUubmFtZSBpbig8YW55PnR5cGUpLnByb3RvdHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhbkFjdGl2YXRlSG9vayh0eXBlKTogRnVuY3Rpb24ge1xuICB2YXIgYW5ub3RhdGlvbnMgPSByZWZsZWN0b3IuYW5ub3RhdGlvbnModHlwZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYW5ub3RhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBsZXQgYW5ub3RhdGlvbiA9IGFubm90YXRpb25zW2ldO1xuICAgIGlmIChhbm5vdGF0aW9uIGluc3RhbmNlb2YgQ2FuQWN0aXZhdGUpIHtcbiAgICAgIHJldHVybiBhbm5vdGF0aW9uLmZuO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIl19
