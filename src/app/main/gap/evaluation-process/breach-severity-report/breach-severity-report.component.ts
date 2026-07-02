import { Component, Input, OnInit } from '@angular/core';
import { BreachService } from 'app/services/breach.service';

@Component({
  selector: 'app-breach-severity-report',
  templateUrl: './breach-severity-report.component.html',
  styleUrls: ['./breach-severity-report.component.scss']
})
export class BreachSeverityReportComponent implements OnInit {

  @Input()
  embedded = false;

  loading = false;
  data: any = null;

  public contentHeader: object = {};

  constructor(private breachService: BreachService) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Reporte de Brechas por Severidad',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Proceso de Evaluación', isLink: false, link: '#' },
          { name: 'Brechas por Severidad', isLink: false, link: '#' }
        ]
      }
    };
    this.load();
  }

  load(): void {
    this.loading = true;
    this.breachService.getSeverityReport().subscribe({
      next: (res: any) => {
        this.data = res?.data ?? res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getSeverityColorScheme(): { domain: string[] } {
    if (!this.data?.severityColors?.length) return { domain: ['#ea5455', '#ff9f43', '#28c76f'] };
    return { domain: this.data.severityColors };
  }

  getStatusColorScheme(): { domain: string[] } {
    if (!this.data?.statusColors?.length) return { domain: ['#7367f0', '#28c76f', '#ff9f43'] };
    return { domain: this.data.statusColors };
  }

  getTypeLabel(type: string | null): string {
    if (!type) return '—';
    return type === 'control' ? 'Control' : 'Requisito';
  }

  getTypeIcon(type: string | null): string {
    return type === 'control' ? 'shield' : 'file-text';
  }

  view: [number, number] = [320, 260];
}
