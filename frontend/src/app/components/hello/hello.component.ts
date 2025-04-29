import { Component, ViewEncapsulation } from '@angular/core';
import { HelloService } from '../../services/hello.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hello',
  imports: [FormsModule, RouterModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HelloComponent {
  name: string = "Piyush";
  message: string = '';

  constructor(private helloService: HelloService, private authService: AuthService) { }

  async ngOnInit() {
    await this.authService.init();
  }
  
  getMessage(): void {
    this.helloService.getHello(this.name).subscribe({
      next: (data) => {
        this.message = data;
      },
      error: (error) => {
        console.error("Request failed with error:", error);
        this.message = 'Error sending request';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
