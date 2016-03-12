'use strict';function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var worker_render_common_1 = require('angular2/src/platform/worker_render_common');
exports.WORKER_SCRIPT = worker_render_common_1.WORKER_SCRIPT;
exports.WORKER_RENDER_PLATFORM = worker_render_common_1.WORKER_RENDER_PLATFORM;
exports.initializeGenericWorkerRenderer = worker_render_common_1.initializeGenericWorkerRenderer;
exports.WORKER_RENDER_APPLICATION_COMMON = worker_render_common_1.WORKER_RENDER_APPLICATION_COMMON;
var worker_render_1 = require('angular2/src/platform/worker_render');
exports.WORKER_RENDER_APPLICATION = worker_render_1.WORKER_RENDER_APPLICATION;
exports.WebWorkerInstance = worker_render_1.WebWorkerInstance;
var client_message_broker_1 = require('../src/web_workers/shared/client_message_broker');
exports.ClientMessageBroker = client_message_broker_1.ClientMessageBroker;
exports.ClientMessageBrokerFactory = client_message_broker_1.ClientMessageBrokerFactory;
exports.FnArg = client_message_broker_1.FnArg;
exports.UiArguments = client_message_broker_1.UiArguments;
var service_message_broker_1 = require('../src/web_workers/shared/service_message_broker');
exports.ReceivedMessage = service_message_broker_1.ReceivedMessage;
exports.ServiceMessageBroker = service_message_broker_1.ServiceMessageBroker;
exports.ServiceMessageBrokerFactory = service_message_broker_1.ServiceMessageBrokerFactory;
var serializer_1 = require('../src/web_workers/shared/serializer');
exports.PRIMITIVE = serializer_1.PRIMITIVE;
__export(require('../src/web_workers/shared/message_bus'));
var worker_render_2 = require('angular2/src/platform/worker_render');
/**
 * @deprecated Use WORKER_RENDER_APPLICATION
 */
exports.WORKER_RENDER_APP = worker_render_2.WORKER_RENDER_APPLICATION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBS08sNENBQTRDLENBQUM7QUFKbEQsNkRBQWE7QUFDYiwrRUFBc0I7QUFDdEIsaUdBQStCO0FBQy9CLG1HQUNrRDtBQUNwRCw4QkFBMkQscUNBQXFDLENBQUM7QUFBekYsOEVBQXlCO0FBQUUsOERBQThEO0FBQ2pHLHNDQUtPLGlEQUFpRCxDQUFDO0FBSnZELDBFQUFtQjtBQUNuQix3RkFBMEI7QUFDMUIsOENBQUs7QUFDTCwwREFDdUQ7QUFDekQsdUNBSU8sa0RBQWtELENBQUM7QUFIeEQsbUVBQWU7QUFDZiw2RUFBb0I7QUFDcEIsMkZBQ3dEO0FBQzFELDJCQUF3QixzQ0FBc0MsQ0FBQztBQUF2RCwyQ0FBdUQ7QUFDL0QsaUJBQWMsdUNBQXVDLENBQUMsRUFBQTtBQUN0RCw4QkFBd0MscUNBQXFDLENBQUMsQ0FBQTtBQUU5RTs7R0FFRztBQUNVLHlCQUFpQixHQUFHLHlDQUF5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtcbiAgV09SS0VSX1NDUklQVCxcbiAgV09SS0VSX1JFTkRFUl9QTEFURk9STSxcbiAgaW5pdGlhbGl6ZUdlbmVyaWNXb3JrZXJSZW5kZXJlcixcbiAgV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTl9DT01NT05cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXJfY29tbW9uJztcbmV4cG9ydCB7V09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTiwgV2ViV29ya2VySW5zdGFuY2V9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS93b3JrZXJfcmVuZGVyJztcbmV4cG9ydCB7XG4gIENsaWVudE1lc3NhZ2VCcm9rZXIsXG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBGbkFyZyxcbiAgVWlBcmd1bWVudHNcbn0gZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXInO1xuZXhwb3J0IHtcbiAgUmVjZWl2ZWRNZXNzYWdlLFxuICBTZXJ2aWNlTWVzc2FnZUJyb2tlcixcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5XG59IGZyb20gJy4uL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VydmljZV9tZXNzYWdlX2Jyb2tlcic7XG5leHBvcnQge1BSSU1JVElWRX0gZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyJztcbmV4cG9ydCAqIGZyb20gJy4uL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnZV9idXMnO1xuaW1wb3J0IHtXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcic7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIFdPUktFUl9SRU5ERVJfQVBQTElDQVRJT05cbiAqL1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfQVBQID0gV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTjtcbiJdfQ==
