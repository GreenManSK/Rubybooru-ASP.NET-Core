export enum SizeConditionType {
  SideSize,
  SideRatio,
}

export enum SizeConditionOperation {
  Equals,
  GreaterEquals,
  LessEquals,
  NotEquals,
}

export interface ISizeCondition {
  type: SizeConditionType;
  operation: SizeConditionOperation;
  ratioValue: number;
}
