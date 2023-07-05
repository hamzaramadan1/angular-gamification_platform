import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {SuperAdminComponent} from './pages/superadmin/superadmin.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import {BrowserModule} from "@angular/platform-browser";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {authInterceptorProviders} from "./interceptors/auth.interceptor";
import { AdminComponent } from './pages/admin/admin.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { HangmanDisplayComponent } from './pages/game/components/hangman-display/hangman-display.component';
import { HangmanKeyboardComponent } from './pages/game/components/hangman-keyboard/hangman-keyboard.component';
import { HangmanQuestionComponent } from './pages/game/components/hangman-question/hangman-question.component';
import { HangmanComponent } from './pages/game/components/hangman/hangman.component';
import { HangComponent } from './pages/game/app.component';
import { CardComponent } from './pages/memory-game/components/card/card.component';
import { CaComponent } from './pages/memory-game/app.component';
import { CardService } from './pages/memory-game/services/card.service';
import { WordSearchGameComponent } from './pages/word-search-game/word-search-game.component';
import { WordSearchService } from './services/wordSearch.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SuperAdminComponent,
    DetailComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    AdminComponent,
    NavbarComponent,
    EditUserComponent,
    CoursesComponent,
    CourseDetailsComponent,
    HangmanComponent,
    HangmanDisplayComponent,
    HangmanKeyboardComponent,
    HangmanQuestionComponent,
    HangComponent,
    CardComponent,
    CaComponent,
    AppComponent,
    WordSearchGameComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        HttpClientModule,
        FormsModule,
        SweetAlert2Module,
        ReactiveFormsModule,
        BrowserAnimationsModule

    ],
  providers: [authInterceptorProviders, CardService, WordSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
