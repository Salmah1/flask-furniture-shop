# Furniture Shop

A full-stack furniture e-commerce web application built with Flask, SQLAlchemy, SQLite, HTML, CSS, and JavaScript. The platform focuses on sustainable furniture shopping while providing a range of accessibility features to improve the user experience for all users.

## Overview

Furniture Shop is an online furniture store that allows users to browse products, view detailed product information, manage a shopping basket, and complete a simulated checkout process.

The application also incorporates accessibility-focused functionality, including dark mode, adjustable text size, brightness controls, dyslexia-friendly fonts, and text-to-speech support.

## Features

### Shopping Features

- Browse furniture products
- View detailed product information
- Add products to a shopping basket
- Update item quantities
- Remove individual items from the basket
- Clear the entire basket
- Checkout and payment form
- Order confirmation page
- Responsive user interface

### Product Discovery

- Live product search
- Product sorting by:
  - Name
  - Price
  - Environmental Impact
- Dynamic product descriptions using AJAX

### Sustainability Features

- Environmental impact ratings displayed for each product
- Carbon footprint indicators for furniture items
- Visual sustainability badges

### Accessibility Features

- Dark mode
- Adjustable text size
- Brightness controls
- OpenDyslexic font support
- Text-to-speech functionality
- Keyboard-accessible controls
- Persistent accessibility preferences using local storage

## Technologies

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- SQLite
- Jinja2

### Frontend

- HTML5
- CSS3
- JavaScript
- jQuery
- Bootstrap

### Deployment

- Gunicorn
- Render

## Project Structure

```text
flask-furniture-shop/
│
├── app/
│   ├── instance/
│   │   └── data.sqlite3
│   │
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── ProductPage.html
│   │   ├── ShoppingBasket.html
│   │   ├── PaymentPage.html
│   │   ├── PaymentSuccessfulPage.html
│   │   └── Error.html
│   │
│   ├── static/
│   │   ├── styles/
│   │   ├── js/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── app.py
│   └── Items_DB.py
│
├── screenshots/
│
├── Procfile
├── runtime.txt
├── requirements.txt
└── README.md
```

## Requirements

- Python 3.10+
- Flask
- Flask-SQLAlchemy

## Installation

### Clone the Repository

```bash
git clone https://github.com/Salmah1/flask-furniture-shop.git
cd flask-furniture-shop
```

### Create a Virtual Environment

```bash
python -m venv venv
```

### Activate the Virtual Environment

#### macOS/Linux

```bash
source venv/bin/activate
```

#### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application Locally

Start the Flask server:

```bash
python app/app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5001
```

## Database

The application uses SQLite with SQLAlchemy ORM.

On first launch, the database is automatically created and populated with sample furniture products if no existing data is found.

## Screenshots

### Home Page

![Home Page](screenshots/home-page.png)

### Product Page

![Product Page](screenshots/product-page.png)

### Shopping Basket

![Shopping Basket](screenshots/shopping-basket.png)

### Checkout

![Checkout](screenshots/payment-page.png)

### Accessibility Settings

![Accessibility Settings](screenshots/accessibility-settings.png)

### Order Confirmation

![Order Confirmation](screenshots/order-confirmation.png)
