import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { StaticPipe } from './pipes/static.pipe';
import { AuthService } from './services/auth.service';
import { ItemService } from './services/item.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { UpdateProfileComponent } from './account/update-profile/update-profile.component';
import { ViewTransactionComponent } from './account/view-transaction/view-transaction.component';
import { WorkSpaceComponent } from './account/work-space/work-space.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { FeaturedServicesComponent } from './home/featured-services/featured-services.component';


@NgModule({
  declarations: [
    AppComponent,
    StaticPipe,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    UpdateProfileComponent,
    ViewTransactionComponent,
    WorkSpaceComponent,
    CarouselComponent,
    FeaturedServicesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule
  ],
  providers: [AuthService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
