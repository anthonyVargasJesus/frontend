import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
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
  selector: 'app-edit-actives-inventory',
  templateUrl: './edit-actives-inventory.component.html',
  styles: [
  ]
})
export class EditActivesInventoryComponent implements OnInit {

  constructor(
    private activesInventoryService: ActivesInventoryService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public router: Router, private macroprocessService: MacroprocessService,
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
  id: string;
  loading2 = false; public contentHeader: object; public form: FormGroup;
  public submitted = false;
  //public last: string = '';

  title = 'Editar activo';

  ngOnInit(): void {
    this.initForm();

    this.initMenuName(); this.getAllMacroprocesss();
    this.getAllSubprocesss();
    this.getAllActiveTypes();
    this.getAllOwners();
    this.getAllCustodians();
    this.getAllUsageClassifications();
    this.getAllSupportTypes();
    this.getAllLocations();

    this.initActivesInventory();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      this.obtain(this.id);
    });


  }


  initActivesInventory() {
    this.activesInventory = new ActivesInventory();
    this.initMacroprocess();
    this.initSubprocess();
    this.initActiveType();
    this.initOwner();
    this.initCustodian();
    this.initUsageClassification();
    this.initSupportType();
    this.initLocation();
  }

  initMacroprocess() {
    if (this.macroprocesss.length > 0)
      this.activesInventory.macroprocess = this.macroprocesss[0];
  }

  initSubprocess() {
    if (this.subprocesss.length > 0)
      this.activesInventory.subprocess = this.subprocesss[0];
  }


  initActiveType() {
    if (this.activeTypes.length > 0)
      this.activesInventory.activeType = this.activeTypes[0];
  }



  initOwner() {
    if (this.owners.length > 0)
      this.activesInventory.owner = this.owners[0];
  }

  initCustodian() {
    if (this.custodians.length > 0)
      this.activesInventory.custodian = this.custodians[0];
  }

  initUsageClassification() {
    if (this.usageClassifications.length > 0)
      this.activesInventory.usageClassification = this.usageClassifications[0];
  }

  initSupportType() {
    if (this.supportTypes.length > 0)
      this.activesInventory.supportType = this.supportTypes[0];
  }

  initLocation() {
    if (this.locations.length > 0)
      this.activesInventory.location = this.locations[0];
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

  obtain(id: string) {
    this.loading = true;
    this.activesInventoryService.obtain(id)
      .subscribe((res: any) => {
        this.activesInventory = res.data;
        this.title = 'Editar ' + this.activesInventory.name;
        this.setFormValue(this.activesInventory);
        this.loading = false;
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  setFormValue(activesInventory: ActivesInventory) {
    this.form.setValue({
      number: ((activesInventory.number == null) ? '' : activesInventory.number),
      macroprocess: ((activesInventory.macroprocessId == null) ? '' : activesInventory.macroprocessId),
      subprocess: ((activesInventory.subprocessId == null) ? '' : activesInventory.subprocessId),
      procedure: ((activesInventory.procedure == null) ? '' : activesInventory.procedure),
      activeType: ((activesInventory.activeTypeId == null) ? '' : activesInventory.activeTypeId),
      name: ((activesInventory.name == null) ? '' : activesInventory.name),
      description: ((activesInventory.description == null) ? '' : activesInventory.description),
      owner: ((activesInventory.ownerId == null) ? '' : activesInventory.ownerId),
      custodian: ((activesInventory.custodianId == null) ? '' : activesInventory.custodianId),
      usageClassification: ((activesInventory.usageClassificationId == null) ? '' : activesInventory.usageClassificationId),
      supportType: ((activesInventory.supportTypeId == null) ? '' : activesInventory.supportTypeId),
      location: ((activesInventory.locationId == null) ? '' : activesInventory.locationId),
    });
  }


  getFormValue() {
    this.activesInventory.activesInventoryId = Number(this.id);
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


  get f() {
    return this.form.controls;
  }

  save() {

    this.submitted = true;
    if (this.form.invalid)
      return;

    this.loading2 = true;
    this.getFormValue();



    this.activesInventoryService.update(this.activesInventory)
      .subscribe(res => {
        this.activesInventory = res.data; this.loading2 = false;


      }, error => {
        this.loading2 = false;
        ErrorManager.handleError(error);
      });

  }
  navigateToBack() {
    this.router.navigate(['/actives/actives-inventory']);
  }
}
