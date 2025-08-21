from crewai import Agent, Task, Crew, Process, LLM
from tools import read_file, write_file
from pathlib import Path
import json
from models import LLMConfig


class BackendIntegration:
    def __init__(self, frontend_changes_output_path: Path, file_tree_path: Path, user_preferences: str):
        self.frontend_changes_output_path = frontend_changes_output_path
        self.file_tree_path = file_tree_path
        self.user_preferences = user_preferences
        self.llm = LLM(model=LLMConfig().model_name, temperature=LLMConfig().temperature)
        self.file_read_tool = read_file
        self.file_write_tool = write_file

    def run(self):
        # Load the file tree to get all file paths
        with open(self.file_tree_path, "r") as f:
            file_tree_data = json.load(f)
        all_repo_files = [f["path"] for f in file_tree_data.get("files", [])]

        # Validator Agent
        validator_agent = Agent(
            role="Frontend-Backend Change Validator",
            goal=f"""Analyze frontend changes and identify potential breaking changes or necessary backend adjustments, keeping in mind the user's preferences: '{self.user_preferences}'.""",
            backstory=(
                "You are an expert in identifying discrepancies and integration points between frontend and backend codebases. "
                "Your primary task is to review frontend modifications and determine if any new variables, changed names, "
                "or structural alterations require corresponding updates in the backend API, models, or logic. "
                "You have access to a 'file_reader' tool to examine any relevant files."
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        # Backend Agent
        backend_agent = Agent(
            role="Backend Code Adjuster",
            goal=f"""Implement necessary changes in the backend code based on the validator's findings, ensuring perfect syntax, indentation, and idiomatic Python/FastAPI patterns, while respecting the user's preferences: '{self.user_preferences}'.""",
            backstory=(
                "You are a highly skilled and meticulous backend developer, proficient in FastAPI and Python. "
                "Your expertise lies in precisely modifying existing backend code to accommodate frontend changes, "
                "ensuring seamless integration, preventing errors, and strictly adhering to best practices, "
                "including proper syntax, consistent indentation, and idiomatic Python/FastAPI patterns. "
                "You can read existing files and write modified content back to them using 'file_reader' and 'file_writer' tools. "
                "You ONLY output code when generating it, with no additional conversational text."
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool, self.file_write_tool],
            allow_delegation=False,
        )

        # Validator Task
        validator_task = Task(
            description=f"""
            1. **Read Frontend Changes:** Read the content of the file at '{self.frontend_changes_output_path}' to understand the frontend modifications.
            2. **Analyze Backend Impact:** Based on the frontend changes (and keeping in mind the user's preferences: '{self.user_preferences}'), identify any new variables, changed names, or structural alterations that would require changes in the backend.
               Consider common backend components like:
               - FastAPI endpoints (routes, request bodies, response models)
               - Pydantic models
               - Database schemas (if implied by new data structures)
               - Utility functions or business logic that interacts with frontend data.
            3. **List All Backend Files:** You have access to a variable `all_repo_files` which is a list of all file paths in the repository. Use this list to identify all potential backend files that might need modification. Focus on Python files typically associated with backend logic (e.g., files in 'src/', 'api/', 'models/', 'schemas/').
            4. **Output Required Changes:** If backend changes are needed, output a detailed list of:
               - Which backend files need to be read.
               - What specific changes (e.g., add new field 'x' to model 'Y', change endpoint '/old' to '/new') are required for each file.
               - If no backend changes are needed, state "No backend changes required."
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
                    }},
                    {{
                        "path": "src/models/user.py",
                        "modifications": [
                            "Rename 'old_name' field to 'new_name' in User model."
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
            description=f"""
            Based on the JSON output from the 'Frontend-Backend Change Validator' agent and the user's preferences ('{self.user_preferences}'):

            1. **Parse Validator Output:** Carefully parse the JSON output from the 'Frontend-Backend Change Validator' agent.
            2. **Check for Changes:** If the parsed JSON indicates `"changes_required": false`, then output the `"message"` from the validator's output (e.g., "No backend changes required.") and do nothing else.
            3. **Read Relevant Files:** If `"changes_required": true`, then for each file listed in `"files_to_modify"`, use the 'file_reader' tool to read its current content.
            4. **Apply Modifications:** Implement the specific modifications detailed by the validator for each file.
               Ensure the changes are idiomatic to FastAPI/Python and maintain code quality.
            5. **Write Modified Files:** For each modified file, use the 'file_writer' tool to write the updated content back to its original path.
            6. **Output Confirmation:** After all modifications are applied and written, output a concise confirmation message listing *only* the paths of the files that were modified. DO NOT include the code content in your output.
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
