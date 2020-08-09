import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire'
import { environment } from './firebase.enviroment'

import { APP_ROUTING } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { FiltersComponent } from './components/pages/filters/filters.component';
import { VideosComponent } from './components/pages/videos/videos.component';
import { VideoComponent } from './components/pages/video/video.component';

import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FilterComponent } from './components/pages/filter/filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParamOptionComponent } from './components/pages/filter/param-option/param-option.component';
import { FiltersChainManagerComponent } from './components/pages/filters-chain-manager/filters-chain-manager.component';
import { FilterChainCardComponent } from './components/pages/filters-chain-manager/filter-chain-card/filter-chain-card.component';
import { Object2arrayPipe } from './pipes/object2array.pipe';
import { FilterChainComponent } from './components/pages/filter-chain/filter-chain.component';
import { JsonPreviewComponent } from './components/shared/json-preview/json-preview.component';
import { InputFieldComponent } from './components/shared/input-field/input-field.component';
import { ChainFilterComponent } from './components/pages/filter-chain/chain-filter/chain-filter.component';
import { MediaVisualizerComponent } from './components/shared/media-visualizer/media-visualizer.component';
import { BadgeComponent } from './components/shared/badge/badge.component';
import { FilterComplexPreviewPipe } from './pipes/filter-complex-preview.pipe';
import { StorageComponent } from './components/shared/storage/storage.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UploadFileComponent } from './components/shared/storage/upload-file/upload-file.component';
import { FileCardComponent } from './components/shared/storage/file-card/file-card.component';
import { MediaFileSrcPipe } from './components/shared/storage/file-card/media-file-src.pipe';
//import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//import { ModalComponent } from './components/shared/modal/modal.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FiltersComponent,
    VideosComponent,
    NavbarComponent,
    VideoComponent,
    FilterComponent,
    ParamOptionComponent,
    FiltersChainManagerComponent,
    FilterChainCardComponent,
    Object2arrayPipe,
    FilterChainComponent,
    JsonPreviewComponent,
    InputFieldComponent,
    ChainFilterComponent,
    MediaVisualizerComponent,
    BadgeComponent,
    FilterComplexPreviewPipe,
    StorageComponent,
    UploadFileComponent,
    FileCardComponent,
    MediaFileSrcPipe,
    //ModalModule.forRoot()
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    APP_ROUTING,
    NgbModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ModalModule.forRoot()
    //MatIconModule
    //NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
