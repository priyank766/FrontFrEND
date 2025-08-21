import json
import logging
from pathlib import Path

def setup_logging(log_file_name: str):
    """Configures logging for the application."""
    log_dir = Path(__file__).parent.parent / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file_path = log_dir / log_file_name
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file_path),
            logging.StreamHandler()
        ]
    )

def read_json_file(file_name: str) -> dict:
    """Reads and parses a JSON file from the 'data' directory."""
    data_file_path = Path(__file__).parent.parent / "data" / file_name
    try:
        with open(data_file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logging.error(f"JSON file not found at {data_file_path}")
        raise
    except json.JSONDecodeError:
        logging.error(f"Error decoding JSON from {data_file_path}. Ensure it's a valid JSON file.")
        raise

def write_json_file(data: dict, file_name: str):
    """Writes a dictionary to a JSON file in the 'data' directory."""
    data_dir = Path(__file__).parent.parent / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    data_file_path = data_dir / file_name
    try:
        with open(data_file_path, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logging.error(f"Error writing JSON to {data_file_path}: {e}")
        raise
