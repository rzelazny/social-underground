const { expect, it } = require("@jest/globals");
const Login = require("../public/js/login");

describe("Login", () => {
    describe("Initialization", () => {
        it("should let you log in", function () {
            const login = new Login("fake@gmail.com", "password");

            expect(login.email).toEqual("fake@gmail.com");
            expect(login.password).toEqual("password");
        });

        it("should throw an error if not provided an email", () => {
            const cb = () => new Login ("fake@gmail.com");
            const err = new Error ("Expected parameter 'name' to be a non-empty string");

            expect(cb).toThrowError(err);
        });

        it("should throw an error if not provided a password", () => {
            const cb = () => new Login ("password");
            const err = new Error ("Expected parameter 'name' to be a non-empty string");

            expect(cb).toThrowError(err);
        });
    });
});