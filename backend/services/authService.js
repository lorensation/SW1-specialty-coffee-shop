import User from '../models/User.js';
import Session from '../models/Session.js';

/**
 * Authentication Service - Simplified
 * Handles authentication logic without JWT
 */
class AuthService {
  /**
   * Register a new user
   */
  static async register({ email, password, name }) {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await User.create({ email, password, name });

    // Create session
    const session = await Session.create(user.id);

    // Remove password from response
    delete user.password_hash;

    return {
      user,
      sessionToken: session.session_token,
    };
  }

  /**
   * Login user
   */
  static async login({ email, password }) {
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const session = await Session.create(user.id);

    // Remove password from response
    delete user.password_hash;

    return {
      user,
      sessionToken: session.session_token,
    };
  }

  /**
   * Logout user
   */
  static async logout(sessionToken) {
    await Session.deleteByToken(sessionToken);
    return true;
  }

  /**
   * Validate session
   */
  static async validateSession(sessionToken) {
    if (!sessionToken) {
      return null;
    }

    const session = await Session.findByToken(sessionToken);
    if (!session) {
      return null;
    }

    const user = await User.findById(session.user_id);
    if (!user || !user.is_active) {
      return null;
    }

    return user;
  }
}

export default AuthService;
