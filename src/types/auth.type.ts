export interface ISendOtp{
    email: string
}

export interface IVerifyOtp{
    email: string,
    otp: string
}