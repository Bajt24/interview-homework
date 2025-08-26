import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsListComponent } from "./pages/items-list/items-list.component";
import { ItemsStateService } from './core/states/items-state.service';
import { catchError, of } from 'rxjs';
import { ToastService } from './shared/services/toast.service';
import { ShipmentsListComponent } from './pages/shipments-list/shipments-list.component';
import { ShipmentsStateService } from './core/states/shipments-state.service';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'items',
    component: ItemsListComponent,
    canActivate: [
      ()=>{
        const items = inject(ItemsStateService);
        const toast = inject(ToastService);

        return items.loadItems().pipe(
          catchError(err => {
            toast.showDanger('Failed to load items');
            return of(false);
          })
        )
      }
    ]
  },
  {
    path: 'shipments',
    component: ShipmentsListComponent,
    canActivate: [
      ()=>{
        const items = inject(ShipmentsStateService);
        const toast = inject(ToastService);

        return items.loadShipments().pipe(
          catchError(err => {
            toast.showDanger('Failed to load items');
            return of(false);
          })
        )
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
