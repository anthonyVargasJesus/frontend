import { Component, OnInit } from '@angular/core';
import { EvaluationService } from 'app/services/evaluation.service';

@Component({
  selector: 'app-compliance-evolution',
  templateUrl: './compliance-evolution.component.html',
  styleUrls: ['./compliance-evolution.component.scss']
})

export class ComplianceEvolutionComponent implements OnInit {

  loading = false;
  data: any = null;

  public contentHeader: object = {};

  lineColorScheme = { domain: ['#7367f0', '#28c76f', '#ff9f43'] };

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Evolución de Cumplimiento Histórico',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Proceso de Evaluación', isLink: false, link: '#' },
          { name: 'Cumplimiento Histórico', isLink: false, link: '#' }
        ]
      }
    };
    this.load();
  }

  load(): void {
    this.loading = true;
    this.evaluationService.getComplianceEvolution().subscribe({
      next: (res: any) => {
        this.data = res?.data ?? res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRateLabel(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return '—';
    return rate.toFixed(1) + '%';
  }

  getDeltaClass(delta: number | null | undefined): string {
    if (delta === null || delta === undefined) return 'text-muted';
    if (delta > 0) return 'text-success';
    if (delta < 0) return 'text-danger';
    return 'text-muted';
  }

  getDeltaIcon(delta: number | null | undefined): string {
    if (delta === null || delta === undefined) return '—';
    if (delta > 0) return '↑ +' + delta.toFixed(1) + '%';
    if (delta < 0) return '↓ ' + delta.toFixed(1) + '%';
    return '= 0%';
  }

  getCompletionBarClass(rate: number | null | undefined): string {
    if (rate === null || rate === undefined) return 'bg-secondary';
    if (rate >= 75) return 'bg-success';
    if (rate >= 50) return 'bg-info';
    if (rate >= 25) return 'bg-warning';
    return 'bg-danger';
  }

  yAxisTickFormatting(value: number): string {
    return value.toFixed(0) + '%';
  }

}
