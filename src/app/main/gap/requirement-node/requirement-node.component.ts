import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Requirement } from 'app/models/requirement';


@Component({
  selector: 'app-requirement-node',
  templateUrl: './requirement-node.component.html',
  styleUrls: ['./requirement-node.component.scss']
})


export class RequirementNodeComponent implements OnInit {

  @Input() requirements: Requirement[] = [];

  coreConfig: any;
  @Output() selectEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  select(requirement: Requirement) {
    this.selectEvent.emit(requirement);
  }

  selectChild(requirement: Requirement) {
    this.selectEvent.emit(requirement);
  }


}
