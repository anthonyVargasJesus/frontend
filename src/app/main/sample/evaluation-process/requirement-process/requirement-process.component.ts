import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChipModel } from 'app/models/chip-model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-requirement-process',
  templateUrl: './requirement-process.component.html',
  styles: [
  ]
})
export class RequirementProcessComponent implements OnInit {

  emails: ChipModel[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInput2') fruitInput2: ElementRef<HTMLInputElement>;

  responsibleOptions: string[] = [  'Oficial de Seguridad de la Información',
  'Dirección Ejecutiva',
  'Comité de Gobierno Digital'];

  options: string[] = [  'Analisis de contexto interno',
  'Analisis de contexto externo',
  'Matriz de Partes Interesadas',
  'Documento de Definición del Alcance',
  'Politica General del SGSI',
  'Politicas Especidicas del SGSI',
  'Requerimientos de la Partes Interesadas'];

  selectedResponsibles: ChipModel[] = [];

  filteredOptions: Observable<string[]>;
  
  public contentHeader: object;
  constructor() { }

  ngOnInit(): void {
    this.selectedResponsibles.push({ name: 'Oficial de Seguridad de la Información'});
    this.emails.push({ name: 'Analisis de contexto interno'});
    this.emails.push({ name: 'Analisis de contexto externo'});
    this.initMenuName();
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Cargar',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Evaluaciones',
            isLink: false,
            link: '#'
          },
          {
            name: 'Cargar',
            isLink: false
          }
        ]
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  add(){

  }
  edit(){

  }

  remove(email: ChipModel): void {

    const index = this.emails.indexOf(email);

    if (index >= 0) 
      this.emails.splice(index, 1);
    
  }

  
  remove2(email: ChipModel): void {

    const index = this.selectedResponsibles.indexOf(email);

    if (index >= 0) 
      this.selectedResponsibles.splice(index, 1);
    
  }

  add2(event: any): void {

    // const value = (event.value || '').trim();

    // if (value == '') 
    //   return;
    

    // if (value)
    //     this.emails.push({ name: value });
    //    event.chipInput!.clear();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.emails.push({name: event.option.viewValue});
    this.fruitInput.nativeElement.value = '';
    //this.options.setValue(null);
  }

  selected2(event: MatAutocompleteSelectedEvent): void {
    this.selectedResponsibles.push({name: event.option.viewValue});
    this.fruitInput2.nativeElement.value = '';
    //this.options.setValue(null);
  }


}
