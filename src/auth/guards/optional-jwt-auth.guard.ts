import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw error if token is missing
  handleRequest(err: any, user: any, info: any) {
    // If there's an error or no user, just return null (don't throw)
    // This allows the request to proceed even without authentication
    if (err || !user) {
      return null;
    }
    return user;
  }

  // Override canActivate to allow requests without token
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const result = super.canActivate(context);
    
    // Handle Promise
    if (result instanceof Promise) {
      return result.catch(() => {
        // If authentication fails, allow the request to proceed (user will be null)
        return true;
      });
    }
    
    // Handle Observable
    if (result instanceof Observable) {
      return result.pipe(
        catchError(() => {
          // If authentication fails, allow the request to proceed
          return of(true);
        }),
        map(() => true),
      );
    }
    
    // Handle boolean (shouldn't happen, but just in case)
    return result;
  }
}

