## 🔁 Function 3 – cart transform function

**Date:** 27-Jul-2025

```
Extension path:
shopify-app/discounter/extensions/cart-transformer-js
```

**Description:**
Cart transformers function for using the remane product line item title, repless price or change the product lineitem image.

## Cart transformer Graphql Query

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

## Cart Transform Function generated Log

```JSON
{
  "shopId": 76326535202,
  "apiClientId": 264595898369,
  "payload": {
    "export": "cart-transform-run",
    "input": {
      "cart": {
        "lines": [
          {
            "id": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
            "quantity": 3,
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "id": "gid://shopify/Product/7840387498018",
                "title": "The Collection Snowboard: Oxygen"
              }
            }
          }
        ]
      }
    },
    "inputBytes": 217,
    "output": {
      "operations": [
        {
          "lineUpdate": {
            "cartLineId": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
            "title": "The Collection Snowboard"
          }
        }
      ]
    },
    "outputBytes": 129,
    "logs": [],
    "functionId": "e02dbdf5-b4d7-47ae-9270-6b56964d8517",
    "fuelConsumed": 186754
  },
  "logType": "function_run",
  "status": "success",
  "source": "cart-transformer-js",
  "sourceNamespace": "extensions",
  "logTimestamp": "2025-07-27T06:30:44.422143Z",
  "localTime": "2025-07-27 12:30:44",
  "storeName": "jk-llc-store.myshopify.com"
}
```

## Rename or change the line item product title

## Input (STDIN)

```JSON
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
        "quantity": 3,
        "merchandise": {
          "__typename": "ProductVariant",
          "product": {
            "id": "gid://shopify/Product/7840387498018",
            "title": "The Collection Snowboard: Oxygen"
          }
        }
      }
    ]
  }
}
```

## Output (STDOUT)

```JSON
{
  "operations": [
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
        "title": "The Collection Snowboard"
      }
    }
  ]
}
```



## Input (STDIN)

```JSON
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
        "quantity": 3,
        "merchandise": {
          "__typename": "ProductVariant",
          "product": {
            "id": "gid://shopify/Product/7840387498018",
            "title": "The Collection Snowboard: Oxygen"
          }
        }
      }
    ]
  }
}
```

## Output (STDOUT)

```JSON
{
  "operations": [
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/beb49de4-c473-49dc-8861-80163529c60e",
        "title": "The Collection Snowboard"
      }
    }
  ]
}
```

### Cart LinesMerge and LineUpdate Combine Discount with Cart Transform.

## Input (STDIN)

```JSON
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/ff7bb8a2-08ce-4351-a579-36f57d1c2dbc",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43229297967138",
          "product": {
            "id": "gid://shopify/Product/7840387399714",
            "title": "Selling Plans Ski Wax",
            "productTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "24.95"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/9013a94a-1ecf-4958-a9d4-cc1e1f9ceb55",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43227596488738",
          "product": {
            "id": "gid://shopify/Product/7839957286946",
            "title": "Apple iPhone 16 Pro Max",
            "productTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "1300.0"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/daa8b2fb-a951-4183-82f3-5fad9951fd83",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43229298163746",
          "product": {
            "id": "gid://shopify/Product/7840387498018",
            "title": "The Collection Snowboard: Oxygen",
            "productTags": true
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "1025.0"
          }
        }
      }
    ]
  }
}
```

## Output (STDOUT)

```JSON
{
  "operations": [
    {
      "linesMerge": {
        "cartLines": [
          {
            "cartLineId": "gid://shopify/CartLine/daa8b2fb-a951-4183-82f3-5fad9951fd83",
            "quantity": 1
          }
        ],
        "title": "Custom Bundle Builder Item",
        "parentVariantId": "gid://shopify/ProductVariant/44003219144738",
        "price": {
          "percentageDecrease": {
            "value": 50
          }
        }
      }
    },
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/ff7bb8a2-08ce-4351-a579-36f57d1c2dbc",
        "price": {
          "adjustment": {
            "fixedPricePerUnit": {
              "amount": 1000
            }
          }
        },
        "title": "cart line update"
      }
    },
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/9013a94a-1ecf-4958-a9d4-cc1e1f9ceb55",
        "price": {
          "adjustment": {
            "fixedPricePerUnit": {
              "amount": 1000
            }
          }
        },
        "title": "cart line update"
      }
    }
  ]
}
```

### Cart LinesMerge, Line Expand and LineUpdate Combine Discount with Cart Transform.

## Input (STDIN)

```JSON
{
  "cart": {
    "lines": [
      {
        "id": "gid://shopify/CartLine/ff7bb8a2-08ce-4351-a579-36f57d1c2dbc",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43229297967138",
          "product": {
            "id": "gid://shopify/Product/7840387399714",
            "title": "Selling Plans Ski Wax",
            "productTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "24.95"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/9013a94a-1ecf-4958-a9d4-cc1e1f9ceb55",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43227596488738",
          "product": {
            "id": "gid://shopify/Product/7839957286946",
            "title": "Apple iPhone 16 Pro Max",
            "productTags": false
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "1300.0"
          }
        }
      },
      {
        "id": "gid://shopify/CartLine/daa8b2fb-a951-4183-82f3-5fad9951fd83",
        "quantity": 1,
        "merchandise": {
          "__typename": "ProductVariant",
          "id": "gid://shopify/ProductVariant/43229298163746",
          "product": {
            "id": "gid://shopify/Product/7840387498018",
            "title": "The Collection Snowboard: Oxygen",
            "productTags": true
          }
        },
        "cost": {
          "subtotalAmount": {
            "amount": "1025.0"
          }
        }
      }
    ]
  }
}
```

```JSON
{
  "operations": [
    {
      "linesMerge": {
        "cartLines": [
          {
            "cartLineId": "gid://shopify/CartLine/daa8b2fb-a951-4183-82f3-5fad9951fd83",
            "quantity": 1
          }
        ],
        "title": "Custom Bundle Builder Item",
        "parentVariantId": "gid://shopify/ProductVariant/44003219144738",
        "price": {
          "percentageDecrease": {
            "value": 50
          }
        }
      }
    },
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/ff7bb8a2-08ce-4351-a579-36f57d1c2dbc",
        "price": {
          "adjustment": {
            "fixedPricePerUnit": {
              "amount": 1000
            }
          }
        },
        "title": "cart line update"
      }
    },
    {
      "lineUpdate": {
        "cartLineId": "gid://shopify/CartLine/9013a94a-1ecf-4958-a9d4-cc1e1f9ceb55",
        "price": {
          "adjustment": {
            "fixedPricePerUnit": {
              "amount": 1000
            }
          }
        },
        "title": "cart line update"
      }
    },
    {
      "lineExpand": {
        "cartLineId": "gid://shopify/CartLine/ff7bb8a2-08ce-4351-a579-36f57d1c2dbc",
        "expandedCartItems": [
          {
            "merchandiseId": "gid://shopify/ProductVariant/43229297967138",
            "quantity": 1
          }
        ],
        "price": {
          "percentageDecrease": {
            "value": 50
          }
        },
        "title": "Expand Line Item Bundle"
      }
    }
  ]
}
```
