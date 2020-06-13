import { SizeConditionType } from './size-condition-type';
import { SizeConditionOperation } from './size-condition-operation';

export class SizeCondition {
  type: SizeConditionType = SizeConditionType.SideSize;
  operation: SizeConditionOperation = SizeConditionOperation.Equals;
  ratioValue = 1.0;
}
