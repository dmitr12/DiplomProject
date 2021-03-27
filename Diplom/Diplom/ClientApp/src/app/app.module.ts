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
import { PlaylistComponent } from './pages/playlist/playlist.component';
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import { AudioplayerComponent } from './components/audioplayer/audioplayer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { AddmusicformComponent } from './components/musics/addmusicform/addmusicform.component';
import {MatDialogModule} from "@angular/material/dialog";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { MusicCardComponent } from './shared/music-card/music-card.component';
import { DeletemusicformComponent } from './components/musics/deletemusicform/deletemusicform.component';
import { EditmusicformComponent } from './components/musics/editmusicform/editmusicform.component';
import { SearchbarComponent } from './shared/searchbar/searchbar.component';
import { SearchComponent } from './pages/search/search.component';
import {MatInputModule} from "@angular/material/input";
import { SearchMusicCardComponent } from './shared/search-music-card/search-music-card.component';
import {MatCardModule} from "@angular/material/card";
import {NgxPaginationModule} from 'ngx-pagination';
import {MymusicComponent} from "./pages/mymusic/mymusic.component";
import { FavouritemusicsComponent } from './pages/favouritemusics/favouritemusics.component';
import { MusicinfoComponent } from './pages/musicinfo/musicinfo.component';
import {RatingModule} from "ng-starrating";

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
    AddmusicformComponent,
    MusicCardComponent,
    DeletemusicformComponent,
    EditmusicformComponent,
    SearchbarComponent,
    SearchComponent,
    SearchMusicCardComponent,
    MymusicComponent,
    FavouritemusicsComponent,
    MusicinfoComponent,
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
          {path: '', redirectTo: 'mymusic', pathMatch: 'full'},
          {
            path: 'mymusic', component: MymusicComponent, children: [
              {path: '', redirectTo: 'playlist', pathMatch: 'full'},
              {path: 'playlist', component: PlaylistComponent},
              {path: 'favorite', component: FavouritemusicsComponent}
            ]
          },
          {path: 'search', component: SearchComponent},
          {path: 'musicinfo/:id', component: MusicinfoComponent}
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
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,
    InfiniteScrollModule,
    MatInputModule,
    MatCardModule,
    NgxPaginationModule,
    RatingModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddmusicformComponent, DeletemusicformComponent, EditmusicformComponent]
})
export class AppModule {
}
