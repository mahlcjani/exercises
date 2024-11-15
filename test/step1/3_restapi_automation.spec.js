
import { expect } from "chai"
import axios from "axios";

describe("REST API automation", function () {
    it("should fetch employees", async function () {
        const response = await axios.get("https://dummy.restapiexample.com/api/v1/employees", {
            headers: {
                "Cookie": "humans_21909=1"
            }
        });

        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal("success");
    });
});

