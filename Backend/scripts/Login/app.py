from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Connexion MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  
    database="health"
)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()

    if user:
        return jsonify({
            "status": "success",
            "role": user["role"],
            "message": "Connexion réussie !"
        })
    else:
        return jsonify({"status": "fail", "message": "Email ou mot de passe invalide"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
    #app.run(debug=True)
