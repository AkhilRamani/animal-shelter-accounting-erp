export class PinNotFoundException extends Error{
    code = 404
    message = 'pin not found'
}
export class IdNotProvidedException extends Error{
    code = 422
    message = 'Id not provided'
}
export class NoRecordWithIDException extends Error{
    code=404
    message='no record found with such id'
}
export class ImageUploadFailedException extends Error{
    code=409
    message='image upload failed'
}
export class DocsNotProvidedError extends Error{
    code=422
    message='employee document not provided'
}
export class WrongOtpException extends Error{
    code=401
    message='wrong otp'
}
export class RequiredInputNotProvidedException extends Error{
    code = 422
    message = 'requied input not provided'
}
export class insufficientSmsBalanceException extends Error{
    code=419
    message = 'insufficient sms balance'
}
export class InvalidOtpException extends Error{
    code=401
    message='invalid otp'
}
export class InvalidOtpRequest extends Error{
    code=406
    message='invalid otp request - otp not available'
}