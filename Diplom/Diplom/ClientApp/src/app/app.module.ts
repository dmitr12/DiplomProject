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
import { MusicComponent } from './pages/music/music.component';
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
import {SignalrService} from "./services/signalr/signalr.service";
import { CommentCardComponent } from './shared/comment-card/comment-card.component';
import { CommentCardChildComponent } from './shared/comment-card-child/comment-card-child.component';
import {MatStepperModule} from "@angular/material/stepper";
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileEditorComponent } from './pages/profile/profile-editor/profile-editor.component';
import { AddplaylistformComponent } from './components/playlists/addplaylistform/addplaylistform.component';
import { PlaylistComponent } from './pages/playlist/playlist/playlist.component';
import { PlaylistCardComponent } from './shared/playlist-card/playlist-card.component';
import { PlaylistEditorComponent } from './pages/playlist/playlist-editor/playlist-editor.component';
import { PlaylistInfoComponent } from './pages/playlist/playlist-info/playlist-info.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DeleteplaylistComponent } from './components/playlists/deleteplaylist/deleteplaylist.component';
import { SearchBarPageComponent } from './shared/search-bar-page/search-bar-page.component';
import { SearchUserCardComponent } from './shared/search-user-card/search-user-card.component';
import { ChangePasswordComponent } from './components/users/change-password/change-password.component';
import { MainComponent } from './pages/main/main.component';
import { ForgotPasswordChangeComponent } from './components/users/forgot-password-change/forgot-password-change.component';
import { FilterbarComponent } from './shared/filterbar/filterbar.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { AddcomplaintformComponent } from './components/complaints/addcomplaintform/addcomplaintform.component';
import { ComplaintsComponent } from './pages/complaints/complaints.component';
import {AdminGuard} from "./guards/admin-guard";
import { NewcomplaintsComponent } from './pages/newcomplaints/newcomplaints.component';
import { CheckedcomplaintsComponent } from './pages/checkedcomplaints/checkedcomplaints.component';
import { ComplaintCardComponent } from './shared/complaint-card/complaint-card.component';

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
    MusicComponent,
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
    CommentCardComponent,
    CommentCardChildComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ProfileEditorComponent,
    AddplaylistformComponent,
    PlaylistComponent,
    PlaylistCardComponent,
    PlaylistEditorComponent,
    PlaylistInfoComponent,
    DeleteplaylistComponent,
    SearchBarPageComponent,
    SearchUserCardComponent,
    ChangePasswordComponent,
    MainComponent,
    ForgotPasswordChangeComponent,
    FilterbarComponent,
    NotfoundComponent,
    AddcomplaintformComponent,
    ComplaintsComponent,
    NewcomplaintsComponent,
    CheckedcomplaintsComponent,
    ComplaintCardComponent,
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
            {path: 'auth', component: AuthlayoutComponent, children: [
                    {path: '', redirectTo: 'login', pathMatch: 'full'},
                    {path: 'login', component: LoginComponent},
                    {path: 'register', component: RegisterComponent},
                    {path: 'forgot-password', component: ForgotPasswordComponent},
                    {path: 'forgot-password-change/:userId/:verifyCode', component: ForgotPasswordChangeComponent}]
            },
            {path: '', component: ApplayoutComponent, children: [
                    {path: '', redirectTo: 'main', pathMatch: 'full'},
                    {path: 'main', component: MainComponent},
                    {path: 'mymusic', component: MymusicComponent, canActivate: [AuthGuard], children:
                        [
                            {path: '', redirectTo: 'music', pathMatch: 'full'},
                            {path: 'music', component: MusicComponent},
                            {path: 'favorite', component: FavouritemusicsComponent}
                            ]
                    },
                    {path: 'complaints', component: ComplaintsComponent, canActivate: [AdminGuard], children:
                      [
                        {path: '', redirectTo: 'new', pathMatch: 'full' },
                        {path: 'new', component: NewcomplaintsComponent},
                        {path: 'checked', component: CheckedcomplaintsComponent}
                      ]
                    },
                    {path: 'search', component: SearchComponent},
                    {path: 'playlist', canActivate: [AuthGuard], component: PlaylistComponent},
                    {path: 'musicinfo/:id', component: MusicinfoComponent},
                    {path: 'profile/:id', component: ProfileComponent},
                    {path: 'profile-editor/:id', canActivate: [AuthGuard], component: ProfileEditorComponent},
                    {path: 'playlist-editor/:id', canActivate: [AuthGuard], component: PlaylistEditorComponent},
                    {path: 'playlist-info/:id', component: PlaylistInfoComponent}]}
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
        MatStepperModule,
        MatCheckboxModule,
        MatTooltipModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddmusicformComponent, DeletemusicformComponent, EditmusicformComponent,
  AddplaylistformComponent, DeleteplaylistComponent, ChangePasswordComponent, AddcomplaintformComponent]
})
export class AppModule {
}
