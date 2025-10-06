import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { coreConfig } from 'app/app-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';


const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'security',
    loadChildren: () => import('./main/security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'current-standard',
    loadChildren: () => import('./main/current-standard/current-standard.module').then(m => m.CurrentStandardModule)
  },
  {
    path: 'mantto',
    loadChildren: () => import('./main/sample/sample.module').then(m => m.SampleModule)
  },
  {
    path: 'gap',
    loadChildren: () => import('./main/gap/gap.module').then(m => m.GapModule)
  },
  {
    path: 'risks',
    loadChildren: () => import('./main/risks/risks.module').then(m => m.RisksModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    FormsModule,
    // App modules
    LayoutModule,
    //SampleModule,
    //CustomComponentsModule,
    //SecurityModule,


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
