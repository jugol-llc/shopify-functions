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
