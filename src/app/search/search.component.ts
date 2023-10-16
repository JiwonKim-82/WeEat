import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Restaurant } from '../model/restaurant.model';
import { MatDialog } from '@angular/material/dialog';
import { PostingComponent } from './posting/posting.component';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy{

  searchText: string = '';
  keyword: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  totalResponse: number = 0;
  pageArray: number[] = [1, 2, 3, 4, 5];
  restaurants: Restaurant[]|null;
  subscription: Subscription | null;
  isLoading: boolean = true;
  error: string = 'No matching restaurants found. Please try again.';

  constructor(
    private searchService: SearchService,
    private dialogRef: MatDialog){}

 
  ngOnInit(): void {
  // Check if there's stored search data, if not, use a default value.

  const searchData = localStorage.getItem('searchData');
    if (searchData) {
      this.searchText = JSON.parse(searchData)[0];
      this.keyword = JSON.parse(searchData)[1];
    } else {
      this.searchText = 'Toronto';
    }
    // Fetch the initial data from the API.
    this.subscription = this.searchService.getRestaurants(this.searchText, this.keyword, 0).subscribe(response => {
      this.restaurants = response.restaurants;
      this.totalResponse = response.total
      this.isLoading = false;
      this.totalPages = Math.ceil(this.totalResponse / 5);      
    });
  }  


  onSearch(){
    // Reset values when searching
    this.isLoading = true;
    this.currentPage = 1;
    this.pageArray = [1,2,3,4,5]

    // Fetch data based on the search criteria.
    this.subscription = this.searchService.getRestaurants(this.searchText, this.keyword, 0)
    .subscribe(
      (res) => {
        this.restaurants = res.restaurants;
        this.totalResponse = res.total;
        this.isLoading = false;
        localStorage.setItem('searchData', JSON.stringify([this.searchText, this.keyword]))
      },
      err=> {
      this.error = "There is no matching restaurant. Try again"
      }
    ) 
  }

  getRestaurantByOffset(){
    this.isLoading = true;
    const offset = (this.currentPage - 1) * 5

    // Fetch data with pagination.
    this.subscription = this.searchService.getRestaurants(this.searchText, this.keyword, offset)
    .subscribe(
      (res) => {
        this.isLoading = false;
        this.restaurants = res.restaurants;
      },
      (err) => {
        alert('Something went wrong')
      }
    ) 
  }

  previousPage() {
    if (this.currentPage === 1) {
      return; // Already on the first page, do nothing
    } else if (this.currentPage === 2) {
      this.currentPage = 1;
    } else if (this.currentPage === 3) {
      this.currentPage = 2;
    } else if (this.currentPage === this.totalPages - 2) {
      this.currentPage = this.totalPages - 3;
    } else if (this.currentPage === this.totalPages - 1) {
      this.currentPage = this.totalPages - 2;
    } else if (this.currentPage === this.totalPages) {
      this.currentPage = this.totalPages - 1;
    } else {
      for (let i = 0; i < this.pageArray.length; i++) {
        this.pageArray[i]--;
      }
      this.currentPage = this.pageArray[2];
    }
    this.getRestaurantByOffset()
  }

  nextPage() {
      if (this.currentPage == 1){
        this.currentPage = 2
      } else if (this.currentPage == 2) {
        this.currentPage = 3
      } else if (this.currentPage == this.totalPages - 2) {
        this.currentPage = this.totalPages - 1
      } else if (this.currentPage == this.totalPages - 1){
        this.currentPage = this.totalPages
      } else if (this.currentPage == this.totalPages) {
        return
      } else {
        for(let i=0; i<this.pageArray.length; i++){
          this.pageArray[i]++
        }
        this.currentPage = this.pageArray[2]
      }
      this.getRestaurantByOffset()
  }

  firstPage() {
    this.currentPage = 1
    this.pageArray = [1,2,3,4,5]
    this.getRestaurantByOffset()
  }

  lastPage() {
    this.pageArray = [this.totalPages-4, this.totalPages-3, this.totalPages-2, this.totalPages-1, this.totalPages]
    this.currentPage = this.totalPages
    this.getRestaurantByOffset()
  }

  openDialog(restaurant: Restaurant) {
    localStorage.removeItem('searchData');
    this.searchService.setSelectedRestaurant(restaurant);
    this.dialogRef.open(PostingComponent, {
      height: '80%',
      width: '600px',
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    localStorage.removeItem('searchData');
  }

}

