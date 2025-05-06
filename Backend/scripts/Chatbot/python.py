from flask import Flask, request, jsonify, render_template, send_from_directory
import wikipediaapi
from openai import OpenAI
import os
from flask_cors import CORS
from waitress import serve
from dotenv import load_dotenv
import logging

# Configuration
load_dotenv()
app = Flask(__name__)

# Configuration CORS pour le développement Angular
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200"],  # URL de développement Angular
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

PORT = int(os.getenv('PORT', 5002))
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
FLASK_ENV = os.getenv('FLASK_ENV', 'production')

# Chemin vers le build Angular
ANGULAR_DIST_DIR = os.path.join(os.path.dirname(__file__), '..', 'angular-dist')

# Initialize APIs
wiki = wikipediaapi.Wikipedia(
    user_agent="MyWikipediaApp/1.0 (yassineselmi007@gmail.com)",
    language="en"
)
client = OpenAI(api_key=OPENAI_API_KEY)

# Routes pour l'interface web Flask (mode standalone)
@app.route('/flask-ui')
def flask_ui():
    """Route alternative pour l'interface Flask originale"""
    return render_template('index.html')

# Route pour servir Angular (production)
@app.route('/')
def serve_angular():
    if FLASK_ENV == 'production' and os.path.exists(ANGULAR_DIST_DIR):
        return send_from_directory(ANGULAR_DIST_DIR, 'index.html')
    return render_template('index.html')  # Fallback vers l'interface Flask

# Route pour les fichiers statiques d'Angular
@app.route('/<path:path>')
def serve_static(path):
    if FLASK_ENV == 'production' and os.path.exists(ANGULAR_DIST_DIR):
        full_path = os.path.join(ANGULAR_DIST_DIR, path)
        if os.path.exists(full_path):
            return send_from_directory(ANGULAR_DIST_DIR, path)
    return send_from_directory('static', path)  # Fallback vers les fichiers statiques Flask

# API Route
@app.route('/api/chat', methods=['POST'])
def handle_query():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    user_query = data.get('query', '').strip()

    if not user_query:
        return jsonify({"error": "Query cannot be empty"}), 400

    try:
        suggested_article = query_openai(user_query)
        wiki_content = fetch_wikipedia_content(suggested_article) if suggested_article else None

        return jsonify({
            "query": user_query,
            "suggested_article": suggested_article,
            "content": wiki_content or "No content found",
            "success": bool(wiki_content)
        })

    except Exception as e:
        logging.error(f"API Error: {str(e)}")
        return jsonify({"error": "Internal server error", "success": False}), 500

# Helper functions
def query_openai(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"Suggest exactly one Wikipedia article for: {prompt}. Reply ONLY with the article name."
            }],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"OpenAI query failed: {str(e)}")
        return None

def fetch_wikipedia_content(topic: str) -> str:
    if not topic:
        return None
    try:
        page = wiki.page(topic)
        return page.text if page.exists() else None
    except Exception as e:
        logging.error(f"Wikipedia fetch failed: {str(e)}")
        return None

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    
    if FLASK_ENV == 'development':
        logging.info("Running in development mode (Flask UI)")
        app.run(host='0.0.0.0', port=PORT, debug=DEBUG, use_reloader=False)
    else:
        if os.path.exists(ANGULAR_DIST_DIR):
            logging.info(f"Serving Angular app from {ANGULAR_DIST_DIR}")
        else:
            logging.warning("Angular dist directory not found, falling back to Flask UI")
        
        logging.info(f"\n=== Server running on: http://0.0.0.0:{PORT} ===")
        logging.info(f"=== Access locally via: http://127.0.0.1:{PORT} ===")
        logging.info(f"=== API endpoint: http://127.0.0.1:{PORT}/api/chat ===\n")
        
        serve(app, host='0.0.0.0', port=PORT)