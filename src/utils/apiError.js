class apiError extends Error {
        constructor(
            statusCode,
            message = "Maybe Your Code Is Wrong Bewakuf",
            errors = [],
            stack = ""
        ){
            super(message)
            this.statusCode = statusCode,
            this.data = null,
            this.message = message,
            this.success = false,
            this.errors = errors,
            stack ? this.stack = stack : Error.captureStackTrace(this,this.constructor)
        }

}

export default apiError;