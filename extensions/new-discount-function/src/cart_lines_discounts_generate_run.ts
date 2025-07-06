import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from '../generated/api';


export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    throw new Error('No cart lines found');
  }

  const hasOrderDiscountClass = input?.discount?.discountClasses?.includes(
    DiscountClass.Order,
  );
  const hasProductDiscountClass = input?.discount?.discountClasses?.includes(
    DiscountClass.Product,
  );

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return {operations:  []};
  }

  const maxCartLine = input.cart.lines.reduce((maxLine, line) => {
    if (Number.parseFloat(line.cost.subtotalAmount.amount) > Number.parseFloat(maxLine.cost.subtotalAmount.amount)) {
      return line;
    }
    return maxLine;
  }, input.cart.lines[0]);

  const operations:any = [];

  if (hasOrderDiscountClass) {
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: 'FLAT 100 OFF ORDER',
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              fixedAmount: {
                amount: 100
              }
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  }

  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: 'FLAT 200 OFF PRODUCT',
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }
  return {
    operations,
  };
}