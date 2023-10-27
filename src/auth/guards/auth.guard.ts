import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ){}

  async canActivate( context: ExecutionContext): Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    const token= this.extractTokenFormHeader(request)

    if (!token) {
      throw new UnauthorizedException('There is no bearer token')
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(
    token,
    {
      secret: jwtConstants.secret
    }
  )
  request['user'] = payload;
  }






  private extractTokenFormHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ')?? [];
    return type === 'Bearer' ? token : undefined
  
}

}
