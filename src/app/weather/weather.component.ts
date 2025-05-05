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
  units = 'metrics';
  lang = 'en';
  selectedLang = 'en';

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
  }

  onConfirmLanguage() {
    console.log(this.selectedLang);
    this.lang = this.selectedLang;
    console.log(this.selectedLang);
    console.log(this.lang);
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onUnitChange(unit: string): void {
    this.units = unit as 'metric' | 'imperial';
    if (this.weatherForm.valid) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    const query = this.weatherForm.value;
    this.weatherService
      .getCurrentWeather(query, this.units, this.lang)
      .subscribe((data) => (this.weatherData = data));
  }
}
