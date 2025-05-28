import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
    chartData = [
    { name: 'ToDo', value: 3 },
    { name: 'In Progress', value: 5 },
    { name: 'Testing', value: 2 },
    { name: 'Closed', value: 4 }
  ];

  view: [number, number] = [900, 500];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#B8E6FC', '#FFE088', '#FFB3F0', '#FFB8C8']
  };
}
