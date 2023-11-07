import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService : AuthService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    private validateRequest(request : Request) {
        if(request.headers.authorization) {
            const jwtString = request.headers.authorization.split('Bearer ')[1];
            this.authService.verify(jwtString)

            return true
        }else{
            return false
        }


    }
}
