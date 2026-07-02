import { Component, Input, OnInit } from '@angular/core';
import { ActionPlanService } from 'app/services/action-plan.service';

@Component({
  selector: 'app-action-plan-progress',
  templateUrl: './action-plan-progress.component.html',
  styleUrls: ['./action-plan-progress.component.scss']
})
export class ActionPlanProgressComponent implements OnInit {

  @Input()
  embedded = false;

  loading = false;
  data: any = null;

  public contentHeader: object;

  view: [number, number] = [350, 260];

  constructor(private actionPlanService: ActionPlanService) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Avance de Planes de Acción por Responsable',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Proceso de Evaluación', isLink: false, link: '#' },
          { name: 'Planes de Acción', isLink: false, link: '#' }
        ]
      }
    };
    this.load();
  }

  load(): void {
    this.loading = true;
    this.actionPlanService.getProgress().subscribe({
      next: (res: any) => {
        this.data = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusColorScheme(): { domain: string[] } {
    if (!this.data?.statusColors?.length) return { domain: ['#7367f0'] };
    return { domain: this.data.statusColors };
  }

  getPriorityColorScheme(): { domain: string[] } {
    if (!this.data?.priorityColors?.length) return { domain: ['#f44336', '#ff9800', '#4caf50'] };
    return { domain: this.data.priorityColors };
  }

  getCompletionBarClass(rate: number): string {
    if (rate >= 75) return 'bg-success';
    if (rate >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  getOverdueBadge(count: number): string {
    return count > 0 ? 'badge badge-danger' : 'badge badge-secondary';
  }

  getRateText(rate: number): string {
    return rate.toFixed(1) + '%';
  }
}
