import type { ComponentType } from "react";

/**
 * Registry Component Map
 * Safe dictionary for statically known components.
 * Live components are dynamically rendered via Sandboxed Runner to prevent
 * missing file build errors when components are deleted or created.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registryComponentMap: Record<string, ComponentType<any>> = {};

export default registryComponentMap;
