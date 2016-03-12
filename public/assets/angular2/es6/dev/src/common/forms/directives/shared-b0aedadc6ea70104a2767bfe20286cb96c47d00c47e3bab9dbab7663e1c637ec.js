import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent, looseIdentical } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Validators } from '../validators';
import { DefaultValueAccessor } from './default_value_accessor';
import { NumberValueAccessor } from './number_value_accessor';
import { CheckboxControlValueAccessor } from './checkbox_value_accessor';
import { SelectControlValueAccessor } from './select_control_value_accessor';
import { normalizeValidator } from './normalize_validator';
export function controlPath(name, parent) {
    var p = ListWrapper.clone(parent.path);
    p.push(name);
    return p;
}
export function setUpControl(control, dir) {
    if (isBlank(control))
        _throwError(dir, "Cannot find control");
    if (isBlank(dir.valueAccessor))
        _throwError(dir, "No value accessor for");
    control.validator = Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    // view -> model
    dir.valueAccessor.registerOnChange(newValue => {
        dir.viewToModelUpdate(newValue);
        control.updateValue(newValue, { emitModelToViewChange: false });
        control.markAsDirty();
    });
    // model -> view
    control.registerOnChange(newValue => dir.valueAccessor.writeValue(newValue));
    // touched
    dir.valueAccessor.registerOnTouched(() => control.markAsTouched());
}
export function setUpControlGroup(control, dir) {
    if (isBlank(control))
        _throwError(dir, "Cannot find control");
    control.validator = Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
function _throwError(dir, message) {
    var path = dir.path.join(" -> ");
    throw new BaseException(`${message} '${path}'`);
}
export function composeValidators(validators) {
    return isPresent(validators) ? Validators.compose(validators.map(normalizeValidator)) : null;
}
export function composeAsyncValidators(validators) {
    return isPresent(validators) ? Validators.composeAsync(validators.map(normalizeValidator)) : null;
}
export function isPropertyUpdated(changes, viewModel) {
    if (!StringMapWrapper.contains(changes, "model"))
        return false;
    var change = changes["model"];
    if (change.isFirstChange())
        return true;
    return !looseIdentical(viewModel, change.currentValue);
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(dir, valueAccessors) {
    if (isBlank(valueAccessors))
        return null;
    var defaultAccessor;
    var builtinAccessor;
    var customAccessor;
    valueAccessors.forEach(v => {
        if (v instanceof DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (v instanceof CheckboxControlValueAccessor || v instanceof NumberValueAccessor ||
            v instanceof SelectControlValueAccessor) {
            if (isPresent(builtinAccessor))
                _throwError(dir, "More than one built-in value accessor matches");
            builtinAccessor = v;
        }
        else {
            if (isPresent(customAccessor))
                _throwError(dir, "More than one custom value accessor matches");
            customAccessor = v;
        }
    });
    if (isPresent(customAccessor))
        return customAccessor;
    if (isPresent(builtinAccessor))
        return builtinAccessor;
    if (isPresent(defaultAccessor))
        return defaultAccessor;
    _throwError(dir, "No valid value accessor for");
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2NvbW1vbi9mb3Jtcy9kaXJlY3RpdmVzL3NoYXJlZC50cyJdLCJuYW1lcyI6WyJjb250cm9sUGF0aCIsInNldFVwQ29udHJvbCIsInNldFVwQ29udHJvbEdyb3VwIiwiX3Rocm93RXJyb3IiLCJjb21wb3NlVmFsaWRhdG9ycyIsImNvbXBvc2VBc3luY1ZhbGlkYXRvcnMiLCJpc1Byb3BlcnR5VXBkYXRlZCIsInNlbGVjdFZhbHVlQWNjZXNzb3IiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsTUFBTSwwQkFBMEI7T0FDcEUsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BT3ZFLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUVqQyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCO09BQ3RELEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUI7T0FDcEQsRUFBQyw0QkFBNEIsRUFBQyxNQUFNLDJCQUEyQjtPQUMvRCxFQUFDLDBCQUEwQixFQUFDLE1BQU0saUNBQWlDO09BQ25FLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx1QkFBdUI7QUFHeEQsNEJBQTRCLElBQVksRUFBRSxNQUF3QjtJQUNoRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ2JBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0FBQ1hBLENBQUNBO0FBRUQsNkJBQTZCLE9BQWdCLEVBQUUsR0FBYztJQUMzREMsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7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RUEsQ0FBQ0EsWUFBWUEsMEJBQTBCQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxXQUFXQSxDQUFDQSxHQUFHQSxFQUFFQSwrQ0FBK0NBLENBQUNBLENBQUNBO1lBQ3BFQSxlQUFlQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUV0QkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxXQUFXQSxDQUFDQSxHQUFHQSxFQUFFQSw2Q0FBNkNBLENBQUNBLENBQUNBO1lBQ2xFQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7SUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFSEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7SUFDckRBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQUNBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBO0lBQ3ZEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQTtJQUV2REEsV0FBV0EsQ0FBQ0EsR0FBR0EsRUFBRUEsNkJBQTZCQSxDQUFDQSxDQUFDQTtJQUNoREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7QUFDZEEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnQsIGxvb3NlSWRlbnRpY2FsfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge05nQ29udHJvbEdyb3VwfSBmcm9tICcuL25nX2NvbnRyb2xfZ3JvdXAnO1xuaW1wb3J0IHtDb250cm9sLCBDb250cm9sR3JvdXB9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7VmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TnVtYmVyVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9udW1iZXJfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7U2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtub3JtYWxpemVWYWxpZGF0b3J9IGZyb20gJy4vbm9ybWFsaXplX3ZhbGlkYXRvcic7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRyb2xQYXRoKG5hbWU6IHN0cmluZywgcGFyZW50OiBDb250cm9sQ29udGFpbmVyKTogc3RyaW5nW10ge1xuICB2YXIgcCA9IExpc3RXcmFwcGVyLmNsb25lKHBhcmVudC5wYXRoKTtcbiAgcC5wdXNoKG5hbWUpO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFVwQ29udHJvbChjb250cm9sOiBDb250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBpZiAoaXNCbGFuayhjb250cm9sKSkgX3Rocm93RXJyb3IoZGlyLCBcIkNhbm5vdCBmaW5kIGNvbnRyb2xcIik7XG4gIGlmIChpc0JsYW5rKGRpci52YWx1ZUFjY2Vzc29yKSkgX3Rocm93RXJyb3IoZGlyLCBcIk5vIHZhbHVlIGFjY2Vzc29yIGZvclwiKTtcblxuICBjb250cm9sLnZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbY29udHJvbC52YWxpZGF0b3IsIGRpci52YWxpZGF0b3JdKTtcbiAgY29udHJvbC5hc3luY1ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZUFzeW5jKFtjb250cm9sLmFzeW5jVmFsaWRhdG9yLCBkaXIuYXN5bmNWYWxpZGF0b3JdKTtcbiAgZGlyLnZhbHVlQWNjZXNzb3Iud3JpdGVWYWx1ZShjb250cm9sLnZhbHVlKTtcblxuICAvLyB2aWV3IC0+IG1vZGVsXG4gIGRpci52YWx1ZUFjY2Vzc29yLnJlZ2lzdGVyT25DaGFuZ2UobmV3VmFsdWUgPT4ge1xuICAgIGRpci52aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZSk7XG4gICAgY29udHJvbC51cGRhdGVWYWx1ZShuZXdWYWx1ZSwge2VtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2V9KTtcbiAgICBjb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gIH0pO1xuXG4gIC8vIG1vZGVsIC0+IHZpZXdcbiAgY29udHJvbC5yZWdpc3Rlck9uQ2hhbmdlKG5ld1ZhbHVlID0+IGRpci52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUobmV3VmFsdWUpKTtcblxuICAvLyB0b3VjaGVkXG4gIGRpci52YWx1ZUFjY2Vzc29yLnJlZ2lzdGVyT25Ub3VjaGVkKCgpID0+IGNvbnRyb2wubWFya0FzVG91Y2hlZCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFVwQ29udHJvbEdyb3VwKGNvbnRyb2w6IENvbnRyb2xHcm91cCwgZGlyOiBOZ0NvbnRyb2xHcm91cCkge1xuICBpZiAoaXNCbGFuayhjb250cm9sKSkgX3Rocm93RXJyb3IoZGlyLCBcIkNhbm5vdCBmaW5kIGNvbnRyb2xcIik7XG4gIGNvbnRyb2wudmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFtjb250cm9sLnZhbGlkYXRvciwgZGlyLnZhbGlkYXRvcl0pO1xuICBjb250cm9sLmFzeW5jVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlQXN5bmMoW2NvbnRyb2wuYXN5bmNWYWxpZGF0b3IsIGRpci5hc3luY1ZhbGlkYXRvcl0pO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dFcnJvcihkaXI6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gIHZhciBwYXRoID0gZGlyLnBhdGguam9pbihcIiAtPiBcIik7XG4gIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGAke21lc3NhZ2V9ICcke3BhdGh9J2ApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9yczogLyogQXJyYXk8VmFsaWRhdG9yfEZ1bmN0aW9uPiAqLyBhbnlbXSk6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuIGlzUHJlc2VudCh2YWxpZGF0b3JzKSA/IFZhbGlkYXRvcnMuY29tcG9zZSh2YWxpZGF0b3JzLm1hcChub3JtYWxpemVWYWxpZGF0b3IpKSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKFxuICAgIHZhbGlkYXRvcnM6IC8qIEFycmF5PFZhbGlkYXRvcnxGdW5jdGlvbj4gKi8gYW55W10pOiBGdW5jdGlvbiB7XG4gIHJldHVybiBpc1ByZXNlbnQodmFsaWRhdG9ycykgPyBWYWxpZGF0b3JzLmNvbXBvc2VBc3luYyh2YWxpZGF0b3JzLm1hcChub3JtYWxpemVWYWxpZGF0b3IpKSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzOiB7W2tleTogc3RyaW5nXTogYW55fSwgdmlld01vZGVsOiBhbnkpOiBib29sZWFuIHtcbiAgaWYgKCFTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKGNoYW5nZXMsIFwibW9kZWxcIikpIHJldHVybiBmYWxzZTtcbiAgdmFyIGNoYW5nZSA9IGNoYW5nZXNbXCJtb2RlbFwiXTtcblxuICBpZiAoY2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhbG9vc2VJZGVudGljYWwodmlld01vZGVsLCBjaGFuZ2UuY3VycmVudFZhbHVlKTtcbn1cblxuLy8gVE9ETzogdnNhdmtpbiByZW1vdmUgaXQgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDExIGlzIGltcGxlbWVudGVkXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VmFsdWVBY2Nlc3NvcihkaXI6IE5nQ29udHJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdKTogQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBpZiAoaXNCbGFuayh2YWx1ZUFjY2Vzc29ycykpIHJldHVybiBudWxsO1xuXG4gIHZhciBkZWZhdWx0QWNjZXNzb3I7XG4gIHZhciBidWlsdGluQWNjZXNzb3I7XG4gIHZhciBjdXN0b21BY2Nlc3NvcjtcbiAgdmFsdWVBY2Nlc3NvcnMuZm9yRWFjaCh2ID0+IHtcbiAgICBpZiAodiBpbnN0YW5jZW9mIERlZmF1bHRWYWx1ZUFjY2Vzc29yKSB7XG4gICAgICBkZWZhdWx0QWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvciB8fCB2IGluc3RhbmNlb2YgTnVtYmVyVmFsdWVBY2Nlc3NvciB8fFxuICAgICAgICAgICAgICAgdiBpbnN0YW5jZW9mIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KGJ1aWx0aW5BY2Nlc3NvcikpXG4gICAgICAgIF90aHJvd0Vycm9yKGRpciwgXCJNb3JlIHRoYW4gb25lIGJ1aWx0LWluIHZhbHVlIGFjY2Vzc29yIG1hdGNoZXNcIik7XG4gICAgICBidWlsdGluQWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1ByZXNlbnQoY3VzdG9tQWNjZXNzb3IpKVxuICAgICAgICBfdGhyb3dFcnJvcihkaXIsIFwiTW9yZSB0aGFuIG9uZSBjdXN0b20gdmFsdWUgYWNjZXNzb3IgbWF0Y2hlc1wiKTtcbiAgICAgIGN1c3RvbUFjY2Vzc29yID0gdjtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChpc1ByZXNlbnQoY3VzdG9tQWNjZXNzb3IpKSByZXR1cm4gY3VzdG9tQWNjZXNzb3I7XG4gIGlmIChpc1ByZXNlbnQoYnVpbHRpbkFjY2Vzc29yKSkgcmV0dXJuIGJ1aWx0aW5BY2Nlc3NvcjtcbiAgaWYgKGlzUHJlc2VudChkZWZhdWx0QWNjZXNzb3IpKSByZXR1cm4gZGVmYXVsdEFjY2Vzc29yO1xuXG4gIF90aHJvd0Vycm9yKGRpciwgXCJObyB2YWxpZCB2YWx1ZSBhY2Nlc3NvciBmb3JcIik7XG4gIHJldHVybiBudWxsO1xufVxuIl19
