export interface DiscountMetafield {
  amount: number;
  type: 'fixed' | 'percentage' | string; 
  conditions: ConditionGroup[];
}

export interface ConditionGroup {
  [x: string]: any;
  subConditions: SubCondition[];
  actionType: 'fixed' | 'percentage' | string; 
  actionValue: string | number;
}

export interface SubCondition {
  parameter: 'total_items' | 'subtotal_price' | string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | string;
  value: string | number;
}
