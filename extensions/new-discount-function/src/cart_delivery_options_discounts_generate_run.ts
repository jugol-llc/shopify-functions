import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {

  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping,
  );

  if (!hasShippingDiscountClass) {
    return {operations: []};
  }

  const firstDeliveryGroup = input.cart.deliveryGroups?.filter(item => Number?.parseFloat(item?.deliveryOptions?.[0]?.cost?.amount) > 0  && item)[0];

  if (!firstDeliveryGroup) {
    throw new Error("No delivery groups found");
  }

  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: [
            {
              message: "FREE DELIVERY",
              targets: [
                {
                  deliveryGroup: {
                    id: firstDeliveryGroup?.id,
                  },
                },
              ],
              value: {
                fixedAmount: {
                  amount: 1000
                },
                // percentage: {
                //   value: 100
                // }
              },
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}