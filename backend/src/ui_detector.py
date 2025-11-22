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

    # --- Extension-based detection logic ---
    streamlit_files = [
        f["path"]
        for f in files
        if f["path"].endswith(".py")
        and (
            "streamlit" in f["path"].lower()
            or "streamlit_app.py" in f["path"].lower()

        )
    ]
    if streamlit_files:
        exists = True
        tech = "Streamlit"
        examples = streamlit_files
        logging.info(f"Detected Streamlit UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    react_files = [
        f["path"]
        for f in files
        if f["path"].endswith((".js", ".jsx", ".ts", ".tsx")) or f["path"].endswith("package.json")
    ]
    if any(f.endswith(("App.js", "App.jsx", "App.tsx")) for f in react_files) and any(
        f.endswith("package.json") for f in react_files
    ) and any(f.endswith("tsconfig.json") for f in files):
        exists = True
        tech = "React"
        examples = react_files
        logging.info(f"Detected React UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    vue_files = [
        f["path"]
        for f in files
        if f["path"].endswith((".vue", ".js")) or f["path"].endswith("package.json")
    ]
    if any(f.endswith("App.vue") for f in vue_files) and any(
        f.endswith("package.json") for f in vue_files
    ):
        exists = True
        tech = "Vue"
        examples = vue_files
        logging.info(f"Detected Vue UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    angular_files = [
        f["path"]
        for f in files
        if f["path"].endswith((".ts", ".json")) or f["path"].endswith("package.json")
    ]
    if any(f.endswith("main.ts") for f in angular_files) and any(
        f.endswith("package.json") for f in angular_files
    ):
        exists = True
        tech = "Angular"
        examples = angular_files
        logging.info(f"Detected Angular UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    # Generic HTML/CSS/JS UI detection (any .html file, not just index.html)
    html_files = [f["path"] for f in files if f["path"].endswith(".html")]
    css_files = [f["path"] for f in files if f["path"].endswith(".css")]
    js_files = [f["path"] for f in files if f["path"].endswith(".js")]
    if html_files:
        exists = True
        tech = "HTML/CSS/JS"
        examples = html_files + css_files + js_files
        logging.info(f"Detected HTML/CSS/JS UI with files: {examples}")
        return {"exists": exists, "tech": tech, "examples": examples}

    logging.info("No specific UI technology detected.")
    return {"exists": exists, "tech": tech, "examples": examples}


def main(file_tree_path: str, out: str):
    setup_logging("ui_detector.log")

    try:
        file_tree_data = read_json_file(file_tree_path)

        detection_result = detect_ui(file_tree_data)

        write_json_file(detection_result, out)
        logging.info(f"UI detection results successfully written to {out}")
        print(json.dumps(detection_result, indent=2))  # Print for direct output

    except Exception as e:
        logging.exception(f"An unexpected error occurred in UI Detector: {e}")
        raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UI Detector agent.")
    parser.add_argument(
        "file_tree_path",
        help="Name of the JSON file containing the repository file tree (from the 'data' directory).",
    )
    parser.add_argument(
        "--out",
        default="ui_detection_output.json",
        help="Output JSON file name for detection results (will be saved in the 'data' directory).",
    )
    args = parser.parse_args()
    main(args.file_tree_path, args.out)
