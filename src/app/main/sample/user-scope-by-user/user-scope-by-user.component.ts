import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlGroupService } from 'app/services/control-group.service';
import { RequirementService } from 'app/services/requirement.service';
import { UserControlGroupService } from 'app/services/user-control-group.service';
import { UserRequirementFamilyService } from 'app/services/user-requirement-family.service';
import { ControlGroup } from 'app/models/control-group';
import { Requirement } from 'app/models/requirement';
import { ErrorManager } from 'app/errors/error-manager';

const FAMILY_LEVEL = 1;

/**
 * Checklist de "qué grupos de control y qué familias de cláusula ve este usuario en el panel de
 * evaluación (/gap/panel)". Guarda la selección completa de una vez (reemplaza todo lo asignado
 * antes), no es alta/baja fila por fila.
 */
@Component({
  selector: 'app-user-scope-by-user',
  templateUrl: './user-scope-by-user.component.html',
  styles: [
  ]
})
export class UserScopeByUserComponent implements OnInit, OnChanges {

  @Input() userId: number;
  @Input() standardId: number;

  controlGroups: ControlGroup[] = [];
  requirementFamilies: Requirement[] = [];

  selectedControlGroupIds = new Set<number>();
  selectedRequirementFamilyIds = new Set<number>();

  loading = false;
  saving = false;

  constructor(
    private _controlGroupService: ControlGroupService,
    private _requirementService: RequirementService,
    private _userControlGroupService: UserControlGroupService,
    private _userRequirementFamilyService: UserRequirementFamilyService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.userId || changes.standardId) && this.standardId)
      this.load();
  }

  private load() {
    if (!this.standardId) return;
    this.loading = true;

    this._controlGroupService.getAll(this.standardId.toString()).subscribe((res: any) => {
      this.controlGroups = (res.data || []).sort((a: ControlGroup, b: ControlGroup) => Number(a.number) - Number(b.number));
    }, error => ErrorManager.handleError(error));

    this._requirementService.getAll(this.standardId).subscribe((res: any) => {
      this.requirementFamilies = (res.data || [])
        .filter((r: Requirement) => r.level === FAMILY_LEVEL)
        .sort((a: Requirement, b: Requirement) => Number(a.numeration) - Number(b.numeration));
    }, error => ErrorManager.handleError(error));

    this._userControlGroupService.get(this.userId, this.standardId).subscribe((res: any) => {
      this.selectedControlGroupIds = new Set((res.data || []).map((x: any) => x.controlGroupId));
      this.loading = false;
    }, error => {
      this.loading = false;
      ErrorManager.handleError(error);
    });

    this._userRequirementFamilyService.get(this.userId, this.standardId).subscribe((res: any) => {
      this.selectedRequirementFamilyIds = new Set((res.data || []).map((x: any) => x.requirementId));
    }, error => ErrorManager.handleError(error));
  }

  toggleControlGroup(controlGroupId: number) {
    if (this.selectedControlGroupIds.has(controlGroupId))
      this.selectedControlGroupIds.delete(controlGroupId);
    else
      this.selectedControlGroupIds.add(controlGroupId);
  }

  toggleRequirementFamily(requirementId: number) {
    if (this.selectedRequirementFamilyIds.has(requirementId))
      this.selectedRequirementFamilyIds.delete(requirementId);
    else
      this.selectedRequirementFamilyIds.add(requirementId);
  }

  save() {
    this.saving = true;

    this._userControlGroupService.set(this.userId, this.standardId, Array.from(this.selectedControlGroupIds))
      .subscribe(() => {
        this._userRequirementFamilyService.set(this.userId, this.standardId, Array.from(this.selectedRequirementFamilyIds))
          .subscribe(() => this.saving = false, error => {
            this.saving = false;
            ErrorManager.handleError(error);
          });
      }, error => {
        this.saving = false;
        ErrorManager.handleError(error);
      });
  }

}
