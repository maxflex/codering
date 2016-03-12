var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { isPresent, StringWrapper } from 'angular2/src/facade/lang';
import { StringMapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { EventManagerPlugin } from './event_manager';
import { Injectable } from 'angular2/src/core/di';
var modifierKeys = ['alt', 'control', 'meta', 'shift'];
var modifierKeyGetters = {
    'alt': (event) => event.altKey,
    'control': (event) => event.ctrlKey,
    'meta': (event) => event.metaKey,
    'shift': (event) => event.shiftKey
};
export let KeyEventsPlugin = class extends EventManagerPlugin {
    constructor() {
        super();
    }
    supports(eventName) {
        return isPresent(KeyEventsPlugin.parseEventName(eventName));
    }
    addEventListener(element, eventName, handler) {
        var parsedEvent = KeyEventsPlugin.parseEventName(eventName);
        var outsideHandler = KeyEventsPlugin.eventCallback(element, StringMapWrapper.get(parsedEvent, 'fullKey'), handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(() => {
            return DOM.onAndCancel(element, StringMapWrapper.get(parsedEvent, 'domEventName'), outsideHandler);
        });
    }
    static parseEventName(eventName) {
        var parts = eventName.toLowerCase().split('.');
        var domEventName = parts.shift();
        if ((parts.length === 0) ||
            !(StringWrapper.equals(domEventName, 'keydown') ||
                StringWrapper.equals(domEventName, 'keyup'))) {
            return null;
        }
        var key = KeyEventsPlugin._normalizeKey(parts.pop());
        var fullKey = '';
        modifierKeys.forEach(modifierName => {
            if (ListWrapper.contains(parts, modifierName)) {
                ListWrapper.remove(parts, modifierName);
                fullKey += modifierName + '.';
            }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
            // returning null instead of throwing to let another plugin process the event
            return null;
        }
        var result = StringMapWrapper.create();
        StringMapWrapper.set(result, 'domEventName', domEventName);
        StringMapWrapper.set(result, 'fullKey', fullKey);
        return result;
    }
    static getEventFullKey(event) {
        var fullKey = '';
        var key = DOM.getEventKey(event);
        key = key.toLowerCase();
        if (StringWrapper.equals(key, ' ')) {
            key = 'space'; // for readability
        }
        else if (StringWrapper.equals(key, '.')) {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        modifierKeys.forEach(modifierName => {
            if (modifierName != key) {
                var modifierGetter = StringMapWrapper.get(modifierKeyGetters, modifierName);
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        fullKey += key;
        return fullKey;
    }
    static eventCallback(element, fullKey, handler, zone) {
        return (event) => {
            if (StringWrapper.equals(KeyEventsPlugin.getEventFullKey(event), fullKey)) {
                zone.run(() => handler(event));
            }
        };
    }
    /** @internal */
    static _normalizeKey(keyName) {
        // TODO: switch to a StringMap if the mapping grows too much
        switch (keyName) {
            case 'esc':
                return 'escape';
            default:
                return keyName;
        }
    }
};
KeyEventsPlugin = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], KeyEventsPlugin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZXZlbnRzL2tleV9ldmVudHMudHMiXSwibmFtZXMiOlsiS2V5RXZlbnRzUGx1Z2luIiwiS2V5RXZlbnRzUGx1Z2luLmNvbnN0cnVjdG9yIiwiS2V5RXZlbnRzUGx1Z2luLnN1cHBvcnRzIiwiS2V5RXZlbnRzUGx1Z2luLmFkZEV2ZW50TGlzdGVuZXIiLCJLZXlFdmVudHNQbHVnaW4ucGFyc2VFdmVudE5hbWUiLCJLZXlFdmVudHNQbHVnaW4uZ2V0RXZlbnRGdWxsS2V5IiwiS2V5RXZlbnRzUGx1Z2luLmV2ZW50Q2FsbGJhY2siLCJLZXlFdmVudHNQbHVnaW4uX25vcm1hbGl6ZUtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSx1Q0FBdUM7T0FDbEQsRUFDTCxTQUFTLEVBRVQsYUFBYSxFQUdkLE1BQU0sMEJBQTBCO09BQzFCLEVBQUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxpQkFBaUI7T0FFM0MsRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7QUFFL0MsSUFBSSxZQUFZLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RCxJQUFJLGtCQUFrQixHQUF1RDtJQUMzRSxLQUFLLEVBQUUsQ0FBQyxLQUFvQixLQUFLLEtBQUssQ0FBQyxNQUFNO0lBQzdDLFNBQVMsRUFBRSxDQUFDLEtBQW9CLEtBQUssS0FBSyxDQUFDLE9BQU87SUFDbEQsTUFBTSxFQUFFLENBQUMsS0FBb0IsS0FBSyxLQUFLLENBQUMsT0FBTztJQUMvQyxPQUFPLEVBQUUsQ0FBQyxLQUFvQixLQUFLLEtBQUssQ0FBQyxRQUFRO0NBQ2xELENBQUM7QUFFRiwyQ0FDcUMsa0JBQWtCO0lBQ3JEQTtRQUFnQkMs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QU9BLElBQUlBLFlBQVlBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7WUFDSEEsQ0FBQ0E7UUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsT0FBT0EsSUFBSUEsR0FBR0EsQ0FBQ0E7UUFDZkEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDakJBLENBQUNBO0lBRURMLE9BQU9BLGFBQWFBLENBQUNBLE9BQW9CQSxFQUFFQSxPQUFZQSxFQUFFQSxPQUFpQkEsRUFDckRBLElBQVlBO1FBQy9CTSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQTtZQUNYQSxFQUFFQSxDQUFDQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxlQUFlQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDMUVBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxDQUFDQTtRQUNIQSxDQUFDQSxDQUFDQTtJQUNKQSxDQUFDQTtJQUVETixnQkFBZ0JBO0lBQ2hCQSxPQUFPQSxhQUFhQSxDQUFDQSxPQUFlQTtRQUNsQ08sNERBQTREQTtRQUM1REEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLEtBQUtBLEtBQUtBO2dCQUNSQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUNsQkE7Z0JBQ0VBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO1FBQ25CQSxDQUFDQTtJQUNIQSxDQUFDQTtBQUNIUCxDQUFDQTtBQTNGRDtJQUFDLFVBQVUsRUFBRTs7b0JBMkZaO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge1xuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIFN0cmluZ1dyYXBwZXIsXG4gIFJlZ0V4cFdyYXBwZXIsXG4gIE51bWJlcldyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0V2ZW50TWFuYWdlclBsdWdpbn0gZnJvbSAnLi9ldmVudF9tYW5hZ2VyJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbnZhciBtb2RpZmllcktleXMgPSBbJ2FsdCcsICdjb250cm9sJywgJ21ldGEnLCAnc2hpZnQnXTtcbnZhciBtb2RpZmllcktleUdldHRlcnM6IHtba2V5OiBzdHJpbmddOiAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW59ID0ge1xuICAnYWx0JzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBldmVudC5hbHRLZXksXG4gICdjb250cm9sJzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBldmVudC5jdHJsS2V5LFxuICAnbWV0YSc6IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gZXZlbnQubWV0YUtleSxcbiAgJ3NoaWZ0JzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBldmVudC5zaGlmdEtleVxufTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEtleUV2ZW50c1BsdWdpbiBleHRlbmRzIEV2ZW50TWFuYWdlclBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkgeyBzdXBlcigpOyB9XG5cbiAgc3VwcG9ydHMoZXZlbnROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KEtleUV2ZW50c1BsdWdpbi5wYXJzZUV2ZW50TmFtZShldmVudE5hbWUpKTtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudDogSFRNTEVsZW1lbnQsIGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICB2YXIgcGFyc2VkRXZlbnQgPSBLZXlFdmVudHNQbHVnaW4ucGFyc2VFdmVudE5hbWUoZXZlbnROYW1lKTtcblxuICAgIHZhciBvdXRzaWRlSGFuZGxlciA9IEtleUV2ZW50c1BsdWdpbi5ldmVudENhbGxiYWNrKFxuICAgICAgICBlbGVtZW50LCBTdHJpbmdNYXBXcmFwcGVyLmdldChwYXJzZWRFdmVudCwgJ2Z1bGxLZXknKSwgaGFuZGxlciwgdGhpcy5tYW5hZ2VyLmdldFpvbmUoKSk7XG5cbiAgICByZXR1cm4gdGhpcy5tYW5hZ2VyLmdldFpvbmUoKS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICByZXR1cm4gRE9NLm9uQW5kQ2FuY2VsKGVsZW1lbnQsIFN0cmluZ01hcFdyYXBwZXIuZ2V0KHBhcnNlZEV2ZW50LCAnZG9tRXZlbnROYW1lJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHNpZGVIYW5kbGVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUV2ZW50TmFtZShldmVudE5hbWU6IHN0cmluZyk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9IHtcbiAgICB2YXIgcGFydHM6IHN0cmluZ1tdID0gZXZlbnROYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKTtcblxuICAgIHZhciBkb21FdmVudE5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIGlmICgocGFydHMubGVuZ3RoID09PSAwKSB8fFxuICAgICAgICAhKFN0cmluZ1dyYXBwZXIuZXF1YWxzKGRvbUV2ZW50TmFtZSwgJ2tleWRvd24nKSB8fFxuICAgICAgICAgIFN0cmluZ1dyYXBwZXIuZXF1YWxzKGRvbUV2ZW50TmFtZSwgJ2tleXVwJykpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIga2V5ID0gS2V5RXZlbnRzUGx1Z2luLl9ub3JtYWxpemVLZXkocGFydHMucG9wKCkpO1xuXG4gICAgdmFyIGZ1bGxLZXkgPSAnJztcbiAgICBtb2RpZmllcktleXMuZm9yRWFjaChtb2RpZmllck5hbWUgPT4ge1xuICAgICAgaWYgKExpc3RXcmFwcGVyLmNvbnRhaW5zKHBhcnRzLCBtb2RpZmllck5hbWUpKSB7XG4gICAgICAgIExpc3RXcmFwcGVyLnJlbW92ZShwYXJ0cywgbW9kaWZpZXJOYW1lKTtcbiAgICAgICAgZnVsbEtleSArPSBtb2RpZmllck5hbWUgKyAnLic7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZnVsbEtleSArPSBrZXk7XG5cbiAgICBpZiAocGFydHMubGVuZ3RoICE9IDAgfHwga2V5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gcmV0dXJuaW5nIG51bGwgaW5zdGVhZCBvZiB0aHJvd2luZyB0byBsZXQgYW5vdGhlciBwbHVnaW4gcHJvY2VzcyB0aGUgZXZlbnRcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gU3RyaW5nTWFwV3JhcHBlci5jcmVhdGUoKTtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLnNldChyZXN1bHQsICdkb21FdmVudE5hbWUnLCBkb21FdmVudE5hbWUpO1xuICAgIFN0cmluZ01hcFdyYXBwZXIuc2V0KHJlc3VsdCwgJ2Z1bGxLZXknLCBmdWxsS2V5KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc3RhdGljIGdldEV2ZW50RnVsbEtleShldmVudDogS2V5Ym9hcmRFdmVudCk6IHN0cmluZyB7XG4gICAgdmFyIGZ1bGxLZXkgPSAnJztcbiAgICB2YXIga2V5ID0gRE9NLmdldEV2ZW50S2V5KGV2ZW50KTtcbiAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoU3RyaW5nV3JhcHBlci5lcXVhbHMoa2V5LCAnICcpKSB7XG4gICAgICBrZXkgPSAnc3BhY2UnOyAgLy8gZm9yIHJlYWRhYmlsaXR5XG4gICAgfSBlbHNlIGlmIChTdHJpbmdXcmFwcGVyLmVxdWFscyhrZXksICcuJykpIHtcbiAgICAgIGtleSA9ICdkb3QnOyAgLy8gYmVjYXVzZSAnLicgaXMgdXNlZCBhcyBhIHNlcGFyYXRvciBpbiBldmVudCBuYW1lc1xuICAgIH1cbiAgICBtb2RpZmllcktleXMuZm9yRWFjaChtb2RpZmllck5hbWUgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVyTmFtZSAhPSBrZXkpIHtcbiAgICAgICAgdmFyIG1vZGlmaWVyR2V0dGVyID0gU3RyaW5nTWFwV3JhcHBlci5nZXQobW9kaWZpZXJLZXlHZXR0ZXJzLCBtb2RpZmllck5hbWUpO1xuICAgICAgICBpZiAobW9kaWZpZXJHZXR0ZXIoZXZlbnQpKSB7XG4gICAgICAgICAgZnVsbEtleSArPSBtb2RpZmllck5hbWUgKyAnLic7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBmdWxsS2V5ICs9IGtleTtcbiAgICByZXR1cm4gZnVsbEtleTtcbiAgfVxuXG4gIHN0YXRpYyBldmVudENhbGxiYWNrKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBmdWxsS2V5OiBhbnksIGhhbmRsZXI6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICB6b25lOiBOZ1pvbmUpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgICAgaWYgKFN0cmluZ1dyYXBwZXIuZXF1YWxzKEtleUV2ZW50c1BsdWdpbi5nZXRFdmVudEZ1bGxLZXkoZXZlbnQpLCBmdWxsS2V5KSkge1xuICAgICAgICB6b25lLnJ1bigoKSA9PiBoYW5kbGVyKGV2ZW50KSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgc3RhdGljIF9ub3JtYWxpemVLZXkoa2V5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPOiBzd2l0Y2ggdG8gYSBTdHJpbmdNYXAgaWYgdGhlIG1hcHBpbmcgZ3Jvd3MgdG9vIG11Y2hcbiAgICBzd2l0Y2ggKGtleU5hbWUpIHtcbiAgICAgIGNhc2UgJ2VzYyc6XG4gICAgICAgIHJldHVybiAnZXNjYXBlJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBrZXlOYW1lO1xuICAgIH1cbiAgfVxufVxuIl19
