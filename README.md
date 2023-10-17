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


2. Clone the repository using the following command:

   ```sh
   git clone https://github.com/JiwonKim-82/WeEat
   ```

3. Install the necessary NPM packages:

   ```sh
   npm install
   ```
   
4. Create an "environments" file under the "src" directory.


5. In each "environment.ts" file, enter your Firebase keys and Yelp authorization  key as shown in the example below:

   ```js
   export const environment = {
  production: false,
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
   },
   yelpApi: 'YOUR-YELP-API-AUTH-KEY'
   }
   ```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


