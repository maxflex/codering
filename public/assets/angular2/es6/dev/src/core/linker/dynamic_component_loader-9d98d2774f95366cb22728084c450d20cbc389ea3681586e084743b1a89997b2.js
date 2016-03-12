var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { Compiler } from './compiler';
import { isPresent } from 'angular2/src/facade/lang';
import { AppViewManager } from 'angular2/src/core/linker/view_manager';
/**
 * Represents an instance of a Component created via {@link DynamicComponentLoader}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #dispose}
 * method.
 */
export class ComponentRef {
    /**
     * The {@link ViewRef} of the Host View of this Component instance.
     */
    get hostView() {
        return this.location.internalElement.parentView.ref;
    }
    /**
     * @internal
     *
     * The instance of the component.
     *
     * TODO(i): this api should be removed
     */
    get hostComponent() { return this.instance; }
}
export class ComponentRef_ extends ComponentRef {
    /**
     * TODO(i): refactor into public/private fields
     */
    constructor(location, instance, componentType, injector, _dispose) {
        super();
        this._dispose = _dispose;
        this.location = location;
        this.instance = instance;
        this.componentType = componentType;
        this.injector = injector;
    }
    /**
     * @internal
     *
     * Returns the type of this Component instance.
     *
     * TODO(i): this api should be removed
     */
    get hostComponentType() { return this.componentType; }
    dispose() { this._dispose(); }
}
/**
 * Service for instantiating a Component and attaching it to a View at a specified location.
 */
export class DynamicComponentLoader {
}
export let DynamicComponentLoader_ = class extends DynamicComponentLoader {
    constructor(_compiler, _viewManager) {
        super();
        this._compiler = _compiler;
        this._viewManager = _viewManager;
    }
    loadAsRoot(type, overrideSelector, injector, onDispose, projectableNodes) {
        return this._compiler.compileInHost(type).then(hostProtoViewRef => {
            var hostViewRef = this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector, projectableNodes);
            var newLocation = this._viewManager.getHostElement(hostViewRef);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => {
                if (isPresent(onDispose)) {
                    onDispose();
                }
                this._viewManager.destroyRootHostView(hostViewRef);
            };
            return new ComponentRef_(newLocation, component, type, injector, dispose);
        });
    }
    loadIntoLocation(type, hostLocation, anchorName, providers = null, projectableNodes = null) {
        return this.loadNextToLocation(type, this._viewManager.getNamedElementInComponentView(hostLocation, anchorName), providers, projectableNodes);
    }
    loadNextToLocation(type, location, providers = null, projectableNodes = null) {
        return this._compiler.compileInHost(type).then(hostProtoViewRef => {
            var viewContainer = this._viewManager.getViewContainer(location);
            var hostViewRef = viewContainer.createHostView(hostProtoViewRef, viewContainer.length, providers, projectableNodes);
            var newLocation = this._viewManager.getHostElement(hostViewRef);
            var component = this._viewManager.getComponent(newLocation);
            var dispose = () => {
                var index = viewContainer.indexOf(hostViewRef);
                if (!hostViewRef.destroyed && index !== -1) {
                    viewContainer.remove(index);
                }
            };
            return new ComponentRef_(newLocation, component, type, null, dispose);
        });
    }
};
DynamicComponentLoader_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Compiler, AppViewManager])
], DynamicComponentLoader_);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY19jb21wb25lbnRfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2R5bmFtaWNfY29tcG9uZW50X2xvYWRlci50cyJdLCJuYW1lcyI6WyJDb21wb25lbnRSZWYiLCJDb21wb25lbnRSZWYuaG9zdFZpZXciLCJDb21wb25lbnRSZWYuaG9zdENvbXBvbmVudCIsIkNvbXBvbmVudFJlZl8iLCJDb21wb25lbnRSZWZfLmNvbnN0cnVjdG9yIiwiQ29tcG9uZW50UmVmXy5ob3N0Q29tcG9uZW50VHlwZSIsIkNvbXBvbmVudFJlZl8uZGlzcG9zZSIsIkR5bmFtaWNDb21wb25lbnRMb2FkZXIiLCJEeW5hbWljQ29tcG9uZW50TG9hZGVyXyIsIkR5bmFtaWNDb21wb25lbnRMb2FkZXJfLmNvbnN0cnVjdG9yIiwiRHluYW1pY0NvbXBvbmVudExvYWRlcl8ubG9hZEFzUm9vdCIsIkR5bmFtaWNDb21wb25lbnRMb2FkZXJfLmxvYWRJbnRvTG9jYXRpb24iLCJEeW5hbWljQ29tcG9uZW50TG9hZGVyXy5sb2FkTmV4dFRvTG9jYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQXFELFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUM1RixFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVk7T0FDNUIsRUFBMEIsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO09BRXBFLEVBQUMsY0FBYyxFQUFDLE1BQU0sdUNBQXVDO0FBSXBFOzs7Ozs7R0FNRztBQUNIO0lBMEJFQTs7T0FFR0E7SUFDSEEsSUFBSUEsUUFBUUE7UUFDVkMsTUFBTUEsQ0FBZUEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7SUFDckVBLENBQUNBO0lBRUREOzs7Ozs7T0FNR0E7SUFDSEEsSUFBSUEsYUFBYUEsS0FBVUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0Es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QTtRQUN4RUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7QUFDSEosQ0FBQ0E7QUFoREQ7SUFBQyxVQUFVLEVBQUU7OzRCQWdEWjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtLZXksIEluamVjdG9yLCBSZXNvbHZlZFByb3ZpZGVyLCBQcm92aWRlciwgcHJvdmlkZSwgSW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtDb21waWxlcn0gZnJvbSAnLi9jb21waWxlcic7XG5pbXBvcnQge2lzVHlwZSwgVHlwZSwgc3RyaW5naWZ5LCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Byb21pc2V9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtBcHBWaWV3TWFuYWdlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfbWFuYWdlcic7XG5pbXBvcnQge0VsZW1lbnRSZWYsIEVsZW1lbnRSZWZffSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7SG9zdFZpZXdSZWZ9IGZyb20gJy4vdmlld19yZWYnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gaW5zdGFuY2Ugb2YgYSBDb21wb25lbnQgY3JlYXRlZCB2aWEge0BsaW5rIER5bmFtaWNDb21wb25lbnRMb2FkZXJ9LlxuICpcbiAqIGBDb21wb25lbnRSZWZgIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgQ29tcG9uZW50IEluc3RhbmNlIGFzIHdlbGwgb3RoZXIgb2JqZWN0cyByZWxhdGVkIHRvIHRoaXNcbiAqIENvbXBvbmVudCBJbnN0YW5jZSBhbmQgYWxsb3dzIHlvdSB0byBkZXN0cm95IHRoZSBDb21wb25lbnQgSW5zdGFuY2UgdmlhIHRoZSB7QGxpbmsgI2Rpc3Bvc2V9XG4gKiBtZXRob2QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRSZWYge1xuICAvKipcbiAgICogVGhlIGluamVjdG9yIHByb3ZpZGVkIHtAbGluayBEeW5hbWljQ29tcG9uZW50TG9hZGVyI2xvYWRBc1Jvb3R9LlxuICAgKlxuICAgKiBUT0RPKGkpOiB0aGlzIGFwaSBpcyB1c2VsZXNzIGFuZCBzaG91bGQgYmUgcmVwbGFjZWQgYnkgYW4gaW5qZWN0b3IgcmV0cmlldmVkIGZyb21cbiAgICogICAgIHRoZSBIb3N0RWxlbWVudFJlZiwgd2hpY2ggaXMgY3VycmVudGx5IG5vdCBwb3NzaWJsZS5cbiAgICovXG4gIGluamVjdG9yOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogTG9jYXRpb24gb2YgdGhlIEhvc3QgRWxlbWVudCBvZiB0aGlzIENvbXBvbmVudCBJbnN0YW5jZS5cbiAgICovXG4gIGxvY2F0aW9uOiBFbGVtZW50UmVmO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIENvbXBvbmVudC5cbiAgICovXG4gIGluc3RhbmNlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyIGRlZmluZWQgY29tcG9uZW50IHR5cGUsIHJlcHJlc2VudGVkIHZpYSB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAqXG4gICAqIDwhLS0gVE9ETzogY3VzdG9taXplIHdvcmRpbmcgZm9yIERhcnQgZG9jcyAtLT5cbiAgICovXG4gIGNvbXBvbmVudFR5cGU6IFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgVmlld1JlZn0gb2YgdGhlIEhvc3QgVmlldyBvZiB0aGlzIENvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGdldCBob3N0VmlldygpOiBIb3N0Vmlld1JlZiB7XG4gICAgcmV0dXJuICg8RWxlbWVudFJlZl8+dGhpcy5sb2NhdGlvbikuaW50ZXJuYWxFbGVtZW50LnBhcmVudFZpZXcucmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogVE9ETyhpKTogdGhpcyBhcGkgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICovXG4gIGdldCBob3N0Q29tcG9uZW50KCk6IGFueSB7IHJldHVybiB0aGlzLmluc3RhbmNlOyB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgYW5kIGFsbCBvZiB0aGUgZGF0YSBzdHJ1Y3R1cmVzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICpcbiAgICogVE9ETyhpKTogcmVuYW1lIHRvIGRlc3Ryb3kgdG8gYmUgY29uc2lzdGVudCB3aXRoIEFwcFZpZXdNYW5hZ2VyIGFuZCBWaWV3Q29udGFpbmVyUmVmXG4gICAqL1xuICBhYnN0cmFjdCBkaXNwb3NlKCk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRSZWZfIGV4dGVuZHMgQ29tcG9uZW50UmVmIHtcbiAgLyoqXG4gICAqIFRPRE8oaSk6IHJlZmFjdG9yIGludG8gcHVibGljL3ByaXZhdGUgZmllbGRzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihsb2NhdGlvbjogRWxlbWVudFJlZiwgaW5zdGFuY2U6IGFueSwgY29tcG9uZW50VHlwZTogVHlwZSwgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9kaXNwb3NlOiAoKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuY29tcG9uZW50VHlwZSA9IGNvbXBvbmVudFR5cGU7XG4gICAgdGhpcy5pbmplY3RvciA9IGluamVjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoaXMgQ29tcG9uZW50IGluc3RhbmNlLlxuICAgKlxuICAgKiBUT0RPKGkpOiB0aGlzIGFwaSBzaG91bGQgYmUgcmVtb3ZlZFxuICAgKi9cbiAgZ2V0IGhvc3RDb21wb25lbnRUeXBlKCk6IFR5cGUgeyByZXR1cm4gdGhpcy5jb21wb25lbnRUeXBlOyB9XG5cbiAgZGlzcG9zZSgpIHsgdGhpcy5fZGlzcG9zZSgpOyB9XG59XG5cbi8qKlxuICogU2VydmljZSBmb3IgaW5zdGFudGlhdGluZyBhIENvbXBvbmVudCBhbmQgYXR0YWNoaW5nIGl0IHRvIGEgVmlldyBhdCBhIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIER5bmFtaWNDb21wb25lbnRMb2FkZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIENvbXBvbmVudCBgdHlwZWAgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZVxuICAgKiBwbGF0Zm9ybS1zcGVjaWZpYyBnbG9iYWwgdmlldyB0aGF0IG1hdGNoZXMgdGhlIGNvbXBvbmVudCdzIHNlbGVjdG9yLlxuICAgKlxuICAgKiBJbiBhIGJyb3dzZXIgdGhlIHBsYXRmb3JtLXNwZWNpZmljIGdsb2JhbCB2aWV3IGlzIHRoZSBtYWluIERPTSBEb2N1bWVudC5cbiAgICpcbiAgICogSWYgbmVlZGVkLCB0aGUgY29tcG9uZW50J3Mgc2VsZWN0b3IgY2FuIGJlIG92ZXJyaWRkZW4gdmlhIGBvdmVycmlkZVNlbGVjdG9yYC5cbiAgICpcbiAgICogWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYGluamVjdG9yYCBhbmQgdGhpcyB7QGxpbmsgSW5qZWN0b3J9IHdpbGwgYmUgdXNlZCB0byBpbnN0YW50aWF0ZSB0aGVcbiAgICogQ29tcG9uZW50LlxuICAgKlxuICAgKiBUbyBiZSBub3RpZmllZCB3aGVuIHRoaXMgQ29tcG9uZW50IGluc3RhbmNlIGlzIGRlc3Ryb3llZCwgeW91IGNhbiBhbHNvIG9wdGlvbmFsbHkgcHJvdmlkZVxuICAgKiBgb25EaXNwb3NlYCBjYWxsYmFjay5cbiAgICpcbiAgICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSB7QGxpbmsgQ29tcG9uZW50UmVmfSByZXByZXNlbnRpbmcgdGhlIG5ld2x5IGNyZWF0ZWQgQ29tcG9uZW50LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICdjaGlsZC1jb21wb25lbnQnLFxuICAgKiAgIHRlbXBsYXRlOiAnQ2hpbGQnXG4gICAqIH0pXG4gICAqIGNsYXNzIENoaWxkQ29tcG9uZW50IHtcbiAgICogfVxuICAgKlxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ215LWFwcCcsXG4gICAqICAgdGVtcGxhdGU6ICdQYXJlbnQgKDxjaGlsZCBpZD1cImNoaWxkXCI+PC9jaGlsZD4pJ1xuICAgKiB9KVxuICAgKiBjbGFzcyBNeUFwcCB7XG4gICAqICAgY29uc3RydWN0b3IoZGNsOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICogICAgIGRjbC5sb2FkQXNSb290KENoaWxkQ29tcG9uZW50LCAnI2NoaWxkJywgaW5qZWN0b3IpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBib290c3RyYXAoTXlBcHApO1xuICAgKiBgYGBcbiAgICpcbiAgICogUmVzdWx0aW5nIERPTTpcbiAgICpcbiAgICogYGBgXG4gICAqIDxteS1hcHA+XG4gICAqICAgUGFyZW50IChcbiAgICogICAgIDxjaGlsZCBpZD1cImNoaWxkXCI+Q2hpbGQ8L2NoaWxkPlxuICAgKiAgIClcbiAgICogPC9teS1hcHA+XG4gICAqIGBgYFxuICAgKi9cbiAgYWJzdHJhY3QgbG9hZEFzUm9vdCh0eXBlOiBUeXBlLCBvdmVycmlkZVNlbGVjdG9yOiBzdHJpbmcsIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICBvbkRpc3Bvc2U/OiAoKSA9PiB2b2lkLCBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IFByb21pc2U8Q29tcG9uZW50UmVmPjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIENvbXBvbmVudCBhbmQgYXR0YWNoZXMgaXQgdG8gYSBWaWV3IENvbnRhaW5lciBsb2NhdGVkIGluc2lkZSBvZiB0aGVcbiAgICogQ29tcG9uZW50IFZpZXcgb2YgYW5vdGhlciBDb21wb25lbnQgaW5zdGFuY2UuXG4gICAqXG4gICAqIFRoZSB0YXJnZXRlZCBDb21wb25lbnQgSW5zdGFuY2UgaXMgc3BlY2lmaWVkIHZpYSBpdHMgYGhvc3RMb2NhdGlvbmAge0BsaW5rIEVsZW1lbnRSZWZ9LiBUaGVcbiAgICogbG9jYXRpb24gd2l0aGluIHRoZSBDb21wb25lbnQgVmlldyBvZiB0aGlzIENvbXBvbmVudCBJbnN0YW5jZSBpcyBzcGVjaWZpZWQgdmlhIGBhbmNob3JOYW1lYFxuICAgKiBUZW1wbGF0ZSBWYXJpYWJsZSBOYW1lLlxuICAgKlxuICAgKiBZb3UgY2FuIG9wdGlvbmFsbHkgcHJvdmlkZSBgcHJvdmlkZXJzYCB0byBjb25maWd1cmUgdGhlIHtAbGluayBJbmplY3Rvcn0gcHJvdmlzaW9uZWQgZm9yIHRoaXNcbiAgICogQ29tcG9uZW50IEluc3RhbmNlLlxuICAgKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHtAbGluayBDb21wb25lbnRSZWZ9IHJlcHJlc2VudGluZyB0aGUgbmV3bHkgY3JlYXRlZCBDb21wb25lbnQuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYFxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ2NoaWxkLWNvbXBvbmVudCcsXG4gICAqICAgdGVtcGxhdGU6ICdDaGlsZCdcbiAgICogfSlcbiAgICogY2xhc3MgQ2hpbGRDb21wb25lbnQge1xuICAgKiB9XG4gICAqXG4gICAqIEBDb21wb25lbnQoe1xuICAgKiAgIHNlbGVjdG9yOiAnbXktYXBwJyxcbiAgICogICB0ZW1wbGF0ZTogJ1BhcmVudCAoPGRpdiAjY2hpbGQ+PC9kaXY+KSdcbiAgICogfSlcbiAgICogY2xhc3MgTXlBcHAge1xuICAgKiAgIGNvbnN0cnVjdG9yKGRjbDogRHluYW1pY0NvbXBvbmVudExvYWRlciwgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgKiAgICAgZGNsLmxvYWRJbnRvTG9jYXRpb24oQ2hpbGRDb21wb25lbnQsIGVsZW1lbnRSZWYsICdjaGlsZCcpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBib290c3RyYXAoTXlBcHApO1xuICAgKiBgYGBcbiAgICpcbiAgICogUmVzdWx0aW5nIERPTTpcbiAgICpcbiAgICogYGBgXG4gICAqIDxteS1hcHA+XG4gICAqICAgIFBhcmVudCAoXG4gICAqICAgICAgPGRpdiAjY2hpbGQ9XCJcIiBjbGFzcz1cIm5nLWJpbmRpbmdcIj48L2Rpdj5cbiAgICogICAgICA8Y2hpbGQtY29tcG9uZW50IGNsYXNzPVwibmctYmluZGluZ1wiPkNoaWxkPC9jaGlsZC1jb21wb25lbnQ+XG4gICAqICAgIClcbiAgICogPC9teS1hcHA+XG4gICAqIGBgYFxuICAgKi9cbiAgYWJzdHJhY3QgbG9hZEludG9Mb2NhdGlvbih0eXBlOiBUeXBlLCBob3N0TG9jYXRpb246IEVsZW1lbnRSZWYsIGFuY2hvck5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM/OiBSZXNvbHZlZFByb3ZpZGVyW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGFibGVOb2Rlcz86IGFueVtdW10pOiBQcm9taXNlPENvbXBvbmVudFJlZj47XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYSBDb21wb25lbnQgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBWaWV3IENvbnRhaW5lciBmb3VuZCBhdCB0aGVcbiAgICogYGxvY2F0aW9uYCBzcGVjaWZpZWQgYXMge0BsaW5rIEVsZW1lbnRSZWZ9LlxuICAgKlxuICAgKiBZb3UgY2FuIG9wdGlvbmFsbHkgcHJvdmlkZSBgcHJvdmlkZXJzYCB0byBjb25maWd1cmUgdGhlIHtAbGluayBJbmplY3Rvcn0gcHJvdmlzaW9uZWQgZm9yIHRoaXNcbiAgICogQ29tcG9uZW50IEluc3RhbmNlLlxuICAgKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHtAbGluayBDb21wb25lbnRSZWZ9IHJlcHJlc2VudGluZyB0aGUgbmV3bHkgY3JlYXRlZCBDb21wb25lbnQuXG4gICAqXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYFxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ2NoaWxkLWNvbXBvbmVudCcsXG4gICAqICAgdGVtcGxhdGU6ICdDaGlsZCdcbiAgICogfSlcbiAgICogY2xhc3MgQ2hpbGRDb21wb25lbnQge1xuICAgKiB9XG4gICAqXG4gICAqIEBDb21wb25lbnQoe1xuICAgKiAgIHNlbGVjdG9yOiAnbXktYXBwJyxcbiAgICogICB0ZW1wbGF0ZTogJ1BhcmVudCdcbiAgICogfSlcbiAgICogY2xhc3MgTXlBcHAge1xuICAgKiAgIGNvbnN0cnVjdG9yKGRjbDogRHluYW1pY0NvbXBvbmVudExvYWRlciwgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgKiAgICAgZGNsLmxvYWROZXh0VG9Mb2NhdGlvbihDaGlsZENvbXBvbmVudCwgZWxlbWVudFJlZik7XG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIGJvb3RzdHJhcChNeUFwcCk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBSZXN1bHRpbmcgRE9NOlxuICAgKlxuICAgKiBgYGBcbiAgICogPG15LWFwcD5QYXJlbnQ8L215LWFwcD5cbiAgICogPGNoaWxkLWNvbXBvbmVudD5DaGlsZDwvY2hpbGQtY29tcG9uZW50PlxuICAgKiBgYGBcbiAgICovXG4gIGFic3RyYWN0IGxvYWROZXh0VG9Mb2NhdGlvbih0eXBlOiBUeXBlLCBsb2NhdGlvbjogRWxlbWVudFJlZiwgcHJvdmlkZXJzPzogUmVzb2x2ZWRQcm92aWRlcltdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGFibGVOb2Rlcz86IGFueVtdW10pOiBQcm9taXNlPENvbXBvbmVudFJlZj47XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEeW5hbWljQ29tcG9uZW50TG9hZGVyXyBleHRlbmRzIER5bmFtaWNDb21wb25lbnRMb2FkZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb21waWxlcjogQ29tcGlsZXIsIHByaXZhdGUgX3ZpZXdNYW5hZ2VyOiBBcHBWaWV3TWFuYWdlcikgeyBzdXBlcigpOyB9XG5cbiAgbG9hZEFzUm9vdCh0eXBlOiBUeXBlLCBvdmVycmlkZVNlbGVjdG9yOiBzdHJpbmcsIGluamVjdG9yOiBJbmplY3Rvciwgb25EaXNwb3NlPzogKCkgPT4gdm9pZCxcbiAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IFByb21pc2U8Q29tcG9uZW50UmVmPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyLmNvbXBpbGVJbkhvc3QodHlwZSkudGhlbihob3N0UHJvdG9WaWV3UmVmID0+IHtcbiAgICAgIHZhciBob3N0Vmlld1JlZiA9IHRoaXMuX3ZpZXdNYW5hZ2VyLmNyZWF0ZVJvb3RIb3N0Vmlldyhob3N0UHJvdG9WaWV3UmVmLCBvdmVycmlkZVNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdG9yLCBwcm9qZWN0YWJsZU5vZGVzKTtcbiAgICAgIHZhciBuZXdMb2NhdGlvbiA9IHRoaXMuX3ZpZXdNYW5hZ2VyLmdldEhvc3RFbGVtZW50KGhvc3RWaWV3UmVmKTtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl92aWV3TWFuYWdlci5nZXRDb21wb25lbnQobmV3TG9jYXRpb24pO1xuXG4gICAgICB2YXIgZGlzcG9zZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGlzUHJlc2VudChvbkRpc3Bvc2UpKSB7XG4gICAgICAgICAgb25EaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdmlld01hbmFnZXIuZGVzdHJveVJvb3RIb3N0Vmlldyhob3N0Vmlld1JlZik7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIG5ldyBDb21wb25lbnRSZWZfKG5ld0xvY2F0aW9uLCBjb21wb25lbnQsIHR5cGUsIGluamVjdG9yLCBkaXNwb3NlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbnRvTG9jYXRpb24odHlwZTogVHlwZSwgaG9zdExvY2F0aW9uOiBFbGVtZW50UmVmLCBhbmNob3JOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10gPSBudWxsLFxuICAgICAgICAgICAgICAgICAgIHByb2plY3RhYmxlTm9kZXM6IGFueVtdW10gPSBudWxsKTogUHJvbWlzZTxDb21wb25lbnRSZWY+IHtcbiAgICByZXR1cm4gdGhpcy5sb2FkTmV4dFRvTG9jYXRpb24oXG4gICAgICAgIHR5cGUsIHRoaXMuX3ZpZXdNYW5hZ2VyLmdldE5hbWVkRWxlbWVudEluQ29tcG9uZW50Vmlldyhob3N0TG9jYXRpb24sIGFuY2hvck5hbWUpLCBwcm92aWRlcnMsXG4gICAgICAgIHByb2plY3RhYmxlTm9kZXMpO1xuICB9XG5cbiAgbG9hZE5leHRUb0xvY2F0aW9uKHR5cGU6IFR5cGUsIGxvY2F0aW9uOiBFbGVtZW50UmVmLCBwcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSA9IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzOiBhbnlbXVtdID0gbnVsbCk6IFByb21pc2U8Q29tcG9uZW50UmVmPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyLmNvbXBpbGVJbkhvc3QodHlwZSkudGhlbihob3N0UHJvdG9WaWV3UmVmID0+IHtcbiAgICAgIHZhciB2aWV3Q29udGFpbmVyID0gdGhpcy5fdmlld01hbmFnZXIuZ2V0Vmlld0NvbnRhaW5lcihsb2NhdGlvbik7XG4gICAgICB2YXIgaG9zdFZpZXdSZWYgPSB2aWV3Q29udGFpbmVyLmNyZWF0ZUhvc3RWaWV3KGhvc3RQcm90b1ZpZXdSZWYsIHZpZXdDb250YWluZXIubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnMsIHByb2plY3RhYmxlTm9kZXMpO1xuICAgICAgdmFyIG5ld0xvY2F0aW9uID0gdGhpcy5fdmlld01hbmFnZXIuZ2V0SG9zdEVsZW1lbnQoaG9zdFZpZXdSZWYpO1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX3ZpZXdNYW5hZ2VyLmdldENvbXBvbmVudChuZXdMb2NhdGlvbik7XG5cbiAgICAgIHZhciBkaXNwb3NlID0gKCkgPT4ge1xuICAgICAgICB2YXIgaW5kZXggPSB2aWV3Q29udGFpbmVyLmluZGV4T2YoaG9zdFZpZXdSZWYpO1xuICAgICAgICBpZiAoIWhvc3RWaWV3UmVmLmRlc3Ryb3llZCAmJiBpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICB2aWV3Q29udGFpbmVyLnJlbW92ZShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gbmV3IENvbXBvbmVudFJlZl8obmV3TG9jYXRpb24sIGNvbXBvbmVudCwgdHlwZSwgbnVsbCwgZGlzcG9zZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
