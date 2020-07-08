import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { APP_ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { FiltersComponent } from './components/pages/filters/filters.component';
import { VideosComponent } from './components/pages/videos/videos.component';
import { VideoComponent } from './components/pages/video/video.component';

import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FilterComponent } from './components/pages/filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FiltersComponent,
    VideosComponent,
    NavbarComponent,
    VideoComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
