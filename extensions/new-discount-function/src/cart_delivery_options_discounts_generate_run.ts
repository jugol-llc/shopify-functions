import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";
import { useChecker } from "../utils/useChacker";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping
  );

  const {deliveryCandidates} = useChecker(input?.cart, input?.discount?.metafield?.jsonValue,  input.cart.deliveryGroups)

  const operations: any = [];

  if (!hasShippingDiscountClass) {
    return { operations: [] };
  } 

  if(deliveryCandidates.length && hasShippingDiscountClass){
    operations.push({
      deliveryDiscountsAdd: {
        candidates: deliveryCandidates,
        selectionStrategy: DeliveryDiscountSelectionStrategy.All,
      },
    });
  }

  return {
    operations
  }
}
