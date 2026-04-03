# Inventory Management System

A RESTful API built with Node.js, Express, and MongoDB for managing product inventory.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- express-validator
- Render (deployment)

## Project Structure
inventory-system/
├── middleware/
│   ├── auth.js
│   └── validate.js
├── models/
│   ├── Product.js
│   ├── Category.js
│   └── Sale.js
├── routes/
│   ├── auth.js
│   └── products.js
├── .env
├── .gitignore
├── index.js
└── package.json

## Installation and Setup

1. Clone the repository:
git clone https://github.com/Juju1240/inventory-system.git

2. Navigate into the project folder:
cd inventory-system

3. Install dependencies:
npm install

4. Create a `.env` file in the root folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

5. Start the server:
node index.js

The server runs on `http://localhost:3000`

## Live Deployment
https://inventory-system-59hu.onrender.com

---

## API Endpoints

### Authentication

#### Register a user
POST /auth/register
Body:
```json
{
  "username": "admin",
  "password": "password123"
}
```
Response:
```json
{
  "message": "User registered successfully"
}
```

#### Login
POST /auth/login
Body:
```json
{
  "username": "admin",
  "password": "password123"
}
```
Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Products
All product routes require a Bearer token in the Authorization header.

#### Add a product
POST /products
Body:
```json
{
  "name": "Wireless Headphones",
  "price": 99.99,
  "category": "Electronics",
  "quantity": 50,
  "description": "High quality wireless headphones"
}
```

#### Get all products
GET /products
Optional query parameters:
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)
- `sortBy` — field to sort by (default: createdAt)
- `sortOrder` — asc or desc (default: desc)
- `category` — filter by category
- `minPrice` — minimum price filter
- `maxPrice` — maximum price filter
- `search` — search by product name

Example:
GET /products?category=Electronics&minPrice=50&maxPrice=200&page=1&limit=5

#### Get one product
GET /products/:id

#### Update a product
PATCH /products/:id
Body (only include fields you want to change):
```json
{
  "price": 79.99
}
```

#### Delete a product
DELETE /products/:id

#### Bulk insert products
POST /products/bulk
Body:
```json
{
  "products": [
    {
      "name": "Gaming Mouse",
      "price": 49.99,
      "category": "Electronics",
      "quantity": 30
    },
    {
      "name": "Desk Lamp",
      "price": 24.99,
      "category": "Office",
      "quantity": 60
    }
  ]
}
```

#### Get analytics
GET /products/stats/analytics
Returns total products, average price, total inventory value broken down by category and overall.

---

## Database Design

### Product Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Product name |
| price | Number | Yes | Product price |
| category | String | Yes | Product category |
| quantity | Number | Yes | Stock quantity |
| description | String | No | Product description |
| inStock | Boolean | No | Defaults to true |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

### Category Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Category name (unique) |
| description | String | No | Category description |

### Sale Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product | ObjectId | Yes | Reference to Product |
| quantitySold | Number | Yes | Units sold |
| totalPrice | Number | Yes | Total sale value |
| saleDate | Date | Auto | Date of sale |

---

## Security Implementation

### Authentication
All product routes are protected using JSON Web Tokens (JWT). A user must register and log in to receive a token. That token must be included in every request as a Bearer token in the Authorization header.

### Input Validation
All POST requests to `/products` are validated using express-validator. The API checks that name and category are non-empty strings, price is a positive number, and quantity is a non-negative integer. Invalid requests are rejected with descriptive error messages before reaching the database.

### Password Security
User passwords are hashed using bcryptjs with a salt round of 10 before being stored. Plain text passwords are never saved anywhere.

### Environment Variables
All sensitive credentials including the MongoDB connection string and JWT secret are stored in a `.env` file which is excluded from version control via `.gitignore`.

### MongoDB Atlas Network Security
The database is hosted on MongoDB Atlas which provides built-in encryption at rest, TLS encryption in transit, and IP whitelisting capabilities.

---

## Indexing

Indexes are created on the following fields to optimise query performance:
- `name` — for fast name-based searches
- `category` — for fast category filtering
- `price` — for fast price range queries

---

## Design Decisions

**Why MongoDB?**
MongoDB's document model is a natural fit for product inventory where products can have varying attributes depending on their category. A laptop has different attributes to a t-shirt, and MongoDB handles this flexibility without requiring schema changes.

**Why Mongoose?**
Mongoose adds schema validation, middleware support, and a clean query API on top of the raw MongoDB driver, making the code more maintainable and less error-prone.

**Why JWT for authentication?**
JWT tokens are stateless, meaning the server does not need to store session data. This makes the API scalable and suitable for deployment on cloud platforms like Render.

**Why Render for deployment?**
Render offers free tier hosting for Node.js applications with automatic deployments from GitHub, making it ideal for this project.