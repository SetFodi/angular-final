import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HTTP_INTERCEPTORS
import { JwtInterceptor } from './services/interceptors/jwt.interceptor';
// Your standalone components/pipes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    // Note: Standalone components do not need to be declared here
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderComponent,
    // Import standalone components directly
    LoginComponent,
    RegisterComponent,
    MovieCardComponent,
    MovieDetailsComponent,
    AdminComponent,
    MoviesComponent,
    TruncatePipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true // Allows multiple interceptors
    }
    // ... other providers if any
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}