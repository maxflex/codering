import { InjectMetadata, OptionalMetadata, InjectableMetadata, SelfMetadata, HostMetadata, SkipSelfMetadata } from './metadata';
import { makeDecorator, makeParamDecorator } from '../util/decorators';
/**
 * Factory for creating {@link InjectMetadata}.
 */
export var Inject = makeParamDecorator(InjectMetadata);
/**
 * Factory for creating {@link OptionalMetadata}.
 */
export var Optional = makeParamDecorator(OptionalMetadata);
/**
 * Factory for creating {@link InjectableMetadata}.
 */
export var Injectable = makeDecorator(InjectableMetadata);
/**
 * Factory for creating {@link SelfMetadata}.
 */
export var Self = makeParamDecorator(SelfMetadata);
/**
 * Factory for creating {@link HostMetadata}.
 */
export var Host = makeParamDecorator(HostMetadata);
/**
 * Factory for creating {@link SkipSelfMetadata}.
 */
export var SkipSelf = makeParamDecorator(SkipSelfMetadata);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb3JlL2RpL2RlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFDTCxjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLGtCQUFrQixFQUNsQixZQUFZLEVBQ1osWUFBWSxFQUNaLGdCQUFnQixFQUNqQixNQUFNLFlBQVk7T0FDWixFQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQjtBQWtEcEU7O0dBRUc7QUFDSCxXQUFXLE1BQU0sR0FBa0Isa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFdEU7O0dBRUc7QUFDSCxXQUFXLFFBQVEsR0FBb0Isa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU1RTs7R0FFRztBQUNILFdBQVcsVUFBVSxHQUF5QyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVoRzs7R0FFRztBQUNILFdBQVcsSUFBSSxHQUFnQixrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVoRTs7R0FFRztBQUNILFdBQVcsSUFBSSxHQUFnQixrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVoRTs7R0FFRztBQUNILFdBQVcsUUFBUSxHQUFvQixrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0TWV0YWRhdGEsXG4gIE9wdGlvbmFsTWV0YWRhdGEsXG4gIEluamVjdGFibGVNZXRhZGF0YSxcbiAgU2VsZk1ldGFkYXRhLFxuICBIb3N0TWV0YWRhdGEsXG4gIFNraXBTZWxmTWV0YWRhdGFcbn0gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQge21ha2VEZWNvcmF0b3IsIG1ha2VQYXJhbURlY29yYXRvcn0gZnJvbSAnLi4vdXRpbC9kZWNvcmF0b3JzJztcblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgSW5qZWN0TWV0YWRhdGF9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdEZhY3Rvcnkge1xuICAodG9rZW46IGFueSk6IGFueTtcbiAgbmV3ICh0b2tlbjogYW55KTogSW5qZWN0TWV0YWRhdGE7XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIE9wdGlvbmFsTWV0YWRhdGF9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbmFsRmFjdG9yeSB7XG4gICgpOiBhbnk7XG4gIG5ldyAoKTogT3B0aW9uYWxNZXRhZGF0YTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgSW5qZWN0YWJsZU1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmplY3RhYmxlRmFjdG9yeSB7XG4gICgpOiBhbnk7XG4gIG5ldyAoKTogSW5qZWN0YWJsZU1ldGFkYXRhO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBTZWxmTWV0YWRhdGF9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlbGZGYWN0b3J5IHtcbiAgKCk6IGFueTtcbiAgbmV3ICgpOiBTZWxmTWV0YWRhdGE7XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIEhvc3RNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9zdEZhY3Rvcnkge1xuICAoKTogYW55O1xuICBuZXcgKCk6IEhvc3RNZXRhZGF0YTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgU2tpcFNlbGZNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2tpcFNlbGZGYWN0b3J5IHtcbiAgKCk6IGFueTtcbiAgbmV3ICgpOiBTa2lwU2VsZk1ldGFkYXRhO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBJbmplY3RNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCB2YXIgSW5qZWN0OiBJbmplY3RGYWN0b3J5ID0gbWFrZVBhcmFtRGVjb3JhdG9yKEluamVjdE1ldGFkYXRhKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgT3B0aW9uYWxNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCB2YXIgT3B0aW9uYWw6IE9wdGlvbmFsRmFjdG9yeSA9IG1ha2VQYXJhbURlY29yYXRvcihPcHRpb25hbE1ldGFkYXRhKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgSW5qZWN0YWJsZU1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBJbmplY3RhYmxlOiBJbmplY3RhYmxlRmFjdG9yeSA9IDxJbmplY3RhYmxlRmFjdG9yeT5tYWtlRGVjb3JhdG9yKEluamVjdGFibGVNZXRhZGF0YSk7XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIFNlbGZNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCB2YXIgU2VsZjogU2VsZkZhY3RvcnkgPSBtYWtlUGFyYW1EZWNvcmF0b3IoU2VsZk1ldGFkYXRhKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgSG9zdE1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBIb3N0OiBIb3N0RmFjdG9yeSA9IG1ha2VQYXJhbURlY29yYXRvcihIb3N0TWV0YWRhdGEpO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBTa2lwU2VsZk1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBTa2lwU2VsZjogU2tpcFNlbGZGYWN0b3J5ID0gbWFrZVBhcmFtRGVjb3JhdG9yKFNraXBTZWxmTWV0YWRhdGEpOyJdfQ==
