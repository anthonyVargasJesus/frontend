import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorManager } from 'app/errors/error-manager';
import { DialogData } from 'app/models/dialog-data';
import { Risk } from 'app/models/risk';
import { RiskService } from 'app/services/risk.service';


@Component({
  selector: 'app-follow-up-risk',
  templateUrl: './follow-up-risk.component.html',
  styleUrls: ['./follow-up-risk.component.scss']
})
export class FollowUpRiskComponent implements OnInit {

  riskId: number;
  selectedRisk: Risk;

  constructor(
    private dialogRef: MatDialogRef<FollowUpRiskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private riskService: RiskService,
  ) { }

  loading = false;
  loading2 = false;

  ngOnInit(): void {
    this.riskId = this.data['riskId'];
    this.obtainRisk();
  }

  obtainRisk() {
    this.loading = true;
    this.riskService.obtain(this.riskId.toString())
      .subscribe((res: any) => {
        this.selectedRisk = res.data;
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }


  save() {

    this.loading2 = true;
    const FOLLOW_UP_STATUS_ID = 5;

    this.riskService.updateStatus(this.riskId, FOLLOW_UP_STATUS_ID)
      .subscribe(res => {
        this.loading2 = false;
        this.dialogRef.close({ updated: true });
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }


  close() {
    this.dialogRef.close();
  }

}
