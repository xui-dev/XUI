import { notFound } from "next/navigation";
import { getAllComponents, getRegistryComponent } from "@/lib/registry";
import ComponentDetailClient from "@/components/components-page/ComponentDetailClient";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  const components = await getAllComponents();
  return components.map((comp) => ({
    id: comp.id,
  }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = await getRegistryComponent(id);

  if (!component) {
    notFound();
  }

  return <ComponentDetailClient component={component} />;
}
