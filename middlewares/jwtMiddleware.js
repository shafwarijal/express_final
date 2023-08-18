import jwt from 'jsonwebtoken';
import userModel from '../databases/models/userModel.js';
import responseHelper from '../helpers/responseHelper.js';

const jwtMiddleware = {
  validateTokenAll: async (req, res, next) => {
    try {
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return responseHelper(res, 400, '', 'User not found');
        req.user = user;
        next();
      } else {
        responseHelper(res, 400, '', 'Invalid JWT token');
      }
    } catch (error) {
      responseHelper(res, 500, '', error.message);
    }
  },

  validateTokenAdmin: async (req, res, next) => {
    try {
      if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return responseHelper(res, 400, '', 'User not found');
        if (user.role !== 'admin') return responseHelper(res, 400, '', 'Unauthorised access');
        req.user = user;
        next();
      } else {
        responseHelper(res, 400, '', 'Invalid JWT token');
      }
    } catch (error) {
      responseHelper(res, 500, '', error.message);
    }
  },
};
export default jwtMiddleware;
