from crewai import Agent, Task, Crew, Process, LLM
from tools.tools import read_file, write_file
from pathlib import Path
import json
from models import LLMConfig


class BackendIntegration:
    def __init__(
        self,
        repo_path: Path,
        frontend_changes_output_path: str,
        file_tree_path: Path,
        user_preferences: str,
    ):
        self.repo_path = repo_path
        self.frontend_changes_output_path = frontend_changes_output_path
        self.file_tree_path = file_tree_path
        self.user_preferences = user_preferences

        formatted_preferences = []
        if self.user_preferences.get("improvements"):
            formatted_preferences.append(
                f"- Desired Improvements: {', '.join(self.user_preferences['improvements'])}"
            )
        if self.user_preferences.get("theme"):
            formatted_preferences.append(f"- Theme: {self.user_preferences['theme']}")
        if self.user_preferences.get("priority"):
            formatted_preferences.append(
                f"- Priority: {self.user_preferences['priority']}"
            )
        if self.user_preferences.get("additionalDetails"):
            formatted_preferences.append(
                f"- Additional Details: {self.user_preferences['additionalDetails']}"
            )

        self.formatted_preferences = "\n".join(formatted_preferences)
        self.llm = LLM(
            model=LLMConfig().model_name,
            temperature=LLMConfig().temperature,
            base_url=LLMConfig().base_url,
        )
        self.file_read_tool = read_file
        self.file_write_tool = write_file

    def run(self):
        # Load the file tree to get all file paths
        with open(self.file_tree_path, "r") as f:
            file_tree_data = json.load(f)
        all_repo_files = [f["path"] for f in file_tree_data.get("files", [])]

        # Resolve the full path to the frontend changes file
        full_frontend_changes_path = self.repo_path.joinpath(
            self.frontend_changes_output_path
        ).resolve()

        # Validator Agent
        validator_agent = Agent(
            role="Frontend-Backend Change Validator",
            goal=f"""
            Your mission is to act as a bridge between the frontend and backend.
            You must analyze the changes made to the frontend code and determine the precise impact on the backend.
            This involves identifying any new data requirements, API changes, or other modifications needed to support the new frontend features.
            You must be meticulous in your analysis to prevent any integration issues.
            User preferences to consider:\n{self.formatted_preferences}. 
            """,
            backstory=(
                """You are a seasoned full-stack developer with a deep understanding of both frontend and backend technologies.
                You have a knack for spotting potential integration problems before they arise.
                Your analysis is crucial for maintaining a stable and consistent application."""
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        # Backend Agent
        backend_agent = Agent(
            role="Backend Code Adjuster",
            goal=f"""
            Your sole focus is to implement the necessary changes in the backend code as specified by the validator.
            You must not deviate from the validator's instructions.
            Your implementation must be flawless, adhering to the highest standards of code quality, including perfect syntax, indentation, and idiomatic Python/FastAPI patterns.
            You must also respect the user's preferences:\n{self.formatted_preferences}.
            You are a backend specialist, you do not touch frontend code.
            """,
            backstory=(
                """You are a master backend developer, a true craftsman of server-side code.
                You are fluent in FastAPI and Python, and you take pride in writing clean, efficient, and maintainable code.
                You are given a set of instructions, and you follow them to the letter, ensuring that the backend is always in perfect sync with the frontend."""
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool, self.file_write_tool],
            allow_delegation=False,
        )

        # Validator Task
        validator_task = Task(
            description=f"""
            1.  **Read Frontend Changes:** Read the content of the file at '{full_frontend_changes_path}' to understand the frontend modifications.
            2.  **Analyze Backend Impact:** Based on the frontend changes, and considering the user's preferences (\n{self.formatted_preferences}), identify any necessary backend changes.
                Look for new data fields, modified API endpoints, or any other changes that require a corresponding update in the backend.
            3.  **Consult File List:** You have access to a list of all repository files in the `all_repo_files` variable. Use this to identify potential backend files that may need changes.
            4.  **Output Required Changes:** Produce a JSON report detailing the required backend changes. If no changes are needed, your report should indicate that.
            """,
            expected_output="""A JSON object detailing the required backend changes, or a string "No backend changes required.".
            Example for changes:
            ```json
            {{
                "changes_required": true,
                "files_to_modify": [
                    {{
                        "path": "src/api/items.py",
                        "modifications": [
                            "Add 'new_field' to ItemCreate Pydantic model.",
                            "Update '/items/' POST endpoint to handle 'new_field'."
                        ]
                    }}
                ]
            }}
            ```
            Example for no changes:
            ```json
            {{
                "changes_required": false,
                "message": "No backend changes required."
            }}
            ```
            """,
            agent=validator_agent,
        )

        # Backend Task
        backend_task = Task(
            description="""
            **Your task is to act as a backend developer and implement the changes specified by the validator.**
            1.  **Parse Validator's Report:** Carefully analyze the JSON output from the 'Frontend-Backend Change Validator'.
            2.  **Check for Required Changes:** If the report indicates that no changes are required (`"changes_required": false`), you must output the message from the report and stop.
            3.  **Implement Changes:** If changes are required, you must iterate through the `files_to_modify` list. For each file:
                a.  Use the `file_reader` tool to read the file's content.
                b.  Apply the specified modifications to the content.
                c.  Use the `file_writer` tool to write the modified content back to the file.
            4.  **Confirm Your Work:** After successfully modifying all the files, you must output a confirmation message that lists the paths of the files you have changed.
            """,
            expected_output="""A confirmation message stating which backend files were modified (listing their paths),
            or a message stating that no backend changes were required.
            Example for changes: "Successfully modified: src/api/items.py, src/models/user.py"
            Example for no changes: "No backend changes required."
            """,
            agent=backend_agent,
            context=[validator_task],
        )

        crew = Crew(
            agents=[validator_agent, backend_agent],
            tasks=[validator_task, backend_task],
            process=Process.sequential,
            verbose=False,
        )

        result = crew.kickoff()
        return result


if __name__ == "__main__":
    pass