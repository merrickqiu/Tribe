"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Asynchronous function to check an HTTP response for errors.
 *
 * @param resp - HTTP response object
 * @returns A Promise resolving to a tuple containing HTTP status code and response data.
 *          The tuple is of the form [number, ResponseData].
 * @throws {MatrixError} If the response is from a Matrix homeserver.
 * @throws {NotMatrixServerError} If the response was not from a Matrix homeserver.
 */
function checkResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (response.status < 200 || response.status >= 400) {
                const result = yield response.json();
                if (!("errcode" in result)) {
                    throw new NotMatrixServerError();
                }
                throw new MatrixError(response.status, result);
            }
            else {
                return [response.status, yield response.json()];
            }
        }
        catch (error) {
            if (error instanceof MatrixError) {
                throw error;
            }
            else {
                throw new NotMatrixServerError();
            }
        }
    });
}
/**
 * Wraps an error response from a matrix server
 */
class MatrixError extends Error {
    constructor(status, result) {
        super();
        this.status = status;
        this.result = result;
        this.status = status;
        this.result = result;
    }
}
/**
 * An error not from a matrix server
 */
class NotMatrixServerError extends Error {
}
