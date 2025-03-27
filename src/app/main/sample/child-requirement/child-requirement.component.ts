import { Component, Input, OnInit } from '@angular/core';
import { Requirement } from 'app/models/requirement';

@Component({
  selector: 'app-child-requirement',
  templateUrl: './child-requirement.component.html',
  styles: [
  ]
})
export class ChildRequirementComponent implements OnInit {


  @Input()
  requirement: Requirement;


  constructor() { }

  ngOnInit(): void {
  }

}
