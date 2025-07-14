
interface CartLine {
    id: string;
    quantity: number;
}

interface CartCost {
    subtotalAmount: {
        amount: string;
    };
}

interface Cart {
    lines: CartLine[];
    cost: CartCost;
    deliveryGroups: DeliveryGroup[];
}

interface DeliveryGroup {
    id: string;
}

interface DiscountCondition {
    parameter: string;
    operator: string;
    value: string | number;
}

interface Rule {
    subConditions?: DiscountCondition[];
    actionType: string;
    actionValue: string;
    excludeProducts?: string[];
}

interface DiscountMetafield {
    jsonValue?: {
        conditions?: Rule[];
    };
}

interface CartPayload {
    input: {
        cart: Cart;
        discount?: {
            metafield?: DiscountMetafield;
        };
    };
}

interface CartData {
    payload: CartPayload;
}