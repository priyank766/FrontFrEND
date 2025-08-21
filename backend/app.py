from flask import Flask, jsonify, request
import os
import json

app = Flask(__name__)

@app.route('/api/demo/new-feature')
def get_demo_feature():
    base_path = os.path.join(app.root_path, '..', 'new-feature')
    original_path = os.path.join(base_path, 'original')
    modified_path = os.path.join(base_path, 'modified')

    response = {
        'original': {},
        'modified': {}
    }

    for file_name in os.listdir(original_path):
        with open(os.path.join(original_path, file_name), 'r') as f:
            response['original'][file_name] = f.read()

    for file_name in os.listdir(modified_path):
        with open(os.path.join(modified_path, file_name), 'r') as f:
            response['modified'][file_name] = f.read()

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Using a different port to avoid conflict with frontend dev server
