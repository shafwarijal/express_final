import userModel from '../databases/models/userModel.js';
import tokenModel from '../databases/models/tokenModel.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import responseHelper from '../helpers/responseHelper.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let hashedPassword = await bcrypt.hash(password, 8);
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      });
      await user.save();
      responseHelper(res, 200, user, 'User created successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  signin: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) return responseHelper(res, 400, '', 'User not found');

      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isPasswordValid) return responseHelper(res, 400, '', 'Invalid password');

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      responseHelper(res, 200, { user, token }, 'User logged in successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error.message);
    }
  },

  changeRole: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) return responseHelper(res, 400, '', 'User not found');
      user.role = req.body.role;
      await user.save();
      responseHelper(res, 200, user, 'Role changed successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userModel.find({}, 'name email');
      responseHelper(res, 200, user, 'Success get all users');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  requestPasswordReset: async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return responseHelper(res, 400, '', 'User not found');
      }

      const token = await tokenModel.findOne({ userId: user._id });
      if (token) {
        await token.deleteOne();
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, 8);

      await new tokenModel({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
      }).save();

      // const link = `${process.env.CLIENT_URL}/api/v1/users/resetPassword?token=${resetToken}&id=${user._id}`;
      const link = `${process.env.CLIENT_URL}/api/v1/users/resetPassword/${resetToken}/${user._id}`;

      await sendEmail(
        user.email,
        'Password Reset Request',
        { name: user.name, link: link },
        './template/requestResetPassword.handlebars' // Correct template path
      );

      res.status(200).json({ link: link, message: 'Kindly check your email for further instructions' });
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },

  resetPassword: async (req, res) => {
    const { token, id } = req.params;
    const { password } = req.body;

    try {
      const passwordResetToken = await tokenModel.findOne({ userId: id });
      if (!passwordResetToken) return responseHelper(res, 400, '', 'Invalid token');

      const isTokenValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isTokenValid) return responseHelper(res, 400, '', 'Invalid token');

      const hashedPassword = await bcrypt.hash(password, 8);

      await userModel.findByIdAndUpdate(id, { password: hashedPassword });

      const userUpdated = await userModel.findById(id);

      await passwordResetToken.deleteOne();

      responseHelper(res, 200, userUpdated, 'Password updated successfully');
    } catch (error) {
      responseHelper(res, 500, '', error.message);
      console.log(error);
    }
  },
};

export default userController;
