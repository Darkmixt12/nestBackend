import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ){}

  canActivate( context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    const token= this.extractTokenFormHeader(request)

    console.log({token});
    return Promise.resolve(true)


  }

  private extractTokenFormHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ')?? [];
    return type === 'Bearer' ? token : undefined
  }
}
