# Cool2Care Enhanced - Smart Living & Electronics Hub

![Cool2Care Banner](https://via.placeholder.com/1200x300/2563eb/ffffff?text=Cool2Care+Enhanced)

Cool2Care Enhanced is a comprehensive full-stack MERN application that combines **Smart Refrigerator Management** with a complete **Electronics Marketplace**. Users can manage their smart fridge inventory while also buying and selling electronics in a secure, feature-rich platform.

## 🌟 Key Features

### 🧊 Smart Refrigerator Management
- **Intelligent Food Tracking**: Automatic expiry date calculation for 12+ food categories
- **Real-time Monitoring**: Temperature, humidity, and power status display
- **Smart Notifications**: Alerts for items expiring within 2 days
- **Inventory Management**: Add, edit, and remove food items with quantities
- **Expiry Analytics**: Track food waste and consumption patterns

### 📱 Electronics Marketplace
- **Buy & Sell Electronics**: Complete marketplace for new and used electronics
- **Advanced Search**: Filter by category, brand, condition, price, and location
- **Product Categories**: Smartphones, laptops, gaming, audio, cameras, and more
- **Condition Ratings**: New, Like-new, Good, Fair, Poor condition classifications
- **User Reviews**: Rating and review system with helpful voting
- **Seller Profiles**: Comprehensive seller verification and rating system

### 🛒 E-Commerce Features
- **Shopping Cart**: Persistent cart with quantity management
- **Order Management**: Complete order lifecycle from purchase to delivery
- **Payment Integration**: Ready for Stripe/PayPal integration
- **Order Tracking**: Real-time order status updates
- **Wishlist**: Save favorite products for later

### 👤 User Management
- **Dual User Types**: Regular users and verified sellers
- **Profile Management**: Complete user profiles with multiple addresses
- **Seller Dashboard**: Manage products, orders, and sales analytics
- **Address Management**: Multiple shipping addresses
- **Authentication**: Secure JWT-based authentication

## 🛠 Tech Stack

### Backend
- **Node.js & Express.js** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Modern icon library

### Development Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Nodemon** - Development server

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cool2care-enhanced-mern
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install

   # Configure environment variables
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT secret

   # Start the server
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install

   # Start the development server
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/cool2care
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Optional: For production features
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🚀 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
GET  /api/auth/me          - Get current user
PUT  /api/auth/profile     - Update profile
POST /api/auth/become-seller - Become a seller
```

### Smart Fridge Endpoints
```
GET  /api/items            - Get user's food items
POST /api/items            - Add food item
PUT  /api/items/:id        - Update food item
DELETE /api/items/:id      - Delete food item
GET  /api/fridge/status    - Get fridge status
```

### Electronics Marketplace Endpoints
```
GET  /api/electronics      - Get all products (with filters)
GET  /api/electronics/:id  - Get single product
POST /api/electronics      - Create product (sellers)
PUT  /api/electronics/:id  - Update product (owner)
DELETE /api/electronics/:id - Delete product (owner)
```

### Order Management Endpoints
```
GET  /api/orders/myorders  - Get user orders
GET  /api/orders/seller    - Get seller orders
POST /api/orders           - Create new order
PUT  /api/orders/:id/pay   - Mark order as paid
```

### Review System Endpoints
```
GET  /api/reviews/product/:id - Get product reviews
POST /api/reviews            - Create review
PUT  /api/reviews/:id        - Update review
DELETE /api/reviews/:id      - Delete review
```

## 🎯 Usage Guide

### For Regular Users
1. **Register/Login** to access the platform
2. **Smart Fridge**: Add food items and track expiry dates
3. **Browse Electronics**: Search and filter products
4. **Shopping**: Add to cart and place orders
5. **Reviews**: Rate and review purchased products

### For Sellers
1. **Become a Seller** through the profile section
2. **List Products** with detailed descriptions and images
3. **Manage Inventory** through the seller dashboard
4. **Process Orders** and update delivery status
5. **Track Performance** with built-in analytics

## 📊 Project Structure

```
cool2care-enhanced-mern/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/         # Authentication & validation
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🔧 Available Scripts

### Backend
```bash
npm start          # Production server
npm run dev        # Development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint code
```

## 🌟 Key Features Showcase

### Smart Fridge Dashboard
- Visual temperature display
- Expiry notifications
- Food categorization
- Automatic expiry calculation

### Electronics Marketplace
- Advanced product search
- Image galleries
- Seller verification
- Condition-based pricing

### User Experience
- Responsive design
- Real-time notifications
- Intuitive navigation
- Modern UI/UX

## 📈 Future Enhancements

### Phase 2 Features
- [ ] **AI-Powered Recommendations**: Smart product suggestions
- [ ] **Barcode Scanning**: Quick product identification
- [ ] **Recipe Suggestions**: Based on expiring ingredients  
- [ ] **Mobile App**: React Native mobile application
- [ ] **IoT Integration**: Real smart fridge connectivity
- [ ] **Social Features**: Product sharing and community

### Phase 3 Features
- [ ] **Multi-vendor Support**: Complete marketplace platform
- [ ] **Advanced Analytics**: Business intelligence dashboard
- [ ] **International Support**: Multi-currency and language
- [ ] **AI Chatbot**: Customer support automation
- [ ] **Blockchain Integration**: Product authenticity verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: Cool2Care Engineering
- **UI/UX Design**: Cool2Care Design Team
- **Product Management**: Cool2Care Product Team

## 📞 Support

For support, email support@cool2care.com or join our Slack channel.

## 🎉 Acknowledgments

- React community for excellent documentation
- MongoDB team for the robust database
- Express.js contributors
- Open source community

---

**Built with ❤️ using the MERN Stack**

*Cool2Care Enhanced - Where Smart Living Meets Smart Shopping*