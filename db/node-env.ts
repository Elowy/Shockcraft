// Server-only replacement for Workers bindings in the Node standalone build.
export const env={...process.env,SHOCKCRAFT_NODE_RUNTIME:'1'};
