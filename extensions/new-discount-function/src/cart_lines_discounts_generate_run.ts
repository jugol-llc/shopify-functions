import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from "../generated/api";
import { ConditionResult } from "../types/rules";
import { rulesSet } from "../utils/rules";

export function cartLinesDiscountsGenerateRun(
  input: CartInput
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    throw new Error("No cart lines found");
  }

  const operations: any = [];

  const hasOrderDiscountClass = input?.discount?.discountClasses?.includes(
    DiscountClass.Order
  );

  const hasProductDiscountClass = input?.discount?.discountClasses?.includes(
    DiscountClass.Product
  );

  let chackedRules: ConditionResult[] = [];
  if (input?.discount?.metafield?.jsonValue) {
    chackedRules = rulesSet(input, input?.discount?.metafield?.jsonValue);
  }

  const isAppliedDiscount = chackedRules?.some(
    (item) => item.subCondition === true
  );

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }

  if (
    (hasOrderDiscountClass || hasProductDiscountClass) && chackedRules?.length) {
    const orderCandidates: any[] = [];
    const productCandidates: any[] = [];

    chackedRules.forEach((rule, ind) => {
      if (!rule.subCondition) return;

      const discountValue =
        rule.actionType === "fixed"
          ? { fixedAmount: { amount: rule.actionValue } }
          : { percentage: { value: rule.actionValue } };

      if (hasOrderDiscountClass) {
        orderCandidates.push({
          message: `Check Condition - ${ind}`,
          targets: [
            {
              orderSubtotal: {
                excludedCartLineIds: [],
              },
            },
          ],
          value: discountValue,
        });
      }

      if (hasProductDiscountClass) {
        const targets = input.cart.lines.map((item) => ({
          cartLine: { id: item.id },
        }));

        productCandidates.push({
          message: `Check Product Condition - ${ind}`,
          targets,
          value: discountValue,
        });
      }
    });

    if (orderCandidates.length) {
      operations.push({
        orderDiscountsAdd: {
          candidates: orderCandidates,
          selectionStrategy: OrderDiscountSelectionStrategy.First,
        },
      });
    }

    if (productCandidates.length) {
      operations.push({
        productDiscountsAdd: {
          candidates: productCandidates,
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      });
    }
  }

  return {
    operations,
  };
}
