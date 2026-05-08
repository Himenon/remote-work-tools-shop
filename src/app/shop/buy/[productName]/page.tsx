import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findProductSpec } from "../../../_store/product";
import { BuyFormConnector } from "./BuyFormConnector";

interface PageProps {
  params: Promise<{ productName: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { productName } = await params;
  const spec = findProductSpec(productName);
  if (!spec) {
    return {};
  }
  return { title: `${spec.name} - RemoteWork Tools Shop` };
};

export default async function BuyPage({ params }: PageProps): Promise<JSX.Element> {
  const { productName } = await params;
  const spec = findProductSpec(productName);

  if (!spec) {
    notFound();
  }

  return <BuyFormConnector spec={spec} />;
}
