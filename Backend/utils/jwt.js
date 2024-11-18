const sendToken = (user, statusCode, res) => {
    // Create JWT token
    const token = user.getJWTToken();

    res.status(statusCode).json({
        success: true,
        token,
        user
    })
    

}
module.exports = sendToken;