from flask import Flask, redirect, render_template, session, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from jinja2 import TemplateNotFound
import os

app = Flask(__name__)
# Secret key used for Flask sessions


app.config['SECRET_KEY'] = os.environ.get(
    "SECRET_KEY",
    "dev-secret-key"
)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.sqlite3'

db = SQLAlchemy(app)

# Furniture model for database
class Furniture(db.Model):
    __tablename__ = 'furniture'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.String(128))
    carbon = db.Column(db.Float, nullable=False)


with app.app_context():
    db.create_all()

    if Furniture.query.count() == 0:
        furniture = [
            {
                "name": "Ashford Dining Table",
                "price": 549,
                "description": "This table seamlessly merges form and function, featuring an extendable top that effortlessly accommodates up to six guests, making it perfect for intimate family dinners.",
                "image": "images/table_1.jpg",
                "carbon": 1.45
            },
            {
                "name": "Harlow Dining Table",
                "price": 149,
                "description": "Step into the world of the Ezra range with this exquisite dining table, an absolute must-have for your home! Elevating your dining experience to a whole new level.",
                "image": "images/table_2.jpg",
                "carbon": 2.15
            },
            {
                "name": "Brooklyn Dining Table", 
                "price": 229, 
                "description": "Crafted with a sleek metal frame, this piece boasts a design that seamlessly blends with any decor. Perfect for intimate gatherings, this table redefines modern sophistication.", 
                "image": "images/table_3.jpg", 
                "carbon": 2.85
            },
            {
                "name": "Ashford Dining Chair", 
                "price": 199, 
                "description": "This dining chair blends seamlessly with various styles while adding sophistication to your dining area. It creates an inviting and comfortable seating experience.", 
                "image": "images/chair_1.jpg", 
                "carbon": 1.25
            },
            {
                "name": "Harlow Dining Chair", 
                "price": 139, 
                "description": "The Melia Dining Chairs are one to have if you're looking to elevate the style in your dining space. The Melia chair has a rustic homely feel that looks great in any home.", 
                "image": "images/chair_2.jpg", 
                "carbon": 2.05
            },
            {
                "name": "Brooklyn Dining Chair", 
                "price": 99, 
                "description": "The chair's sleek silhouette and PU leather upholstery radiates contemporary elegance, providing a luxurious and sophisticated look for your dining area.", 
                "image": "images/chair_3.jpg", 
                "carbon": 1.18
            }
       ]

        for item in furniture:
            db.session.add(Furniture(**item))

        db.session.commit()


# Route for homepage
@app.route('/')
def galleryPage():
    try:
        search_query = request.args.get('search', '')

        if search_query:
            furniture = Furniture.query.filter(
                Furniture.name.ilike(f"%{search_query}%")
            ).all()
        else:
            furniture = Furniture.query.all()
        
        return render_template('index.html', furniture=furniture)
    except TemplateNotFound as e:
        return f"Template not found: {e}", 404
    
    
# Route to return furniture description using AJAX
@app.route('/description/<int:itemId>')
def get_description(itemId):
    furniture = Furniture.query.get(itemId)

    if furniture:
        return {
            "description": furniture.description
        }

    return {
        "description": "Description unavailable."
    }, 404


# Route for individual product page
@app.route('/furniture/<int:itemId>', methods=['GET', 'POST'])
def productPage(itemId):
    furniture = Furniture.query.get_or_404(itemId)
    if request.method == 'POST':
        quantity = int(request.form['quantity'])
        basket_items = session.get('basket', [])

        # Check if the item already exists in the basket
        existing_item = next((item for item in basket_items if item['id'] == itemId), None)
        if existing_item:
            # Update the quantity and total price of the existing item
            existing_item['quantity'] += quantity
            existing_item['total'] = existing_item['quantity'] * existing_item['price']
        else:
            # Add the item to the basket
            basket_item = {
                'id': furniture.id,
                'name': furniture.name,
                'price': furniture.price,
                'quantity': quantity,
                'total': furniture.price * quantity,
                'image': furniture.image
            }
            basket_items.append(basket_item)

        session['basket'] = basket_items
        session.modified = True
        flash(f"{furniture.name} added to basket")
        return redirect(url_for('basket'))
    return render_template('ProductPage.html', furniture=furniture)


# Route for shopping basket
@app.route('/basket', methods=['GET', 'POST'])
def basket():
    basket_items = session.get('basket', [])
    total_price = 0

    # Filter out items with invalid prices
    valid_basket_items = []
    for item in basket_items:
        try:
            item_price = float(item['price'])
            if item_price > 0:
                item['total'] = item_price * item['quantity']
                valid_basket_items.append(item)
            else:
                print(f"Invalid price for item {item['name']}: {item['price']}")
        except ValueError:
            print(f"Invalid price for item {item['name']}: {item['price']}")

    if request.method == 'POST':
        item_id = request.form.get('item_id')
        action = request.form.get('action')

        # Clear basket
        if action == 'clear':
            valid_basket_items = []
        elif action == 'delete':
            valid_basket_items = [item for item in valid_basket_items if str(item['id']) != item_id]
        elif action == 'update':
            new_quantity = int(request.form.get('quantity'))
            for item in valid_basket_items:
                if str(item['id']) == item_id:
                    item['quantity'] = new_quantity
                    item['total'] = item['price'] * new_quantity

        session['basket'] = valid_basket_items
        session.modified = True

    total_price = sum(item['total'] for item in valid_basket_items)

    return render_template('ShoppingBasket.html', basket=valid_basket_items, total_price=total_price)

    
# Route for adding item to basket
@app.route('/add_to_basket/<int:furniture_id>', methods=['GET', 'POST'])
def add_to_basket(furniture_id):
    furniture = Furniture.query.get(furniture_id)
    if furniture:
        if 'basket' not in session:
            session['basket'] = []

        # Check if the item already exists in the basket
        existing_item = next((item for item in session['basket'] if item['id'] == furniture_id), None)
        if existing_item:
            # Update the quantity of the existing item
            existing_item['quantity'] += 1
            existing_item['total'] = existing_item['quantity'] * existing_item['price']
        else:
            # Add the item to the basket
            basket_item = {
                'id': furniture.id,
                'name': furniture.name,
                'price': furniture.price,
                'quantity': 1,  
                'total': furniture.price,
                'image': furniture.image
            }
            session['basket'].append(basket_item)

        session.modified = True

        flash(f"{furniture.name} added to basket")

        return redirect(url_for('basket'))
    return "Item not found", 404


@app.route('/checkout', methods=['GET', 'POST'])
def checkout():

    basket_items = session.get('basket', [])

    if not basket_items:
        return redirect(url_for('galleryPage'))

    total_price = sum(item['total'] for item in basket_items)

    return render_template(
        'PaymentPage.html',
        total_price=total_price
    )


# Route for successful checkout
@app.route('/successful_checkout', methods=['POST'])
def successful_checkout():

    # Empty basket after successful payment
    session.pop('basket', None)
    flash("Thank you for your order!")
    return render_template('PaymentSuccessfulPage.html')


# Error handler page
@app.errorhandler(Exception)
def handle_exception(e):
    return render_template("Error.html"), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)