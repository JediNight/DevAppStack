var expect = require("chai").expect;
const app = require("../server");
const request = require("request");

describe("Server runs", function() {
	it("status", async () => {
		request("http://localhost:5000/", function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			process.exit(1);
		});
	});
});
