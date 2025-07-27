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
