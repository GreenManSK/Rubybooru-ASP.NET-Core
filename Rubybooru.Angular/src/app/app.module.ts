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
import { ImagePanelComponent } from './views/image/image-panel/image-panel.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { InputWhispererComponent } from './components/input-whisperer/input-whisperer.component';
import { MenuComponent } from './components/menu/menu.component';
import { UntaggedImagesComponent } from './views/untagged/untagged-images/untagged-images.component';
import { UntaggedImagesPanelComponent } from './views/untagged/untagged-images-panel/untagged-images-panel.component';
import { EditTagsComponent } from './views/tags/edit-tags/edit-tags.component';
import { TagFormComponent } from './views/tags/tag-form/tag-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageSearchComponent,
    ImageGridComponent,
    PageSelectorComponent,
    ImageSearchTagsComponent,
    TagListComponent,
    ImageComponent,
    ImagePanelComponent,
    SearchBarComponent,
    InputWhispererComponent,
    MenuComponent,
    UntaggedImagesComponent,
    UntaggedImagesPanelComponent,
    EditTagsComponent,
    TagFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
