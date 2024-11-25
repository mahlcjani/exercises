
import { reverseArray } from "../../src/step1/arrays.js"
import { assert } from "chai"

describe("test reverseArray()", function () {
    it('should reverse ["a", "bb", "af", "asd"]', function () {
        assert.deepEqual(
            reverseArray(["asd", "af", "bb", "a"]),
            ["a", "bb", "af", "asd"]
        );
    });

    it('should reverse empty array', function () {
        assert.deepEqual(reverseArray([]), []);
    });

    it('should reverse one element array', function () {
        assert.deepEqual(reverseArray(["item"]), ["item"]);
    });

    it('should reverse odd-element array', function () {
        assert.deepEqual(
            reverseArray(["1", "2", "3", "4", "5", "6", "7"]),
            ["7", "6", "5", "4", "3", "2", "1"]
        );





    });
});

