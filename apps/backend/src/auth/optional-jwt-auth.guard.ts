import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to not throw an error when no user is found
  handleRequest(err: any, user: any) {
    // Return the user if found, or null if not found
    return user || null;
  }
}
