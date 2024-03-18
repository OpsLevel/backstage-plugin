import ResizeObserver from "resize-observer-polyfill";
// vue-apexcharts uses this
// Parents of the Graph components blow up if we don't mock out those pieces.
global.ResizeObserver = ResizeObserver;

Object.defineProperty(global.SVGElement.prototype, "getScreenCTM", {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(global.SVGElement.prototype, "createSVGMatrix", {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 10,
    y: 10,
    inverse: () => {},
    multiply: () => {},
  }),
});
