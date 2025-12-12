import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CartServicesService } from '../../../core/services/cart/cart-services.service';
import { IProduct } from '../../../Model/i-product';
import { AuthService } from '../../../core/services/auth/userauth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  currentUser: string | null = null;
  showHomeLink: boolean = false;

  cartCount: number = 0;
  searchTerm: string = '';

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/product'], { queryParams: { search: this.searchTerm } });
    } else {
      this.router.navigate(['/product']);
    }
  }

  private sub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartServicesService
  ) { }

  ngOnInit() {
    // Initial login state
    this.isLoggedIn = !!this.authService.getCurrentUser();
    this.currentUser = this.authService.getCurrentUser()?.displayName ?? null;

    // Subscribe to user changes
    this.sub.add(
      this.authService.getCurrentUserObservable().subscribe(user => {
        this.isLoggedIn = !!user;
        this.currentUser = user?.displayName ?? null;
      })
    );

    // Subscribe to router events with type guard
    this.sub.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(event => {
          this.showHomeLink = !(event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
        })
    );

    // Subscribe to cart count
    this.sub.add(
      this.cartService.getCount().subscribe(count => {
        this.cartCount = count;
      })
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
