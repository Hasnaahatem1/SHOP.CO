import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserauthService } from '../../../core/services/auth/userauth.service';
import { CartServicesService } from '../../../core/services/cart/cart-services.service';
import { IProduct } from '../../../Model/i-product';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  currentUser: string | null = null; // ← نضيف هذا
  showHomeLink: boolean = false;
  cartCount: number = 0;

  private sub: Subscription = new Subscription();

  constructor(
    private authService: UserauthService,
    private router: Router,
    private cartService: CartServicesService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getUserLogged();
    this.currentUser = this.authService.getCurrentUser(); // ← نقرأ اسم المستخدم

    this.sub.add(
      this.authService.getAuthSubject().subscribe(status => {
        this.isLoggedIn = status;
        this.currentUser = this.authService.getCurrentUser(); // ← نحدّث اسم المستخدم عند أي تغيير
      })
    );

    // متابعة تغييرات الراوتر لتحديد ظهور Home link
    this.sub.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          const navEnd = event as NavigationEnd;
          this.showHomeLink = !(navEnd.urlAfterRedirects === '/' || navEnd.urlAfterRedirects === '/home');
        })
    );

    // متابعة عدد المنتجات في الكارت
    this.sub.add(
      this.cartService.cart$.subscribe((cart: IProduct[]) => {
        this.cartCount = cart.length;
      })
    );
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

