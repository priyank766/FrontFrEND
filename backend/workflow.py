import os
import sys
import json
import subprocess
import logging
from pathlib import Path

# Ensure the src directory is in the Python path
sys.path.append(str(Path(__file__).parent / "src"))

from src.git_details import main as git_details_main
from src.ui_detector import main as ui_detector_main
from src.ui_advisor import UIAdvisorCrew
from src.backend_integrator import BackendIntegration

from tools.tools import read_file, write_file
from utils.utils import write_json_file

import time
from litellm.exceptions import InternalServerError

from utils.utils import read_json_file, setup_logging
from models.models import LLMConfig

# --- Configuration ---
REPO_URL = "https://github.com/priyank766/RAG-vs-Fine-Tuning"
PROJECT_ROOT = Path(__file__).parent.parent
REPO_DIR = PROJECT_ROOT / "repo"
DATA_DIR = PROJECT_ROOT / "data"
LOGS_DIR = PROJECT_ROOT / "logs"


# --- Main Workflow Logic ---
def run_command(command: list[str], description: str, logger: logging.Logger) -> None:
    """Runs a command and logs its output."""
    logger.info(f"--- Starting: {description} ---")
    try:
        # Using subprocess.run to capture output and handle errors
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONPATH"] = str(PROJECT_ROOT)
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
            env=env,
        )

        logger.info(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            logger.warning(f"STDERR:\n{result.stderr}")
        logger.info(f"--- Completed: {description} ---")
    except subprocess.CalledProcessError as e:
        logger.error(f"ERROR: {description} failed with exit code {e.returncode}")
        logger.error(f"STDOUT:\n{e.stdout}")
        logger.error(f"STDERR:\n{e.stderr}")
        raise e
    except FileNotFoundError as e:
        logger.error(
            "ERROR: Command not found. Make sure Python and required packages are in your PATH."
        )
        raise e


def main(repo_url: str, user_preferences: dict):
    """
    Main function to orchestrate the entire Front FrEND workflow.
    """
    # --- Setup ---
    # Set stdout to utf-8
    sys.stdout.reconfigure(encoding="utf-8")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    workflow_log_path = LOGS_DIR / "workflow.log"
    setup_logging(str(workflow_log_path))
    workflow_logger = logging.getLogger()

    # Force LiteLLM to use the model defined in LLMConfig
    os.environ["LITELLM_MODEL"] = LLMConfig().model_name
    workflow_logger.info(
        f"Configured LiteLLM to use model: {os.environ['LITELLM_MODEL']}"
    )

    workflow_logger.info(f"Starting workflow for repository: {repo_url}")

    file_tree_json_path = DATA_DIR / "file_tree.json"
    print("--- Starting: Phase 1: Fetching Git Tree ---")
    workflow_logger.info("--- Starting: Phase 1: Fetching Git Tree ---")
    try:
        git_details_main(repo_url, str(file_tree_json_path))
        workflow_logger.info("--- Completed: Phase 1: Fetching Git Tree ---")
        print("--- Completed: Phase 1: Fetching Git Tree ---")
    except Exception as e:
        workflow_logger.exception("ERROR during Fetching Git Tree.")
        raise e

    ui_detection_json_path = DATA_DIR / "ui_detection_output.json"
    print("--- Starting: Phase 2: UI Detection and Analysis ---")
    workflow_logger.info("--- Starting: Phase 2: UI Detection and Analysis ---")
    try:
        ui_detector_main(str(file_tree_json_path), str(ui_detection_json_path))
        workflow_logger.info("--- Completed: Phase 2: UI Detection and Analysis ---")
        print("--- Completed: Phase 2: UI Detection and Analysis ---")
    except Exception as e:
        workflow_logger.exception("ERROR during UI Detection and Analysis.")
        raise e

    print("--- Starting: Phase 3.1: UI Advisor ---")
    workflow_logger.info("--- Starting: Phase 3.1: UI Advisor ---")
    try:
        ui_detection_output = read_json_file(ui_detection_json_path)
        workflow_logger.info(
            f"Content of ui_detection_output.json: {ui_detection_output}"
        )

        if ui_detection_output.get("exists"):
            workflow_logger.info(f"UI detected: {ui_detection_output.get('tech')}")
            workflow_logger.info(
                f"Example UI files: {ui_detection_output.get('file_names')}"
            )

            # Use user preferences directly from argument
            workflow_logger.info(f"User preferences: {user_preferences}")

            # Instantiate and run the UIAdvisorCrew
            advisor_crew = UIAdvisorCrew(
                repo_path=REPO_DIR,
                ui_detection_output=ui_detection_output,
                user_preferences=user_preferences,
            )

            print(
                "🚀 Kicking off the UI Advisor & Generator Crew... this may take a few moments."
            )

            workflow_logger.info("--- Kicking off UI Advisor Crew ---")
            result = None
            max_retries = 3
            retry_delay = 15  # seconds
            for attempt in range(max_retries):
                try:
                    result = advisor_crew.run()
                    workflow_logger.info(
                        f"--- UI Advisor Crew Finished. Result: {result} ---"
                    )
                    break  # Success, exit loop
                except InternalServerError as e:
                    workflow_logger.warning(
                        f"Attempt {attempt + 1}/{max_retries} failed with model overload error: {e}"
                    )
                    if attempt + 1 < max_retries:
                        workflow_logger.info(f"Retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                    else:
                        workflow_logger.error("Max retries reached. Failing.")
                        raise e

            print("--- ✅ UI Advisor, Generator, and Writer Crew Finished ---")
            print("Final Result:")
            print(result)

            # Determine the path to the modified UI file for Phase 4
            examples = ui_detection_output.get("examples", [])
            if not examples:
                raise ValueError("UI detection found no example files to process.")

            all_code_changes = []

            for ui_file_for_backend_analysis in examples:
                workflow_logger.info(
                    f"--- Processing UI file: {ui_file_for_backend_analysis} ---"
                )
                print(f"--- Processing UI file: {ui_file_for_backend_analysis} ---")

                full_ui_file_path = REPO_DIR / ui_file_for_backend_analysis
                try:
                    with open(full_ui_file_path, "r", encoding="utf-8") as f:
                        original_ui_content = f.read()
                except Exception as e:
                    workflow_logger.error(
                        f"Error reading UI file for backend analysis: {e}"
                    )
                    original_ui_content = ""  # Or handle as appropriate
                file_changes_tracker = {
                    ui_file_for_backend_analysis: {
                        "before": original_ui_content,
                        "after": "",  # Will be filled after UI Advisor
                    }
                }

                print("--- Starting: Phase 4: Backend Code Generation ---")
                workflow_logger.info(
                    "--- Starting: Phase 4: Backend Code Generation ---"
                )
                try:
                    backend_integration_crew = BackendIntegration(
                        repo_path=REPO_DIR,
                        frontend_changes_output_path=ui_file_for_backend_analysis,
                        file_tree_path=file_tree_json_path,
                        user_preferences=user_preferences,
                    )
                    print(
                        "\n🚀 Kicking off the Backend Integration Crew... this may take a few moments.\n"
                    )
                    workflow_logger.info("--- Kicking off Backend Integration Crew ---")
                    backend_result = backend_integration_crew.run()
                    workflow_logger.info(
                        f"--- Backend Integration Crew Finished. Result: {backend_result} ---"
                    )
                    print("--- ✅ Backend Integration Crew Finished ---")
                    print("Final Result:\n")
                    print(backend_result)

                    try:
                        with open(full_ui_file_path, "r", encoding="utf-8") as f:
                            modified_ui_content = f.read()
                    except Exception as e:
                        workflow_logger.error(
                            f"Error reading modified UI file for backend analysis: {e}"
                        )
                        modified_ui_content = ""  # Or handle as appropriate
                    file_changes_tracker[ui_file_for_backend_analysis]["after"] = (
                        modified_ui_content
                    )

                    print("--- Starting: Phase 5: Design Validation ---")
                    workflow_logger.info("--- Starting: Phase 5: Design Validation ---")
                    try:
                        modified_files = [ui_file_for_backend_analysis]
                        if (
                            backend_result
                            and "Successfully modified:" in backend_result
                        ):
                            modified_backend_files = (
                                backend_result.replace("Successfully modified:", "")
                                .strip()
                                .split(", ")
                            )
                            modified_files.extend(modified_backend_files)
                            # Capture before/after for backend files too
                            for f_path in modified_backend_files:
                                try:
                                    with open(
                                        REPO_DIR / f_path, "r", encoding="utf-8"
                                    ) as f:
                                        original_backend_content = f.read()
                                except Exception as e:
                                    workflow_logger.error(
                                        f"Error reading backend file {f_path}: {e}"
                                    )
                                    original_backend_content = ""
                                file_changes_tracker[f_path] = {
                                    "before": original_backend_content,
                                    "after": "",
                                }

                        # --- Capture content after Design Validation for all modified files ---
                        for f_path in modified_files:
                            try:
                                with open(
                                    REPO_DIR / f_path, "r", encoding="utf-8"
                                ) as f:
                                    final_content = f.read()
                            except Exception as e:
                                workflow_logger.error(
                                    f"Error reading final content of {f_path}: {e}"
                                )
                                final_content = ""
                            if f_path in file_changes_tracker:
                                file_changes_tracker[f_path]["after"] = final_content
                            else:  # Case where Design Validator might modify a file not touched by UI Advisor/Backend Integrator
                                try:
                                    with open(
                                        REPO_DIR / f_path, "r", encoding="utf-8"
                                    ) as f:
                                        before_content = f.read()
                                except Exception as e:
                                    workflow_logger.error(
                                        f"Error reading before content of {f_path}: {e}"
                                    )
                                    before_content = ""
                                file_changes_tracker[f_path] = {
                                    "before": before_content,
                                    "after": final_content,
                                }

                        # --- Construct codeChanges object ---
                        for path, contents in file_changes_tracker.items():
                            all_code_changes.append(
                                {
                                    "path": path,
                                    "before": contents["before"],
                                    "after": contents["after"],
                                }
                            )

                    except Exception as e:
                        workflow_logger.exception(
                            "ERROR during Design Validation execution."
                        )
                        print(
                            f"An unexpected error occurred during the Design Validation phase: {e}"
                        )
                        raise

                except Exception as e:
                    workflow_logger.exception(
                        "ERROR during Backend Integration execution."
                    )
                    print(
                        f"An unexpected error occurred during the Backend Integration phase: {e}"
                    )
                    raise

            # --- Save aggregated codeChanges to JSON ---
            aggregated_results = {
                "improvements": [
                    "UI/UX improvements applied.",
                    "Backend integration adjustments made.",
                ],
                "files": all_code_changes,
            }
            write_json_file(
                aggregated_results,
                str(DATA_DIR / "workflow_results.json"),
            )
            workflow_logger.info(
                f"Aggregated code changes saved to {DATA_DIR / 'workflow_results.json'}"
            )

        else:
            workflow_logger.info(
                "No UI detected. Skipping UI Advisor and Backend Integration phases."
            )
            print("No UI detected. The next step would be to generate a new one.")
            # In a complete application, this would trigger the UI Generator agent.

    except Exception as e:
        workflow_logger.exception("ERROR during UI Advisor execution.")
        print(f"An unexpected error occurred during the UI Advisor phase: {e}")
        raise

    workflow_logger.info("--- Workflow Complete ---")
    print("\nWorkflow finished successfully. Check logs for details.")


if __name__ == "__main__":
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Run FrontFrEND workflow.")
    parser.add_argument("--repo_url", required=True, help="GitHub repository URL")
    parser.add_argument(
        "--user_preferences",
        required=True,
        help="User UI/UX preferences as a JSON string",
    )
    args = parser.parse_args()

    try:
        preferences_dict = json.loads(args.user_preferences)
    except json.JSONDecodeError:
        print("Error: user_preferences must be a valid JSON string.")
        sys.exit(1)

    main(args.repo_url, preferences_dict)
