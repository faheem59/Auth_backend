const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const options = {
        httpOnly: true,
        secure: false,  
        sameSite: 'None',
        
    }
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user,
            token
        });
};
module.exports = sendToken;
