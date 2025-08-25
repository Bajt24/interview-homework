import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItemsListComponent} from "./pages/items-list/items-list.component";
import { ItemsStateService } from './core/states/items-state.service';

const routes: Routes = [
  {
    path: '',
    component: ItemsListComponent,
    resolve: {
      data: ()=>{
        const items = inject(ItemsStateService);
        return items.loadItems();
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
