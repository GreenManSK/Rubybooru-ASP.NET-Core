import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageSearchComponent } from './views/search/image-search/image-search.component';
import { ImageSearchTagsComponent } from './views/search/image-search-tags/image-search-tags.component';
import { ImageComponent } from './views/image/image/image.component';
import { ImagePanelComponent } from './views/image/image-panel/image-panel.component';
import { UntaggedImagesComponent } from './views/untagged/untagged-images/untagged-images.component';
import { UntaggedImagesPanelComponent } from './views/untagged/untagged-images-panel/untagged-images-panel.component';
import { EditTagsComponent } from './views/tags/edit-tags/edit-tags.component';
import { TagFormComponent } from './views/tags/tag-form/tag-form.component';
import { DuplicatesImagesComponent } from './views/duplicates/duplicates-images/duplicates-images.component';
import { DuplicateRecordComponent } from './views/duplicate-record/duplicate-record.component';
import { DuplicateRecordPanelComponent } from './views/duplicate-record-panel/duplicate-record-panel.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ImageSearchComponent},
      {path: '', component: ImageSearchTagsComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'untagged/:page',
    children: [
      {path: '', component: UntaggedImagesComponent},
      {path: '', component: UntaggedImagesPanelComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'duplicates/:page',
    children: [
      {path: '', component: DuplicatesImagesComponent},
      {path: '', component: UntaggedImagesPanelComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'tags',
    children: [
      {path: '', component: EditTagsComponent},
      {path: '', component: TagFormComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'image/:id',
    children: [
      {path: '', component: ImageComponent},
      {path: '', component: ImagePanelComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'duplicate-record/:id',
    children: [
      {path: '', component: DuplicateRecordComponent},
      {path: '', component: DuplicateRecordPanelComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: ':page',
    children: [
      {path: '', component: ImageSearchComponent},
      {path: '', component: ImageSearchTagsComponent, outlet: 'sidebar'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
