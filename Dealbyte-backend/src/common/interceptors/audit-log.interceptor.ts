import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Logs CREATE, UPDATE, DELETE operations to the AuditLog table.
 * Apply to controllers/routes that modify data.
 * 
 * Usage: @UseInterceptors(AuditLogInterceptor)
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const user = request.user;
    const path = request.route?.path || request.url;

    // Only log mutating operations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const action = this.methodToAction(method);

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const entityId =
            request.params?.id ||
            (responseData as Record<string, unknown>)?.id ||
            'unknown';
          const entityType = this.extractEntityType(path);

          await this.prisma.auditLog.create({
            data: {
              userId: user?.userId || 'system',
              action,
              entityType,
              entityId: String(entityId),
              details: {
                method,
                path,
                body: this.sanitizeBody(request.body),
              } as any,
            },
          });
        } catch (error) {
          // Don't let audit logging failures break the main request
          console.error('Audit log failed:', error);
        }
      }),
    );
  }

  private methodToAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return method;
    }
  }

  private extractEntityType(path: string): string {
    // Extract entity name from path like /api/users/:id -> User
    const segments = path.split('/').filter(Boolean);
    const entity = segments.find((s) => !s.startsWith(':') && s !== 'api');
    if (!entity) return 'Unknown';
    // Convert plural to singular-ish and capitalize
    return entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, '');
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    if (!body) return {};
    const sanitized = { ...body };
    // Never log passwords
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.refreshToken;
    return sanitized;
  }
}
