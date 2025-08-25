import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ItemsStateService } from './core/states/items-state.service';
import { AppComponent } from './app.component';
import { ItemsApiService } from './core/services/items-api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule
  ],
  providers: [ItemsStateService, ItemsApiService,  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiUrlInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
