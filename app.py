from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory store (for demo). In production use a DB or persistent store.
reviews = []

@app.route('/reviews', methods=['POST'])
def receive_review():
    data = request.get_json() or {}
    review = data.get('review', '').strip()
    if not review:
        return jsonify({'error': 'Empty review'}), 400
    # Store review (not displayed back to client as requested)
    reviews.append({'review': review})
    return jsonify({'status': 'ok'}), 201

if __name__ == '__main__':
    app.run(debug=True)
