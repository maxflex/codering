'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var exceptions_1 = require('angular2/src/facade/exceptions');
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require("angular2/src/core/di");
/**
 * A TypeScript implementation of {@link MessageBus} for communicating via JavaScript's
 * postMessage API.
 */
var PostMessageBus = (function () {
    function PostMessageBus(sink, source) {
        this.sink = sink;
        this.source = source;
    }
    PostMessageBus.prototype.attachToZone = function (zone) {
        this.source.attachToZone(zone);
        this.sink.attachToZone(zone);
    };
    PostMessageBus.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this.source.initChannel(channel, runInZone);
        this.sink.initChannel(channel, runInZone);
    };
    PostMessageBus.prototype.from = function (channel) { return this.source.from(channel); };
    PostMessageBus.prototype.to = function (channel) { return this.sink.to(channel); };
    PostMessageBus = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [PostMessageBusSink, PostMessageBusSource])
    ], PostMessageBus);
    return PostMessageBus;
})();
exports.PostMessageBus = PostMessageBus;
var PostMessageBusSink = (function () {
    function PostMessageBusSink(_postMessageTarget) {
        this._postMessageTarget = _postMessageTarget;
        this._channels = collection_1.StringMapWrapper.create();
        this._messageBuffer = [];
    }
    PostMessageBusSink.prototype.attachToZone = function (zone) {
        var _this = this;
        this._zone = zone;
        this._zone.runOutsideAngular(function () {
            async_1.ObservableWrapper.subscribe(_this._zone.onEventDone, function (_) { _this._handleOnEventDone(); });
        });
    };
    PostMessageBusSink.prototype.initChannel = function (channel, runInZone) {
        var _this = this;
        if (runInZone === void 0) { runInZone = true; }
        if (collection_1.StringMapWrapper.contains(this._channels, channel)) {
            throw new exceptions_1.BaseException(channel + " has already been initialized");
        }
        var emitter = new async_1.EventEmitter();
        var channelInfo = new _Channel(emitter, runInZone);
        this._channels[channel] = channelInfo;
        emitter.subscribe(function (data) {
            var message = { channel: channel, message: data };
            if (runInZone) {
                _this._messageBuffer.push(message);
            }
            else {
                _this._sendMessages([message]);
            }
        });
    };
    PostMessageBusSink.prototype.to = function (channel) {
        if (collection_1.StringMapWrapper.contains(this._channels, channel)) {
            return this._channels[channel].emitter;
        }
        else {
            throw new exceptions_1.BaseException(channel + " is not set up. Did you forget to call initChannel?");
        }
    };
    PostMessageBusSink.prototype._handleOnEventDone = function () {
        if (this._messageBuffer.length > 0) {
            this._sendMessages(this._messageBuffer);
            this._messageBuffer = [];
        }
    };
    PostMessageBusSink.prototype._sendMessages = function (messages) { this._postMessageTarget.postMessage(messages); };
    return PostMessageBusSink;
})();
exports.PostMessageBusSink = PostMessageBusSink;
var PostMessageBusSource = (function () {
    function PostMessageBusSource(eventTarget) {
        var _this = this;
        this._channels = collection_1.StringMapWrapper.create();
        if (eventTarget) {
            eventTarget.addEventListener("message", function (ev) { return _this._handleMessages(ev); });
        }
        else {
            // if no eventTarget is given we assume we're in a WebWorker and listen on the global scope
            addEventListener("message", function (ev) { return _this._handleMessages(ev); });
        }
    }
    PostMessageBusSource.prototype.attachToZone = function (zone) { this._zone = zone; };
    PostMessageBusSource.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (collection_1.StringMapWrapper.contains(this._channels, channel)) {
            throw new exceptions_1.BaseException(channel + " has already been initialized");
        }
        var emitter = new async_1.EventEmitter();
        var channelInfo = new _Channel(emitter, runInZone);
        this._channels[channel] = channelInfo;
    };
    PostMessageBusSource.prototype.from = function (channel) {
        if (collection_1.StringMapWrapper.contains(this._channels, channel)) {
            return this._channels[channel].emitter;
        }
        else {
            throw new exceptions_1.BaseException(channel + " is not set up. Did you forget to call initChannel?");
        }
    };
    PostMessageBusSource.prototype._handleMessages = function (ev) {
        var messages = ev.data;
        for (var i = 0; i < messages.length; i++) {
            this._handleMessage(messages[i]);
        }
    };
    PostMessageBusSource.prototype._handleMessage = function (data) {
        var channel = data.channel;
        if (collection_1.StringMapWrapper.contains(this._channels, channel)) {
            var channelInfo = this._channels[channel];
            if (channelInfo.runInZone) {
                this._zone.run(function () { channelInfo.emitter.emit(data.message); });
            }
            else {
                channelInfo.emitter.emit(data.message);
            }
        }
    };
    return PostMessageBusSource;
})();
exports.PostMessageBusSource = PostMessageBusSource;
/**
 * Helper class that wraps a channel's {@link EventEmitter} and
 * keeps track of if it should run in the zone.
 */
var _Channel = (function () {
    function _Channel(emitter, runInZone) {
        this.emitter = emitter;
        this.runInZone = runInZone;
    }
    return _Channel;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdF9tZXNzYWdlX2J1cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvcG9zdF9tZXNzYWdlX2J1cy50cyJdLCJuYW1lcyI6WyJQb3N0TWVzc2FnZUJ1cyIsIlBvc3RNZXNzYWdlQnVzLmNvbnN0cnVjdG9yIiwiUG9zdE1lc3NhZ2VCdXMuYXR0YWNoVG9ab25lIiwiUG9zdE1lc3NhZ2VCdXMuaW5pdENoYW5uZWwiLCJQb3N0TWVzc2FnZUJ1cy5mcm9tIiwiUG9zdE1lc3NhZ2VCdXMudG8iLCJQb3N0TWVzc2FnZUJ1c1NpbmsiLCJQb3N0TWVzc2FnZUJ1c1NpbmsuY29uc3RydWN0b3IiLCJQb3N0TWVzc2FnZUJ1c1NpbmsuYXR0YWNoVG9ab25lIiwiUG9zdE1lc3NhZ2VCdXNTaW5rLmluaXRDaGFubmVsIiwiUG9zdE1lc3NhZ2VCdXNTaW5rLnRvIiwiUG9zdE1lc3NhZ2VCdXNTaW5rLl9oYW5kbGVPbkV2ZW50RG9uZSIsIlBvc3RNZXNzYWdlQnVzU2luay5fc2VuZE1lc3NhZ2VzIiwiUG9zdE1lc3NhZ2VCdXNTb3VyY2UiLCJQb3N0TWVzc2FnZUJ1c1NvdXJjZS5jb25zdHJ1Y3RvciIsIlBvc3RNZXNzYWdlQnVzU291cmNlLmF0dGFjaFRvWm9uZSIsIlBvc3RNZXNzYWdlQnVzU291cmNlLmluaXRDaGFubmVsIiwiUG9zdE1lc3NhZ2VCdXNTb3VyY2UuZnJvbSIsIlBvc3RNZXNzYWdlQnVzU291cmNlLl9oYW5kbGVNZXNzYWdlcyIsIlBvc3RNZXNzYWdlQnVzU291cmNlLl9oYW5kbGVNZXNzYWdlIiwiX0NoYW5uZWwiLCJfQ2hhbm5lbC5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0EsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFDL0Usc0JBQThDLDJCQUEyQixDQUFDLENBQUE7QUFDMUUsMkJBQStCLGdDQUFnQyxDQUFDLENBQUE7QUFDaEUsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFHaEQ7OztHQUdHO0FBQ0g7SUFFRUEsd0JBQW1CQSxJQUF3QkEsRUFBU0EsTUFBNEJBO1FBQTdEQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFvQkE7UUFBU0EsV0FBTUEsR0FBTkEsTUFBTUEsQ0FBc0JBO0lBQUdBLENBQUNBO0lBRXBGRCxxQ0FBWUEsR0FBWkEsVUFBYUEsSUFBWUE7UUFDdkJFLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQy9CQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUMvQkEsQ0FBQ0E7SUFFREYsb0NBQVdBLEdBQVhBLFVBQVlBLE9BQWVBLEVBQUVBLFNBQXlCQTtRQUF6QkcseUJBQXlCQSxHQUF6QkEsZ0JBQXlCQTtRQUNwREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO0lBQzVDQSxDQUFDQTtJQUVESCw2QkFBSUEsR0FBSkEsVUFBS0EsT0FBZUEsSUFBdUJJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBRTlFSiwyQkFBRUEsR0FBRkEsVUFBR0EsT0FBZUEsSUFBdUJLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBaEIxRUw7UUFBQ0EsZUFBVUEsRUFBRUE7O3VCQWlCWkE7SUFBREEscUJBQUNBO0FBQURBLENBQUNBLEFBakJELElBaUJDO0FBaEJZLHNCQUFjLGlCQWdCMUIsQ0FBQTtBQUVEO0lBS0VNLDRCQUFvQkEsa0JBQXFDQTtRQUFyQ0MsdUJBQWtCQSxHQUFsQkEsa0JBQWtCQSxDQUFtQkE7UUFIakRBLGNBQVNBLEdBQThCQSw2QkFBZ0JBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2pFQSxtQkFBY0EsR0FBa0JBLEVBQUVBLENBQUNBO0lBRWlCQSxDQUFDQTtJQUU3REQseUNBQVlBLEdBQVpBLFVBQWFBLElBQVlBO1FBQXpCRSxpQkFLQ0E7UUFKQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGlCQUFpQkEsQ0FBQ0E7WUFDM0JBLHlCQUFpQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsRUFBRUEsVUFBQ0EsQ0FBQ0EsSUFBT0EsS0FBSUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3RkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFREYsd0NBQVdBLEdBQVhBLFVBQVlBLE9BQWVBLEVBQUVBLFNBQXlCQTtRQUF0REcsaUJBZ0JDQTtRQWhCNEJBLHlCQUF5QkEsR0FBekJBLGdCQUF5QkE7UUFDcERBLEVBQUVBLENBQUNBLENBQUNBLDZCQUFnQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkRBLE1BQU1BLElBQUlBLDBCQUFhQSxDQUFJQSxPQUFPQSxrQ0FBK0JBLENBQUNBLENBQUNBO1FBQ3JFQSxDQUFDQTtRQUVEQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxvQkFBWUEsRUFBRUEsQ0FBQ0E7UUFDakNBLElBQUlBLFdBQVdBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLE9BQU9BLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO1FBQ25EQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUN0Q0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsVUFBQ0EsSUFBWUE7WUFDN0JBLElBQUlBLE9BQU9BLEdBQUdBLEVBQUNBLE9BQU9BLEVBQUVBLE9BQU9BLEVBQUVBLE9BQU9BLEVBQUVBLElBQUlBLEVBQUNBLENBQUNBO1lBQ2hEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZEEsS0FBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxLQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7UUFDSEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFREgsK0JBQUVBLEdBQUZBLFVBQUdBLE9BQWVBO1FBQ2hCSSxFQUFFQSxDQUFDQSxDQUFDQSw2QkFBZ0JBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUN6Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsTUFBTUEsSUFBSUEsMEJBQWFBLENBQUlBLE9BQU9BLHdEQUFxREEsQ0FBQ0EsQ0FBQ0E7UUFDM0ZBLENBQUNBO0lBQ0hBLENBQUNBO0lBRU9KLCtDQUFrQkEsR0FBMUJBO1FBQ0VLLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25DQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUN4Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDM0JBLENBQUNBO0lBQ0hBLENBQUNBO0lBRU9MLDBDQUFhQSxHQUFyQkEsVUFBc0JBLFFBQXVCQSxJQUFJTSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ25HTix5QkFBQ0E7QUFBREEsQ0FBQ0EsQUFoREQsSUFnREM7QUFoRFksMEJBQWtCLHFCQWdEOUIsQ0FBQTtBQUVEO0lBSUVPLDhCQUFZQSxXQUF5QkE7UUFKdkNDLGlCQW1EQ0E7UUFqRFNBLGNBQVNBLEdBQThCQSw2QkFBZ0JBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBR3ZFQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsV0FBV0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFDQSxFQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBeEJBLENBQXdCQSxDQUFDQSxDQUFDQTtRQUMxRkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsMkZBQTJGQTtZQUMzRkEsZ0JBQWdCQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFDQSxFQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBeEJBLENBQXdCQSxDQUFDQSxDQUFDQTtRQUM5RUEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFFREQsMkNBQVlBLEdBQVpBLFVBQWFBLElBQVlBLElBQUlFLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO0lBRWpERiwwQ0FBV0EsR0FBWEEsVUFBWUEsT0FBZUEsRUFBRUEsU0FBeUJBO1FBQXpCRyx5QkFBeUJBLEdBQXpCQSxnQkFBeUJBO1FBQ3BEQSxFQUFFQSxDQUFDQSxDQUFDQSw2QkFBZ0JBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZEQSxNQUFNQSxJQUFJQSwwQkFBYUEsQ0FBSUEsT0FBT0Esa0NBQStCQSxDQUFDQSxDQUFDQTtRQUNyRUEsQ0FBQ0E7UUFFREEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsb0JBQVlBLEVBQUVBLENBQUNBO1FBQ2pDQSxJQUFJQSxXQUFXQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUNuREEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0E7SUFDeENBLENBQUNBO0lBRURILG1DQUFJQSxHQUFKQSxVQUFLQSxPQUFlQTtRQUNsQkksRUFBRUEsQ0FBQ0EsQ0FBQ0EsNkJBQWdCQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2REEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDekNBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ05BLE1BQU1BLElBQUlBLDBCQUFhQSxDQUFJQSxPQUFPQSx3REFBcURBLENBQUNBLENBQUNBO1FBQzNGQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVPSiw4Q0FBZUEsR0FBdkJBLFVBQXdCQSxFQUFnQkE7UUFDdENLLElBQUlBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBO1FBQ3ZCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUN6Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbkNBLENBQUNBO0lBQ0hBLENBQUNBO0lBRU9MLDZDQUFjQSxHQUF0QkEsVUFBdUJBLElBQVNBO1FBQzlCTSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUMzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsNkJBQWdCQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2REEsSUFBSUEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsY0FBUUEsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcEVBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUN6Q0EsQ0FBQ0E7UUFDSEEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFDSE4sMkJBQUNBO0FBQURBLENBQUNBLEFBbkRELElBbURDO0FBbkRZLDRCQUFvQix1QkFtRGhDLENBQUE7QUFFRDs7O0dBR0c7QUFDSDtJQUNFTyxrQkFBbUJBLE9BQTBCQSxFQUFTQSxTQUFrQkE7UUFBckRDLFlBQU9BLEdBQVBBLE9BQU9BLENBQW1CQTtRQUFTQSxjQUFTQSxHQUFUQSxTQUFTQSxDQUFTQTtJQUFHQSxDQUFDQTtJQUM5RUQsZUFBQ0E7QUFBREEsQ0FBQ0EsQUFGRCxJQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTWVzc2FnZUJ1cyxcbiAgTWVzc2FnZUJ1c1NvdXJjZSxcbiAgTWVzc2FnZUJ1c1Npbmtcbn0gZnJvbSBcImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnZV9idXNcIjtcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyLCBPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9kaVwiO1xuaW1wb3J0IHtOZ1pvbmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3pvbmUvbmdfem9uZSc7XG5cbi8qKlxuICogQSBUeXBlU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHtAbGluayBNZXNzYWdlQnVzfSBmb3IgY29tbXVuaWNhdGluZyB2aWEgSmF2YVNjcmlwdCdzXG4gKiBwb3N0TWVzc2FnZSBBUEkuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb3N0TWVzc2FnZUJ1cyBpbXBsZW1lbnRzIE1lc3NhZ2VCdXMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2luazogUG9zdE1lc3NhZ2VCdXNTaW5rLCBwdWJsaWMgc291cmNlOiBQb3N0TWVzc2FnZUJ1c1NvdXJjZSkge31cblxuICBhdHRhY2hUb1pvbmUoem9uZTogTmdab25lKTogdm9pZCB7XG4gICAgdGhpcy5zb3VyY2UuYXR0YWNoVG9ab25lKHpvbmUpO1xuICAgIHRoaXMuc2luay5hdHRhY2hUb1pvbmUoem9uZSk7XG4gIH1cblxuICBpbml0Q2hhbm5lbChjaGFubmVsOiBzdHJpbmcsIHJ1bkluWm9uZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLnNvdXJjZS5pbml0Q2hhbm5lbChjaGFubmVsLCBydW5JblpvbmUpO1xuICAgIHRoaXMuc2luay5pbml0Q2hhbm5lbChjaGFubmVsLCBydW5JblpvbmUpO1xuICB9XG5cbiAgZnJvbShjaGFubmVsOiBzdHJpbmcpOiBFdmVudEVtaXR0ZXI8YW55PiB7IHJldHVybiB0aGlzLnNvdXJjZS5mcm9tKGNoYW5uZWwpOyB9XG5cbiAgdG8oY2hhbm5lbDogc3RyaW5nKTogRXZlbnRFbWl0dGVyPGFueT4geyByZXR1cm4gdGhpcy5zaW5rLnRvKGNoYW5uZWwpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3N0TWVzc2FnZUJ1c1NpbmsgaW1wbGVtZW50cyBNZXNzYWdlQnVzU2luayB7XG4gIHByaXZhdGUgX3pvbmU6IE5nWm9uZTtcbiAgcHJpdmF0ZSBfY2hhbm5lbHM6IHtba2V5OiBzdHJpbmddOiBfQ2hhbm5lbH0gPSBTdHJpbmdNYXBXcmFwcGVyLmNyZWF0ZSgpO1xuICBwcml2YXRlIF9tZXNzYWdlQnVmZmVyOiBBcnJheTxPYmplY3Q+ID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9zdE1lc3NhZ2VUYXJnZXQ6IFBvc3RNZXNzYWdlVGFyZ2V0KSB7fVxuXG4gIGF0dGFjaFRvWm9uZSh6b25lOiBOZ1pvbmUpOiB2b2lkIHtcbiAgICB0aGlzLl96b25lID0gem9uZTtcbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLl96b25lLm9uRXZlbnREb25lLCAoXykgPT4geyB0aGlzLl9oYW5kbGVPbkV2ZW50RG9uZSgpOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRDaGFubmVsKGNoYW5uZWw6IHN0cmluZywgcnVuSW5ab25lOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX2NoYW5uZWxzLCBjaGFubmVsKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYCR7Y2hhbm5lbH0gaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZGApO1xuICAgIH1cblxuICAgIHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHZhciBjaGFubmVsSW5mbyA9IG5ldyBfQ2hhbm5lbChlbWl0dGVyLCBydW5JblpvbmUpO1xuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdID0gY2hhbm5lbEluZm87XG4gICAgZW1pdHRlci5zdWJzY3JpYmUoKGRhdGE6IE9iamVjdCkgPT4ge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB7Y2hhbm5lbDogY2hhbm5lbCwgbWVzc2FnZTogZGF0YX07XG4gICAgICBpZiAocnVuSW5ab25lKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VCdWZmZXIucHVzaChtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NlbmRNZXNzYWdlcyhbbWVzc2FnZV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG8oY2hhbm5lbDogc3RyaW5nKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIGlmIChTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX2NoYW5uZWxzLCBjaGFubmVsKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdLmVtaXR0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGAke2NoYW5uZWx9IGlzIG5vdCBzZXQgdXAuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgaW5pdENoYW5uZWw/YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlT25FdmVudERvbmUoKSB7XG4gICAgaWYgKHRoaXMuX21lc3NhZ2VCdWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2VzKHRoaXMuX21lc3NhZ2VCdWZmZXIpO1xuICAgICAgdGhpcy5fbWVzc2FnZUJ1ZmZlciA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlbmRNZXNzYWdlcyhtZXNzYWdlczogQXJyYXk8T2JqZWN0PikgeyB0aGlzLl9wb3N0TWVzc2FnZVRhcmdldC5wb3N0TWVzc2FnZShtZXNzYWdlcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvc3RNZXNzYWdlQnVzU291cmNlIGltcGxlbWVudHMgTWVzc2FnZUJ1c1NvdXJjZSB7XG4gIHByaXZhdGUgX3pvbmU6IE5nWm9uZTtcbiAgcHJpdmF0ZSBfY2hhbm5lbHM6IHtba2V5OiBzdHJpbmddOiBfQ2hhbm5lbH0gPSBTdHJpbmdNYXBXcmFwcGVyLmNyZWF0ZSgpO1xuXG4gIGNvbnN0cnVjdG9yKGV2ZW50VGFyZ2V0PzogRXZlbnRUYXJnZXQpIHtcbiAgICBpZiAoZXZlbnRUYXJnZXQpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldjogTWVzc2FnZUV2ZW50KSA9PiB0aGlzLl9oYW5kbGVNZXNzYWdlcyhldikpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBubyBldmVudFRhcmdldCBpcyBnaXZlbiB3ZSBhc3N1bWUgd2UncmUgaW4gYSBXZWJXb3JrZXIgYW5kIGxpc3RlbiBvbiB0aGUgZ2xvYmFsIHNjb3BlXG4gICAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXY6IE1lc3NhZ2VFdmVudCkgPT4gdGhpcy5faGFuZGxlTWVzc2FnZXMoZXYpKTtcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUb1pvbmUoem9uZTogTmdab25lKSB7IHRoaXMuX3pvbmUgPSB6b25lOyB9XG5cbiAgaW5pdENoYW5uZWwoY2hhbm5lbDogc3RyaW5nLCBydW5JblpvbmU6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnModGhpcy5fY2hhbm5lbHMsIGNoYW5uZWwpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgJHtjaGFubmVsfSBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkYCk7XG4gICAgfVxuXG4gICAgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdmFyIGNoYW5uZWxJbmZvID0gbmV3IF9DaGFubmVsKGVtaXR0ZXIsIHJ1bkluWm9uZSk7XG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbF0gPSBjaGFubmVsSW5mbztcbiAgfVxuXG4gIGZyb20oY2hhbm5lbDogc3RyaW5nKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIGlmIChTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX2NoYW5uZWxzLCBjaGFubmVsKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdLmVtaXR0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGAke2NoYW5uZWx9IGlzIG5vdCBzZXQgdXAuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgaW5pdENoYW5uZWw/YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlTWVzc2FnZXMoZXY6IE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuICAgIHZhciBtZXNzYWdlcyA9IGV2LmRhdGE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5faGFuZGxlTWVzc2FnZShtZXNzYWdlc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlTWVzc2FnZShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICB2YXIgY2hhbm5lbCA9IGRhdGEuY2hhbm5lbDtcbiAgICBpZiAoU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyh0aGlzLl9jaGFubmVscywgY2hhbm5lbCkpIHtcbiAgICAgIHZhciBjaGFubmVsSW5mbyA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoYW5uZWxJbmZvLnJ1bkluWm9uZSkge1xuICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7IGNoYW5uZWxJbmZvLmVtaXR0ZXIuZW1pdChkYXRhLm1lc3NhZ2UpOyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5uZWxJbmZvLmVtaXR0ZXIuZW1pdChkYXRhLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciBjbGFzcyB0aGF0IHdyYXBzIGEgY2hhbm5lbCdzIHtAbGluayBFdmVudEVtaXR0ZXJ9IGFuZFxuICoga2VlcHMgdHJhY2sgb2YgaWYgaXQgc2hvdWxkIHJ1biBpbiB0aGUgem9uZS5cbiAqL1xuY2xhc3MgX0NoYW5uZWwge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sIHB1YmxpYyBydW5JblpvbmU6IGJvb2xlYW4pIHt9XG59XG5cbi8vIFRPRE8oanRlcGxpdHo2MDIpIFJlcGxhY2UgdGhpcyB3aXRoIHRoZSBkZWZpbml0aW9uIGluIGxpYi53ZWJ3b3JrZXIuZC50cygjMzQ5MilcbmV4cG9ydCBpbnRlcmZhY2UgUG9zdE1lc3NhZ2VUYXJnZXQgeyBwb3N0TWVzc2FnZTogKG1lc3NhZ2U6IGFueSwgdHJhbnNmZXI/OltBcnJheUJ1ZmZlcl0pID0+IHZvaWQ7IH1cbiJdfQ==
