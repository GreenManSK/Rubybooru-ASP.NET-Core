import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageSearchComponent } from './views/search/image-search/image-search.component';
import { ImageSearchTagsComponent } from './views/search/image-search-tags/image-search-tags.component';
import { ImageComponent } from './views/image/image/image.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ImageSearchComponent},
      {path: '', component: ImageSearchTagsComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: ':page',
    children: [
      {path: '', component: ImageSearchComponent},
      {path: '', component: ImageSearchTagsComponent, outlet: 'sidebar'}
    ]
  },
  {
    path: 'image/:id',
    children: [
      {path: '', component: ImageComponent},
      {path: '', component: ImageSearchTagsComponent, outlet: 'sidebar'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
