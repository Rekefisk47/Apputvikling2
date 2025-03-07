import { setUncaughtExceptionCaptureCallback } from "node:process"

const HTTP_CODES = {

    SUCCESS: {
        OK: 200
    },
    CLIENT_ERROR: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        CONFLICT: 409,
        GONE: 410,
        IM_A_TEAPOT: 418
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 501,
        SERVICE_UNAVAILABLE: 503
    },
}

export default HTTP_CODES;