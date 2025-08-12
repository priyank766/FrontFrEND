import json
import argparse
import logging
from pathlib import Path
from utils import setup_logging, read_json_file, write_json_file

def detect_ui(file_tree: dict) -> dict:
    """
    Detects if a UI exists in the file tree and infers the technology.
    """
    exists = False
    tech = None
    examples = []

    files = file_tree.get("files", [])

    # Indicators for various UI technologies
    streamlit_indicators = ["app.py", "streamlit_app.py", "main.py"]
    react_indicators = ["index.html", "src/App.js", "src/App.jsx", "package.json"]
    vue_indicators = ["index.html", "src/main.js", "src/App.vue", "package.json"]
    angular_indicators = ["index.html", "src/main.ts", "angular.json", "package.json"]
    html_css_js_indicators = ["index.html", "style.css", "script.js"]

    # Check for Streamlit
    streamlit_files = [f["path"] for f in files if any(indicator in f["path"] for indicator in streamlit_indicators) and f["path"].endswith(".py")]
    if streamlit_files:
        exists = True
        tech = "Streamlit"
        examples = streamlit_files
        logging.info(f"Detected Streamlit UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    # Check for React
    react_files = [f["path"] for f in files if any(indicator in f["path"] for indicator in react_indicators)]
    if all(any(indicator in f for f in react_files) for indicator in ["index.html", "package.json"]) and any("App.js" in f or "App.jsx" in f for f in react_files):
        exists = True
        tech = "React"
        examples = react_files
        logging.info(f"Detected React UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    # Check for Vue
    vue_files = [f["path"] for f in files if any(indicator in f["path"] for indicator in vue_indicators)]
    if all(any(indicator in f for f in vue_files) for indicator in ["index.html", "package.json"]) and any("App.vue" in f for f in vue_files):
        exists = True
        tech = "Vue"
        examples = vue_files
        logging.info(f"Detected Vue UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    # Check for Angular
    angular_files = [f["path"] for f in files if any(indicator in f["path"] for indicator in angular_indicators)]
    if all(any(indicator in f for f in angular_files) for indicator in ["index.html", "package.json"]) and any("main.ts" in f for f in angular_files):
        exists = True
        tech = "Angular"
        examples = angular_files
        logging.info(f"Detected Angular UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    # Check for generic HTML/CSS/JS
    html_css_js_files = [f["path"] for f in files if any(indicator in f["path"] for indicator in html_css_js_indicators)]
    if "index.html" in html_css_js_files:
        exists = True
        tech = "HTML/CSS/JS"
        examples = html_css_js_files
        logging.info(f"Detected HTML/CSS/JS UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    logging.info("No specific UI technology detected.")
    return {"exists": exists, "tech": tech, "examples": examples}

def main():
    parser = argparse.ArgumentParser(description="UI Detector agent.")
    parser.add_argument("file_tree_path", help="Name of the JSON file containing the repository file tree (from the 'data' directory).")
    parser.add_argument("--out", default="ui_detection_output.json", help="Output JSON file name for detection results (will be saved in the 'data' directory).")
    args = parser.parse_args()

    setup_logging("ui_detector.log")

    try:
        file_tree_data = read_json_file(args.file_tree_path)

        detection_result = detect_ui(file_tree_data)

        write_json_file(detection_result, args.out)
        logging.info(f"UI detection results successfully written to {args.out}")
        print(json.dumps(detection_result, indent=2)) # Print for direct output

    except Exception as e:
        logging.exception(f"An unexpected error occurred in UI Detector: {e}")

if __name__ == "__main__":
    main()
