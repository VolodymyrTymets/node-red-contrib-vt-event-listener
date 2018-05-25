"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Index_1 = require("./../src/Index");
var chai_1 = require("chai");
require("mocha");
describe("Index.ts", function () {
    it("should export default function", function () {
        chai_1.expect(Index_1.default).to.be.a("function");
    });
});
//# sourceMappingURL=Index.test.js.map