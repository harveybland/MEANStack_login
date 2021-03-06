import { UserService } from './../user.service';
import { User } from './../../core/interface/user.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  fullName = new FormControl('', [
    Validators.required
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  password = new FormControl('', [
    Validators.required
  ]);

  signUpForm: FormGroup = new FormGroup({
    fullName: this.fullName,
    email: this.email,
    password: this.password
  });

  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private _userService: UserService,
    public _router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    let model = this.userModel();
    this._userService.create(model).subscribe(res => {
      return this._userService.login(model).subscribe(res => {
        this._userService.setToken(res['token']);
        this._router.navigateByUrl('/ui/profile');
      })
    },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      })
  }

  userModel() {
    return {
      fullName: this.signUpForm.controls.fullName.value,
      email: this.signUpForm.controls.email.value,
      password: this.signUpForm.controls.password.value,
    }
  }

}
