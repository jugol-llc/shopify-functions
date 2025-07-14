function checkOperations(targetValue: any, operator: string, inputValue: any): boolean {
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

export function useChecker(cartItems: any = [], rules: any = [], cartDelivery: any = []) {

    // Final Output Arrays
    const orderCandidates: any[] = [];
    const productCandidates: any[] = [];
    const deliveryCandidates: any[] = [];

    rules?.conditions?.forEach((item: Rule) => {
        const {subConditions, ...refs} = item;
        const subConditionResult: Rule & { checks: boolean[] } = {
            ...refs,
            checks: []
        };

        subConditions?.forEach((singleCondition: DiscountCondition) => {
            const {parameter, operator, value} = singleCondition;

            if (parameter === 'total_line_items') {
                const totalQty = cartItems?.lines?.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0) ?? 0;
                const result = checkOperations(Number(totalQty), operator, Number(value));
                subConditionResult.checks.push(result);
            }

            if (parameter === 'subtotal_price') {
                const subtotal = Number(cartItems?.cost?.subtotalAmount?.amount ?? 0);
                const result = checkOperations(subtotal, operator, Number(value));
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

        if (subConditionResult?.checks?.every(Boolean) && ['subtotal_percentage_off', 'subtotal_fixed_off'].includes(subConditionResult?.actionType)) {
            const value =
                subConditionResult?.actionType === 'subtotal_fixed_off'
                    ? {fixedAmount: {amount: parseFloat(subConditionResult.actionValue)}}
                    : {percentage: {value: parseFloat(subConditionResult.actionValue)}};

            orderCandidates.push({
                message: `Order Discount Off - ${subConditionResult.actionValue} ${subConditionResult.actionType === 'subtotal_fixed_off' ? 'TK' : '%'}`,
                targets: [
                    {
                        orderSubtotal: {
                            excludedCartLineIds: subConditionResult.excludeProducts ?? [],
                        },
                    },
                ],
                value: value,
            });
        }

        if (subConditionResult?.checks?.every(Boolean) && ['line_percentage_off', 'line_fixed_off'].includes(subConditionResult?.actionType)) {
            if (subConditionResult?.lineItems?.length) {
                const targets = subConditionResult?.lineItems?.map((item) => ({
                    cartLine: {id: item.id},
                }));

                const value = subConditionResult?.actionType === 'line_fixed_off'
                    ? {fixedAmount: {amount: parseFloat(subConditionResult.actionValue)}}
                    : {percentage: {value: parseFloat(subConditionResult.actionValue)}};

                productCandidates.push({
                    message: `Product Discount Off - ${subConditionResult?.actionValue} ${subConditionResult?.actionType === 'line_fixed_off' ? 'TK' : '%'}`,
                    targets: targets,
                    value: value
                });
            }
        }


        if (cartDelivery?.length && subConditionResult?.checks?.every(Boolean) && ['shipping_percentage_off', 'shipping_fixed_off'].includes(subConditionResult?.actionType)) {
            const value =
                subConditionResult?.actionType === 'shipping_fixed_off'
                    ? {fixedAmount: {amount: parseFloat(subConditionResult.actionValue)}}
                    : {percentage: {value: parseFloat(subConditionResult.actionValue)}};

            const targets = cartDelivery?.map((item: { id: any; }) => ({
                deliveryGroup: {
                    id: item.id,
                },
            })) ?? [];

            deliveryCandidates.push({
                message: `Shipping Discount Off - ${subConditionResult.actionValue} ${subConditionResult.actionType === 'shipping_fixed_off' ? 'TK' : '%'}`,
                targets: targets,
                value: value,
            });
        }
    });

    return {orderCandidates, productCandidates, deliveryCandidates};

}
