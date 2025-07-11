import { CartInput } from "../generated/api";
import { DiscountMetafield } from "../types/metafiled";
import { ConditionResult } from "../types/rules";

export const rulesSet = (input: CartInput, discount: DiscountMetafield) =>
  evaluateCartConditions(input?.cart, discount);

function evaluateCartConditions( cart: any, conditionData: DiscountMetafield,) {

  let total_items = cart.lines.reduce((sum: any, line: { quantity: any; }) => sum + line.quantity, 0);
  const subtotal_price = parseFloat(cart.cost.subtotalAmount.amount);

  const inputValues = {
    total_items,
    subtotal_price,
  };

  const results: ConditionResult[] = [];

  for (const conditionGroup of conditionData.conditions) {
    let allTrue = true;

    for (const subCondition of conditionGroup.subConditions) {
      const { parameter, operator, value } = subCondition;
      const inputValue = inputValues[parameter];
      let targetValue: string | number;
      if (typeof value === "number") {
        targetValue = isNaN(value) ? value : value;
      } else {
        targetValue = parseFloat(value);
      }
        allTrue = checkOperations(operator, inputValue, targetValue)
      if (!allTrue) break;
    }

    results.push({
      subCondition: allTrue,
      discountType: conditionGroup.discountType,
      actionType: conditionGroup.actionType,
      actionValue: conditionGroup.actionValue,
    });
  }

  return results;
}

function checkOperations(operator:any, inputValue:any, targetValue:any) {
  let allTrue = true;
  switch (operator) {
    case ">":
      if (!(inputValue > targetValue)) allTrue = false;
      break;
    case "<":
      if (!(inputValue < targetValue)) allTrue = false;
      break;
    case ">=":
      if (!(inputValue >= targetValue)) allTrue = false;
      break;
    case "<=":
      if (!(inputValue <= targetValue)) allTrue = false;
      break;
    case "==":
      if (!(inputValue === targetValue)) allTrue = false;
      break;
    case "!=":
      if (!(inputValue !== targetValue)) allTrue = false;
      break;
    default:
      allTrue = false;
  }
  return allTrue;
}
