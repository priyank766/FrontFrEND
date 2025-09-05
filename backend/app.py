from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
import json
import logging
from pathlib import Path
import threading
import queue

# Ensure the src directory is in the Python path for workflow.py imports
sys.path.append(str(Path(__file__).parent / "src"))

# Import the main workflow function
from workflow import main as run_workflow_main

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Configuration ---
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
LOGS_DIR = PROJECT_ROOT / "logs"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Setup basic logging for app.py
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOGS_DIR / "app.log"), logging.StreamHandler()],
)

# Global variable to store workflow results and messages
workflow_results = {}
workflow_messages_queue = queue.Queue()


def workflow_runner(repo_url, user_preferences):
    """Runs the workflow.main in a separate thread and captures its output."""
    global workflow_results
    try:
        # Call the main workflow function directly
        run_workflow_main(repo_url, user_preferences)

        # After workflow completes, read the results from the data directory
        results_file = DATA_DIR / "workflow_results.json"
        if results_file.exists():
            with open(results_file, "r", encoding="utf-8") as f:
                workflow_results = json.load(f)
            workflow_results["status"] = "completed"
            workflow_results["message"] = "Workflow finished successfully."
        else:
            workflow_results = {
                "status": "completed",
                "message": "Workflow finished, but results file not found.",
            }

        workflow_messages_queue.put("FRONTEND_WORKFLOW_COMPLETE")  # Signal for frontend
        logging.info("Workflow execution completed successfully.")

    except Exception as e:
        logging.error(f"Error during workflow execution: {e}", exc_info=True)
        workflow_results = {"status": "error", "message": str(e)}
        workflow_messages_queue.put(f"ERROR: {e}")
        workflow_messages_queue.put(
            "FRONTEND_WORKFLOW_COMPLETE" 
        )  # Signal for frontend even on error


@app.route("/api/workflow/start", methods=["POST"])
def start_workflow():
    global workflow_results
    data = request.json
    repo_url = data.get("repo_url")
    user_preferences = data.get("user_preferences")

    if not repo_url:
        return jsonify({"error": "Repository URL is required"}), 400

    logging.info(
        f"Starting workflow for repo: {repo_url} with preferences: {user_preferences}"
    )

    # Clear previous results and messages
    workflow_results = {}
    while not workflow_messages_queue.empty():
        try:
            workflow_messages_queue.get_nowait()
        except queue.Empty:
            break

    # Run workflow in a separate thread to avoid blocking the API
    thread = threading.Thread(target=workflow_runner, args=(repo_url, user_preferences))
    thread.start()

    return jsonify({"message": "Workflow started", "status": "processing"}), 202


@app.route("/api/workflow/status", methods=["GET"])
def get_workflow_status():
    messages = []
    while not workflow_messages_queue.empty():
        try:
            messages.append(workflow_messages_queue.get_nowait())
        except queue.Empty:
            break

    status = workflow_results.get("status", "processing")
    return jsonify({"status": status, "messages": messages}), 200


@app.route("/api/workflow/results", methods=["GET"])
def get_workflow_results():
    global workflow_results
    if workflow_results:
        return jsonify(workflow_results), 200
    return jsonify({"message": "Workflow results not available yet."}), 204


@app.route("/api/live_preview", methods=["GET"])
def get_live_preview():
    ui_detection_file = DATA_DIR / "ui_detection_output.json"
    if not ui_detection_file.exists():
        return (
            "<h1>Live Preview Not Available</h1><p>UI detection output file not found.</p>",
            204,
        )

    try:
        with open(ui_detection_file, "r", encoding="utf-8") as f:
            ui_detection_data = json.load(f)
    except Exception as e:
        logging.error(f"Error reading ui_detection_output.json: {e}")
        return (
            "<h1>Live Preview Error</h1><p>Could not read UI detection output.</p>",
            500,
        )

    example_files = ui_detection_data.get("examples", [])
    if not example_files:
        return (
            "<h1>Live Preview Not Available</h1><p>No example UI files found in detection output.</p>",
            204,
        )

    combined_html = ""
    css_content = ""
    js_content = ""

    # Assuming REPO_DIR is accessible here, or passed as an app config
    # For now, let's assume PROJECT_ROOT is the base for repo
    repo_root = (
        PROJECT_ROOT / "repo" 
    )  # Go up one level from backend to FrontFrEND, then into repo

    for relative_path in example_files:
        file_path = repo_root / relative_path
        if not file_path.exists():
            logging.warning(f"Live Preview: File not found in repo: {file_path}")
            continue

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                if relative_path.endswith(".html"):
                    combined_html = content
                elif relative_path.endswith(".css"):
                    css_content += content + "\n"
                elif relative_path.endswith(".js"):
                    js_content += content + "\n"
        except Exception as e:
            logging.error(f"Error reading file {file_path} for live preview: {e}")
            continue

    if not combined_html:
        return (
            "<h1>Live Preview Not Available</h1><p>No HTML file found in example UI files.</p>",
            204,
        )

    # Embed CSS and JS into the HTML
    if css_content:
        combined_html = combined_html.replace(
            "</head>", f"<style>{css_content}</style></head>"
        )
    if js_content:
        combined_html = combined_html.replace(
            "</body>", f"<script>{js_content}</script></body>"
        )

    return combined_html, 200


if __name__ == "__main__":
    # This is a simple way to run Flask for development.
    # For production, use a WSGI server like Gunicorn or uWSGI.
    app.run(debug=True, use_reloader=False, host="127.0.0.1", port=5001)
