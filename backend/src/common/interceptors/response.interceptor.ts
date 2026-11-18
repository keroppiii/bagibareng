import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Membungkus semua respons sukses menjadi { data }.
 * Respons list yang sudah berbentuk { data, meta } dibiarkan apa adanya.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value: unknown) => {
        if (value === undefined || value === null) return value;
        if (
          typeof value === 'object' &&
          'data' in value &&
          'meta' in value
        ) {
          return value;
        }
        return { data: value };
      }),
    );
  }
}