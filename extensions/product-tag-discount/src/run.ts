import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {};

export function run(input: RunInput): FunctionRunResult {

  const MIMINUM_DISCOUNT_ITEMS = 2; 
  let DISCOUNT_AMOUNT =  5;

  if(input?.discountNode?.metafield?.jsonValue?.amount){
    DISCOUNT_AMOUNT = input?.discountNode?.metafield?.jsonValue?.amount
  }
  
  const totalDiscounttagItems = input.cart.lines.reduce((total:any, item) => {
    if(item.merchandise.__typename === "ProductVariant" && item.merchandise.product.hasDiscountTag){
      return total + item.quantity;
    }else{
      return total;
    }
  }, 0)

  if((totalDiscounttagItems >= MIMINUM_DISCOUNT_ITEMS)){
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          value: {
            percentage: {
              value: DISCOUNT_AMOUNT
            }
          },
          targets: [
            {
              orderSubtotal: {
                excludedVariantIds: ["gid://shopify/ProductVariant/43227596488738"]
              }
            }
          ]
        }
      ]
    }
  } else {
    return EMPTY_DISCOUNT;
  }


};