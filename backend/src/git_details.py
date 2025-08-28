import argparse
import logging
from pathlib import Path
from utils import setup_logging, write_json_file
import git


def get_existing_remote_url(repo_path: Path) -> str | None:
    """Gets the remote URL of an existing local repository."""
    if not (repo_path / ".git").exists():
        logging.debug(f"No .git directory found in {repo_path}")
        return None
    try:
        logging.debug(f"Fetching remote URL from {repo_path}")
        repo = git.Repo(repo_path)
        remote_url = repo.remotes.origin.url
        logging.debug(f"Found remote URL: {remote_url}")
        return remote_url
    except Exception as e:
        logging.error(f"Could not get remote URL from {repo_path}: {e}")
        return None


def list_files(root: Path) -> list:
    """Lists all files in a directory recursively."""
    logging.info(f"Scanning for files in {root}...")
    files = []
    for path in root.rglob("*"):
        if path.is_file():
            files.append(
                {
                    "path": str(path.relative_to(root)).replace("\\", "/"),
                    "size": path.stat().st_size,
                    "type": path.suffix or "",
                }
            )
    logging.info(f"Found {len(files)} files.")
    return files


def main(url: str, out: str):
    """Clones a repo if it doesn't exist or if it's the wrong one, then lists files."""
    setup_logging("git_details.log")

    repo_dir = Path(__file__).parent.parent.parent / "repo"

    try:
        if repo_dir.exists() and repo_dir.is_dir():
            existing_url = get_existing_remote_url(repo_dir)
            if existing_url:
                if existing_url == url:
                    logging.info(f"Repository {url} already exists. Pulling latest changes.")
                    repo = git.Repo(repo_dir)
                    repo.remotes.origin.pull()
                else:
                    logging.error(
                        f"Another repository ({existing_url}) is already cloned."
                    )
                    logging.error(
                        "Please remove the 'repo' directory to clone a new one."
                    )
                    return
            else:
                logging.error("Directory 'repo' exists but is not a git repository.")
                return
        else:
            logging.info(f"Cloning {url} into {repo_dir}...")
            git.Repo.clone_from(url, str(repo_dir))

        tree = list_files(repo_dir)
        write_json_file({"files": tree}, out)
        logging.info(f"File tree JSON successfully written to {out}")

    except git.exc.GitCommandError as e:
        logging.exception(
            f"A git command failed!\nStderr: {e.stderr}\nStdout: {e.stdout}"
        )
        raise
    except Exception as e:
        logging.exception(f"An unexpected error occurred: {e}")
        raise



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clone repo and list files to JSON.")
    parser.add_argument("url", help="GitHub repository URL to clone")
    parser.add_argument(
        "--out",
        default="file_tree.json",
        help="Output JSON file name (will be saved in the 'data' directory)",
    )
    args = parser.parse_args()
    main(args.url, args.out)
