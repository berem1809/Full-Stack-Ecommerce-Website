//Defines a custom error class ErrorHandler that inherits from JavaScript's built-in Error class to handle errors with additional properties.
class ErrorHandler extends Error {
    //Defines a custom error class ErrorHandler that inherits from JavaScript's built-in Error class to handle errors with additional properties.
    constructor(message, statusCode) { //Constructor accepts message and statusCode as parameters to customize the error details.
        super(message); //Calls the parent Error constructor with the message, allowing ErrorHandler to inherit Error properties.
        this.statusCode = statusCode; // Assigns the status code to the error instance, enabling handling specific HTTP statuses.

        
        Error.captureStackTrace(this, this.constructor); 
//In JavaScript, a stack trace is a report that shows the sequence of function calls that led to an error or specific point in the code. It helps developers understand the flow of the code and where an error originated.
//Error.captureStackTrace: Captures the stack trace at the point where this error instance was created.
//this: Sets the stack trace to start from this error instance.
//this.constructor: Omits the constructor call from the stack trace, focusing on the origin of the error.


    }
}

module.exports = ErrorHandler; // Exports the ErrorHandler class for use in other files.
