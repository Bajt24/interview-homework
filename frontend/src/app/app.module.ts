import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ItemsStateService } from './core/states/items-state.service';
import { AppComponent } from './app.component';
import { ItemsApiService } from './core/services/items-api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ShipmentsApiService } from './core/services/shipments-api.service';
import { ShipmentsStateService } from './core/states/shipments-state.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    ToastComponent
  ],
  providers: [ItemsStateService, ItemsApiService, {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiUrlInterceptor,
    multi: true,
  },
    ShipmentsStateService, ShipmentsApiService,],
  bootstrap: [AppComponent]
})
export class AppModule {
}
