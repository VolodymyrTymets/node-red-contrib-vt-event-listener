import EventStream from "./../src/Index";
import { expect } from "chai";
import "mocha";

describe("Index.ts", () => {

    it("should export default function", () => {
        expect(EventStream).to.be.a("function");
    });

});
