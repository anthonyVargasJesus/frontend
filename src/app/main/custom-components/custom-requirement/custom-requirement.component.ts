import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { CoreConfigService } from '@core/services/config.service';
import { Requirement } from 'app/models/requirement';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-custom-requirement',
  templateUrl: './custom-requirement.component.html',
  styleUrls: ['./custom-requirement.component.scss']
})
export class CustomRequirementComponent implements OnInit, OnChanges {

  @Input()
  standardId: number;

  @Input()
  evaluationId: number;

  @Input()
  parent: Requirement;

  @Input()
  requirement: Requirement;

  @Input() forceExpand: boolean;

  isExpanded: boolean = false; // cada componente lleva su propio estado

  public contentHeader: object;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  private panelClass: string;
  coreConfig: any;

  ngOnChanges() {
    this.isExpanded = true;
  }


  constructor(private _coreConfigService: CoreConfigService,) {
    this._unsubscribeAll = new Subject();
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnInit(): void {


  }


}
