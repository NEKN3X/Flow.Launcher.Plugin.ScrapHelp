import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
  resolver: "ts-jest-resolver",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
