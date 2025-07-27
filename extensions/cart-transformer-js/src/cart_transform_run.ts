import type {
  CartInput,
  CartTransformRunResult,
} from "../generated/api";

const NO_CHANGES: CartTransformRunResult = {
  operations: [],
};

export function cartTransformRun(input: CartInput): CartTransformRunResult {
  return NO_CHANGES;
};