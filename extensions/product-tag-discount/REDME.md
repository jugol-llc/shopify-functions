

## 🔁 Function 1 – Product Tag-Based Discount
**Date:** 04-Jul-2025

**Description:**
Implemented a Shopify function that applies a discount to specific products based on their tags. If any product in the customer's cart contains one or more predefined tags such as `Discounted`, `Most Purchased`, etc., the function will apply a fixed discount amount to those tagged items.

### Rules
``` json
IF
 quantity > 3 && hasDiscount === true 
 THEN APPLY THE DISCOUNT
ELSE
  DOSN'T APPLY THE DISCOUNT

```


### Input (STDIN)
``` json

{
  "cart": {
    "lines": [
      {
        "quantity": 3,
        "merchandise": {
          "__typename": "ProductVariant",
          "product": {
            "hasDiscountTag": true
          }
        }
      },
      {
        "quantity": 5,
        "merchandise": {
          "__typename": "ProductVariant",
          "product": {
            "hasDiscountTag": true
          }
        }
      }
    ]
  }
}
```
###  Output (STDOUT)
``` JSON

{
  "discountApplicationStrategy": "FIRST",
  "discounts": [
    {
      "value": {
        "percentage": {
          "value": 20
        }
      },
      "targets": [
        {
          "orderSubtotal": {
            "excludedVariantIds": [
              "gid://shopify/ProductVariant/43227596488738"
            ]
          }
        }
      ]
    }
  ]
}
```

