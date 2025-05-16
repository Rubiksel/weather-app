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
  weatherForm!: FormGroup;
  weatherData: any;
  units: 'imperial' | 'metric' = 'imperial';
  lang = 'en';
  selectedDays = 1;
  errorMessage: string | null = null;
  showLangDropdown: boolean = false;
  isLoading: boolean = false;
  resolvedLocation: { name: string; state?: string; country: string } | null =
    null;

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.weatherForm = this.fb.group({
      city: [''],
      state: [''],
      country: [''],
      lat: [''],
      lon: [''],
    });

    const savedQuery = localStorage.getItem('lastWeatherQuery');
    if (savedQuery) {
      const parsedQuery = JSON.parse(savedQuery);
      this.weatherForm.patchValue(parsedQuery);
      this.onSubmit();
    }
  }

  get temperatureUnit(): string {
    return this.units === 'imperial' ? 'F' : 'C';
  }

  setLanguage(code: string): void {
    this.lang = code;
    this.showLangDropdown = false;
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onUnitChange(unit: string): void {
    this.units = unit as 'imperial' | 'metric';
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onDaysChange(days: number): void {
    this.selectedDays = days;
    if (this.weatherForm.valid && this.weatherData) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    const query = this.weatherForm.value;
    if (query.city && !query.country) {
      this.errorMessage = 'Please specify a country when searching by city.';
      return;
    }

    localStorage.setItem('lastWeatherQuery', JSON.stringify(query));

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
