
import {Response} from 'node-fetch'

interface ResponseData {
    [key: string]: any;
}

/**
 * Asynchronous function to check an HTTP response for errors.
 *
 * @param resp - HTTP response object
 * @returns A Promise resolving to a tuple containing HTTP status code and response data.
 *          The tuple is of the form [number, ResponseData].
 * @throws {MatrixError} If the response is from a Matrix homeserver.
 * @throws {NotMatrixServerError} If the response was not from a Matrix homeserver.
 */
async function checkResponse(response: Response): Promise<[number, ResponseData]> {
    try {
        if (response.status < 200 ||  response.status >= 400) {
            const result: ResponseData = await response.json() as ResponseData;
            if  (!("errcode" in result)) {
                throw new NotMatrixServerError();
            }
            throw new MatrixError(response.status, result);
        } else {
            return [response.status, await response.json() as ResponseData];
        }
    } catch (error) {
        if (error instanceof MatrixError) {
            throw error;
        } else {
            throw new NotMatrixServerError();
        }
    }
}

/**
 * Wraps an error response from a matrix server
 */
class MatrixError extends Error {
    constructor(public status: number, public result: ResponseData) {
        super();
        this.status = status;
        this.result = result;
    }
}

/**
 * An error not from a matrix server
 */
class NotMatrixServerError extends Error {}