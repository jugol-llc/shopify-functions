

## 🔁 Function 2 – product, order and shipping discount 

**Date:** 06-Jul-2025

``` 
Extension path: 
shopify-app/discounter/extensions/new-discount-function 
```

**Description:**
Implements a discount function that applies conditional discounts based on `Line item`, `order sub-total`, and `shipping cost`. Supports combining multiple discount types within a single rule set.


## Delivery Options Discounts 
### Rules
``` json
IF
  amount > 0.0 && discountClasses.includes('SHIPPING')
  THEN APPLY SHIPPING DISCOUNT THIS DELIVERY GROUP
ELSE
  DOSN'T APPLY THE DISCOUNT
```
### Input (STDIN)
``` json
{
  "cart": {
    "deliveryGroups": [
      {
        "id": "gid://shopify/CartDeliveryGroup/0",
        "deliveryOptions": [
          {
            "cost": {
              "amount": "0.0"
            }
          }
        ]
      },
      {
        "id": "gid://shopify/CartDeliveryGroup/1",
        "deliveryOptions": [
          {
            "cost": {
              "amount": "5000.0"
            }
          }
        ]
      }
    ]
  },
  "discount": {
    "discountClasses": [
      "PRODUCT",
      "ORDER",
      "SHIPPING"
    ]
  }
}
```


###  Output (STDOUT)
``` JSON
{
  "operations": [
    {
      "deliveryDiscountsAdd": {
        "candidates": [
          {
            "message": "FREE DELIVERY",
            "targets": [
              {
                "deliveryGroup": {
                  "id": "gid://shopify/CartDeliveryGroup/1"
                }
              }
            ],
            "value": {
              "fixedAmount": {
                "amount": 1000
              }
            }
          }
        ],
        "selectionStrategy": "ALL"
      }
    }
  ]
}
```

## Cart Lines Discounts
### Rules
``` json
IF
  discountClasses.includes('PRODUCT')
  THEN APPLY SHIPPING DISCOUNT MAX AMOUNTED LINEITEM AND ORDER SUB TOTAL
ELSE
  DOSN'T APPLY THE DISCOUNT
```
### Input (STDIN)
``` json
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/0",
        "cost": {
          "subtotalAmount": {
            "amount": "24.95"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/1",
        "cost": {
          "subtotalAmount": {
            "amount": "1300.0"
          }
        }
      }
    ]
  },
  "discount": {
    "discountClasses": [
      "PRODUCT",
      "ORDER",
      "SHIPPING"
    ]
  }
}
```


###  Output (STDOUT)
``` JSON
{
  "operations": [
    {
      "orderDiscountsAdd": {
        "candidates": [
          {
            "message": "FLAT 100 OFF ORDER",
            "targets": [
              {
                "orderSubtotal": {
                  "excludedCartLineIds": []
                }
              }
            ],
            "value": {
              "fixedAmount": {
                "amount": 100
              }
            }
          }
        ],
        "selectionStrategy": "FIRST"
      }
    },
    {
      "productDiscountsAdd": {
        "candidates": [
          {
            "message": "FLAT 200 OFF PRODUCT",
            "targets": [
              {
                "cartLine": {
                  "id": "gid://shopify/CartLine/1"
                }
              }
            ],
            "value": {
              "percentage": {
                "value": 100
              }
            }
          }
        ],
        "selectionStrategy": "FIRST"
      }
    }
  ]
}
```
