// src/middleware/auth.js
import { GraphQLError } from 'graphql';
import { User } from '../models/User';

export class AuthenticationError extends GraphQLError {
  constructor(message = 'Not authenticated') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }
      }
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message = 'Not authorized') {
    super(message, {
      extensions: {
        code: 'UNAUTHORIZED',
        http: { status: 403 }
      }
    });
  }
}

export function requireAuth(context) {
  const user = context.user;
  if (!user?.uid) {
    throw new AuthenticationError();
  }
  return user;
}

export async function requireAdmin(context) {
    const user = requireAuth(context);
    
      // Here the admin logic could be more robust...
      // But for now, we check if the email contains 'admin' or if the user has the admin role
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser?.isAdmin || !user.email?.includes('admin')) {
        throw new AuthorizationError('Admin access required');
    }
    
    return user;
  }
