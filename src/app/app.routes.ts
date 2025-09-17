import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { NewArrivalsComponent } from './pages/new-arrivals/new-arrivals.component';
import { TopsellingComponent } from './pages/topselling/topselling.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductsComponent } from './pages/products/products.component';
import { MenClothesComponent } from './pages/men-clothes/men-clothes.component';
import { WamenComponent } from './pages/wamen/wamen.component';
import { Component } from '@angular/core';
import { JeweleryComponent } from './pages/jewelery/jewelery.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { TermsComponent } from './pages/terms/terms.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent,canActivate:[authGuard]},
  { path: 'newarrivals', component: NewArrivalsComponent },
  {path:'topselling',component:TopsellingComponent},
  {path:'cart',component:CartComponent,canActivate:[authGuard]},
  {path:'product',component:ProductsComponent},
  {path:'men',component:MenClothesComponent},
  {path:'Wamon',component:WamenComponent},
  {path:'jewelery',component:JeweleryComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  { path: 'terms', component: TermsComponent },
  {path:'checkout',component:CheckoutComponent},
  {path:'**',component:NotFoundComponent}


];
