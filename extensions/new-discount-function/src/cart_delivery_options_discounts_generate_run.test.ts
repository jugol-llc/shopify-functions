import {describe, it, expect} from "vitest";

import {cartDeliveryOptionsDiscountsGenerateRun} from "./cart_delivery_options_discounts_generate_run";
import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
  DeliveryInput,
  CartDeliveryOptionsDiscountsGenerateRunResult,
} from "../generated/api";

describe("cartDeliveryOptionsDiscountsGenerateRun", () => {

  it("returns empty operations when no discount classes are present", () => {
    const input: DeliveryInput = {
      "cart": {
        "deliveryGroups": [
          {
            "id": "gid://shopify/CartDeliveryGroup/0"
          },
          {
            "id": "gid://shopify/CartDeliveryGroup/1"
          }
        ]
      },
      "discount": {
        "discountClasses": [
          DiscountClass.Order, DiscountClass.Product, DiscountClass.Shipping
        ]
      }
    }

    const result: CartDeliveryOptionsDiscountsGenerateRunResult =
      cartDeliveryOptionsDiscountsGenerateRun(input);

      console.log("result", JSON.stringify(result))

  });




  // it("returns delivery discount when shipping discount class is present", () => {
  //   const input: DeliveryInput = {
  //     ...baseInput,
  //     discount: {
  //       discountClasses: [DiscountClass.Shipping],
  //     },
  //   };

  //   const result: CartDeliveryOptionsDiscountsGenerateRunResult =
  //     cartDeliveryOptionsDiscountsGenerateRun(input);
  //   expect(result.operations).toHaveLength(1);
  //   expect(result.operations[0]).toMatchObject({
  //     deliveryDiscountsAdd: {
  //       candidates: [
  //         {
  //           message: "FREE DELIVERY",
  //           targets: [
  //             {
  //               deliveryGroup: {
  //                 id: "gid://shopify/DeliveryGroup/0",
  //               },
  //             },
  //           ],
  //           value: {
  //             percentage: {
  //               value: 100,
  //             },
  //           },
  //         },
  //       ],
  //       selectionStrategy: DeliveryDiscountSelectionStrategy.All,
  //     },
  //   });
  // });

  // it("throws error when no delivery groups are present", () => {
  //   const input: DeliveryInput = {
  //     cart: {
  //       deliveryGroups: [],
  //     },
  //     discount: {
  //       discountClasses: [DiscountClass.Shipping],
  //     },
  //   };

  //   expect(() => cartDeliveryOptionsDiscountsGenerateRun(input)).toThrow(
  //     "No delivery groups found",
  //   );
  // });
});