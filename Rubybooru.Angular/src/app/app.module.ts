import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ImageSearchComponent } from './views/search/image-search/image-search.component';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageSearchTagsComponent } from './views/search/image-search-tags/image-search-tags.component';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { ImageComponent } from './views/image/image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageSearchComponent,
    ImageGridComponent,
    PageSelectorComponent,
    ImageSearchTagsComponent,
    TagListComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
