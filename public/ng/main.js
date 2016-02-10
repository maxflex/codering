System.register(['angular2/platform/browser', './components/app.component'], function(exports_1) {
    "use strict";
    var browser_1, app_component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent);
        }
    }
});
// import {bootstrap} from 'angular2/platform/browser';
// import {Component, enableProdMode, Injectable, OnInit} from 'angular2/core';
// import {Http, HTTP_PROVIDERS, URLSearchParams} from 'angular2/http';
// import 'rxjs/add/operator/map';
//
// const API_KEY = '6c759d320ea37acf99ec363f678f73c0:14:74192489';
//
// @Injectable()
// class ArticleApi {
//   constructor(private http: Http) {}
//
//   seachArticle(query) {
//     const endpoint = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
//     const searchParams = new URLSearchParams()
//     searchParams.set('api-key', API_KEY);
//     searchParams.set('q', query);
//
//     response this.http
//       .get(endpoint, {search: searchParams})
//       .map(res => res.json())
//       .map(res => res.response.docs);
//   }
//
//   postExample(someData) {
//     return this.http
//       .post('https://yourEndpoint', JSON.stringify(someData))
//       .map(res => res.json());
//   }
//
//   testy() {
//     return this.http
//       .get('api/v1/language', {id: 1})
//       .map(res => res.json())
//   }
// }
//
// @Component({
//   selector: 'app',
//   template: `
//             <ul>
//                 <li *ngFor="#article of articles | async"> {{article.headline.main}} </li>
//              </ul>`,
//   providers: [HTTP_PROVIDERS, ArticleApi],
// })
// class App implements OnInit {
//   constructor(private articleApi: ArticleApi) { }
//
//   ngOnInit() {
//     this.articles = this.articleApi.seachArticle('obama');
//     setTimeout(function() {
//       console.log(this.articles)
//     }.bind(this), 5000)
//   }
// }
//
// enableProdMode();
// bootstrap(App)
//   .catch(err => console.error(err));
//# sourceMappingURL=main.js.map