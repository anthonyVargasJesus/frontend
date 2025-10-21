import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ParamMap, Router } from '@angular/router';
import { ActivesInventory } from 'app/models/actives-inventory';
import { ErrorManager } from 'app/errors/error-manager';
import { ActivesInventoryService } from 'app/services/actives-inventory.service';

import { MacroprocessService } from 'app/services/macroprocess.service';
import { Macroprocess } from 'app/models/macroprocess';
import { SubprocessService } from 'app/services/subprocess.service';
import { Subprocess } from 'app/models/subprocess';
import { ActiveTypeService } from 'app/services/active-type.service';
import { ActiveType } from 'app/models/active-type';
import { OwnerService } from 'app/services/owner.service';
import { Owner } from 'app/models/owner';
import { CustodianService } from 'app/services/custodian.service';
import { Custodian } from 'app/models/custodian';
import { UsageClassificationService } from 'app/services/usage-classification.service';
import { UsageClassification } from 'app/models/usage-classification';
import { SupportTypeService } from 'app/services/support-type.service';
import { SupportType } from 'app/models/support-type';
import { LocationService } from 'app/services/location.service';
import { Location } from 'app/models/location';



@Component({
  selector: 'app-add-actives-inventory',
  templateUrl: './add-actives-inventory.component.html',
  styles: [
  ]
})


export class AddActivesInventoryComponent implements OnInit {

  constructor(
    private activesInventoryService: ActivesInventoryService,
    public router: Router,
    private _formBuilder: FormBuilder, private macroprocessService: MacroprocessService,
    private subprocessService: SubprocessService,
    private activeTypeService: ActiveTypeService,
    private ownerService: OwnerService,
    private custodianService: CustodianService,
    private usageClassificationService: UsageClassificationService,
    private supportTypeService: SupportTypeService,
    private locationService: LocationService,


  ) { }

  macroprocesss: Macroprocess[] = [];
  subprocesss: Subprocess[] = [];
  activeTypes: ActiveType[] = [];
  owners: Owner[] = [];
  custodians: Custodian[] = [];
  usageClassifications: UsageClassification[] = [];
  supportTypes: SupportType[] = [];
  locations: Location[] = [];

  activesInventory: ActivesInventory;
  loading = false;
  loading2 = false;
  public form: FormGroup;
  public submitted = false;
  public contentHeader: object;

  ngOnInit(): void {
    this.initForm(); this.initMenuName();
    this.getAllMacroprocesss();
    this.getAllSubprocesss();
    this.getAllActiveTypes();
    this.getAllOwners();
    this.getAllCustodians();
    this.getAllUsageClassifications();
    this.getAllSupportTypes();
    this.getAllLocations();

    this.initActivesInventory();

  }  
  
  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Inventario de activos',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Activos',
            isLink: false,
            link: '#'
          },
          {
            name: 'Inventario',
            isLink: false
          }
        ]
      }
    }
  }

  initForm() {
    this.form = this._formBuilder.group({
      number: ['', [Validators.required, Validators.maxLength(20),]],
      macroprocess: ['', [Validators.required,]],
      subprocess: ['', [Validators.required,]],
      procedure: ['', [Validators.maxLength(200),]],
      activeType: ['', [Validators.required,]],
      name: ['', [Validators.required, Validators.maxLength(250),]],
      description: ['', [Validators.maxLength(500),]],
      owner: ['', [Validators.required,]],
      custodian: ['', [Validators.required,]],
      usageClassification: ['', [Validators.required,]],
      supportType: ['', [Validators.required,]],
      location: ['', [Validators.required,]],
    });
  }

  initActivesInventory() {
    this.activesInventory = new ActivesInventory();
  }



  getAllMacroprocesss() {
    this.macroprocessService.getAll()
      .subscribe((res: any) => {
        this.macroprocesss = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllSubprocesss() {
    this.subprocessService.getAll()
      .subscribe((res: any) => {
        this.subprocesss = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllActiveTypes() {
    this.activeTypeService.getAll()
      .subscribe((res: any) => {
        this.activeTypes = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllOwners() {
    this.ownerService.getAll()
      .subscribe((res: any) => {
        this.owners = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllCustodians() {
    this.custodianService.getAll()
      .subscribe((res: any) => {
        this.custodians = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllUsageClassifications() {
    this.usageClassificationService.getAll()
      .subscribe((res: any) => {
        this.usageClassifications = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllSupportTypes() {
    this.supportTypeService.getAll()
      .subscribe((res: any) => {
        this.supportTypes = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }


  getAllLocations() {
    this.locationService.getAll()
      .subscribe((res: any) => {
        this.locations = res.data;
        this.initActivesInventory();
      }, error => {
        ErrorManager.handleError(error);
      });
  }



  getFormValue() {
    this.activesInventory.number = this.form.value.number;
    this.activesInventory.macroprocessId = this.form.value.macroprocess;
    this.activesInventory.subprocessId = this.form.value.subprocess;
    this.activesInventory.procedure = this.form.value.procedure;
    this.activesInventory.activeTypeId = this.form.value.activeType;
    this.activesInventory.name = this.form.value.name;
    this.activesInventory.description = this.form.value.description;
    this.activesInventory.ownerId = this.form.value.owner;
    this.activesInventory.custodianId = this.form.value.custodian;
    this.activesInventory.usageClassificationId = this.form.value.usageClassification;
    this.activesInventory.supportTypeId = this.form.value.supportType;
    this.activesInventory.locationId = this.form.value.location;
  }






  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();



    this.activesInventoryService.insert(this.activesInventory)
      .subscribe(res => {
        this.activesInventory = res.data;
        this.loading2 = false; 
        this.navigateToBack();
      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  } 
  
  navigateToBack() {
    this.router.navigate(['/actives/actives-inventory']);
  }


}
