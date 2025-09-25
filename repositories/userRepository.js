export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async ({ username, email, password, type, mobile }) => {
  const user = new User({ username, email, password, type, mobile });
  return await user.save();
};

export const createSession = async (userId, token) => {
  const session = new Session({
    userId,
    token,
    startTime: new Date(),
  });
  return await session.save();
};


export const deleteSessionByToken = async (token) => {
  return await Session.deleteOne({ token });
};

export const saveOtpToUser = async (user, otp) => {
    user.otp = otp;
    await user.save();
    return user;
};
export const saveUser = async (user) => {
    return await user.save();
};

export const findUserByMobile = async (mobile) => {
    return await User.findOne({ mobile });
};

export const verifyUserMobile = async (user) => {
    user.mobileVerified = true;
    user.otp = undefined; // clear OTP
    return await user.save();
};