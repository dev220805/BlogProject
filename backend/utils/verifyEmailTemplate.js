const verifyEmailTemplate = ({ name, otp }) => {
    return `
        <p>Dear ${name},</p>
        <p>Your OTP for email verification is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    `;
};

export default verifyEmailTemplate;
