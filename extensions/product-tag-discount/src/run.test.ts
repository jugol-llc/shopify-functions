import { describe, it, expect } from 'vitest';
import { run } from './index';
import { FunctionResult, DiscountApplicationStrategy } from '../generated/api';

describe('order discounts function', () => {
  it('returns no discounts without configuration', () => {
    const result = run({
      "cart": {
        "lines": [
          {
            "quantity": 4,
            "merchandise": {
              "__typename": "ProductVariant",
              "product": {
                "hasDiscountTag": true
              }
            }
          }
        ]
      }
    });


    console.log("result data", JSON.stringify(result))

  });
});