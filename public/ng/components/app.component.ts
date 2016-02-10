import {Component, OnInit} from 'angular2/core'
import {Http, HTTP_PROVIDERS, URLSearchParams} from 'angular2/http'
import {Language} from './language.component'

import 'rxjs/add/operator/map';

@Component({
  selector: 'ng-app',
  viewProviders: [HTTP_PROVIDERS],
  directives: [Language],
  inputs: ['lng']
  template: `
    <language></language>
    <h1>LNG={{ lng }}</h1>
  `
})

export class AppComponent {
  lng: string
  constructor(private http: Http) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', '1');

    this.http.get('api/v1/language', {search: params})
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        // err => this.logError(err.text()),
        () => console.log('Random Quote Complete')
      );
  }

  ngOnInit() {
    // this.testy()
    console.log('on init')
  }
}
