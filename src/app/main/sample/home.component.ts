import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ErrorManager } from 'app/errors/error-manager';
import { getResults, PAGE_SIZE } from 'app/config/config';
import { Router } from '@angular/router';
import {MatAccordion} from '@angular/material/expansion';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit {


  public contentHeader: object;
  public submitted = false;
  public currentSkin: string;
  private _unsubscribeAll: Subject<any>;
  coreConfig: any;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _coreConfigService: CoreConfigService,
    private router: Router,
  ) {

    this._unsubscribeAll = new Subject();

  }
  ngAfterContentInit(): void {
    if (this.accordion)
    this.accordion.openAll();
  }




  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
    this.initMenuName();

  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    //this.contextMenu.menuData = { 'item': cloth };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction1() {
  
  }


  initMenuName() {
    this.contentHeader = {
      headerTitle: 'ISO 27001',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'NORMAS ISO',
            isLink: false,
            link: '#'
          },
          {
            name: 'ISO 27001',
            isLink: false
          }
        ]
      }
    }
  }


}
