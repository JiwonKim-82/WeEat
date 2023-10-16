import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = '/api/v3/businesses/search';
  private selectedRestaurantSubject = new BehaviorSubject<Restaurant | null>(null)
  restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);

  constructor(private http:HttpClient) {}

  setSelectedRestaurant(restaurant: Restaurant) {
    this.selectedRestaurantSubject.next(restaurant);
  }

  getSelectedRestaurant(): Observable<Restaurant | null> {
    return this.selectedRestaurantSubject.asObservable();
  }

  getRestaurants(city: string, keyword:string, newOffset: number):Observable<{ restaurants: Restaurant[], total: number }>{
    const headers = new HttpHeaders({
          'Authorization': 'Bearer 2sisBbGRMgR2XQpnm9mGtIc4tNco4qvLXFYMCjgvIAFoE2U-D6gQRAL1DzuIY_aqAbqAC7C6-fan-8SqsMOlRW0NV2iOLq6epnSWufSdA2Baf32wrg9n3Gcvb9_rZHYx',
          'accept': 'application/json'
        });
        return this.http.get(this.apiUrl + `?location=${city}&term=${keyword}&sort_by=best_match&limit=5&offset=${newOffset}`, {headers: headers})
        .pipe(
          map(response => {
            const restaurants = this.extractRestaurantData(response)[0];
            const totalResponse = this.extractRestaurantData(response)[1];
            // this.restaurantsSubject.next(restaurants);
            return { restaurants, total: totalResponse };
          }),
          catchError(()=>{
            return of({ restaurants: [], total: 0 });
          })
        )
  }

  // Extract restaurant data from the API response
  private extractRestaurantData(response: any){
    const restaurantsList: Restaurant[] = [];
    const total = response.total

    if(response && response.businesses){
      for (const item of response.businesses) {
        const restaurantPrice = item.price || ''
       const restaurant = new Restaurant(
        item.id,
        item.name,
        item.location.display_address.join(', '),
        item.categories[0].title,
        item.image_url,
        restaurantPrice
       )
      restaurantsList.push(restaurant)
      };
    }
    return [restaurantsList, total];
  }
}


