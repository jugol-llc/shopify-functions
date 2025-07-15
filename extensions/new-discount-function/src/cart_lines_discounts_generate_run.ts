import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
  CartInput,
  CartLinesDiscountsGenerateRunResult,
} from "../generated/api";
import { ConditionResult } from "../types/rules";
import { rulesSet } from "../utils/rules";
import { useChecker } from "../utils/useChacker";

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

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  } 

  if (hasOrderDiscountClass || hasProductDiscountClass) {

    // const cartItems = cartData?.payload?.input?.cart;
    // const rules = cartData?.payload?.input?.discount?.metafield?.jsonValue;
    const {productCandidates, orderCandidates} = useChecker(input?.cart, input?.discount?.metafield?.jsonValue)

    console.log("productCandidates", JSON.stringify(productCandidates, null, 2))
    console.log("orderCandidates", JSON.stringify(orderCandidates, null, 2))


    if(productCandidates.length && hasProductDiscountClass){
      operations.push({
        productDiscountsAdd: {
          candidates: productCandidates,
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      });
    }

    if (orderCandidates.length && hasOrderDiscountClass) {
      operations.push({ 
        orderDiscountsAdd: {
          candidates: orderCandidates,
          selectionStrategy: OrderDiscountSelectionStrategy.First,
        },
      });
    }
  }

  return {
    operations,
  };


  // let chackedRules: ConditionResult[] = [];
  // if (input?.discount?.metafield?.jsonValue) {
  //   chackedRules = rulesSet(input, input?.discount?.metafield?.jsonValue);
  // }

  // const isAppliedDiscount = chackedRules?.some(
  //   (item) => item.subCondition === true
  // );
  // if ((hasOrderDiscountClass || hasProductDiscountClass) && chackedRules?.length) {
  //   const orderCandidates: any[] = [];
  //   const productCandidates: any[] = [];

  //   chackedRules.forEach((rule, ind) => {
  //     if (!rule.subCondition) return;

  //     const discountValue =
  //       rule.actionType === "fixed"
  //         ? { fixedAmount: { amount: parseFloat(rule.actionValue) } }
  //         : { percentage: { value: parseFloat(rule.actionValue) } };

  //     if (hasOrderDiscountClass) {
  //       orderCandidates.push({
  //         message: `Check Condition - ${ind}`,
  //         targets: [
  //           {
  //             orderSubtotal: {
  //               excludedCartLineIds: [],
  //             },
  //           },
  //         ],
  //         value: discountValue,
  //       });
  //     }

  //     if (hasProductDiscountClass) {
  //       const targets = input.cart.lines.map((item) => ({
  //         cartLine: { id: item.id },
  //       }));

  //       productCandidates.push({
  //         message: `Check Product Condition - ${ind}`,
  //         targets,
  //         value: discountValue,
  //       });
  //     }
  //   });

  //   if (orderCandidates.length) {
  //     operations.push({
  //       orderDiscountsAdd: {
  //         candidates: orderCandidates,
  //         selectionStrategy: OrderDiscountSelectionStrategy.First,
  //       },
  //     });
  //   }

  //   if (productCandidates.length) {
  //     operations.push({
  //       productDiscountsAdd: {
  //         candidates: productCandidates,
  //         selectionStrategy: ProductDiscountSelectionStrategy.First,
  //       },
  //     });
  //   }
  // }

  // console.log("chackedRules?.length < 0 && input?.discount?.metafield?.jsonValue?.conditions === undefined", chackedRules?.length < 0 && input?.discount?.metafield?.jsonValue?.conditions === undefined)
  // console.log("chackedRules", chackedRules)
  // console.log("chackedRules length", chackedRules?.length)
  // console.log("chackedinput?.discount?.metafield?.jsonValueRules", JSON.stringify(input?.discount?.metafield?.jsonValue, null, 2))

  
  // if(!(chackedRules?.length > 0) && input?.discount?.metafield?.jsonValue?.discountType === 'automatic'){
  //   const orderCandidates: any[] = [];
  //   const productCandidates: any[] = [];

  //   let discountValue = {}
  //   if(input?.discount?.metafield?.jsonValue?.type){
  //      discountValue = input?.discount?.metafield?.jsonValue?.type === 'fixed'
  //         ? { fixedAmount: { amount: input?.discount?.metafield?.jsonValue?.amount } }
  //         : { percentage: { value: input?.discount?.metafield?.jsonValue?.amount } };
  //   }
    
  //   if (hasOrderDiscountClass) {
  //     orderCandidates.push({
  //       message: `Automatic Discount`,
  //       targets: [
  //         {
  //           orderSubtotal: {
  //             excludedCartLineIds: [],
  //           },
  //         },
  //       ],
  //       value: discountValue,
  //     });
  //   }

  //   if (hasProductDiscountClass) {
  //     const targets = input.cart.lines.map((item) => ({
  //       cartLine: { id: item.id },
  //     }));

  //     productCandidates.push({
  //       message: `Automatic Discount`,
  //       targets,
  //       value: discountValue,
  //     });
  //   }
      

  //   if (orderCandidates.length) {
  //     operations.push({ 
  //       orderDiscountsAdd: {
  //         candidates: orderCandidates,
  //         selectionStrategy: OrderDiscountSelectionStrategy.First,
  //       },
  //     });
  //   }


  //   console.log("productCandidates", JSON.stringify(productCandidates))

  //   if (productCandidates.length) {
  //     operations.push({
  //       productDiscountsAdd: {
  //         candidates: productCandidates,
  //         selectionStrategy: ProductDiscountSelectionStrategy.All,
  //       },
  //     });
  //   }
  // }
}
