// eslint-disable-next-line no-restricted-imports -- Test configuration overrides
import { TextEncoder, TextDecoder } from "util";

// jsdom does not bundle TextEncoder out of the box despite all browsers doing so.
// https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
Object.assign(global, { TextDecoder, TextEncoder });
