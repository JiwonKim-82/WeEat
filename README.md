# WeEat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.5.

## About The Project

A Food Social Media Web Application “We-Eat”, using Angular and Firebase, enabling users to share restaurant experiences, manage friends, and explore a curated list of restaurants.

##  Built With

* Angular: service, model, directive, image-cropper, guards, life-cycle hooks etc.
* Firebase: data storage, authentication, and REST API calls
* Yelp API: restaurant data
* Angular Material and Bootstrap: UI design
* Custom CSS: styling

## Getting Started

### Installation

1. Get a free API Key at [https://docs.developer.yelp.com/](https://docs.developer.yelp.com/)

2. Clone the repo
   ```sh
   git clone https://github.com/JiwonKim-82/WeEat
   ```

3. Install NPM packages
   ```sh
   npm install
   ```
   
4. Enter your Firebase Keys in `environment.ts`
   ```js
   export const environment = {
    production: true,
    firebase: {
    projectId: '',
    appId: '',
    databaseURL: '',
    storageBucket: '',
    locationId: '',
    apiKey: '',
    authDomain: '',
    messagingSenderId: '',
    measurementId: '',
    }
    }
   ```

5. Enter your api authorization key from Yelp in `service/search.service.ts`
   ```sh
   const headers = new HttpHeaders({
          'Authorization': 'YOUR-AUTH-KEY',
          'accept': 'application/json'
        });
   ```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


