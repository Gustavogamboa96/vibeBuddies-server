const { updatePassword } = require('../services/updatePasswordService');
const userDAO = require('../repositories/userDAO');
const bcrypt = require('bcrypt');
const { dataResponse } = require('../utils/dataResponse');
const logger = require('../utils/logger');

jest.mock('../repositories/userDAO');
jest.mock('bcrypt');
jest.mock('../utils/dataResponse');
jest.mock('../utils/logger');

dataResponse.mockImplementation((httpStatus, status, data) => ({
    httpStatus,
    status,
    data
}));

describe('updatePassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no username is passed', async () => {
        // userDAO.updatePassword.mockReturnValue({Item})
        const result = await updatePassword('', 'currentPassword', 'newPassword');

        // expect(result.httpStatus).toBe(401);
        // expect(result.status).toBe('fail');
        expect(result.data.message).toBe('No username was passed, might have to refresh session');
    });

    it('should return 401 if username does not exist', async () => {
        const mockUsername = 'nonexistentUser';

        userDAO.getUserByUsername.mockResolvedValue({ Count: 0, Items: [] });

        const result = await updatePassword(mockUsername, 'currentPassword', 'newPassword');

        expect(result.httpStatus).toBe(401);
        expect(result.status).toBe('fail');
        expect(result.data.message).toBe('Username does not exist!');
    });

    it('should return 401 if currentPassword does not match database password', async () => {
        const mockUsername = 'existingUser';
        const mockCurrentPassword = 'wrongPassword';
        const mockDatabasePassword = 'hashedPassword';

        userDAO.getUserByUsername.mockResolvedValue({
            Count: 1,
            Items: [{ password: mockDatabasePassword }]
        });
        bcrypt.compareSync.mockReturnValue(false);

        const result = await updatePassword(mockUsername, mockCurrentPassword, 'newPassword');

        expect(result.httpStatus).toBe(401);
        expect(result.status).toBe('fail');
        expect(result.data.message).toBe('Password incorrect!');
    });

    it('should return 401 if the password update fails', async () => {
        const mockUsername = 'existingUser';
        const mockCurrentPassword = 'correctPassword';
        const mockNewPassword = 'newPassword';
        const mockDatabasePassword = 'hashedPassword';

        userDAO.getUserByUsername.mockResolvedValue({
            Count: 1,
            Items: [{ password: mockDatabasePassword }]
        });
        bcrypt.compareSync.mockReturnValue(true);
        bcrypt.hashSync.mockReturnValue('newHashedPassword');
        userDAO.updatePassword.mockResolvedValue({});

        const result = await updatePassword(mockUsername, mockCurrentPassword, mockNewPassword);

        expect(result.httpStatus).toBe(401);
        expect(result.status).toBe('fail');
        expect(result.data.message).toBe('Could not change password');
    });

    it('should return 201 if the password is successfully updated', async () => {
        const mockUsername = 'existingUser';
        const mockCurrentPassword = 'correctPassword';
        const mockNewPassword = 'newPassword';
        const mockDatabasePassword = 'hashedPassword';

        userDAO.getUserByUsername.mockResolvedValue({
            Count: 1,
            Items: [{ password: mockDatabasePassword }]
        });
        bcrypt.compareSync.mockReturnValue(true);
        bcrypt.hashSync.mockReturnValue('newHashedPassword');
        userDAO.updatePassword.mockResolvedValue({ Attributes: { password: 'newHashedPassword' } });

        const result = await updatePassword(mockUsername, mockCurrentPassword, mockNewPassword);

        expect(result.httpStatus).toBe(201);
        expect(result.status).toBe('success');
        expect(result.data.message).toBe('Password changed succesfully');
    });

    it('should log an error and throw if an unexpected error occurs', async () => {
        const mockUsername = 'existingUser';
        const mockCurrentPassword = 'correctPassword';
        const mockNewPassword = 'newPassword';
        const errorMessage = 'Unexpected error';

        userDAO.getUserByUsername.mockRejectedValue(new Error(errorMessage));

        await expect(updatePassword(mockUsername, mockCurrentPassword, mockNewPassword)).rejects.toThrow(errorMessage);
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to update user's password: ${errorMessage}`), expect.any(Object));
    });
});
