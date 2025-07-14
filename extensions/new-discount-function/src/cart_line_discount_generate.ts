/**
 * cart_lines_discounts_generate_run.ts 
 * this is the main funcnolity before replase chaker.ts
 * this is working with the rules.ts 
 */

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


//   return {
//     operations,
//   };
// }
