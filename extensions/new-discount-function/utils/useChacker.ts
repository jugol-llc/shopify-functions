function checkOperations(
  targetValue: any,
  operator: string,
  inputValue: any
): boolean {
  const isArray = Array.isArray(inputValue);
  const targetIsArray = Array.isArray(targetValue);

  switch (operator) {
    case "contains":
      if (isArray && targetIsArray) {
        return targetValue.some((val: any) => inputValue.includes(val));
      }
      return inputValue.includes(targetValue);

    case "contains_all":
      if (isArray && targetIsArray) {
        return targetValue.every((val: any) => inputValue.includes(val));
      }
      return false;

    case "!contains":
    case "doesnt_contain":
    case "not_contains":
      if (isArray && targetIsArray) {
        return targetValue.every((val: any) => !inputValue.includes(val));
      }
      return !inputValue.includes(targetValue);

    case ">":
      return targetValue > inputValue;
    case "<":
      return targetValue < inputValue;
    case ">=":
      return targetValue >= inputValue;
    case "<=":
      return targetValue <= inputValue;
    case "==":
      return targetValue === inputValue;
    case "!=":
      return targetValue !== inputValue;
    default:
      return false;
  }
}

// const cartItems = cartData?.payload?.input?.cart;
// const rules = cartData?.payload?.input?.discount?.metafield?.jsonValue;
// const cartDelivery = cartItems?.deliveryGroups;

export function useChecker(
  cartItems: any = [],
  rules: any = [],
  cartDelivery: any = []
) {
  // Final Output Arrays
  const orderCandidates: any[] = [];
  const productCandidates: any[] = [];
  const deliveryCandidates: any[] = [];
  const checkConditionForSingle = [];

let buyXGetYData = {};
rules?.conditions?.forEach((item) => {
    const {subConditions, ...refs} = item;
    const subConditionResult = {
        ...refs,
        checks: []
    };

    subConditions?.forEach((singleCondition) => {
        const {parameter, operator, value} = singleCondition;

        if (parameter === 'total_line_items') {
            const totalQty = cartItems?.lines?.reduce((sum, item) => sum + item.quantity, 0);
            const result = checkOperations(Number(totalQty), operator, Number(value));
            if (result && refs.actionType === 'line_fixed_off') {
                subConditionResult.lineItems = cartItems?.lines?.filter(item => item?.id)
            }
            subConditionResult.checks.push(result);
        }

        if (parameter === 'subtotal_price') {
            const subtotal = cartItems?.cost?.subtotalAmount?.amount;

            const result = checkOperations(Number(subtotal), operator, Number(value));
            subConditionResult.checks.push(result);
        }

        if (parameter === 'line_item_quantity') {
            subConditionResult.lineItems = cartItems?.lines?.filter(item => {
                    if (checkOperations(Number(item.quantity), operator, Number(value))) {
                        return item?.id;
                    }
                }
            );
        }
    });

    if (rules.conditionType === 'multiple') {
        checkConditionForSingle.push(subConditionResult)
    }
    if (rules.conditionType === 'single') {
        checkConditionForSingle.push(subConditionResult.checks)
    }
    if(refs.actionType === 'buy_x_get_y'){
        buyXGetYData = refs
    }
});

const givenDiscountByOperation = (actionType, actionValue, excludeProducts) => {
    if (['subtotal_percentage_off', 'subtotal_fixed_off'].includes(actionType)) {
        const value = actionType === 'subtotal_fixed_off'
            ? {fixedAmount: {amount: parseFloat(actionValue)}}
            : {percentage: {value: parseFloat(actionValue)}};
        orderCandidates.push({
            message: `Order Discount Off - ${actionValue} ${actionType === 'subtotal_fixed_off' ? 'TK' : '%'}`,
            targets: [
                {
                    orderSubtotal: {
                        excludedCartLineIds: excludeProducts ?? [],
                    },
                },
            ],
            value: value
        });
    }

    if (['line_percentage_off', 'line_fixed_off'].includes(actionType)) {
        if (cartItems?.lines?.length) {
            const targets = cartItems?.lines?.map((item) => ({
                cartLine: {id: item.id},
            }));

            const value = actionType === 'line_fixed_off'
                ? {fixedAmount: {amount: parseFloat(actionValue)}}
                : {percentage: {value: parseFloat(actionValue)}};

            productCandidates.push({
                message: `Product Discount Off - ${actionValue} ${actionType === 'line_fixed_off' ? 'TK' : '%'}`,
                targets: targets,
                value: value
            });
        }
    }

    if (['shipping_percentage_off', 'shipping_fixed_off'].includes(actionType)) {
        const value = actionType === 'shipping_fixed_off'
            ? {fixedAmount: {amount: parseFloat(actionValue)}}
            : {percentage: {value: parseFloat(actionValue)}};

        const targets = cartDelivery?.map((item) => {
            return {
                deliveryGroup: {
                    id: item?.id,
                }
            }
        })

        deliveryCandidates.push({
            message: `Shipping Discount Off - ${actionValue} ${actionType === 'shipping_fixed_off' ? 'TK' : '%'}`,
            targets: targets,
            value: value
        });
    }
}

if (rules.conditionType === "no-rules" && rules.discountClasses.length) {
    if (rules.discountClasses.includes('PRODUCT') && rules?.discountClassData['PRODUCT']) {
        const {discountAmount, discountType} = rules?.discountClassData['PRODUCT'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        const targets = cartItems?.lines?.map((item) => ({
            cartLine: {id: item.id},
        }));

        productCandidates.push({
            message: `Product Discount Off - ${discountAmount} ${discountType === 'fixed' ? 'TK' : '%'}`,
            targets: targets,
            value: value
        });
    }

    if (rules.discountClasses.includes('ORDER') && rules?.discountClassData['ORDER']) {
        const {discountAmount, discountType} = rules?.discountClassData['ORDER'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        orderCandidates.push({
            message: `Order Discount Off - ${discountAmount} ${discountType === 'fixed' ? 'TK' : '%'}`,
            targets: [
                {
                    orderSubtotal: {
                        excludedCartLineIds: [],
                    },
                },
            ],
            value: value
        });
    }

    if (rules.discountClasses.includes('SHIPPING') && rules?.discountClassData['ORDER']) {
        const {discountAmount, discountType} = rules?.discountClassData['ORDER'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        const targets = cartDelivery?.map((item) => {
            return {
                deliveryGroup: {
                    id: item?.id,
                }
            }
        })

        deliveryCandidates.push({
            message: `Shipping Discount Off - ${discountAmount} ${discountType === 'fixed' ? 'TK' : '%'}`,
            targets: targets,
            value: value
        });
    }
}

if (rules?.conditionType === "single" && rules?.discountClasses?.length) {
    if (rules?.discountClasses?.includes("PRODUCT") && rules?.discountClassData['PRODUCT']) {
        const {discountAmount, discountType} = rules?.discountClassData['PRODUCT'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        const targets = cartItems?.lines?.map((item) => ({
            cartLine: {id: item?.id},
        }));

        productCandidates.push({
            message: `Product Discount Off - ${discountAmount} ${
                discountType === "fixed" ? "TK" : "%"
            }`,
            targets: targets,
            value: value,
        });
    }
    if (rules?.discountClasses?.includes("ORDER") && rules?.discountClassData['ORDER']) {
        const {discountAmount, discountType} = rules?.discountClassData['ORDER'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        orderCandidates.push({
            message: `Order Discount Off - ${discountAmount} ${
                discountType === "fixed" ? "TK" : "%"
            }`,
            targets: [
                {
                    orderSubtotal: {
                        excludedCartLineIds: [],
                    },
                },
            ],
            value: value,
        });
    }

    if (rules?.discountClasses?.includes("SHIPPING") && rules?.discountClassData['SHIPPING']) {
        const {discountAmount, discountType} = rules?.discountClassData['SHIPPING'] ?? {};

        const value = discountType === 'fixed'
            ? {fixedAmount: {amount: parseFloat(discountAmount)}}
            : {percentage: {value: parseFloat(discountAmount)}};

        const targets = cartDelivery?.map((item) => {
            return {
                deliveryGroup: {
                    id: item?.id,
                },
            };
        });

        deliveryCandidates.push({
            message: `Shipping Discount Off - ${discountAmount} ${
                discountType === "fixed" ? "TK" : "%"
            }`,
            targets: targets,
            value: value,
        });
    }
}

if (rules?.conditionType === 'multiple') {
    const allChecksTrue = checkConditionForSingle.filter(rule =>
        rule.checks.length > 0 && rule.checks.every(check => check === true)
    );

    if (rules?.strategy === 'first') {
        givenDiscountByOperation(allChecksTrue[0]?.actionType, allChecksTrue[0]?.actionValue);
    }

    if(rules?.strategy === 'all'){
        allChecksTrue?.forEach(({actionType, actionValue}) => givenDiscountByOperation(actionType, actionValue))
    }

    if(rules?.strategy === 'maximum'){
        const maximumCheck = allChecksTrue?.map(function (item){
            let percentageAmount = item?.actionValue
            if(['subtotal_percentage_off', 'line_percentage_off', 'shipping_percentage_off']?.includes(item?.actionType)){
                percentageAmount = ((cartItems?.cost?.subtotalAmount?.amount * item?.actionValue) ?? 0) / 100
            }
            return {
                ...item,
                discountedValue: parseFloat(percentageAmount)
            }
        });

        const maximumGivenDiscount = maximumCheck?.reduce((max, item) => item.discountedValue > max.discountedValue ? item : max)
        givenDiscountByOperation(maximumGivenDiscount?.actionType, maximumGivenDiscount?.actionValue);
    }

    if(buyXGetYData && buyXGetYData?.actionType === 'buy_x_get_y'){
        const variantIds = cartItems?.lines?.map((item) => item?.merchandise?.id)
        const allMatch = buyXGetYData?.actionValue?.buyProducts?.every(id =>
            variantIds?.includes(id)
        );

        if(allMatch){
            const getProductIds = buyXGetYData?.actionValue?.getProducts?.filter(id => {
                if (variantIds?.includes(id)) {
                    return id;
                }
            });

            if(getProductIds.length){
                const value = {percentage: {value: 100}};


                const cartLines = getProductIds?.map((item) =>{
                    return cartItems?.lines?.filter((line) =>{
                        if(line?.merchandise?.id === item){
                            return line.id
                        }
                    })[0]?.id
                })

                const targets = cartLines?.map((item) => ({
                    cartLine: {id: item},
                }));

                productCandidates.push({
                    message: `BuyX GetX Free`,
                    targets: targets,
                    value: value,
                });
            }
        }
    }
}


  return { orderCandidates, productCandidates, deliveryCandidates };
}
