import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Import your standalone components directly
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { AdminComponent } from './pages/admin/admin.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MoviesComponent } from './pages/movies/movies.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // We only declare the root if it isn't standalone
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    // Now your standalone stuff goes here:
    LoginComponent,
    RegisterComponent,
    MovieCardComponent,
    MovieDetailsComponent,
    AdminComponent,
    MoviesComponent,
    TruncatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
