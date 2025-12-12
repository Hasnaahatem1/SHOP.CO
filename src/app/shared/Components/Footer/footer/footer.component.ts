import { Component } from '@angular/core';

import { FirebaseService } from '../../../../core/services/firebase-service.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
email: string = '';

  constructor(private firebaseService: FirebaseService) {}

  subscribe() {
    if (!this.email) {
      alert('Please enter a valid email');
      return;
    }

    this.firebaseService.addSubscriber(this.email)
      .then(() => {
        alert('Thank you for subscribing!');
        this.email = '';
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong!');
      });
  }
}
