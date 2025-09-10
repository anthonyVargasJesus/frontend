import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ReferenceDocumentation } from 'app/models/reference-documentation';
import Swal from 'sweetalert2';
import { ErrorManager } from 'app/errors/error-manager';


@Injectable({
  providedIn: 'root'
})
export class ReferenceDocumentationInStorageService {

  /** Clave única dentro de localStorage */
  private readonly storageKey = 'referenceDocumentations';

  // ---------------------- Utilidades internas ---------------------- //
  /**
   * Recupera y parsea todos los registros almacenados.
   */
  private load(): ReferenceDocumentation[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as ReferenceDocumentation[]) : [];
  }

  /**
   * Persiste la colección completa reemplazando el contenido previo.
   */
  private save(collection: ReferenceDocumentation[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(collection));
  }

  /**
   * Genera un ID numérico incremental cuando el objeto no lo trae.
   */
  private generateId(): number {
    const all = this.load();
    const maxId = all.reduce((max, item) => Math.max(max, Number(item.referenceDocumentationId || 0)), 0);
    return maxId + 1;
  }

  // ------------------------- Operaciones CRUD ---------------------- //

  /**
   * Obtiene una página filtrada por requirementEvaluationId y búsqueda textual.
   */
  getByrequirementEvaluationId(requirementEvaluationId: number) {
    try {
      const dataJson = localStorage.getItem('referenceDocumentations');
      const allItems: ReferenceDocumentation[] = dataJson ? JSON.parse(dataJson) : [];

      const filtered = allItems.filter(item =>
        item.requirementEvaluationId === requirementEvaluationId
      );

      return of(filtered);
    } catch (error) {
      return throwError(() => new Error('Error al leer localStorage'));
    }
  }

  /**
   * Devuelve un solo registro por ID.
   */
  obtain(id: string | number): Observable<ReferenceDocumentation | undefined> {
    const result = this.load().find((d) => d.referenceDocumentationId === id);
    return of(result);
  }

  /**
   * Inserta un nuevo registro.
   */
  insert(referenceDocumentation: ReferenceDocumentation): Observable<ReferenceDocumentation> {
    try {
      const collection = this.load();

      if (!referenceDocumentation.referenceDocumentationId) {
        referenceDocumentation.referenceDocumentationId = this.generateId();
      }

      collection.push(referenceDocumentation);
      this.save(collection);

      Swal.fire('Evidencia registrada', 'La evidencia se registró satisfactoriamente', 'success');
      return of(referenceDocumentation);
    } catch (error) {
      ErrorManager.handleError(error);
      return throwError(() => error);
    }
  }

  /**
   * Actualiza un registro existente.
   */
  update(referenceDocumentation: ReferenceDocumentation): Observable<ReferenceDocumentation> {
    try {
      const collection = this.load();
      const index = collection.findIndex((d) => d.referenceDocumentationId === referenceDocumentation.referenceDocumentationId);

      if (index === -1) {
        throw new Error('Elemento no encontrado');
      }

      collection[index] = referenceDocumentation;
      this.save(collection);

      Swal.fire('Evidencia actualizada', 'La evidencia se actualizó satisfactoriamente', 'success');
      return of(referenceDocumentation);
    } catch (error) {
      ErrorManager.handleError(error);
      return throwError(() => error);
    }
  }

  /**
   * Elimina un registro por ID.
   */
  delete(id: number): Observable<boolean> {
    try {
      const collection = this.load();
      const newCollection = collection.filter((d) => d.referenceDocumentationId !== id);

      if (newCollection.length === collection.length) {
        throw new Error('Elemento no encontrado');
      }

      this.save(newCollection);
      Swal.fire('Evidencia eliminada', 'La evidencia se eliminó satisfactoriamente', 'success');
      return of(true);
    } catch (error) {
      ErrorManager.handleError(error);
      return throwError(() => error);
    }
  }

}
