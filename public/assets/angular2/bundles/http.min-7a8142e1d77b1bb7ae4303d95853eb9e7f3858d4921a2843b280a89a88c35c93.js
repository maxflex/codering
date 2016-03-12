"format register";System.register("angular2/src/http/interfaces",[],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=function(){function e(){}return e}();t.ConnectionBackend=a;var o=function(){function e(){}return e}();return t.Connection=o,n.define=s,r.exports}),System.register("angular2/src/http/headers",["angular2/src/facade/lang","angular2/src/facade/exceptions","angular2/src/facade/collection"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=e("angular2/src/facade/lang"),o=e("angular2/src/facade/exceptions"),i=e("angular2/src/facade/collection"),c=function(){function e(t){var r=this;return t instanceof e?void(this._headersMap=t._headersMap):(this._headersMap=new i.Map,void(a.isBlank(t)||i.StringMapWrapper.forEach(t,function(e,t){r._headersMap.set(t,i.isListLikeIterable(e)?e:[e])})))}return e.fromResponseHeaderString=function(t){return t.trim().split("\n").map(function(e){return e.split(":")}).map(function(e){var t=e[0],r=e.slice(1);return[t.trim(),r.join(":").trim()]}).reduce(function(e,t){var r=t[0],n=t[1];return!e.set(r,n)&&e},new e)},e.prototype.append=function(e,t){var r=this._headersMap.get(e),n=i.isListLikeIterable(r)?r:[];n.push(t),this._headersMap.set(e,n)},e.prototype["delete"]=function(e){this._headersMap["delete"](e)},e.prototype.forEach=function(e){this._headersMap.forEach(e)},e.prototype.get=function(e){return i.ListWrapper.first(this._headersMap.get(e))},e.prototype.has=function(e){return this._headersMap.has(e)},e.prototype.keys=function(){return i.MapWrapper.keys(this._headersMap)},e.prototype.set=function(e,t){var r=[];if(i.isListLikeIterable(t)){var n=t.join(",");r.push(n)}else r.push(t);this._headersMap.set(e,r)},e.prototype.values=function(){return i.MapWrapper.values(this._headersMap)},e.prototype.toJSON=function(){return a.Json.stringify(this.values())},e.prototype.getAll=function(e){var t=this._headersMap.get(e);return i.isListLikeIterable(t)?t:[]},e.prototype.entries=function(){throw new o.BaseException('"entries" method is not implemented on Headers class')},e}();return t.Headers=c,n.define=s,r.exports}),System.register("angular2/src/http/enums",[],!0,function(e,t,r){var n=System.global,s=n.define;return n.define=void 0,function(e){e[e.Get=0]="Get",e[e.Post=1]="Post",e[e.Put=2]="Put",e[e.Delete=3]="Delete",e[e.Options=4]="Options",e[e.Head=5]="Head",e[e.Patch=6]="Patch"}(t.RequestMethod||(t.RequestMethod={})),t.RequestMethod,!function(e){e[e.Unsent=0]="Unsent",e[e.Open=1]="Open",e[e.HeadersReceived=2]="HeadersReceived",e[e.Loading=3]="Loading",e[e.Done=4]="Done",e[e.Cancelled=5]="Cancelled"}(t.ReadyState||(t.ReadyState={})),t.ReadyState,!function(e){e[e.Basic=0]="Basic",e[e.Cors=1]="Cors",e[e.Default=2]="Default",e[e.Error=3]="Error",e[e.Opaque=4]="Opaque"}(t.ResponseType||(t.ResponseType={})),t.ResponseType,n.define=s,r.exports}),System.register("angular2/src/http/url_search_params",["angular2/src/facade/lang","angular2/src/facade/collection"],!0,function(e,t,r){function n(e){void 0===e&&(e="");var t=new i.Map;if(e.length>0){var r=e.split("&");r.forEach(function(e){var r=e.split("="),n=r[0],s=r[1],a=o.isPresent(t.get(n))?t.get(n):[];a.push(s),t.set(n,a)})}return t}var s=System.global,a=s.define;s.define=void 0;var o=e("angular2/src/facade/lang"),i=e("angular2/src/facade/collection"),c=function(){function e(e){void 0===e&&(e=""),this.rawParams=e,this.paramsMap=n(e)}return e.prototype.clone=function(){var t=new e;return t.appendAll(this),t},e.prototype.has=function(e){return this.paramsMap.has(e)},e.prototype.get=function(e){var t=this.paramsMap.get(e);return i.isListLikeIterable(t)?i.ListWrapper.first(t):null},e.prototype.getAll=function(e){var t=this.paramsMap.get(e);return o.isPresent(t)?t:[]},e.prototype.set=function(e,t){var r=this.paramsMap.get(e),n=o.isPresent(r)?r:[];i.ListWrapper.clear(n),n.push(t),this.paramsMap.set(e,n)},e.prototype.setAll=function(e){var t=this;e.paramsMap.forEach(function(e,r){var n=t.paramsMap.get(r),s=o.isPresent(n)?n:[];i.ListWrapper.clear(s),s.push(e[0]),t.paramsMap.set(r,s)})},e.prototype.append=function(e,t){var r=this.paramsMap.get(e),n=o.isPresent(r)?r:[];n.push(t),this.paramsMap.set(e,n)},e.prototype.appendAll=function(e){var t=this;e.paramsMap.forEach(function(e,r){for(var n=t.paramsMap.get(r),s=o.isPresent(n)?n:[],a=0;a<e.length;++a)s.push(e[a]);t.paramsMap.set(r,s)})},e.prototype.replaceAll=function(e){var t=this;e.paramsMap.forEach(function(e,r){var n=t.paramsMap.get(r),s=o.isPresent(n)?n:[];i.ListWrapper.clear(s);for(var a=0;a<e.length;++a)s.push(e[a]);t.paramsMap.set(r,s)})},e.prototype.toString=function(){var e=[];return this.paramsMap.forEach(function(t,r){t.forEach(function(t){return e.push(r+"="+t)})}),e.join("&")},e.prototype["delete"]=function(e){this.paramsMap["delete"](e)},e}();return t.URLSearchParams=c,s.define=a,r.exports}),System.register("angular2/src/http/static_response",["angular2/src/facade/lang","angular2/src/facade/exceptions","angular2/src/http/http_utils"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=e("angular2/src/facade/lang"),o=e("angular2/src/facade/exceptions"),i=e("angular2/src/http/http_utils"),c=function(){function e(e){this._body=e.body,this.status=e.status,this.statusText=e.statusText,this.headers=e.headers,this.type=e.type,this.url=e.url}return e.prototype.blob=function(){throw new o.BaseException('"blob()" method not implemented on Response superclass')},e.prototype.json=function(){var e;return i.isJsObject(this._body)?e=this._body:a.isString(this._body)&&(e=a.Json.parse(this._body)),e},e.prototype.text=function(){return this._body.toString()},e.prototype.arrayBuffer=function(){throw new o.BaseException('"arrayBuffer()" method not implemented on Response superclass')},e}();return t.Response=c,n.define=s,r.exports}),System.register("angular2/src/http/base_response_options",["angular2/core","angular2/src/facade/lang","angular2/src/http/headers","angular2/src/http/enums"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},o=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},i=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},c=e("angular2/core"),u=e("angular2/src/facade/lang"),p=e("angular2/src/http/headers"),l=e("angular2/src/http/enums"),d=function(){function e(e){var t=void 0===e?{}:e,r=t.body,n=t.status,s=t.headers,a=t.statusText,o=t.type,i=t.url;this.body=u.isPresent(r)?r:null,this.status=u.isPresent(n)?n:null,this.headers=u.isPresent(s)?s:null,this.statusText=u.isPresent(a)?a:null,this.type=u.isPresent(o)?o:null,this.url=u.isPresent(i)?i:null}return e.prototype.merge=function(t){return new e({body:u.isPresent(t)&&u.isPresent(t.body)?t.body:this.body,status:u.isPresent(t)&&u.isPresent(t.status)?t.status:this.status,headers:u.isPresent(t)&&u.isPresent(t.headers)?t.headers:this.headers,statusText:u.isPresent(t)&&u.isPresent(t.statusText)?t.statusText:this.statusText,type:u.isPresent(t)&&u.isPresent(t.type)?t.type:this.type,url:u.isPresent(t)&&u.isPresent(t.url)?t.url:this.url})},e}();t.ResponseOptions=d;var h=function(e){function t(){e.call(this,{status:200,statusText:"Ok",type:l.ResponseType.Default,headers:new p.Headers})}return a(t,e),t=o([c.Injectable(),i("design:paramtypes",[])],t)}(d);return t.BaseResponseOptions=h,n.define=s,r.exports}),System.register("angular2/src/http/backends/browser_xhr",["angular2/core"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},o=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},i=e("angular2/core"),c=function(){function e(){}return e.prototype.build=function(){return new XMLHttpRequest},e=a([i.Injectable(),o("design:paramtypes",[])],e)}();return t.BrowserXhr=c,n.define=s,r.exports}),System.register("angular2/src/http/backends/browser_jsonp",["angular2/core","angular2/src/facade/lang"],!0,function(e,t,r){function n(){return null===l&&(l=u.global[t.JSONP_HOME]={}),l}var s=System.global,a=s.define;s.define=void 0;var o=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},i=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},c=e("angular2/core"),u=e("angular2/src/facade/lang"),p=0;t.JSONP_HOME="__ng_jsonp__";var l=null,d=function(){function e(){}return e.prototype.build=function(e){var t=document.createElement("script");return t.src=e,t},e.prototype.nextRequestID=function(){return"__req"+p++},e.prototype.requestCallback=function(e){return t.JSONP_HOME+"."+e+".finished"},e.prototype.exposeConnection=function(e,t){var r=n();r[e]=t},e.prototype.removeConnection=function(e){var t=n();t[e]=null},e.prototype.send=function(e){document.body.appendChild(e)},e.prototype.cleanup=function(e){e.parentNode&&e.parentNode.removeChild(e)},e=o([c.Injectable(),i("design:paramtypes",[])],e)}();return t.BrowserJsonp=d,s.define=a,r.exports}),System.register("angular2/src/http/http_utils",["angular2/src/facade/lang","angular2/src/http/enums","angular2/src/facade/exceptions","angular2/src/facade/lang"],!0,function(e,t,r){function n(e){if(i.isString(e)){var t=e;if(e=e.replace(/(\w)(\w*)/g,function(e,t,r){return t.toUpperCase()+r.toLowerCase()}),e=c.RequestMethod[e],"number"!=typeof e)throw u.makeTypeError('Invalid request method. The method "'+t+'" is not supported.')}return e}function s(e){return"responseURL"in e?e.responseURL:/^X-Request-URL:/m.test(e.getAllResponseHeaders())?e.getResponseHeader("X-Request-URL"):void 0}var a=System.global,o=a.define;a.define=void 0;var i=e("angular2/src/facade/lang"),c=e("angular2/src/http/enums"),u=e("angular2/src/facade/exceptions");t.normalizeMethodName=n,t.isSuccess=function(e){return e>=200&&300>e},t.getResponseURL=s;var p=e("angular2/src/facade/lang");return t.isJsObject=p.isJsObject,a.define=o,r.exports}),System.register("angular2/src/http/base_request_options",["angular2/src/facade/lang","angular2/src/http/headers","angular2/src/http/enums","angular2/core","angular2/src/http/url_search_params","angular2/src/http/http_utils"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},o=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},i=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},c=e("angular2/src/facade/lang"),u=e("angular2/src/http/headers"),p=e("angular2/src/http/enums"),l=e("angular2/core"),d=e("angular2/src/http/url_search_params"),h=e("angular2/src/http/http_utils"),f=function(){function e(e){var t=void 0===e?{}:e,r=t.method,n=t.headers,s=t.body,a=t.url,o=t.search;this.method=c.isPresent(r)?h.normalizeMethodName(r):null,this.headers=c.isPresent(n)?n:null,this.body=c.isPresent(s)?s:null,this.url=c.isPresent(a)?a:null,this.search=c.isPresent(o)?c.isString(o)?new d.URLSearchParams(o):o:null}return e.prototype.merge=function(t){return new e({method:c.isPresent(t)&&c.isPresent(t.method)?t.method:this.method,headers:c.isPresent(t)&&c.isPresent(t.headers)?t.headers:this.headers,body:c.isPresent(t)&&c.isPresent(t.body)?t.body:this.body,url:c.isPresent(t)&&c.isPresent(t.url)?t.url:this.url,search:c.isPresent(t)&&c.isPresent(t.search)?c.isString(t.search)?new d.URLSearchParams(t.search):t.search.clone():this.search})},e}();t.RequestOptions=f;var g=function(e){function t(){e.call(this,{method:p.RequestMethod.Get,headers:new u.Headers})}return a(t,e),t=o([l.Injectable(),i("design:paramtypes",[])],t)}(f);return t.BaseRequestOptions=g,n.define=s,r.exports}),System.register("angular2/src/http/backends/xhr_backend",["angular2/src/http/enums","angular2/src/http/static_response","angular2/src/http/headers","angular2/src/http/base_response_options","angular2/core","angular2/src/http/backends/browser_xhr","angular2/src/facade/lang","rxjs/Observable","angular2/src/http/http_utils"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},o=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},i=e("angular2/src/http/enums"),c=e("angular2/src/http/static_response"),u=e("angular2/src/http/headers"),p=e("angular2/src/http/base_response_options"),l=e("angular2/core"),d=e("angular2/src/http/backends/browser_xhr"),h=e("angular2/src/facade/lang"),f=e("rxjs/Observable"),g=e("angular2/src/http/http_utils"),y=function(){function e(e,t,r){var n=this;this.request=e,this.response=new f.Observable(function(s){var a=t.build();a.open(i.RequestMethod[e.method].toUpperCase(),e.url);var o=function(){var e=h.isPresent(a.response)?a.response:a.responseText,t=u.Headers.fromResponseHeaderString(a.getAllResponseHeaders()),n=g.getResponseURL(a),o=1223===a.status?204:a.status;0===o&&(o=e?200:0);var i=new p.ResponseOptions({body:e,status:o,headers:t,url:n});h.isPresent(r)&&(i=r.merge(i));var l=new c.Response(i);return g.isSuccess(o)?(s.next(l),void s.complete()):void s.error(l)},l=function(e){var t=new p.ResponseOptions({body:e,type:i.ResponseType.Error});h.isPresent(r)&&(t=r.merge(t)),s.error(new c.Response(t))};return h.isPresent(e.headers)&&e.headers.forEach(function(e,t){return a.setRequestHeader(t,e.join(","))}),a.addEventListener("load",o),a.addEventListener("error",l),a.send(n.request.text()),function(){a.removeEventListener("load",o),a.removeEventListener("error",l),a.abort()}})}return e}();t.XHRConnection=y;var b=function(){function e(e,t){this._browserXHR=e,this._baseResponseOptions=t}return e.prototype.createConnection=function(e){return new y(e,this._browserXHR,this._baseResponseOptions)},e=a([l.Injectable(),o("design:paramtypes",[d.BrowserXhr,p.ResponseOptions])],e)}();return t.XHRBackend=b,n.define=s,r.exports}),System.register("angular2/src/http/backends/jsonp_backend",["angular2/src/http/interfaces","angular2/src/http/enums","angular2/src/http/static_response","angular2/src/http/base_response_options","angular2/core","angular2/src/http/backends/browser_jsonp","angular2/src/facade/exceptions","angular2/src/facade/lang","rxjs/Observable"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},o=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},i=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},c=e("angular2/src/http/interfaces"),u=e("angular2/src/http/enums"),p=e("angular2/src/http/static_response"),l=e("angular2/src/http/base_response_options"),d=e("angular2/core"),h=e("angular2/src/http/backends/browser_jsonp"),f=e("angular2/src/facade/exceptions"),g=e("angular2/src/facade/lang"),y=e("rxjs/Observable"),b="JSONP injected script did not invoke callback.",_="JSONP requests must use GET request method.",m=function(){function e(){}return e}();t.JSONPConnection=m;var R=function(e){function t(t,r,n){var s=this;if(e.call(this),this._dom=r,this.baseResponseOptions=n,this._finished=!1,t.method!==u.RequestMethod.Get)throw f.makeTypeError(_);this.request=t,this.response=new y.Observable(function(e){s.readyState=u.ReadyState.Loading;var a=s._id=r.nextRequestID();r.exposeConnection(a,s);var o=r.requestCallback(s._id),i=t.url;i.indexOf("=JSONP_CALLBACK&")>-1?i=g.StringWrapper.replace(i,"=JSONP_CALLBACK&","="+o+"&"):i.lastIndexOf("=JSONP_CALLBACK")===i.length-"=JSONP_CALLBACK".length&&(i=i.substring(0,i.length-"=JSONP_CALLBACK".length)+("="+o));var c=s._script=r.build(i),d=function(t){if(s.readyState!==u.ReadyState.Cancelled){if(s.readyState=u.ReadyState.Done,r.cleanup(c),!s._finished){var a=new l.ResponseOptions({body:b,type:u.ResponseType.Error,url:i});return g.isPresent(n)&&(a=n.merge(a)),void e.error(new p.Response(a))}var o=new l.ResponseOptions({body:s._responseData,url:i});g.isPresent(s.baseResponseOptions)&&(o=s.baseResponseOptions.merge(o)),e.next(new p.Response(o)),e.complete()}},h=function(t){if(s.readyState!==u.ReadyState.Cancelled){s.readyState=u.ReadyState.Done,r.cleanup(c);var a=new l.ResponseOptions({body:t.message,type:u.ResponseType.Error});g.isPresent(n)&&(a=n.merge(a)),e.error(new p.Response(a))}};return c.addEventListener("load",d),c.addEventListener("error",h),r.send(c),function(){s.readyState=u.ReadyState.Cancelled,c.removeEventListener("load",d),c.removeEventListener("error",h),g.isPresent(c)&&s._dom.cleanup(c)}})}return a(t,e),t.prototype.finished=function(e){this._finished=!0,this._dom.removeConnection(this._id),this.readyState!==u.ReadyState.Cancelled&&(this._responseData=e)},t}(m);t.JSONPConnection_=R;var v=function(e){function t(){e.apply(this,arguments)}return a(t,e),t}(c.ConnectionBackend);t.JSONPBackend=v;var O=function(e){function t(t,r){e.call(this),this._browserJSONP=t,this._baseResponseOptions=r}return a(t,e),t.prototype.createConnection=function(e){return new R(e,this._browserJSONP,this._baseResponseOptions)},t=o([d.Injectable(),i("design:paramtypes",[h.BrowserJsonp,l.ResponseOptions])],t)}(v);return t.JSONPBackend_=O,n.define=s,r.exports}),System.register("angular2/src/http/static_request",["angular2/src/http/headers","angular2/src/http/http_utils","angular2/src/facade/lang"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=e("angular2/src/http/headers"),o=e("angular2/src/http/http_utils"),i=e("angular2/src/facade/lang"),c=function(){function e(e){var t=e.url;if(this.url=e.url,i.isPresent(e.search)){var r=e.search.toString();if(r.length>0){var n="?";i.StringWrapper.contains(this.url,"?")&&(n="&"==this.url[this.url.length-1]?"":"&"),this.url=t+n+r}}this._body=e.body,this.method=o.normalizeMethodName(e.method),this.headers=new a.Headers(e.headers)}return e.prototype.text=function(){return i.isPresent(this._body)?this._body.toString():""},e}();return t.Request=c,n.define=s,r.exports}),System.register("angular2/src/http/http",["angular2/src/facade/lang","angular2/src/facade/exceptions","angular2/core","angular2/src/http/interfaces","angular2/src/http/static_request","angular2/src/http/base_request_options","angular2/src/http/enums"],!0,function(e,t,r){function n(e,t){return e.createConnection(t).response}function s(e,t,r,n){var s=e;return p.isPresent(t)?s.merge(new g.RequestOptions({method:t.method||r,url:t.url||n,search:t.search,headers:t.headers,body:t.body})):p.isPresent(r)?s.merge(new g.RequestOptions({method:r,url:n})):s.merge(new g.RequestOptions({url:n}))}var a=System.global,o=a.define;a.define=void 0;var i=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},c=this&&this.__decorate||function(e,t,r,n){var s,a=arguments.length,o=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(3>a?s(o):a>3?s(t,r,o):s(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o},u=this&&this.__metadata||function(e,t){return"object"==typeof Reflect&&"function"==typeof Reflect.metadata?Reflect.metadata(e,t):void 0},p=e("angular2/src/facade/lang"),l=e("angular2/src/facade/exceptions"),d=e("angular2/core"),h=e("angular2/src/http/interfaces"),f=e("angular2/src/http/static_request"),g=e("angular2/src/http/base_request_options"),y=e("angular2/src/http/enums"),b=function(){function e(e,t){this._backend=e,this._defaultOptions=t}return e.prototype.request=function(e,t){var r;if(p.isString(e))r=n(this._backend,new f.Request(s(this._defaultOptions,t,y.RequestMethod.Get,e)));else{if(!(e instanceof f.Request))throw l.makeTypeError("First argument must be a url string or Request instance.");r=n(this._backend,e)}return r},e.prototype.get=function(e,t){return n(this._backend,new f.Request(s(this._defaultOptions,t,y.RequestMethod.Get,e)))},e.prototype.post=function(e,t,r){return n(this._backend,new f.Request(s(this._defaultOptions.merge(new g.RequestOptions({body:t})),r,y.RequestMethod.Post,e)))},e.prototype.put=function(e,t,r){return n(this._backend,new f.Request(s(this._defaultOptions.merge(new g.RequestOptions({body:t})),r,y.RequestMethod.Put,e)))},e.prototype["delete"]=function(e,t){return n(this._backend,new f.Request(s(this._defaultOptions,t,y.RequestMethod.Delete,e)))},e.prototype.patch=function(e,t,r){return n(this._backend,new f.Request(s(this._defaultOptions.merge(new g.RequestOptions({body:t})),r,y.RequestMethod.Patch,e)))},e.prototype.head=function(e,t){return n(this._backend,new f.Request(s(this._defaultOptions,t,y.RequestMethod.Head,e)))},e=c([d.Injectable(),u("design:paramtypes",[h.ConnectionBackend,g.RequestOptions])],e)}();t.Http=b;var _=function(e){function t(t,r){e.call(this,t,r)}return i(t,e),t.prototype.request=function(e,t){var r;if(p.isString(e)&&(e=new f.Request(s(this._defaultOptions,t,y.RequestMethod.Get,e))),!(e instanceof f.Request))throw l.makeTypeError("First argument must be a url string or Request instance.");return e.method!==y.RequestMethod.Get&&l.makeTypeError("JSONP requests must use GET request method."),r=n(this._backend,e)},t=c([d.Injectable(),u("design:paramtypes",[h.ConnectionBackend,g.RequestOptions])],t)}(b);return t.Jsonp=_,a.define=o,r.exports}),System.register("angular2/http",["angular2/core","angular2/src/http/http","angular2/src/http/backends/xhr_backend","angular2/src/http/backends/jsonp_backend","angular2/src/http/backends/browser_xhr","angular2/src/http/backends/browser_jsonp","angular2/src/http/base_request_options","angular2/src/http/base_response_options","angular2/src/http/static_request","angular2/src/http/static_response","angular2/src/http/interfaces","angular2/src/http/backends/browser_xhr","angular2/src/http/base_request_options","angular2/src/http/base_response_options","angular2/src/http/backends/xhr_backend","angular2/src/http/backends/jsonp_backend","angular2/src/http/http","angular2/src/http/headers","angular2/src/http/enums","angular2/src/http/url_search_params"],!0,function(e,t,r){var n=System.global,s=n.define;n.define=void 0;var a=e("angular2/core"),o=e("angular2/src/http/http"),i=e("angular2/src/http/backends/xhr_backend"),c=e("angular2/src/http/backends/jsonp_backend"),u=e("angular2/src/http/backends/browser_xhr"),p=e("angular2/src/http/backends/browser_jsonp"),l=e("angular2/src/http/base_request_options"),d=e("angular2/src/http/base_response_options"),h=e("angular2/src/http/static_request");t.Request=h.Request;var f=e("angular2/src/http/static_response");t.Response=f.Response;var g=e("angular2/src/http/interfaces");t.Connection=g.Connection,t.ConnectionBackend=g.ConnectionBackend;var y=e("angular2/src/http/backends/browser_xhr");t.BrowserXhr=y.BrowserXhr;var b=e("angular2/src/http/base_request_options");t.BaseRequestOptions=b.BaseRequestOptions,t.RequestOptions=b.RequestOptions;var _=e("angular2/src/http/base_response_options");t.BaseResponseOptions=_.BaseResponseOptions,t.ResponseOptions=_.ResponseOptions;var m=e("angular2/src/http/backends/xhr_backend");t.XHRBackend=m.XHRBackend,t.XHRConnection=m.XHRConnection;var R=e("angular2/src/http/backends/jsonp_backend");t.JSONPBackend=R.JSONPBackend,t.JSONPConnection=R.JSONPConnection;var v=e("angular2/src/http/http");t.Http=v.Http,t.Jsonp=v.Jsonp;var O=e("angular2/src/http/headers");t.Headers=O.Headers;var P=e("angular2/src/http/enums");t.ResponseType=P.ResponseType,t.ReadyState=P.ReadyState,t.RequestMethod=P.RequestMethod;var S=e("angular2/src/http/url_search_params");return t.URLSearchParams=S.URLSearchParams,t.HTTP_PROVIDERS=[a.provide(o.Http,{useFactory:function(e,t){return new o.Http(e,t)},deps:[i.XHRBackend,l.RequestOptions]}),u.BrowserXhr,a.provide(l.RequestOptions,{useClass:l.BaseRequestOptions}),a.provide(d.ResponseOptions,{useClass:d.BaseResponseOptions}),i.XHRBackend],t.HTTP_BINDINGS=t.HTTP_PROVIDERS,t.JSONP_PROVIDERS=[a.provide(o.Jsonp,{useFactory:function(e,t){return new o.Jsonp(e,t)},deps:[c.JSONPBackend,l.RequestOptions]}),p.BrowserJsonp,a.provide(l.RequestOptions,{useClass:l.BaseRequestOptions}),a.provide(d.ResponseOptions,{useClass:d.BaseResponseOptions}),a.provide(c.JSONPBackend,{useClass:c.JSONPBackend_})],t.JSON_BINDINGS=t.JSONP_PROVIDERS,n.define=s,r.exports});
