import { notFound } from "next/navigation";
import { COMPONENTS_DATA } from "@/data/componentsData";
import ComponentDetailClient from "@/components/components-page/ComponentDetailClient";

export async function generateStaticParams() {
  return COMPONENTS_DATA.map((comp) => ({
    id: comp.id,
  }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = COMPONENTS_DATA.find((c) => c.id === id);

  if (!component) {
    notFound();
  }

  return <ComponentDetailClient component={component} />;
}
