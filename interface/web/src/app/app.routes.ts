import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { FiltersComponent } from './components/pages/filters/filters.component';
import { VideosComponent } from './components/pages/videos/videos.component';
import { VideoComponent } from './components/pages/video/video.component';
import { FilterComponent } from './components/pages/filter/filter.component';
//import { Name4Component } from './';
//import { PageNotFoundComponent } from './';

const ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'filters', component: FiltersComponent },
    { path: 'filter/:filter:ID', component: FilterComponent },
    { path: 'videos', component: VideosComponent },
    { path: 'video/:videoID', component: VideoComponent },
    { path: '**', pathMatch:"full", redirectTo: 'home' },

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

export const APP_ROUTING = RouterModule.forRoot(ROUTES)
