import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { Requirement } from 'app/models/requirement';
import { RequirementService } from 'app/services/requirement.service';


@Component({
  selector: 'app-popup-requirements',
  templateUrl: './popup-requirements.component.html',
  styles: [
  ]
})


export class PopupRequirementsComponent implements OnInit {

  requirements: Requirement[] = [];
  loading = false;

  standardId: number;

  constructor(private requirementService: RequirementService, private dialogRef: MatDialogRef<PopupRequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,) {

  }

  ngOnInit(): void {
    this.standardId = this.data['standardId'];
    this.get();
  }

  get() {
    this.loading = true;
    this.requirementService.get(this.standardId)
      .subscribe((res: any) => {
        console.log(res);
        this.requirements = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  close() {
    this.dialogRef.close();
  }

  select(requirement: Requirement) {
    this.dialogRef.close({ requirement: requirement });
  }

}
