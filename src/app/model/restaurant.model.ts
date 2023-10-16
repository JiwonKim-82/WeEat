export class Restaurant {
    id: string;        // Unique identifier for the restaurant
    name: string;      // Name of the restaurant
    location: string;  // Address of the restaurant
    category: string;  // Category of cuisine 
    imageUrl: string;  // URL to the restaurant's image
    price?: string;    // Optional price range for the restaurant
  
    constructor(
      id: string,
      name: string,
      location: string,
      category: string,
      imageUrl: string,
      price?: string  // Make the price optional
    ) {
      this.id = id;
      this.name = name;
      this.location = location;
      this.category = category;
      this.imageUrl = imageUrl;
      this.price = price;
    }
  }