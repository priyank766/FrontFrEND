from crewai import Agent, Task, Crew, Process, LLM
from tools.tools import read_file, write_file
from models import LLMConfig
import logging


class DesignValidatorCrew:
    def __init__(self, files_to_review: list[str], user_preferences: str):
        self.files_to_review = files_to_review
        self.user_preferences = user_preferences
        self.llm = LLM(
            model=LLMConfig().model_name,
            temperature=LLMConfig().temperature,
            base_url=LLMConfig().base_url,
        )
        self.file_read_tool = read_file
        self.file_write_tool = write_file

    def run(self):
        design_validator_agent = Agent(
            role="Design and Code Quality Validator",
            goal=f"""
            Your primary objective is to perform a comprehensive static analysis of the provided code files.
            You must meticulously review the code for issues related to software design principles, code structure, naming conventions, and overall code quality.
            You also need to ensure the code aligns with the user's stated preferences: '{self.user_preferences}'.
            Based on your analysis, you will categorize each identified issue as either a 'frontend' or a 'backend' issue.
            This categorization is crucial for the subsequent fixing process by specialized agents.
            """,
            backstory=(
                """You are a highly experienced software architect with a keen eye for detail.
                You are an expert in identifying design flaws, code smells, and anti-patterns.
                You perform your analysis by statically reviewing the code, without executing it.
                Your reports are clear, concise, and provide actionable feedback to the development team."""
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        frontend_fixer_agent = Agent(
            role="Frontend Code Fixer",
            goal="Fix frontend code issues based on the validator's report. You must only address issues categorized as 'frontend'.",
            backstory="You are a senior frontend developer. You receive reports from the validator and fix the specified frontend issues.",
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool, self.file_write_tool],
            allow_delegation=False,
        )

        backend_fixer_agent = Agent(
            role="Backend Code Fixer",
            goal="Fix backend code issues based on the validator's report. You must only address issues categorized as 'backend'.",
            backstory="You are a senior backend developer. You receive reports from the validator and fix the specified backend issues.",
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool, self.file_write_tool],
            allow_delegation=False,
        )

        validation_task = Task(
            description=f"""
            **Your task is to analyze the following files: {self.files_to_review}.**
            **You must use the 'file_reader' tool to read the content of each file.** Do not ask for the content, use the tool.
            
            Once you have the content of the files, perform a thorough review based on the following criteria:
            1.  **Code Quality**: Check for code smells, anti-patterns, and violations of SOLID, DRY, and KISS principles.
            2.  **Naming Conventions**: Ensure that variables, functions, and classes are named clearly and consistently.
            3.  **Code Structure**: Analyze the code for modularity, separation of concerns, and overall organization.
            4.  **User Preferences**: The user has specified the following preferences: '{self.user_preferences}'. Make sure the code aligns with these preferences.

            After your analysis, you must create a JSON report of all the issues you have found.
            Each issue in the report must have the following fields:
            -   `file_path`: The path to the file where the issue was found.
            -   `issue_description`: A clear and concise description of the issue.
            -   `category`: The category of the issue, which must be either 'frontend' or 'backend'.

            If you do not find any issues, you must return a JSON object with an empty list of issues.
            """,
            expected_output="""A JSON object with a list of issues, each with 'file_path', 'issue_description', and 'category'.
            Example:
            {
                "issues": [
                    {
                        "file_path": "src/main.py",
                        "issue_description": "Variable `x` is poorly named and does not follow the project's naming conventions.",
                        "category": "backend"
                    },
                    {
                        "file_path": "src/components/Button.tsx",
                        "issue_description": "The Button component is not accessible and is missing ARIA attributes.",
                        "category": "frontend"
                    }
                ]
            }
            """,
            agent=design_validator_agent,
        )

        frontend_fix_task = Task(
            description="Fix the 'frontend' issues identified in the validation report. Read the file, apply the fix, and write the file back.",
            expected_output="A confirmation message listing the frontend files that were fixed.",
            agent=frontend_fixer_agent,
            context=[validation_task],
        )

        backend_fix_task = Task(
            description="Fix the 'backend' issues identified in the validation report. Read the file, apply the fix, and write the file back.",
            expected_output="A confirmation message listing the backend files that were fixed.",
            agent=backend_fixer_agent,
            context=[validation_task],
        )

        crew = Crew(
            agents=[design_validator_agent, frontend_fixer_agent, backend_fixer_agent],
            tasks=[validation_task, frontend_fix_task, backend_fix_task],
            process=Process.sequential,
            verbose=False,
        )

        logging.info(
            f"Starting Design Validator Crew for files: {self.files_to_review}"
        )
        result = crew.kickoff()

        logging.info("Design Validator Crew finished.")
        logging.info(f"Validation Task Output: {validation_task.output}")
        logging.info(f"Frontend Fix Task Output: {frontend_fix_task.output}")
        logging.info(f"Backend Fix Task Output: {backend_fix_task.output}")
        logging.info(f"Final Crew Result: {result}")

        return result
