export class User {
    uid: string;                 // Unique identifier for the user
    userName: string;           // User's display name
    userNameLowercase: string;  // Lowercase version of the username for case-insensitive checks
    email: string;              // User's email address
    profileURL?: string;        // Optional URL to the user's profile picture
  
    constructor(
      uid: string,
      userName: string,
      userNameLowercase: string, 
      email: string,
      profileURL?: string      
    ) {
      this.uid = uid;
      this.userName = userName;
      this.userNameLowercase = userNameLowercase;
      this.email = email;
      this.profileURL = profileURL;
    }
  }
  

