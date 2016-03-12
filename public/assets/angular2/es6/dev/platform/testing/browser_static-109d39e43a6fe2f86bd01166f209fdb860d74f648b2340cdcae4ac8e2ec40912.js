import { APP_ID, DirectiveResolver, NgZone, Provider, ViewResolver, PLATFORM_COMMON_PROVIDERS, PLATFORM_INITIALIZER } from 'angular2/core';
import { BROWSER_APP_COMMON_PROVIDERS } from 'angular2/src/platform/browser_common';
import { BrowserDomAdapter } from 'angular2/src/platform/browser/browser_adapter';
import { AnimationBuilder } from 'angular2/src/animate/animation_builder';
import { MockAnimationBuilder } from 'angular2/src/mock/animation_builder_mock';
import { MockDirectiveResolver } from 'angular2/src/mock/directive_resolver_mock';
import { MockViewResolver } from 'angular2/src/mock/view_resolver_mock';
import { MockLocationStrategy } from 'angular2/src/mock/mock_location_strategy';
import { LocationStrategy } from 'angular2/src/router/location_strategy';
import { MockNgZone } from 'angular2/src/mock/ng_zone_mock';
import { XHRImpl } from "angular2/src/platform/browser/xhr_impl";
import { XHR } from 'angular2/compiler';
import { TestComponentBuilder } from 'angular2/src/testing/test_component_builder';
import { BrowserDetection } from 'angular2/src/testing/utils';
import { ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/common_dom';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { Log } from 'angular2/src/testing/utils';
function initBrowserTests() {
    BrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
}
/**
 * Default patform providers for testing without a compiler.
 */
export const TEST_BROWSER_STATIC_PLATFORM_PROVIDERS = CONST_EXPR([
    PLATFORM_COMMON_PROVIDERS,
    new Provider(PLATFORM_INITIALIZER, { useValue: initBrowserTests, multi: true })
]);
export const ADDITIONAL_TEST_BROWSER_PROVIDERS = CONST_EXPR([
    new Provider(APP_ID, { useValue: 'a' }),
    ELEMENT_PROBE_PROVIDERS,
    new Provider(DirectiveResolver, { useClass: MockDirectiveResolver }),
    new Provider(ViewResolver, { useClass: MockViewResolver }),
    Log,
    TestComponentBuilder,
    new Provider(NgZone, { useClass: MockNgZone }),
    new Provider(LocationStrategy, { useClass: MockLocationStrategy }),
    new Provider(AnimationBuilder, { useClass: MockAnimationBuilder }),
]);
/**
 * Default application providers for testing without a compiler.
 */
export const TEST_BROWSER_STATIC_APPLICATION_PROVIDERS = CONST_EXPR([
    BROWSER_APP_COMMON_PROVIDERS,
    new Provider(XHR, { useClass: XHRImpl }),
    ADDITIONAL_TEST_BROWSER_PROVIDERS
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nL2Jyb3dzZXJfc3RhdGljLnRzIl0sIm5hbWVzIjpbImluaXRCcm93c2VyVGVzdHMiXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLFlBQVksRUFDWix5QkFBeUIsRUFDekIsb0JBQW9CLEVBQ3JCLE1BQU0sZUFBZTtPQUNmLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxzQ0FBc0M7T0FDMUUsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLCtDQUErQztPQUV4RSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sd0NBQXdDO09BQ2hFLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEM7T0FDdEUsRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJDQUEyQztPQUN4RSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0NBQXNDO09BQzlELEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEM7T0FDdEUsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVDQUF1QztPQUMvRCxFQUFDLFVBQVUsRUFBQyxNQUFNLGdDQUFnQztPQUVsRCxFQUFDLE9BQU8sRUFBQyxNQUFNLHdDQUF3QztPQUN2RCxFQUFDLEdBQUcsRUFBQyxNQUFNLG1CQUFtQjtPQUU5QixFQUFDLG9CQUFvQixFQUFDLE1BQU0sNkNBQTZDO09BRXpFLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw0QkFBNEI7T0FFcEQsRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDhCQUE4QjtPQUU3RCxFQUFDLFVBQVUsRUFBQyxNQUFNLDBCQUEwQjtPQUU1QyxFQUFDLEdBQUcsRUFBQyxNQUFNLDRCQUE0QjtBQUU5QztJQUNFQSxpQkFBaUJBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0lBQ2hDQSxnQkFBZ0JBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO0FBQzNCQSxDQUFDQTtBQUVEOztHQUVHO0FBQ0gsYUFBYSxzQ0FBc0MsR0FDL0MsVUFBVSxDQUFDO0lBQ1QseUJBQXlCO0lBQ3pCLElBQUksUUFBUSxDQUFDLG9CQUFvQixFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztDQUM5RSxDQUFDLENBQUM7QUFFUCxhQUFhLGlDQUFpQyxHQUMxQyxVQUFVLENBQUM7SUFDVCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUM7SUFDckMsdUJBQXVCO0lBQ3ZCLElBQUksUUFBUSxDQUFDLGlCQUFpQixFQUFFLEVBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFDLENBQUM7SUFDbEUsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFDLENBQUM7SUFDeEQsR0FBRztJQUNILG9CQUFvQjtJQUNwQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUM7SUFDNUMsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxRQUFRLEVBQUUsb0JBQW9CLEVBQUMsQ0FBQztJQUNoRSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBQyxDQUFDO0NBQ2pFLENBQUMsQ0FBQztBQUVQOztHQUVHO0FBQ0gsYUFBYSx5Q0FBeUMsR0FDbEQsVUFBVSxDQUFDO0lBQ1QsNEJBQTRCO0lBQzVCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUN0QyxpQ0FBaUM7Q0FDbEMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQVBQX0lELFxuICBEaXJlY3RpdmVSZXNvbHZlcixcbiAgTmdab25lLFxuICBQcm92aWRlcixcbiAgVmlld1Jlc29sdmVyLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9JTklUSUFMSVpFUlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7QlJPV1NFUl9BUFBfQ09NTU9OX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXJfY29tbW9uJztcbmltcG9ydCB7QnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5cbmltcG9ydCB7QW5pbWF0aW9uQnVpbGRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2FuaW1hdGUvYW5pbWF0aW9uX2J1aWxkZXInO1xuaW1wb3J0IHtNb2NrQW5pbWF0aW9uQnVpbGRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svYW5pbWF0aW9uX2J1aWxkZXJfbW9jayc7XG5pbXBvcnQge01vY2tEaXJlY3RpdmVSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svZGlyZWN0aXZlX3Jlc29sdmVyX21vY2snO1xuaW1wb3J0IHtNb2NrVmlld1Jlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay92aWV3X3Jlc29sdmVyX21vY2snO1xuaW1wb3J0IHtNb2NrTG9jYXRpb25TdHJhdGVneX0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svbW9ja19sb2NhdGlvbl9zdHJhdGVneSc7XG5pbXBvcnQge0xvY2F0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL3NyYy9yb3V0ZXIvbG9jYXRpb25fc3RyYXRlZ3knO1xuaW1wb3J0IHtNb2NrTmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9uZ196b25lX21vY2snO1xuXG5pbXBvcnQge1hIUkltcGx9IGZyb20gXCJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci94aHJfaW1wbFwiO1xuaW1wb3J0IHtYSFJ9IGZyb20gJ2FuZ3VsYXIyL2NvbXBpbGVyJztcblxuaW1wb3J0IHtUZXN0Q29tcG9uZW50QnVpbGRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3Rlc3RpbmcvdGVzdF9jb21wb25lbnRfYnVpbGRlcic7XG5cbmltcG9ydCB7QnJvd3NlckRldGVjdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3Rlc3RpbmcvdXRpbHMnO1xuXG5pbXBvcnQge0VMRU1FTlRfUFJPQkVfUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcblxuaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge0xvZ30gZnJvbSAnYW5ndWxhcjIvc3JjL3Rlc3RpbmcvdXRpbHMnO1xuXG5mdW5jdGlvbiBpbml0QnJvd3NlclRlc3RzKCkge1xuICBCcm93c2VyRG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xuICBCcm93c2VyRGV0ZWN0aW9uLnNldHVwKCk7XG59XG5cbi8qKlxuICogRGVmYXVsdCBwYXRmb3JtIHByb3ZpZGVycyBmb3IgdGVzdGluZyB3aXRob3V0IGEgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBURVNUX0JST1dTRVJfU1RBVElDX1BMQVRGT1JNX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIENPTlNUX0VYUFIoW1xuICAgICAgUExBVEZPUk1fQ09NTU9OX1BST1ZJREVSUyxcbiAgICAgIG5ldyBQcm92aWRlcihQTEFURk9STV9JTklUSUFMSVpFUiwge3VzZVZhbHVlOiBpbml0QnJvd3NlclRlc3RzLCBtdWx0aTogdHJ1ZX0pXG4gICAgXSk7XG5cbmV4cG9ydCBjb25zdCBBRERJVElPTkFMX1RFU1RfQlJPV1NFUl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICBDT05TVF9FWFBSKFtcbiAgICAgIG5ldyBQcm92aWRlcihBUFBfSUQsIHt1c2VWYWx1ZTogJ2EnfSksXG4gICAgICBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyxcbiAgICAgIG5ldyBQcm92aWRlcihEaXJlY3RpdmVSZXNvbHZlciwge3VzZUNsYXNzOiBNb2NrRGlyZWN0aXZlUmVzb2x2ZXJ9KSxcbiAgICAgIG5ldyBQcm92aWRlcihWaWV3UmVzb2x2ZXIsIHt1c2VDbGFzczogTW9ja1ZpZXdSZXNvbHZlcn0pLFxuICAgICAgTG9nLFxuICAgICAgVGVzdENvbXBvbmVudEJ1aWxkZXIsXG4gICAgICBuZXcgUHJvdmlkZXIoTmdab25lLCB7dXNlQ2xhc3M6IE1vY2tOZ1pvbmV9KSxcbiAgICAgIG5ldyBQcm92aWRlcihMb2NhdGlvblN0cmF0ZWd5LCB7dXNlQ2xhc3M6IE1vY2tMb2NhdGlvblN0cmF0ZWd5fSksXG4gICAgICBuZXcgUHJvdmlkZXIoQW5pbWF0aW9uQnVpbGRlciwge3VzZUNsYXNzOiBNb2NrQW5pbWF0aW9uQnVpbGRlcn0pLFxuICAgIF0pO1xuXG4vKipcbiAqIERlZmF1bHQgYXBwbGljYXRpb24gcHJvdmlkZXJzIGZvciB0ZXN0aW5nIHdpdGhvdXQgYSBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNvbnN0IFRFU1RfQlJPV1NFUl9TVEFUSUNfQVBQTElDQVRJT05fUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgQ09OU1RfRVhQUihbXG4gICAgICBCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTLFxuICAgICAgbmV3IFByb3ZpZGVyKFhIUiwge3VzZUNsYXNzOiBYSFJJbXBsfSksXG4gICAgICBBRERJVElPTkFMX1RFU1RfQlJPV1NFUl9QUk9WSURFUlNcbiAgICBdKTtcbiJdfQ==
