import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-metric-toggle',
  template: `
    <div class="btn-group">
      <button class="btn btn-outline-primary" (click)="changeUnit('metric')">
        Metric
      </button>
      <button class="btn btn-outline-primary" (click)="changeUnit('imperial')">
        Imperial
      </button>
    </div>
  `,
})
export class MetricToggleComponent {
  @Output() unitChange = new EventEmitter<string>();

  changeUnit(unit: string) {
    this.unitChange.emit(unit);
  }
}
