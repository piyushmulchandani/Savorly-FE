import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8081',
    realm: 'Savorly',
    clientId: 'savorly-rest-api',
  });

  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {}

  async init(): Promise<boolean> {

    if (this.isInitialized) {
      return true;
    }

    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = (async () => {
      try {
        const authenticated = await this.keycloak.init({ onLoad: 'login-required' });
        this.isInitialized = true;

        if (authenticated && !sessionStorage.getItem('authSuccessLogged')) {
          console.log('Authentication successful!');
          this.notifyLogin();
          sessionStorage.setItem('authSuccessLogged', 'true');
        }

        return true;
      } catch (error) {
        console.error('Keycloak initialization failed', error);
        return false;
      }
    })();

    return this.initPromise;
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    sessionStorage.removeItem('authSuccessLogged');
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string {
    return this.keycloak.token || '';
  }

  isAuthenticated(): boolean {
    return this.keycloak.authenticated || false;
  }

  getUsername(): string | null {
    if (this.keycloak.authenticated && this.keycloak.tokenParsed) {
      return this.keycloak.tokenParsed['preferred_username'];
    }
    return null;
  }

  private async notifyLogin(): Promise<void> {
    const username = this.keycloak.tokenParsed?.['preferred_username'];
    const token = this.keycloak.token;

    if (username) {
      try {
        const response = await fetch('http://localhost:8080/api/v1/users/login/' + username, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('Backend notified successfully');
      } catch (error) {
        console.error('Error notifying backend:', error);
      }
    } else {
      console.error('Username not found in Keycloak token');
    }
  }
    
}
