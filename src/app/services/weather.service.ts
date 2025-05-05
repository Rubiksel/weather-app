import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getCurrentWeather(
    query: any,
    units = 'metric',
    lang = 'fr'
  ): Observable<any> {
    let params = new HttpParams()
      .set('appid', environment.openWeatherApiKey)
      .set('units', units)
      .set('lang', lang);

    if (query.lang) {
      console.log('LANG', lang);
    }
    if (query.city) {
      params = params.set(
        'q',
        `${query.city}${query.state ? ',' + query.state : ''}${
          query.country ? ',' + query.country : ''
        }`
      );
    } else if (query.lat && query.lon) {
      params = params.set('lat', query.lat).set('lon', query.lon);
    }
    console.log('url', `${this.apiUrl}/weather`, { params });
    return this.http.get(`${this.apiUrl}/weather`, { params });
  }
}
