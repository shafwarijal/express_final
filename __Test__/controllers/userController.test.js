import userController from '../../controllers/userController';
import userModel from '../../databases/models/userModel';
import tokenModel from '../../databases/models/tokenModel';
import responseHelper from '../../helpers/responseHelper';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

jest.mock('../../databases/models/userModel');
jest.mock('../../databases/models/tokenModel');
jest.mock('../../helpers/responseHelper');
jest.mock('bcrypt');
jest.mock('crypto');
jest.mock('../../utils/sendEmail');

describe('User Controller - requestPasswordReset', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        email: 'test@example.com',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should send a password reset email', async () => {
    mockReq.body.email = 'test@example.com';
    // ... Your test implementation ...

    // Mock tokenModel.findOne to return a mock token object
    tokenModel.findOne.mockReturnValueOnce({
      userId: 'user123',
      deleteOne: jest.fn(), // Mock deleteOne method
    });

    // Call the requestPasswordReset function
    await userController.requestPasswordReset(mockReq, mockRes);

    // Assertions
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(tokenModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    expect(tokenModel.prototype.save).toHaveBeenCalled();
    expect(tokenModel.findOne().deleteOne).not.toHaveBeenCalled();
    expect(crypto.randomBytes).toHaveBeenCalledWith(32);
    expect(bcrypt.hash).toHaveBeenCalledWith('mockResetToken', 8);
    expect(sendEmailMock).toHaveBeenCalledWith(
      'test@example.com',
      'Password Reset Request',
      {
        name: 'Test User',
        link: 'mockClientUrl/api/v1/users/resetPassword/mockHashedToken/user123',
      },
      './template/requestResetPassword.handlebars'
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      link: 'mockClientUrl/api/v1/users/resetPassword/mockHashedToken/user123',
      message: 'Kindly check your email for further instructions',
    });
  });

  it('should respond with 400 if user is not found', async () => {
    // Mock userModel.findOne to resolve with null (user not found)
    userModel.findOne.mockResolvedValue(null);

    // Call the requestPasswordReset function
    await userController.requestPasswordReset(mockReq, mockRes);

    // Assertions
    expect(responseHelper).toHaveBeenCalledWith(mockRes, 400, '', 'User not found');
  });

  it('should handle error and respond with status 500', async () => {
    const mockError = new Error('Database error');

    // Mock userModel.findOne to throw an error
    userModel.findOne.mockRejectedValue(mockError);

    // Call the requestPasswordReset function
    await userController.requestPasswordReset(mockReq, mockRes);

    // Assertions
    expect(responseHelper).toHaveBeenCalledWith(mockRes, 500, '', 'Database error');
    expect(console.log).toHaveBeenCalledWith(mockError);
  });
});
