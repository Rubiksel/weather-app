import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherApiUrl = 'https://api.openweathermap.org/data/3.0';
  private geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  getCurrentWeather(
    query: any,
    units = 'imperial',
    lang = 'en'
  ): Observable<any> {
    const appid = environment.openWeatherApiKey;

    if (query.city) {
      let location = `${query.city}`;
      if (query.state) location += `${query.state}`;
      if (query.country) location += `${query.country}`;

      const geoParams = new HttpParams()
        .set('q', location)
        .set('limit', 1)
        .set('appid', appid);

      return this.http.get<any[]>(this.geoApiUrl, { params: geoParams }).pipe(
        switchMap((geoData) => {
          if (!geoData.length) {
            throw new Error('Location not found');
          }

          const { lat, lon } = geoData[0];

          const weatherParams = new HttpParams()
            .set('appid', appid)
            .set('units', units)
            .set('lang', lang)
            .set('lat', lat)
            .set('lon', lon)
            .set('exclude', 'minutely,hourly,current,alerts');

          return this.http.get(`${this.weatherApiUrl}/onecall`, {
            params: weatherParams,
          });
        })
      );
    } else if (query.lat && query.lon) {
      const weatherParams = new HttpParams()
        .set('appid', appid)
        .set('units', units)
        .set('lang', lang)
        .set('lat', query.lat)
        .set('lon', query.lon)
        .set('exclude', 'minutely,hourly,current,alerts');

      return this.http.get(`${this.weatherApiUrl}/onecall`, {
        params: weatherParams,
      });
    } else {
      return of(null);
    }
  }
}
