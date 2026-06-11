from app import app, db, Furniture

# Sample data for furniture items
furniture = [
    {"name": "Ashford Dining Table", "price": 549, "description": "This table seamlessly merges form and function, featuring an extendable top that effortlessly accommodates up to six guests, making it perfect for intimate family dinners.", "image": "images/table_1.jpg", "carbon": 1.45},
    {"name": "Harlow Dining Table", "price": 149, "description": "Step into the world of the Ezra range with this exquisite dining table, an absolute must-have for your home! Elevating your dining experience to a whole new level.", "image": "images/table_2.jpg", "carbon": 2.15},
    {"name": "Brooklyn Dining Table", "price": 229, "description": "Crafted with a sleek metal frame, this piece boasts a design that seamlessly blends with any decor. Perfect for intimate gatherings, this table redefines modern sophistication.", "image": "images/table_3.jpg", "carbon": 2.85},
    {"name": "Ashford Dining Chair", "price": 199, "description": "This dining chair blends seamlessly with various styles while adding sophistication to your dining area. It creates an inviting and comfortable seating experience.", "image": "images/chair_1.jpg", "carbon": 1.25},
    {"name": "Harlow Dining Chair", "price": 139, "description": "The Melia Dining Chairs are one to have if you're looking to elevate the style in your dining space. The Melia chair has a rustic homely feel that looks great in any home.", "image": "images/chair_2.jpg", "carbon": 2.05},
    {"name": "Brooklyn Dining Chair", "price": 99, "description": "The chair's sleek silhouette and PU leather upholstery radiates contemporary elegance, providing a luxurious and sophisticated look for your dining area.", "image": "images/chair_3.jpg", "carbon": 1.18}
]

# Create database tables and insert sample data
with app.app_context():
    db.create_all()

    for item in furniture:
        newFurniture = Furniture(name=item['name'], price=item['price'], description=item['description'], image=item['image'], carbon=item['carbon'])
        db.session.add(newFurniture)

    db.session.commit()