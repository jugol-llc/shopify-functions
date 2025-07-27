## 🔁 Function 2 – product, order and shipping discount

**Date:** 06-Jul-2025

```
Extension path:
shopify-app/discounter/extensions/new-discount-function
```

**Description:**
Implements a discount function that applies conditional discounts based on `Line item`, `order sub-total`, and `shipping cost`. Supports combining multiple discount types within a single rule set.

## Discount Graphql Query for the Order, Product and Shipping

```Graphql
query CartInput($includedProductTags: [String!]) {
  cart {
    lines {
      id
      quantity
      merchandise{
        ...on ProductVariant{
          id
          product{
            id
            includedProductTags: hasAnyTag(tags: $includedProductTags)
          }
        }
      }
      cost {
        subtotalAmount {
          amount
        }
      }
    }
    cost{
      subtotalAmount{
        amount
      }
    }
  }
  discount{
    discountClasses
    metafield(namespace: "$app:FUNCTIONS", key: "function-meta-data") {
      jsonValue
    }
  }
}

```

## Function generated Log

```JSON
{
  "shopId": 76326535202,
  "apiClientId": 264595898369,
  "payload": {
    "export": "cart-lines-discounts-generate-run",
    "input": {
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/0",
            "quantity": 3,
            "merchandise": {
              "id": "gid://shopify/ProductVariant/43229298163746",
              "product": {
                "id": "gid://shopify/Product/7840387498018",
                "includedProductTags": false
              }
            },
            "cost": {
              "subtotalAmount": {
                "amount": "3075.0"
              }
            }
          }
        ],
        "cost": {
          "subtotalAmount": {
            "amount": "3075.0"
          }
        }
      },
      "discount": {
        "discountClasses": [
          "PRODUCT"
        ],
        "metafield": {
          "jsonValue": {
            "discountClasses": [
              "PRODUCT"
            ],
            "conditionType": "multiple",
            "conditions": [
              {
                "subConditions": [
                  {
                    "parameter": null,
                    "operator": null,
                    "value": null
                  }
                ],
                "actionType": "buy_x_get_y",
                "actionValue": {
                  "buyProducts": [
                    "gid://shopify/ProductVariant/43229298163746"
                  ],
                  "getProducts": [
                    "gid://shopify/ProductVariant/43227596488738"
                  ]
                }
              }
            ],
            "strategy": "first"
          }
        }
      }
    },
    "inputBytes": 585,
    "output": {
      "operations": []
    },
    "outputBytes": 13,
    "logs": [
      "productCandidates []",
      "orderCandidates []"
    ],
    "functionId": "07e83b68-dd35-4dd7-9415-a68ea1fde67f",
    "fuelConsumed": 693971,
    "inputQueryVariablesMetafieldValue": null,
    "inputQueryVariablesMetafieldNamespace": "$app:FUNCTIONS",
    "inputQueryVariablesMetafieldKey": "function-configuration"
  },
  "logType": "function_run",
  "status": "success",
  "source": "new-discount-function",
  "sourceNamespace": "extensions",
  "logTimestamp": "2025-07-27T06:30:44.491955Z",
  "localTime": "2025-07-27 12:30:44",
  "storeName": "jk-llc-store.myshopify.com"
}
```



## Function Toml Metafield Input

```toml
## Metafield Input
[extensions.input.variables]
  namespace = "$app:FUNCTIONS"
  key = "function-configuration"
```

## Delivery Options Discounts

### Rules

```json
IF
  amount > 0.0 && discountClasses.includes('SHIPPING')
  THEN APPLY SHIPPING DISCOUNT THIS DELIVERY GROUP
ELSE
  DOSN'T APPLY THE DISCOUNT
```

### Input (STDIN)

```json
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
    "discountClasses": ["PRODUCT", "ORDER", "SHIPPING"]
  }
}
```

### Output (STDOUT)

```JSON
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

```json
IF
  discountClasses.includes('PRODUCT')
  THEN APPLY SHIPPING DISCOUNT MAX AMOUNTED LINEITEM AND ORDER SUB TOTAL
ELSE
  DOSN'T APPLY THE DISCOUNT
```

### Input (STDIN)

```json
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
    "discountClasses": ["PRODUCT", "ORDER", "SHIPPING"]
  }
}
```

### Output (STDOUT)

```JSON
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

## Conditional Multiple Discount

### Input (STDIN)

```json
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/0",
        "quantity": 3,
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43227596488738",
          "product": {
            "includedProudcts": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "3900.0"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/1",
        "quantity": 3,
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43229297967138",
          "product": {
            "includedProudcts": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "74.85"
          }
        }
      }
    ],
    "cost": {
      "subtotalAmount": {
        "amount": "3974.85"
      }
    }
  },
  "discount": {
    "discountClasses": ["PRODUCT", "ORDER", "SHIPPING"],
    "metafield": {
      "jsonValue": {
        "discountClasses": ["PRODUCT", "ORDER", "SHIPPING"],
        "conditionType": "multiple",
        "conditions": [
          {
            "subConditions": [
              {
                "parameter": "total_line_items",
                "operator": ">",
                "value": "5"
              }
            ],
            "actionType": "subtotal_percentage_off",
            "actionValue": "50"
          },
          {
            "subConditions": [
              {
                "parameter": "subtotal_price",
                "operator": ">",
                "value": "1000"
              }
            ],
            "actionType": "line_percentage_off",
            "actionValue": "50"
          }
        ],
        "strategy": "all"
      }
    }
  }
}
```

### Output (STDOUT)

```JSON
{
  "operations": [
    {
      "productDiscountsAdd": {
        "candidates": [
          {
            "message": "Product Discount Off - 50 %",
            "targets": [
              {
                "cartLine": {
                  "id": "gid://shopify/CartLine/0"
                }
              },
              {
                "cartLine": {
                  "id": "gid://shopify/CartLine/1"
                }
              }
            ],
            "value": {
              "percentage": {
                "value": 50
              }
            }
          }
        ],
        "selectionStrategy": "ALL"
      }
    },
    {
      "orderDiscountsAdd": {
        "candidates": [
          {
            "message": "Order Discount Off - 50 %",
            "targets": [
              {
                "orderSubtotal": {
                  "excludedCartLineIds": []
                }
              }
            ],
            "value": {
              "percentage": {
                "value": 50
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




## buyX getX Code Discounts

### Input (STDIN)

```json
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/0",
        "quantity": 3,
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43227596488738",
          "product": {
            "id": "gid://shopify/Product/7839957286946",
            "includedProductTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "3900.0"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/1",
        "quantity": 3,
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43229297967138",
          "product": {
            "id": "gid://shopify/Product/7840387399714",
            "includedProductTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "74.85"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/2",
        "quantity": 1,
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43229298163746",
          "product": {
            "id": "gid://shopify/Product/7840387498018",
            "includedProductTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "1025.0"
          }
        }
      }
    ],
    "cost": {
      "subtotalAmount": {
        "amount": "4999.85"
      }
    }
  },
  "discount": {
    "discountClasses": ["PRODUCT"],
    "metafield": {
      "jsonValue": {
        "discountClasses": ["PRODUCT"],
        "conditionType": "multiple",
        "conditions": [
          {
            "subConditions": [
              {
                "parameter": null,
                "operator": null,
                "value": null
              }
            ],
            "actionType": "buy_x_get_y",
            "actionValue": {
              "buyProducts": ["gid://shopify/ProductVariant/43229298163746"],
              "getProducts": ["gid://shopify/ProductVariant/43227596488738"]
            }
          }
        ],
        "strategy": "first"
      }
    }
  }
}
```

### Output (STDOUT)

```JSON
{
  "operations": [
    {
      "productDiscountsAdd": {
        "candidates": [
          {
            "message": "BuyX GetX Free",
            "targets": [
              {
                "cartLine": {
                  "id": "gid://shopify/CartLine/0"
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
        "selectionStrategy": "ALL"
      }
    }
  ]
}
```
