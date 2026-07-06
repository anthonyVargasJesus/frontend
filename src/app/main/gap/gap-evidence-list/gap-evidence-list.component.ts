import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import { ReferenceDocumentationService } from 'app/services/reference-documentation.service';
import { LoginService } from 'app/services/login.service';
import { ErrorManager } from 'app/errors/error-manager';

const MAX_EVIDENCE_ROWS = 100;

/**
 * Versión compacta de la lista de evidencias, con el diseño del prototipo de Fable:
 * "Adjuntar archivo" abre directamente el explorador de archivos del sistema operativo y sube
 * a Firebase Storage; "Agregar enlace" despliega una tarjeta en línea para pegar una URL. Ambos
 * flujos reemplazan al modal genérico de alta (que seguía pidiendo un "tipo de documento" que
 * ya no es obligatorio) pero se guardan en la misma tabla MAE_REFERENCE_DOCUMENTATION.
 */
@Component({
  selector: 'app-gap-evidence-list',
  templateUrl: './gap-evidence-list.component.html',
  styleUrls: ['./gap-evidence-list.component.scss']
})
export class GapEvidenceListComponent implements OnInit, OnChanges {

  @Input() tipo: 'requisito' | 'control' = 'requisito';
  @Input() standardId: number;
  @Input() evaluationId: number;
  @Input() requirementEvaluationId: number;
  @Input() controlEvaluationId: number;

  @Output() updateEvent = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  referenceDocumentations: ReferenceDocumentation[] = [];
  loading = false;
  uploading = false;

  addingLink = false;
  newLinkUrl = '';
  savingLink = false;

  // Valor de "¿Qué demuestra esta evidencia?" al entrar al campo, por evidencia — para no
  // guardar (ni mostrar el toast de éxito) cuando el usuario solo hizo foco y salió sin escribir.
  private descriptionOnFocus = new Map<number, string>();

  constructor(
    private _referenceDocumentationService: ReferenceDocumentationService,
    private _loginService: LoginService,
    private _storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.requirementEvaluationId || changes.controlEvaluationId)
      this.load();
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  get emptyMessage(): string {
    const item = this.tipo === 'control' ? 'este control' : 'este requisito';
    return `Sin evidencias todavía. Adjunta políticas, capturas, actas o reportes que demuestren el cumplimiento de ${item}.`;
  }

  load() {
    if (this.controlEvaluationId) {
      this.loading = true;
      this._referenceDocumentationService.getByControlEvaluationId(0, MAX_EVIDENCE_ROWS, this.controlEvaluationId, '')
        .subscribe((res: any) => {
          this.referenceDocumentations = res.data || [];
          this.loading = false;
        }, error => {
          this.loading = false;
          ErrorManager.handleError(error);
        });
    } else if (this.requirementEvaluationId) {
      this.loading = true;
      this._referenceDocumentationService.getByrequirementEvaluationId(0, MAX_EVIDENCE_ROWS, this.requirementEvaluationId, '')
        .subscribe((res: any) => {
          this.referenceDocumentations = res.data || [];
          this.loading = false;
        }, error => {
          this.loading = false;
          ErrorManager.handleError(error);
        });
    }
  }

  // "Adjuntar archivo": abre el explorador nativo del sistema operativo.
  add() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(file: File | null) {
    if (!file) return;

    this.uploading = true;
    const currentUser = this._loginService.getCurrentUser();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `evidences/${currentUser?.companyId || 0}/${fileName}`;
    const ref = this._storage.ref(filePath);
    const task = this._storage.upload(filePath, file);

    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe(url => {
        this.saveEvidence({
          name: file.name,
          url,
          evidenceType: 'ARCHIVO',
          fileSizeBytes: file.size,
        }, () => this.uploading = false);
      }, error => {
        this.uploading = false;
        ErrorManager.handleError(error);
      });
    })).subscribe();
  }

  // "Agregar enlace": despliega la tarjeta en línea en vez de un modal.
  openAddLink() {
    this.addingLink = true;
    this.newLinkUrl = '';
  }

  cancelAddLink() {
    this.addingLink = false;
    this.newLinkUrl = '';
  }

  saveLink() {
    if (!this.newLinkUrl?.trim()) return;

    this.savingLink = true;
    this.saveEvidence({
      name: this.newLinkUrl.trim(),
      url: this.newLinkUrl.trim(),
      evidenceType: 'ENLACE',
    }, () => {
      this.savingLink = false;
      this.addingLink = false;
      this.newLinkUrl = '';
    });
  }

  private saveEvidence(partial: Partial<ReferenceDocumentation>, done: () => void) {
    const referenceDocumentation = new ReferenceDocumentation();
    referenceDocumentation.name = partial.name;
    referenceDocumentation.url = partial.url;
    referenceDocumentation.evidenceType = partial.evidenceType;
    referenceDocumentation.fileSizeBytes = partial.fileSizeBytes;
    referenceDocumentation.evaluationId = this.evaluationId;
    referenceDocumentation.requirementEvaluationId = this.requirementEvaluationId;
    referenceDocumentation.controlEvaluationId = this.controlEvaluationId;

    this._referenceDocumentationService.insert(referenceDocumentation).subscribe(() => {
      done();
      this.load();
      this.updateEvent.emit();
    }, error => {
      done();
      ErrorManager.handleError(error);
    });
  }

  onDescriptionFocus(doc: ReferenceDocumentation) {
    this.descriptionOnFocus.set(doc.referenceDocumentationId, doc.description || '');
  }

  // Guarda "¿Qué demuestra esta evidencia?" al perder el foco, sin abrir ningún modal — pero
  // solo si el texto realmente cambió, para no disparar un guardado (y su toast) en cada click.
  saveDescription(doc: ReferenceDocumentation) {
    const before = this.descriptionOnFocus.get(doc.referenceDocumentationId) || '';
    if ((doc.description || '') === before) return;

    this._referenceDocumentationService.update(doc).subscribe(() => {
      this.updateEvent.emit();
    }, error => ErrorManager.handleError(error));
  }

  // Marca manual, sin modal: clic en la insignia "Vigente"/"Obsoleta" y se guarda al toque,
  // igual que el resto de acciones rápidas de esta lista.
  toggleObsolete(doc: ReferenceDocumentation) {
    doc.isObsolete = !doc.isObsolete;
    this._referenceDocumentationService.update(doc).subscribe(() => {
      this.updateEvent.emit();
    }, error => {
      doc.isObsolete = !doc.isObsolete;
      ErrorManager.handleError(error);
    });
  }

  delete(referenceDocumentation: ReferenceDocumentation) {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de eliminar el registro ${referenceDocumentation.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(result => {
      if (!result.isConfirmed) return;
      this._referenceDocumentationService.delete(referenceDocumentation.referenceDocumentationId).subscribe(() => {
        this.load();
        this.updateEvent.emit();
      });
    });
  }

}
