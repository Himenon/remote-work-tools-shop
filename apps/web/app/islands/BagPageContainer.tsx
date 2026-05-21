import BagPage, { type BagPageProps } from "@rwts/ui/page/BagPage";

type BagPageContainerProps = Omit<BagPageProps, "onCountChange">;

const handleCountChange = async (productId: string, count: number): Promise<void> => {
  await fetch("/api/update/bag/count", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, count }),
  });
};

export default function BagPageContainer({ items, findProductName }: BagPageContainerProps): JSX.Element {
  const bagPageProps: BagPageProps = {
    items,
    findProductName,
    onCountChange: handleCountChange,
  };

  return <BagPage {...bagPageProps} />;
}
