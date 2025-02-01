# Initial Setup  

## Required Software  
- **MySQL** (Ensure it's running before proceeding)  

## Steps:  
1. **Start MySQL** if it's not already running.  
2. **Set up environment variables**:  
   - Copy the content from the email into the `.env` file.  
   - Update the following values in `.env`:  
     - `DB_USER`  
     - `DB_PASSWORD`  
     - `DB_DATABASE` (Use a unique name, as the migration script will recreate the schema)  
3. **Install dependencies**:  
   ```sh
   npm install
   ```  

---

## Run Migration Script  
```sh
npm run migration
```  

---

## Run Seed Script  
```sh
npm run seed
```  
This will create two users:  

```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "password": "admin"
  },
  {
    "id": 2,
    "name": "Regular User",
    "email": "user@example.com",
    "role": "user",
    "password": "user"
  }
]
```  

---

## Run The Server  
```sh
npm run dev
```  

---

## How to Use the Server  
1. Open Swagger documentation: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
2. Log in using the `/auth/login` route with the user credential above.  
3. Use the JWT token from the response and add it by clicking the **Authorize** button (top right in Swagger UI).
4. After above steps you can use the `/user` routes
---
## Refer [video](https://drive.google.com/file/d/1zlXfdm-EQsgOzfvk1z7SQply5_yq_NDw/view?usp=drive_link) for demo 

