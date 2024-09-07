// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
}
interface WasmModule {
  _generateKochCurve(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): number;
  _malloc(_0: number): number;
  _free(_0: number): void;
  __ZN6__asan9FakeStack17AddrIsInFakeStackEm(_0: number, _1: number): number;
  __ZN6__asan9FakeStack8AllocateEmmm(_0: number, _1: number, _2: number, _3: number): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
