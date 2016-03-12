export { verifyNoBrowserErrors } from './e2e_util';
var benchpress = global['benchpress'];
var bind = benchpress.bind;
var Options = benchpress.Options;
export function runClickBenchmark(config) {
    browser.ignoreSynchronization = !config.waitForAngular2;
    var buttons = config.buttons.map(function (selector) { return $(selector); });
    config.work = function () { buttons.forEach(function (button) { button.click(); }); };
    return runBenchmark(config);
}
export function runBenchmark(config) {
    return getScaleFactor(browser.params.benchmark.scaling)
        .then(function (scaleFactor) {
        var description = {};
        var urlParams = [];
        if (config.params) {
            config.params.forEach(function (param) {
                var name = param.name;
                var value = applyScaleFactor(param.value, scaleFactor, param.scale);
                urlParams.push(name + '=' + value);
                description[name] = value;
            });
        }
        var url = encodeURI(config.url + '?' + urlParams.join('&'));
        return browser.get(url).then(function () {
            return global['benchpressRunner'].sample({
                id: config.id,
                execute: config.work,
                prepare: config.prepare,
                microMetrics: config.microMetrics,
                bindings: [bind(Options.SAMPLE_DESCRIPTION).toValue(description)]
            });
        });
    });
}
function getScaleFactor(possibleScalings) {
    return browser.executeScript('return navigator.userAgent')
        .then(function (userAgent) {
        var scaleFactor = 1;
        possibleScalings.forEach(function (entry) {
            if (userAgent.match(entry.userAgent)) {
                scaleFactor = entry.value;
            }
        });
        return scaleFactor;
    });
}
function applyScaleFactor(value, scaleFactor, method) {
    if (method === 'log2') {
        return value + Math.log(scaleFactor) / Math.LN2;
    }
    else if (method === 'sqrt') {
        return value * Math.sqrt(scaleFactor);
    }
    else if (method === 'linear') {
        return value * scaleFactor;
    }
    else {
        return value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL3Rlc3RpbmcvcGVyZl91dGlsLnRzIl0sIm5hbWVzIjpbInJ1bkNsaWNrQmVuY2htYXJrIiwicnVuQmVuY2htYXJrIiwiZ2V0U2NhbGVGYWN0b3IiLCJhcHBseVNjYWxlRmFjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFRLHFCQUFxQixRQUFPLFlBQVksQ0FBQztBQUVqRCxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztBQUMzQixJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO0FBRWpDLGtDQUFrQyxNQUFNO0lBQ3RDQSxPQUFPQSxDQUFDQSxxQkFBcUJBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBO0lBQ3hEQSxJQUFJQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxRQUFRQSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBLENBQUNBO0lBQzdFQSxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxjQUFhLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNBO0lBQ3BGQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtBQUM5QkEsQ0FBQ0E7QUFFRCw2QkFBNkIsTUFBTTtJQUNqQ0MsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7U0FDbERBLElBQUlBLENBQUNBLFVBQVNBLFdBQVdBO1FBQ3hCLElBQUks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QSxDQUFDQTtRQUNOQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNmQSxDQUFDQTtBQUNIQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7dmVyaWZ5Tm9Ccm93c2VyRXJyb3JzfSBmcm9tICcuL2UyZV91dGlsJztcblxudmFyIGJlbmNocHJlc3MgPSBnbG9iYWxbJ2JlbmNocHJlc3MnXTtcbnZhciBiaW5kID0gYmVuY2hwcmVzcy5iaW5kO1xudmFyIE9wdGlvbnMgPSBiZW5jaHByZXNzLk9wdGlvbnM7XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5DbGlja0JlbmNobWFyayhjb25maWcpIHtcbiAgYnJvd3Nlci5pZ25vcmVTeW5jaHJvbml6YXRpb24gPSAhY29uZmlnLndhaXRGb3JBbmd1bGFyMjtcbiAgdmFyIGJ1dHRvbnMgPSBjb25maWcuYnV0dG9ucy5tYXAoZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuICQoc2VsZWN0b3IpOyB9KTtcbiAgY29uZmlnLndvcmsgPSBmdW5jdGlvbigpIHsgYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbikgeyBidXR0b24uY2xpY2soKTsgfSk7IH07XG4gIHJldHVybiBydW5CZW5jaG1hcmsoY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bkJlbmNobWFyayhjb25maWcpIHtcbiAgcmV0dXJuIGdldFNjYWxlRmFjdG9yKGJyb3dzZXIucGFyYW1zLmJlbmNobWFyay5zY2FsaW5nKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oc2NhbGVGYWN0b3IpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0ge307XG4gICAgICAgIHZhciB1cmxQYXJhbXMgPSBbXTtcbiAgICAgICAgaWYgKGNvbmZpZy5wYXJhbXMpIHtcbiAgICAgICAgICBjb25maWcucGFyYW1zLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFwcGx5U2NhbGVGYWN0b3IocGFyYW0udmFsdWUsIHNjYWxlRmFjdG9yLCBwYXJhbS5zY2FsZSk7XG4gICAgICAgICAgICB1cmxQYXJhbXMucHVzaChuYW1lICsgJz0nICsgdmFsdWUpO1xuICAgICAgICAgICAgZGVzY3JpcHRpb25bbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gZW5jb2RlVVJJKGNvbmZpZy51cmwgKyAnPycgKyB1cmxQYXJhbXMuam9pbignJicpKTtcbiAgICAgICAgcmV0dXJuIGJyb3dzZXIuZ2V0KHVybCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZ2xvYmFsWydiZW5jaHByZXNzUnVubmVyJ10uc2FtcGxlKHtcbiAgICAgICAgICAgIGlkOiBjb25maWcuaWQsXG4gICAgICAgICAgICBleGVjdXRlOiBjb25maWcud29yayxcbiAgICAgICAgICAgIHByZXBhcmU6IGNvbmZpZy5wcmVwYXJlLFxuICAgICAgICAgICAgbWljcm9NZXRyaWNzOiBjb25maWcubWljcm9NZXRyaWNzLFxuICAgICAgICAgICAgYmluZGluZ3M6IFtiaW5kKE9wdGlvbnMuU0FNUExFX0RFU0NSSVBUSU9OKS50b1ZhbHVlKGRlc2NyaXB0aW9uKV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0U2NhbGVGYWN0b3IocG9zc2libGVTY2FsaW5ncykge1xuICByZXR1cm4gYnJvd3Nlci5leGVjdXRlU2NyaXB0KCdyZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudCcpXG4gICAgICAudGhlbihmdW5jdGlvbih1c2VyQWdlbnQ6IHN0cmluZykge1xuICAgICAgICB2YXIgc2NhbGVGYWN0b3IgPSAxO1xuICAgICAgICBwb3NzaWJsZVNjYWxpbmdzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgICBpZiAodXNlckFnZW50Lm1hdGNoKGVudHJ5LnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgIHNjYWxlRmFjdG9yID0gZW50cnkudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNjYWxlRmFjdG9yO1xuICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5U2NhbGVGYWN0b3IodmFsdWUsIHNjYWxlRmFjdG9yLCBtZXRob2QpIHtcbiAgaWYgKG1ldGhvZCA9PT0gJ2xvZzInKSB7XG4gICAgcmV0dXJuIHZhbHVlICsgTWF0aC5sb2coc2NhbGVGYWN0b3IpIC8gTWF0aC5MTjI7XG4gIH0gZWxzZSBpZiAobWV0aG9kID09PSAnc3FydCcpIHtcbiAgICByZXR1cm4gdmFsdWUgKiBNYXRoLnNxcnQoc2NhbGVGYWN0b3IpO1xuICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ2xpbmVhcicpIHtcbiAgICByZXR1cm4gdmFsdWUgKiBzY2FsZUZhY3RvcjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cbiJdfQ==
