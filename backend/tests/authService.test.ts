import { AuthService } from '../src/services/AuthService';
import { RepositoryFactory } from '../src/factories';
import * as helpers from '../src/utils/helpers';

// ============================================================
// Test Suite: AuthService
// Tests registration, login, and profile retrieval logic.
// ============================================================

jest.mock('../src/factories');
jest.mock('../src/utils/helpers');

const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findByIdSafe: jest.fn(),
};

(RepositoryFactory.getUserRepository as jest.Mock).mockReturnValue(mockUserRepo);
(helpers.generateToken as jest.Mock).mockReturnValue('mock_jwt_token');

const authService = new AuthService();

const mockUser = {
    _id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: 'student' as const,
    comparePassword: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('AuthService.register', () => {
    test('registers a new user and returns token', async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);
        mockUserRepo.create.mockResolvedValue(mockUser);

        const result = await authService.register({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });

        expect(result.token).toBe('mock_jwt_token');
        expect(result.user.email).toBe('john@example.com');
        expect(result.user.password).toBeUndefined(); // password not returned
    });

    test('throws ConflictError if email already exists', async () => {
        mockUserRepo.findByEmail.mockResolvedValue(mockUser);

        await expect(
            authService.register({ name: 'John', email: 'john@example.com', password: '123456' })
        ).rejects.toThrow('User with this email already exists');
    });
});

describe('AuthService.login', () => {
    test('logs in with valid credentials', async () => {
        mockUser.comparePassword.mockResolvedValue(true);
        mockUserRepo.findByEmail.mockResolvedValue(mockUser);

        const result = await authService.login('john@example.com', 'password123');

        expect(result.token).toBe('mock_jwt_token');
        expect(result.user.email).toBe('john@example.com');
    });

    test('throws UnauthorizedError for non-existent email', async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        await expect(authService.login('nobody@example.com', 'pass')).rejects.toThrow(
            'Invalid email or password'
        );
    });

    test('throws UnauthorizedError for wrong password', async () => {
        mockUser.comparePassword.mockResolvedValue(false);
        mockUserRepo.findByEmail.mockResolvedValue(mockUser);

        await expect(authService.login('john@example.com', 'wrongpass')).rejects.toThrow(
            'Invalid email or password'
        );
    });
});

describe('AuthService.getProfile', () => {
    test('returns user profile', async () => {
        mockUserRepo.findByIdSafe.mockResolvedValue(mockUser);
        const result = await authService.getProfile('user123');
        expect(result?.name).toBe('John Doe');
    });

    test('throws NotFoundError when user not found', async () => {
        mockUserRepo.findByIdSafe.mockResolvedValue(null);
        await expect(authService.getProfile('bad_id')).rejects.toThrow('User not found');
    });
});
