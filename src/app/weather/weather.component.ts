import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { MetricToggleComponent } from '../metric-toggle/metric-toggle.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MetricToggleComponent,
    FormsModule,
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  weatherForm!: FormGroup; // form group to capture location inputs
  weatherData: any; // this hold the fetched data
  units: 'imperial' | 'metric' = 'imperial'; // unit parameter
  lang = 'en'; // language parameter
  selectedDays = 1; // amount of days for forecast
  errorMessage: string | null = null;
  showLangDropdown: boolean = false; // boolean to handle dropdown
  isLoading: boolean = false; // used so that any change gets rendered first and then shown (no weird sequential update)
  resolvedLocation: { name: string; state?: string; country: string } | null =
    null; // organizes the location info and puts it in a string the geo api can read

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.weatherForm = this.fb.group({
      // initializing the form on page start
      city: [''],
      state: [''],
      country: [''],
      lat: [''],
      lon: [''],
    });

    const savedQuery = localStorage.getItem('lastWeatherQuery'); // local storage handler to reload last known query on page refresh
    if (savedQuery) {
      const parsedQuery = JSON.parse(savedQuery);
      this.weatherForm.patchValue(parsedQuery);
      this.onSubmit();
    }
  }

  get temperatureUnit(): string {
    // getter for display unit
    return this.units === 'imperial' ? 'F' : 'C';
  }

  setLanguage(code: string): void {
    // changes language and reloads data
    this.lang = code;
    this.showLangDropdown = false;
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onUnitChange(unit: string): void {
    // reloads data on unit change
    this.units = unit as 'imperial' | 'metric';
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onDaysChange(days: number): void {
    // reloads data on number of days change
    this.selectedDays = days;
    if (this.weatherForm.valid && this.weatherData) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    // main submission handler
    const query = this.weatherForm.value;
    if (query.city && !query.country) {
      this.errorMessage = 'Please specify a country when searching by city.'; // first failsafe so that users find the right city
      return;
    }

    localStorage.setItem('lastWeatherQuery', JSON.stringify(query)); // storing the query for later use

    this.isLoading = true;

    this.weatherService
      .getCurrentWeather(query, this.units, this.lang)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.resolvedLocation = data.resolvedLocation || null;
          this.errorMessage = null;
          this.isLoading = false;
        },
        error: (error) => {
          this.weatherData = null;
          this.errorMessage =
            'Could not retrieve weather data. Please check your input.';
          console.error(error);
          this.isLoading = false;
        },
      });
  }
}
