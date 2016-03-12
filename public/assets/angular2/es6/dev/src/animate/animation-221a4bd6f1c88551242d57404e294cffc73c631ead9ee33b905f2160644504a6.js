import { DateWrapper, StringWrapper, RegExpWrapper, NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { Math } from 'angular2/src/facade/math';
import { camelCaseToDashCase } from 'angular2/src/platform/dom/util';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
export class Animation {
    /**
     * Stores the start time and starts the animation
     * @param element
     * @param data
     * @param browserDetails
     */
    constructor(element, data, browserDetails) {
        this.element = element;
        this.data = data;
        this.browserDetails = browserDetails;
        /** functions to be called upon completion */
        this.callbacks = [];
        /** functions for removing event listeners */
        this.eventClearFunctions = [];
        /** flag used to track whether or not the animation has finished */
        this.completed = false;
        this._stringPrefix = '';
        this.startTime = DateWrapper.toMillis(DateWrapper.now());
        this._stringPrefix = DOM.getAnimationPrefix();
        this.setup();
        this.wait(timestamp => this.start());
    }
    /** total amount of time that the animation should take including delay */
    get totalTime() {
        let delay = this.computedDelay != null ? this.computedDelay : 0;
        let duration = this.computedDuration != null ? this.computedDuration : 0;
        return delay + duration;
    }
    wait(callback) {
        // Firefox requires 2 frames for some reason
        this.browserDetails.raf(callback, 2);
    }
    /**
     * Sets up the initial styles before the animation is started
     */
    setup() {
        if (this.data.fromStyles != null)
            this.applyStyles(this.data.fromStyles);
        if (this.data.duration != null)
            this.applyStyles({ 'transitionDuration': this.data.duration.toString() + 'ms' });
        if (this.data.delay != null)
            this.applyStyles({ 'transitionDelay': this.data.delay.toString() + 'ms' });
    }
    /**
     * After the initial setup has occurred, this method adds the animation styles
     */
    start() {
        this.addClasses(this.data.classesToAdd);
        this.addClasses(this.data.animationClasses);
        this.removeClasses(this.data.classesToRemove);
        if (this.data.toStyles != null)
            this.applyStyles(this.data.toStyles);
        var computedStyles = DOM.getComputedStyle(this.element);
        this.computedDelay =
            Math.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-delay')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-delay')));
        this.computedDuration = Math.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-duration')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-duration')));
        this.addEvents();
    }
    /**
     * Applies the provided styles to the element
     * @param styles
     */
    applyStyles(styles) {
        StringMapWrapper.forEach(styles, (value, key) => {
            var dashCaseKey = camelCaseToDashCase(key);
            if (isPresent(DOM.getStyle(this.element, dashCaseKey))) {
                DOM.setStyle(this.element, dashCaseKey, value.toString());
            }
            else {
                DOM.setStyle(this.element, this._stringPrefix + dashCaseKey, value.toString());
            }
        });
    }
    /**
     * Adds the provided classes to the element
     * @param classes
     */
    addClasses(classes) {
        for (let i = 0, len = classes.length; i < len; i++)
            DOM.addClass(this.element, classes[i]);
    }
    /**
     * Removes the provided classes from the element
     * @param classes
     */
    removeClasses(classes) {
        for (let i = 0, len = classes.length; i < len; i++)
            DOM.removeClass(this.element, classes[i]);
    }
    /**
     * Adds events to track when animations have finished
     */
    addEvents() {
        if (this.totalTime > 0) {
            this.eventClearFunctions.push(DOM.onAndCancel(this.element, DOM.getTransitionEnd(), (event) => this.handleAnimationEvent(event)));
        }
        else {
            this.handleAnimationCompleted();
        }
    }
    handleAnimationEvent(event) {
        let elapsedTime = Math.round(event.elapsedTime * 1000);
        if (!this.browserDetails.elapsedTimeIncludesDelay)
            elapsedTime += this.computedDelay;
        event.stopPropagation();
        if (elapsedTime >= this.totalTime)
            this.handleAnimationCompleted();
    }
    /**
     * Runs all animation callbacks and removes temporary classes
     */
    handleAnimationCompleted() {
        this.removeClasses(this.data.animationClasses);
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        this.eventClearFunctions.forEach(fn => fn());
        this.eventClearFunctions = [];
        this.completed = true;
    }
    /**
     * Adds animation callbacks to be called upon completion
     * @param callback
     * @returns {Animation}
     */
    onComplete(callback) {
        if (this.completed) {
            callback();
        }
        else {
            this.callbacks.push(callback);
        }
        return this;
    }
    /**
     * Converts the duration string to the number of milliseconds
     * @param duration
     * @returns {number}
     */
    parseDurationString(duration) {
        var maxValue = 0;
        // duration must have at least 2 characters to be valid. (number + type)
        if (duration == null || duration.length < 2) {
            return maxValue;
        }
        else if (duration.substring(duration.length - 2) == 'ms') {
            let value = NumberWrapper.parseInt(this.stripLetters(duration), 10);
            if (value > maxValue)
                maxValue = value;
        }
        else if (duration.substring(duration.length - 1) == 's') {
            let ms = NumberWrapper.parseFloat(this.stripLetters(duration)) * 1000;
            let value = Math.floor(ms);
            if (value > maxValue)
                maxValue = value;
        }
        return maxValue;
    }
    /**
     * Strips the letters from the duration string
     * @param str
     * @returns {string}
     */
    stripLetters(str) {
        return StringWrapper.replaceAll(str, RegExpWrapper.create('[^0-9]+$', ''), '');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2FuaW1hdGUvYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbiIsIkFuaW1hdGlvbi5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvbi50b3RhbFRpbWUiLCJBbmltYXRpb24ud2FpdCIsIkFuaW1hdGlvbi5zZXR1cCIsIkFuaW1hdGlvbi5zdGFydCIsIkFuaW1hdGlvbi5hcHBseVN0eWxlcyIsIkFuaW1hdGlvbi5hZGRDbGFzc2VzIiwiQW5pbWF0aW9uLnJlbW92ZUNsYXNzZXMiLCJBbmltYXRpb24uYWRkRXZlbnRzIiwiQW5pbWF0aW9uLmhhbmRsZUFuaW1hdGlvbkV2ZW50IiwiQW5pbWF0aW9uLmhhbmRsZUFuaW1hdGlvbkNvbXBsZXRlZCIsIkFuaW1hdGlvbi5vbkNvbXBsZXRlIiwiQW5pbWF0aW9uLnBhcnNlRHVyYXRpb25TdHJpbmciLCJBbmltYXRpb24uc3RyaXBMZXR0ZXJzIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUNMLFdBQVcsRUFDWCxhQUFhLEVBQ2IsYUFBYSxFQUNiLGFBQWEsRUFDYixTQUFTLEVBQ1YsTUFBTSwwQkFBMEI7T0FDMUIsRUFBQyxJQUFJLEVBQUMsTUFBTSwwQkFBMEI7T0FDdEMsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGdDQUFnQztPQUMzRCxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3hELEVBQUMsR0FBRyxFQUFDLE1BQU0sdUNBQXVDO0FBS3pEO0lBNEJFQTs7Ozs7T0FLR0E7SUFDSEEsWUFBbUJBLE9BQW9CQSxFQUFTQSxJQUF5QkEsRUFDdERBLGNBQThCQTtRQUQ5QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBYUE7UUFBU0EsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBcUJBO1FBQ3REQSxtQkFBY0EsR0FBZEEsY0FBY0EsQ0FBZ0JBO1FBbENqREEsNkNBQTZDQTtRQUM3Q0EsY0FBU0EsR0FBZUEsRUFBRUEsQ0FBQ0E7UUFXM0JBLDZDQUE2Q0E7UUFDN0NBLHdCQUFtQkEsR0FBZUEsRUFBRUEsQ0FBQ0E7UUFFckNBLG1FQUFtRUE7UUFDbkVBLGNBQVNBLEdBQVlBLEtBQUtBLENBQUNBO1FBRW5CQSxrQkFBYUEsR0FBV0EsRUFBRUEsQ0FBQ0E7UUFpQmpDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUN6REEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsR0FBR0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDYkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBbkJERCwwRUFBMEVBO0lBQzFFQSxJQUFJQSxTQUFTQTtRQUNYRSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoRUEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3pFQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFnQkRGLElBQUlBLENBQUNBLFFBQWtCQTtRQUNyQkcsNENBQTRDQTtRQUM1Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBRURIOztPQUVHQTtJQUNIQSxLQUFLQTtRQUNISSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUN6RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUNBLG9CQUFvQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBO1lBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFDQSxpQkFBaUJBLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLEdBQUdBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO0lBQzdFQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSEEsS0FBS0E7UUFDSEssSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDeENBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQzlDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUNy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Q0E7QUFDSGQsQ0FBQ0E7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERhdGVXcmFwcGVyLFxuICBTdHJpbmdXcmFwcGVyLFxuICBSZWdFeHBXcmFwcGVyLFxuICBOdW1iZXJXcmFwcGVyLFxuICBpc1ByZXNlbnRcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWF0aH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9tYXRoJztcbmltcG9ydCB7Y2FtZWxDYXNlVG9EYXNoQ2FzZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS91dGlsJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcblxuaW1wb3J0IHtCcm93c2VyRGV0YWlsc30gZnJvbSAnLi9icm93c2VyX2RldGFpbHMnO1xuaW1wb3J0IHtDc3NBbmltYXRpb25PcHRpb25zfSBmcm9tICcuL2Nzc19hbmltYXRpb25fb3B0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb24ge1xuICAvKiogZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCB1cG9uIGNvbXBsZXRpb24gKi9cbiAgY2FsbGJhY2tzOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIHRoZSBkdXJhdGlvbiAobXMpIG9mIHRoZSBhbmltYXRpb24gKHdoZXRoZXIgZnJvbSBDU1Mgb3IgbWFudWFsbHkgc2V0KSAqL1xuICBjb21wdXRlZER1cmF0aW9uOiBudW1iZXI7XG5cbiAgLyoqIHRoZSBhbmltYXRpb24gZGVsYXkgKG1zKSAod2hldGhlciBmcm9tIENTUyBvciBtYW51YWxseSBzZXQpICovXG4gIGNvbXB1dGVkRGVsYXk6IG51bWJlcjtcblxuICAvKiogdGltZXN0YW1wIG9mIHdoZW4gdGhlIGFuaW1hdGlvbiBzdGFydGVkICovXG4gIHN0YXJ0VGltZTogbnVtYmVyO1xuXG4gIC8qKiBmdW5jdGlvbnMgZm9yIHJlbW92aW5nIGV2ZW50IGxpc3RlbmVycyAqL1xuICBldmVudENsZWFyRnVuY3Rpb25zOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIGZsYWcgdXNlZCB0byB0cmFjayB3aGV0aGVyIG9yIG5vdCB0aGUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCAqL1xuICBjb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9zdHJpbmdQcmVmaXg6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiB0b3RhbCBhbW91bnQgb2YgdGltZSB0aGF0IHRoZSBhbmltYXRpb24gc2hvdWxkIHRha2UgaW5jbHVkaW5nIGRlbGF5ICovXG4gIGdldCB0b3RhbFRpbWUoKTogbnVtYmVyIHtcbiAgICBsZXQgZGVsYXkgPSB0aGlzLmNvbXB1dGVkRGVsYXkgIT0gbnVsbCA/IHRoaXMuY29tcHV0ZWREZWxheSA6IDA7XG4gICAgbGV0IGR1cmF0aW9uID0gdGhpcy5jb21wdXRlZER1cmF0aW9uICE9IG51bGwgPyB0aGlzLmNvbXB1dGVkRHVyYXRpb24gOiAwO1xuICAgIHJldHVybiBkZWxheSArIGR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlcyB0aGUgc3RhcnQgdGltZSBhbmQgc3RhcnRzIHRoZSBhbmltYXRpb25cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIGJyb3dzZXJEZXRhaWxzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsIHB1YmxpYyBkYXRhOiBDc3NBbmltYXRpb25PcHRpb25zLFxuICAgICAgICAgICAgICBwdWJsaWMgYnJvd3NlckRldGFpbHM6IEJyb3dzZXJEZXRhaWxzKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBEYXRlV3JhcHBlci50b01pbGxpcyhEYXRlV3JhcHBlci5ub3coKSk7XG4gICAgdGhpcy5fc3RyaW5nUHJlZml4ID0gRE9NLmdldEFuaW1hdGlvblByZWZpeCgpO1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgICB0aGlzLndhaXQodGltZXN0YW1wID0+IHRoaXMuc3RhcnQoKSk7XG4gIH1cblxuICB3YWl0KGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIC8vIEZpcmVmb3ggcmVxdWlyZXMgMiBmcmFtZXMgZm9yIHNvbWUgcmVhc29uXG4gICAgdGhpcy5icm93c2VyRGV0YWlscy5yYWYoY2FsbGJhY2ssIDIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgdGhlIGluaXRpYWwgc3R5bGVzIGJlZm9yZSB0aGUgYW5pbWF0aW9uIGlzIHN0YXJ0ZWRcbiAgICovXG4gIHNldHVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGEuZnJvbVN0eWxlcyAhPSBudWxsKSB0aGlzLmFwcGx5U3R5bGVzKHRoaXMuZGF0YS5mcm9tU3R5bGVzKTtcbiAgICBpZiAodGhpcy5kYXRhLmR1cmF0aW9uICE9IG51bGwpXG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKHsndHJhbnNpdGlvbkR1cmF0aW9uJzogdGhpcy5kYXRhLmR1cmF0aW9uLnRvU3RyaW5nKCkgKyAnbXMnfSk7XG4gICAgaWYgKHRoaXMuZGF0YS5kZWxheSAhPSBudWxsKVxuICAgICAgdGhpcy5hcHBseVN0eWxlcyh7J3RyYW5zaXRpb25EZWxheSc6IHRoaXMuZGF0YS5kZWxheS50b1N0cmluZygpICsgJ21zJ30pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIHRoZSBpbml0aWFsIHNldHVwIGhhcyBvY2N1cnJlZCwgdGhpcyBtZXRob2QgYWRkcyB0aGUgYW5pbWF0aW9uIHN0eWxlc1xuICAgKi9cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5hZGRDbGFzc2VzKHRoaXMuZGF0YS5jbGFzc2VzVG9BZGQpO1xuICAgIHRoaXMuYWRkQ2xhc3Nlcyh0aGlzLmRhdGEuYW5pbWF0aW9uQ2xhc3Nlcyk7XG4gICAgdGhpcy5yZW1vdmVDbGFzc2VzKHRoaXMuZGF0YS5jbGFzc2VzVG9SZW1vdmUpO1xuICAgIGlmICh0aGlzLmRhdGEudG9TdHlsZXMgIT0gbnVsbCkgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmRhdGEudG9TdHlsZXMpO1xuICAgIHZhciBjb21wdXRlZFN0eWxlcyA9IERPTS5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5jb21wdXRlZERlbGF5ID1cbiAgICAgICAgTWF0aC5tYXgodGhpcy5wYXJzZUR1cmF0aW9uU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLl9zdHJpbmdQcmVmaXggKyAndHJhbnNpdGlvbi1kZWxheScpKSxcbiAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUR1cmF0aW9uU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUodGhpcy5fc3RyaW5nUHJlZml4ICsgJ3RyYW5zaXRpb24tZGVsYXknKSkpO1xuICAgIHRoaXMuY29tcHV0ZWREdXJhdGlvbiA9IE1hdGgubWF4KHRoaXMucGFyc2VEdXJhdGlvblN0cmluZyhjb21wdXRlZFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHJpbmdQcmVmaXggKyAndHJhbnNpdGlvbi1kdXJhdGlvbicpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRHVyYXRpb25TdHJpbmcodGhpcy5lbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0cmluZ1ByZWZpeCArICd0cmFuc2l0aW9uLWR1cmF0aW9uJykpKTtcbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHByb3ZpZGVkIHN0eWxlcyB0byB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0gc3R5bGVzXG4gICAqL1xuICBhcHBseVN0eWxlcyhzdHlsZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogdm9pZCB7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHN0eWxlcywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHZhciBkYXNoQ2FzZUtleSA9IGNhbWVsQ2FzZVRvRGFzaENhc2Uoa2V5KTtcbiAgICAgIGlmIChpc1ByZXNlbnQoRE9NLmdldFN0eWxlKHRoaXMuZWxlbWVudCwgZGFzaENhc2VLZXkpKSkge1xuICAgICAgICBET00uc2V0U3R5bGUodGhpcy5lbGVtZW50LCBkYXNoQ2FzZUtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBET00uc2V0U3R5bGUodGhpcy5lbGVtZW50LCB0aGlzLl9zdHJpbmdQcmVmaXggKyBkYXNoQ2FzZUtleSwgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgcHJvdmlkZWQgY2xhc3NlcyB0byB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0gY2xhc3Nlc1xuICAgKi9cbiAgYWRkQ2xhc3NlcyhjbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBET00uYWRkQ2xhc3ModGhpcy5lbGVtZW50LCBjbGFzc2VzW2ldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBwcm92aWRlZCBjbGFzc2VzIGZyb20gdGhlIGVsZW1lbnRcbiAgICogQHBhcmFtIGNsYXNzZXNcbiAgICovXG4gIHJlbW92ZUNsYXNzZXMoY2xhc3Nlczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykgRE9NLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudCwgY2xhc3Nlc1tpXSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudHMgdG8gdHJhY2sgd2hlbiBhbmltYXRpb25zIGhhdmUgZmluaXNoZWRcbiAgICovXG4gIGFkZEV2ZW50cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b3RhbFRpbWUgPiAwKSB7XG4gICAgICB0aGlzLmV2ZW50Q2xlYXJGdW5jdGlvbnMucHVzaChET00ub25BbmRDYW5jZWwoXG4gICAgICAgICAgdGhpcy5lbGVtZW50LCBET00uZ2V0VHJhbnNpdGlvbkVuZCgpLCAoZXZlbnQ6IGFueSkgPT4gdGhpcy5oYW5kbGVBbmltYXRpb25FdmVudChldmVudCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVBbmltYXRpb25Db21wbGV0ZWQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVBbmltYXRpb25FdmVudChldmVudDogYW55KTogdm9pZCB7XG4gICAgbGV0IGVsYXBzZWRUaW1lID0gTWF0aC5yb3VuZChldmVudC5lbGFwc2VkVGltZSAqIDEwMDApO1xuICAgIGlmICghdGhpcy5icm93c2VyRGV0YWlscy5lbGFwc2VkVGltZUluY2x1ZGVzRGVsYXkpIGVsYXBzZWRUaW1lICs9IHRoaXMuY29tcHV0ZWREZWxheTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZWxhcHNlZFRpbWUgPj0gdGhpcy50b3RhbFRpbWUpIHRoaXMuaGFuZGxlQW5pbWF0aW9uQ29tcGxldGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogUnVucyBhbGwgYW5pbWF0aW9uIGNhbGxiYWNrcyBhbmQgcmVtb3ZlcyB0ZW1wb3JhcnkgY2xhc3Nlc1xuICAgKi9cbiAgaGFuZGxlQW5pbWF0aW9uQ29tcGxldGVkKCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlQ2xhc3Nlcyh0aGlzLmRhdGEuYW5pbWF0aW9uQ2xhc3Nlcyk7XG4gICAgdGhpcy5jYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuZXZlbnRDbGVhckZ1bmN0aW9ucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuZXZlbnRDbGVhckZ1bmN0aW9ucyA9IFtdO1xuICAgIHRoaXMuY29tcGxldGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuaW1hdGlvbiBjYWxsYmFja3MgdG8gYmUgY2FsbGVkIHVwb24gY29tcGxldGlvblxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHJldHVybnMge0FuaW1hdGlvbn1cbiAgICovXG4gIG9uQ29tcGxldGUoY2FsbGJhY2s6IEZ1bmN0aW9uKTogQW5pbWF0aW9uIHtcbiAgICBpZiAodGhpcy5jb21wbGV0ZWQpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgZHVyYXRpb24gc3RyaW5nIHRvIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSBkdXJhdGlvblxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgcGFyc2VEdXJhdGlvblN0cmluZyhkdXJhdGlvbjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICB2YXIgbWF4VmFsdWUgPSAwO1xuICAgIC8vIGR1cmF0aW9uIG11c3QgaGF2ZSBhdCBsZWFzdCAyIGNoYXJhY3RlcnMgdG8gYmUgdmFsaWQuIChudW1iZXIgKyB0eXBlKVxuICAgIGlmIChkdXJhdGlvbiA9PSBudWxsIHx8IGR1cmF0aW9uLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiBtYXhWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGR1cmF0aW9uLnN1YnN0cmluZyhkdXJhdGlvbi5sZW5ndGggLSAyKSA9PSAnbXMnKSB7XG4gICAgICBsZXQgdmFsdWUgPSBOdW1iZXJXcmFwcGVyLnBhcnNlSW50KHRoaXMuc3RyaXBMZXR0ZXJzKGR1cmF0aW9uKSwgMTApO1xuICAgICAgaWYgKHZhbHVlID4gbWF4VmFsdWUpIG1heFZhbHVlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChkdXJhdGlvbi5zdWJzdHJpbmcoZHVyYXRpb24ubGVuZ3RoIC0gMSkgPT0gJ3MnKSB7XG4gICAgICBsZXQgbXMgPSBOdW1iZXJXcmFwcGVyLnBhcnNlRmxvYXQodGhpcy5zdHJpcExldHRlcnMoZHVyYXRpb24pKSAqIDEwMDA7XG4gICAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKG1zKTtcbiAgICAgIGlmICh2YWx1ZSA+IG1heFZhbHVlKSBtYXhWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbWF4VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU3RyaXBzIHRoZSBsZXR0ZXJzIGZyb20gdGhlIGR1cmF0aW9uIHN0cmluZ1xuICAgKiBAcGFyYW0gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdHJpcExldHRlcnMoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoc3RyLCBSZWdFeHBXcmFwcGVyLmNyZWF0ZSgnW14wLTldKyQnLCAnJyksICcnKTtcbiAgfVxufVxuIl19
