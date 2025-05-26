import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-metric-toggle',
  templateUrl: 'metric-toggle.component.html',
  styleUrls: ['metric-toggle.component.scss'],
  imports: [CommonModule],
})
export class MetricToggleComponent {
  @Output() unitChange = new EventEmitter<string>(); // sending data to the mother component
  currentUnit: string = 'imperial';

  setUnit(unit: string) {
    this.currentUnit = unit;
    this.unitChange.emit(unit);
  }
}
