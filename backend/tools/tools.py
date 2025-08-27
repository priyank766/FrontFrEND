from pathlib import Path
from crewai.tools import tool

REPO_ROOT_PATH = Path(__file__).parent.parent.parent.joinpath("repo").resolve()


@tool("file_reader")
def read_file(file_path: str) -> str:
    """
    Reads the content of a file, but only if it is within the repository's root directory.
    The file_path should be relative to the repository root.
    """
    try:
        # Construct the full path from the root and the relative file_path.
        full_path = REPO_ROOT_PATH.joinpath(file_path).resolve()

        # Security Check: Ensure the resolved path is still within the repo_root.
        if REPO_ROOT_PATH not in full_path.parents and full_path != REPO_ROOT_PATH:
            return f"Error: Access denied. Attempted to read a file outside of the repository root: {file_path}"

        if not full_path.is_file():
            return f"Error: File not found at path: {file_path}"

        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        return content
    except Exception as e:
        return f"An error occurred while trying to read the file: {e}"


@tool("file_writer")
def write_file(file_path: str, content: str) -> str:
    """
    Writes content to a file, but only if it is within the repository's root directory.
    The file_path should be relative to the repository root.
    """
    try:
        # Construct the full path from the root and the relative file_path.
        full_path = REPO_ROOT_PATH.joinpath(file_path).resolve()

        # Security Check: Ensure the resolved path is still within the repo_root.
        if REPO_ROOT_PATH not in full_path.parents and full_path != REPO_ROOT_PATH:
            return f"Error: Access denied. Attempted to write to a file outside of the repository root: {file_path}"

        # Create parent directories if they don't exist
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"File '{file_path}' has been written successfully."

    except Exception as e:
        return f"An error occurred while trying to write the file: {e}"
