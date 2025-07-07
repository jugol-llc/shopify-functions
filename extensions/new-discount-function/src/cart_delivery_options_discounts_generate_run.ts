import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping
  );

  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }

  const firstDeliveryGroup = input.cart.deliveryGroups?.filter(
    (item) =>
      Number?.parseFloat(item?.deliveryOptions?.[0]?.cost?.amount) > 0 && item
  )[0];

  let DISCOUNT_AMOUNT = 5;
  let DISCOUNT_TYPE = "fixed";
  if (input?.discount?.metafield?.jsonValue?.amount) {
    DISCOUNT_AMOUNT = input?.discount?.metafield?.jsonValue?.amount;
  }
  if (input?.discount?.metafield?.jsonValue?.type) {
    DISCOUNT_TYPE = input?.discount?.metafield?.jsonValue?.type;
  }

  const discountValue =
    DISCOUNT_TYPE === "fixed"
      ? { fixedAmount: { amount: DISCOUNT_AMOUNT } }
      : { percentage: { value: DISCOUNT_AMOUNT } };

  if (!firstDeliveryGroup) {
    return { operations: [] };
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
              value: discountValue,
            },
          ],
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}
