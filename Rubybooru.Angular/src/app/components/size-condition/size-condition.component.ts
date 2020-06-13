import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SizeCondition } from '../../data/size-condition';
import { SizeConditionType } from '../../data/size-condition-type';
import { SizeConditionOperation } from '../../data/size-condition-operation';

@Component({
  selector: 'app-size-condition',
  templateUrl: './size-condition.component.html',
  styleUrls: ['./size-condition.component.sass']
})
export class SizeConditionComponent {

  @Input()
  public addIcon = true;

  @Output()
  public buttonClick = new EventEmitter<SizeCondition>();

  @Input()
  public condition: SizeCondition = new SizeCondition();

  public SizeConditionType = SizeConditionType;
  public SizeConditionOperation = SizeConditionOperation;

  constructor() {
  }

  public onClick(): boolean {
    this.buttonClick.emit(this.condition);
    this.condition = new SizeCondition();
    return false;
  }
}
