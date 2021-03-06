import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit
} from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isvisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userRoles = this.authService.decodedToken.role as Array<string>;

    // if there are no roles, clear the viewContainerRef
    if (!userRoles) {
      this.viewContainerRef.clear();
    }

    // if user has role needed then render the element
    if (this.authService.roleMatch(this.appHasRole)) {
      if (!this.isvisible) {
        this.isvisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isvisible = false;
        this.viewContainerRef.clear();
      }
    }
  }
}
