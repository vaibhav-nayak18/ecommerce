export const cookieToken = async (user, res) => {
  const token = user.getToken();

  const time = process.env.TOKEN_TIME;

  const option = {
    expires: new Date(Date.now() + parseInt(time) * 24 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  user.password = undefined;

  res.cookie("token", token, option);
  res.status(200).json({
    success: true,
    user,
    token,
  });
};
