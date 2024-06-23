const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 //When I uses process.env.COOKIE_EXPIRE insted of 5 it gives error,I has to find the solution
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  };

  
  module.exports = sendToken;
  