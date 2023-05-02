import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {SuperAdminComponent} from "./pages/superadmin/superadmin.component";
import {DetailComponent} from "./pages/detail/detail.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {UnauthorizedComponent} from "./pages/unauthorized/unauthorized.component";
import {AuthGuard} from "./guards/auth.guard";
import {Role} from "./models/role.enum";
import {AdminComponent} from "./pages/admin/admin.component";
import {EditUserComponent} from "./pages/edit-user/edit-user.component";
import {CoursesComponent} from "./pages/courses/courses.component";
import {CourseDetailsComponent} from "./pages/course-details/course-details.component";

const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.USER]}
  },
  {path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN]}
  },
  {path: 'superadmin',
    component: SuperAdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.SUPERADMIN]}
  },
  {path: 'edit-user',
    component: EditUserComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.USER, Role.ADMIN]}
  },
  {path: 'detail/:id',
    component: DetailComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.SUPERADMIN]}
  },
  {path: 'course-details/:id',
    component: CourseDetailsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.USER]}
  },
  {path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.USER, Role.ADMIN]}
  },
  {path: '404', component: NotFoundComponent},
  {path: '401', component: UnauthorizedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['/404']);
    }
  }
}
