"""Flask app for Cupcakes"""
from flask import Flask, request, jsonify, render_template

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "oh-so-secret"

connect_db(app)

@app.route('/')
def cupcakes():
    return render_template('index.html')

@app.route('/api/cupcakes')
def get_cupcakes():
    
    cupcakes = Cupcake.query.all()
    serialize = [cupcake.serialize() for cupcake in cupcakes]
    
    return (jsonify(cupcakes=serialize), 200)

@app.route('/api/cupcakes/<int:cupcake_id>')
def get_cupcake_id(cupcake_id):

    cupcake = Cupcake.query.get_or_404(cupcake_id)

    return (jsonify(cupcake=cupcake.serialize()), 200)

@app.route('/api/cupcakes', methods=['POST'])
def add_cupcake():

    flavor = request.json['flavor']
    size = request.json['size']
    rating = request.json['rating']
    image = request.json['image'] if request.json['image'] else None

    cupcake = Cupcake(flavor=flavor,size=size,rating=rating,image=image)

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()), 201)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def patch_cupcake(cupcake_id):

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    
    cupcake.flavor = request.json['flavor'] if request.json['flavor'] else cupcake.flavor
    cupcake.size = request.json['size'] if request.json['size'] else cupcake.size
    cupcake.rating = request.json['rating'] if request.json['rating'] else cupcake.rating
    cupcake.image = request.json['image'] if request.json['image'] else cupcake.image

    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()))

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):

    cupcake = Cupcake.query.get_or_404(cupcake_id)

    db.session.delete(cupcake)
    db.session.commit()

    return jsonify({'message':'Deleted'})
