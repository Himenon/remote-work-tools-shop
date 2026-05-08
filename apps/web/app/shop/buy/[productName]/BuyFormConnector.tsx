"use client";

import { useRouter } from "next/navigation";
import { BuyForm, type BuyFormValues, type BuyFormProduct } from "@rwts/ui/form/BuyForm";
import { DEFAULT_COUNT, DEFAULT_WRAPPING, type BuyFormInput } from "@rwts/contract/form/BuyFormSchema";
import type { ProductSpec } from "@rwts/contract/client/product";

interface BuyFormConnectorProps {
  spec: ProductSpec;
}

const EMPTY_MESSAGE_LENGTH = 0;
const FIRST_SPEC_INDEX = 0;

const buildInitialSpecs = (product: BuyFormProduct): Record<string, string[]> => {
  const initial: Record<string, string[]> = {};
  for (const key of product.specSortKeys) {
    const category = product.categories[key];
    if (!category) {
      continue;
    }
    if (category.view === "indicator") {
      continue;
    }
    const first = category.specs[FIRST_SPEC_INDEX];
    initial[key] = first ? [first.name] : [];
  }
  return initial;
};

const toBuyFormProps = (spec: ProductSpec): { product: BuyFormProduct; defaultValues: BuyFormInput } => {
  const product: BuyFormProduct = {
    name: spec.name,
    price: spec.price,
    specSortKeys: spec.spec.meta.specSortKey,
    categories: Object.fromEntries(
      Object.entries(spec.spec.categories).map(([key, category]) => [
        key,
        {
          name: category.name,
          view: category.view,
          specs: category.specs.map(({ name, cost }) => ({ name, cost })),
        },
      ]),
    ),
  };
  const defaultValues: BuyFormInput = {
    specs: buildInitialSpecs(product),
    giftEnabled: false,
    wrapping: DEFAULT_WRAPPING,
    message: "",
    count: DEFAULT_COUNT,
  };
  return { product, defaultValues };
};

const buildFlatSpecs = (specs: Record<string, string[]>, giftEnabled: boolean, wrapping: string, message: string): Record<string, string> => {
  const flatSpecs: Record<string, string> = {};
  for (const [key, values] of Object.entries(specs)) {
    flatSpecs[key] = values.join(", ");
  }
  if (giftEnabled) {
    flatSpecs["gift_wrapping"] = wrapping;
    if (message.length > EMPTY_MESSAGE_LENGTH) {
      flatSpecs["gift_message"] = message;
    }
  }
  return flatSpecs;
};

export const BuyFormConnector: React.FC<BuyFormConnectorProps> = ({ spec }) => {
  const router = useRouter();

  const handleSubmit = async (values: BuyFormValues): Promise<void> => {
    const flatSpecs = buildFlatSpecs(values.specs, values.giftEnabled, values.wrapping, values.message);
    await fetch("/api/add/bag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: { productId: spec.productId, specs: flatSpecs },
        count: values.count,
      }),
    });
    router.push("/shop/bag");
  };

  return <BuyForm {...toBuyFormProps(spec)} onSubmit={handleSubmit} />;
};

BuyFormConnector.displayName = "BuyFormConnector";
