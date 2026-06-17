import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {

  loading = false;
  data: any = null;

  public contentHeader: object = {};

  stateColorScheme = { domain: ['#4CAF50', '#F44336', '#9E9E9E'] };
  accessColorScheme = { domain: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#9E9E9E'] };
  roleColorScheme = { domain: ['#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688'] };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Panel de Actividad de Usuarios',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          { name: 'Seguridad', isLink: false, link: '#' },
          { name: 'Actividad de Usuarios', isLink: false, link: '#' }
        ]
      }
    };
    this.loadActivity();
  }

  loadActivity(): void {
    this.loading = true;
    this.userService.getActivity().subscribe({
      next: (res: any) => {
        this.data = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getAccessBadgeClass(bucket: string): string {
    const map: { [key: string]: string } = {
      'Hoy': 'badge-success',
      'Última semana': 'badge-info',
      'Último mes': 'badge-warning',
      'Hace más de 30 días': 'badge-danger',
      'Hace más de 60 días': 'badge-dark',
      'Nunca': 'badge-secondary',
    };
    return 'badge ' + (map[bucket] || 'badge-secondary');
  }

  getStateBadgeClass(value: number): string {
    return value === 1 ? 'badge badge-success' : 'badge badge-danger';
  }

  getDaysSinceLabel(days: number | null): string {
    if (days === null || days === undefined) return '—';
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  }

  getUserInitials(user: any): string {
    const first = (user.name || user.firstName || '?')[0].toUpperCase();
    const last = (user.lastName || user.firstName || '')[0]?.toUpperCase() || '';
    return first + last;
  }
}
