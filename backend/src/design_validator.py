from crewai import Agent, Task, Crew, Process, LLM
from tools import read_file, write_file
from models import LLMConfig
import logging


class DesignValidatorCrew:
    def __init__(self, files_to_review: list[str], user_preferences: str):
        self.files_to_review = files_to_review
        self.user_preferences = user_preferences
        self.llm = LLM(
            model=LLMConfig().model_name, temperature=LLMConfig().temperature
        )
        self.file_read_tool = read_file
        self.file_write_tool = write_file

    def run(self):
        design_validator_agent = Agent(
            role="Design and Code Quality Validator",
            goal=f"""Perform a static, text-based code review of the provided files. Identify issues related to structure, naming, completeness, and alignment with user preferences ('{self.user_preferences}'). For each issue, determine if it is a 'frontend' or 'backend' issue.""",
            backstory=(
                "You are a meticulous software architect. You analyze code statically, without executing it. "
                "Your role is to find flaws and categorize them as either frontend or backend issues for other agents to fix."
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
            Review the following files: {self.files_to_review}. Consider the user's preferences: '{self.user_preferences}'.
            For each file, use the 'file_reader' tool to read its content.
            Then, create a JSON report of all issues found. Each issue should have 'file_path', 'issue_description', and 'category' ('frontend' or 'backend').
            """,
            expected_output='A JSON object with a list of issues, each with \'file_path\', \'issue_description\', and \'category\'. Example: {"issues": [{"file_path": "src/main.py", "issue_description": "Variable `x` is poorly named.", "category": "backend"}]}',
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
        logging.info(f"Validation Task Output: {validation_task.output.raw_output}")
        logging.info(f"Frontend Fix Task Output: {frontend_fix_task.output.raw_output}")
        logging.info(f"Backend Fix Task Output: {backend_fix_task.output.raw_output}")
        logging.info(f"Final Crew Result: {result}")

        return result
