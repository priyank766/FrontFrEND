import os
import sys
import json
import subprocess
import logging
from pathlib import Path

# Ensure the src directory is in the Python path
sys.path.append(str(Path(__file__).parent / "src"))

from ui_advisor import UIAdvisorCrew
from utils import read_json_file, setup_logging

# --- Configuration ---
REPO_URL = "https://github.com/priyank766/YT_TRANSCRIBER"
PROJECT_ROOT = Path(__file__).parent
REPO_DIR = PROJECT_ROOT / "repo"
DATA_DIR = PROJECT_ROOT / "data"
LOGS_DIR = PROJECT_ROOT / "logs"


# --- Main Workflow Logic ---
def run_command(command: list[str], description: str, log_file: Path):
    """Runs a command and logs its output."""
    logging.info(f"--- Starting: {description} ---")
    try:
        # Using subprocess.run to capture output and handle errors
        result = subprocess.run(
            command, check=True, capture_output=True, text=True, encoding="utf-8"
        )
        logging.info(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            logging.warning(f"STDERR:\n{result.stderr}")
        logging.info(f"--- Completed: {description} ---")
    except subprocess.CalledProcessError as e:
        logging.error(f"ERROR: {description} failed with exit code {e.returncode}")
        logging.error(f"STDOUT:\n{e.stdout}")
        logging.error(f"STDERR:\n{e.stderr}")
        sys.exit(1)  # Exit if a critical step fails
    except FileNotFoundError:
        logging.error(
            "ERROR: Command not found. Make sure Python and required packages are in your PATH."
        )
        sys.exit(1)


def main():
    """
    Main function to orchestrate the entire Front FrEND workflow.
    """
    # --- Setup ---
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    workflow_log_path = LOGS_DIR / "workflow.log"
    setup_logging(workflow_log_path)

    logging.info(f"Starting workflow for repository: {REPO_URL}")

    file_tree_json_path = DATA_DIR / "file_tree.json"
    run_command(
        [
            sys.executable,
            str(PROJECT_ROOT / "src" / "git_details.py"),
            REPO_URL,
            "--out",
            str(file_tree_json_path),
        ],
        "Phase 1: Fetching Git Tree",
        workflow_log_path,
    )

    ui_detection_json_path = DATA_DIR / "ui_detection_output.json"
    run_command(
        [
            sys.executable,
            str(PROJECT_ROOT / "src" / "ui_detector.py"),
            str(file_tree_json_path),
            "--out",
            str(ui_detection_json_path),
        ],
        "Phase 2: UI Detection and Analysis",
        workflow_log_path,
    )

    logging.info("--- Starting: Phase 3.1: UI Advisor ---")
    try:
        ui_detection_output = read_json_file(ui_detection_json_path)

        if ui_detection_output.get("exists"):
            logging.info(f"UI detected: {ui_detection_output.get('tech')}")
            logging.info(f"Example UI files: {ui_detection_output.get('examples')}")

            # Instantiate and run the UIAdvisorCrew
            advisor_crew = UIAdvisorCrew(ui_detection_output=ui_detection_output)

            print(
                "\n🚀 Kicking off the UI Advisor & Generator Crew... this may take a few moments.\n"
            )
            result = advisor_crew.run()

            print("\n--- ✅ UI Advisor, Generator, and Writer Crew Finished ---")
            print("Final Result:\n")
            print(result)

        else:
            logging.info("No UI detected. Skipping UI Advisor phase.")
            print("No UI detected. The next step would be to generate a new one.")
            # In a complete application, this would trigger the UI Generator agent.

    except Exception as e:
        logging.exception("ERROR during UI Advisor execution.")
        print(f"An unexpected error occurred during the UI Advisor phase: {e}")
        sys.exit(1)

    logging.info("--- Workflow Complete ---")
    print("\nWorkflow finished successfully. Check logs for details.")


if __name__ == "__main__":
    main()
