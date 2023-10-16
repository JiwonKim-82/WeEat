import { Restaurant } from "src/app/model/restaurant.model";

export class Post {
  restaurant: Restaurant; // The restaurant associated with the post
  description: string;    // A description for the post
  isFavorite: boolean;   // Indicates if the post is marked as a favorite
  fileUrl: string;       // URL to an attached image file
  timestamp?: string;    // Optional timestamp for when the post was created

  constructor(
    restaurant: Restaurant,
    description: string,
    isFavorite: boolean,
    fileUrl: string,     // Add file URL to the constructor
    timestamp?: string  // Make the timestamp optional
  ) {
    this.restaurant = restaurant;
    this.description = description;
    this.isFavorite = isFavorite;
    this.fileUrl = fileUrl;
    this.timestamp = timestamp;
  }
}