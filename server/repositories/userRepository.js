import { prisma } from "../config/dbConfig.js";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  })
};

export const createUser = async (data) => {
  const newUser = await prisma.user.create({
    data
  })
  return newUser;
};

export const createSession = async (userId, token) => {
  return await prisma.session.create({
    data: {
      userId: userId,
      token: token
    }
  })
};


export const deleteSessionByToken = async (token) => {
  return prisma.session.deleteMany({
    where: { token }
  })
};

export const doctorList = async () => {
  return prisma.doctor.findMany()
}

export const saveOtpToUser = async (user, otp) => {
  user.otp = otp;
  await user.save();
  return user;
};


export const verifyUserMobile = async (user) => {
  user.mobileVerified = true;
  user.otp = undefined; // clear OTP
  return await user.save();
};