import type { CartInput, CartTransformRunResult } from "../generated/api";

// bundle 1 : gid://shopify/ProductVariant/44003219144738
// bundle 2 : gid://shopify/ProductVariant/43229298589730

const NO_CHANGES: CartTransformRunResult = {
  operations: [],
};

export function cartTransformRun(input: CartInput): CartTransformRunResult {
  const operations: any = [];
  const tagTrueProductIds = input?.cart?.lines
    ?.filter((item) => item.merchandise.product?.productTags)
    ?.map((item) => item.id);

  const processCartLines = tagTrueProductIds?.map((item) => {
    return {
      cartLineId: item,
      quantity: 1,
    };
  });

  if (processCartLines?.length) {
    operations?.push({
      linesMerge: {
        cartLines: processCartLines,
        title: "Custom Bundle Builder Item",
        parentVariantId: "gid://shopify/ProductVariant/44003219144738",
        price: {
          percentageDecrease: {
            value: 50,
          },
        },
      },
    });
  }

  const tagFalseProductIds = input?.cart?.lines
    ?.filter((item) => !!item.merchandise.product?.productTags === false)
    ?.map((item) => item.id);

  if (tagFalseProductIds?.length) {
    const updateLine = tagFalseProductIds?.map((item) => {
      return {
        lineUpdate: {
          cartLineId: item,
          price: {
            adjustment: {
              fixedPricePerUnit: {
                amount: 1000,
              },
            },
          },
          title: "cart line update",
        },
      };
    });

    operations.push(...updateLine);
  }

  const bundleLineItems = input?.cart?.lines?.filter((item) => item.cost.subtotalAmount.amount < 50);

  if (bundleLineItems?.length) {
    const lineExpand = {
      lineExpand: {
        cartLineId: bundleLineItems[0].id,
        expandedCartItems: bundleLineItems?.map(item => {
          return {
            merchandiseId: item?.merchandise?.id,
            quantity: item.quantity,
          }
        }),
        price: {
          percentageDecrease: {
            value: 50,
          },
        },
        title: "Expand Line Item Bundle",
      },
    };
    operations.push(lineExpand);
  }

  // return {
  //   operations: [
  //     // {
  //     //   linesMerge: {
  //     //     cartLines: processCartLines,
  //     //     title: "Custom Bundle Builder Item",
  //     //     price: {
  //     //       percentageDecrease: {
  //     //         value: 50,
  //     //       },
  //     //     },
  //     //     parentVariantId: "gid://shopify/ProductVariant/44003219144738",
  //     //   },
  //     // },
  //     // {
  //     //   lineExpand: {
  //     //     cartLineId: input?.cart?.lines[0]?.id,
  //     //     expandedCartItems: [
  //     //       {
  //     //         merchandiseId: "gid://shopify/ProductVariant/44003219144738",
  //     //         quantity: 1,
  //     //         price: {
  //     //           adjustment: {
  //     //             fixedPricePerUnit: {
  //     //               amount: 100,
  //     //             },
  //     //           },
  //     //         },
  //     //       },
  //     //     ],
  //     //   },
  //     // },
  //     // {
  //     //   lineUpdate: {
  //     //     cartLineId: input?.cart?.lines[0]?.id,
  //     //     title: "Update Title",
  //     //   },
  //     // },
  //   ],
  // };

  // return { operations };
  // const operations: Operation[] = input.cart.lines.filter(
  //   line => line.merchandise.__typename === 'ProductVariant' && line.merchandise.product.title.includes(":")
  // ).map(line => {
  //   return {
  //     lineUpdate: {
  //       cartLineId: line.id,
  //       title: (line.merchandise as ProductVariant).product.title.split(":")[0]
  //     }
  //   }
  // })

  // return operations.length > 0 ? { operations } : NO_CHANGES

  return { operations };
}
