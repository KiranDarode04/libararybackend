import { Injectable,ExecutionContext,UnauthorizedException,CanActivate,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private jwtService: JwtService,private readonly prismaService:PrismaService) {}

     async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: process.env.JWT_SECRET
            }
          );

          const user  = await this.prismaService.user.findUnique({
            where:{
                email:payload['email']
            },
            select:{
                id:true,
                email:true,
                role:true,
            }
        })
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['user'] = user;
        } catch {
          throw new UnauthorizedException();
        }
  
        return true;
      }
    
      private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }

}
