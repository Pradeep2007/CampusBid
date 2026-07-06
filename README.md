CampusBid/
├── .gitignore
├── client/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Footer.jsx
│   │   │       └── Navbar.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AuctionList.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── CreateAuction.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ItemDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MeetupHandshake.jsx
│   │   │   ├── MyAuctions.jsx
│   │   │   ├── MyBids.jsx
│   │   │   └── Profile.jsx
│   │   └── store/
│   │       ├── slices/
│   │       │   └── authSlice.js
│   │       └── store.js
│   ├── vercel.json
│   └── vite.config.js
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── itemController.js
    │   └── transactionController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── Item.js
    │   ├── OTP.js
    │   ├── Transaction.js
    │   └── User.js
    ├── package-lock.json
    ├── package.json
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── itemRoutes.js
    │   └── transactionRoutes.js
    ├── server.js
    ├── services/
    │   └── auctionCron.js
    ├── sockets/
    │   └── bidHandler.js
    └── utils/
        ├── cloudinary.js
        └── emailService.js
