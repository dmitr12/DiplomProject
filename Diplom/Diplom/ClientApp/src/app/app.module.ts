import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {AuthlayoutComponent} from './components/layouts/authlayout/authlayout.component';
import {LoginComponent} from './components/users/login/login.component';
import {RegisterComponent} from './components/users/register/register.component';
import {ACCESS_TOKEN} from "./services/auth/auth.service";
import {JwtModule} from "@auth0/angular-jwt";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {InterceptorService} from "./services/loader/interceptor.service";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ApplayoutComponent } from './components/layouts/applayout/applayout.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {AuthGuard} from "./guards/auth-guard";
import { PlaylistComponent } from './components/musics/playlist/playlist.component';
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import { AudioplayerComponent } from './components/audioplayer/audioplayer.component';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
    AuthlayoutComponent,
    LoginComponent,
    RegisterComponent,
    ApplayoutComponent,
    PlaylistComponent,
    AudioplayerComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    RouterModule.forRoot([
      {
        path: 'auth', component: AuthlayoutComponent, children: [
          {path: '', redirectTo: 'login', pathMatch: 'full'},
          {path: 'login', component: LoginComponent},
          {path: 'register', component: RegisterComponent}
        ]
      },
      {
        path: '', component: ApplayoutComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: 'playlist', pathMatch: 'full'},
          {path: 'playlist', component: PlaylistComponent},

          // { path: 'searchmusic', component: SearchMusicComponent },
          // { path: 'editmusic/:id', component: EditmusicComponent },
          // { path: 'musicinfo/:id', component: MusicinfoComponent }
        ]
      }
    ]),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
