// const { expect, it } = require("@jest/globals");
const loginUser = require("../public/js/login");

describe("Login", () => {
    describe("Initialization", () => {
        it("should let you log in", function () {
            const login = new loginUser("fake@gmail.com", "password");

            expect(login.emailInput).toEqual("fake@gmail.com");
            expect(login.passwordInput).toEqual("password");
        });

        it("should throw an error if not provided an email", () => {
            const cb = () => new loginUser ("fake@gmail.com");
            const err = new Error ("Expected parameter 'name' to be a non-empty string");

            expect(cb).toThrowError(err);
        });

        it("should throw an error if not provided a password", () => {
            const cb = () => new loginUser ("password");
            const err = new Error ("Expected parameter 'name' to be a non-empty string");

            expect(cb).toThrowError(err);
        });
    });
});