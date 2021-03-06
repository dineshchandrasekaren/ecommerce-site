module.exports = async (res, user) => {
  user.password = undefined;
  const token = await user.getToken();

  const option = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("token", token, option)
    .json({ success: true, token, user });
};
