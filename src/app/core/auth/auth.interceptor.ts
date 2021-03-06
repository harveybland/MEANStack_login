import { UserService } from 'src/app/user/user.service';
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _userService: UserService,
        private _router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.headers.get('noauth'))
            return next.handle(req.clone())
        else {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "bearer " + this._userService.getToken())
            })
            return next.handle(clonedreq).pipe(
                tap(
                    event => { },
                    err => {
                        if (err.error.auth == false) {
                            this._router.navigateByUrl('sign-in')
                        }
                    }
                )
            )
        }
    }

}