import logging
from crewai import Agent, Task, Crew, Process, LLM
from tools.tools import read_file, write_file
from models import LLMConfig
from pathlib import Path


class UIAdvisorCrew:
    def __init__(
        self,
        repo_path: Path,
        ui_detection_output: dict,
        user_preferences: str,
    ):
        """
        Initializes the UIAdvisorCrew with UI detection data and user preferences.
        """
        self.repo_path = repo_path
        self.ui_detection_output = ui_detection_output
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
            model=LLMConfig().model_name, temperature=LLMConfig().temperature
        )
        self.file_read_tool = read_file
        self.file_write_tool = write_file

    def run(self):
        """
        Sets up and runs the UI analysis and advisory crew.
        """
        if not self.ui_detection_output.get("exists"):
            return "UI does not exist. The UI Advisor crew has nothing to analyze."

        ui_file_relative_path = (
            self.ui_detection_output.get("examples", [])[0]
            if self.ui_detection_output.get("examples")
            else None
        )
        if not ui_file_relative_path:
            return "No UI file path found in detection output. Cannot run the UI Advisor crew."

        # Resolve the full path to the UI file
        full_ui_file_path = self.repo_path.joinpath(ui_file_relative_path).resolve()

        ui_advisor_agent = Agent(
            role="Expert UI/UX and Accessibility Consultant",
            goal=f"""As an expert UI/UX consultant, your goal is to provide creative and actionable suggestions to improve the UI/UX and accessibility of the provided code.
            Your suggestions should align with the user's preferences: '{self.formatted_preferences}'.
            Focus on enhancing the design with unique backgrounds, gradients, animations, and font styles, while ensuring the final design is highly readable and user-friendly.""",
            backstory=(
                "You are a top-tier UI/UX consultant known for your innovative and aesthetically pleasing designs. "
                "You have a deep understanding of modern design principles and user psychology. "
                "You must use the 'file_reader' tool to analyze the provided code and base your suggestions on it. "
                "Your recommendations should focus on creating a beautiful and functional user interface that is both engaging and easy to use. "
                "Pay close attention to color contrast and readability to avoid issues like text being unreadable against the background."
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        code_generator_agent = Agent(
            role="Senior Frontend Developer and Python Code Quality Expert",
            goal=f"""Implement UI/UX suggestions by modifying existing frontend code, ensuring perfect Python syntax, idiomatic code, high quality implementation, and strictly avoiding the addition of new, unrequested features or content.
            The user's preferences are:\n{self.formatted_preferences}.
            Focus on creative and aesthetically pleasing backgrounds, gradients, animations, and font styles while maintaining excellent readability.""",
            backstory=(
                "You are a meticulous senior frontend developer who excels at implementing modern and creative frontend practices. "
                "You are also a strict Python code quality expert, ensuring all generated code adheres to PEP 8, is syntactically perfect, "
                "idiomatic, and highly readable. Your focus is solely on modifying existing code to apply UI/UX improvements. "
                "You are encouraged to tend to make creative changes it to design following the rules  with backgrounds, gradients, animations, and font styles, but always with an eye for good aesthetics and maintaining readability. "
                "This means using proper color combinations which are readable in different backgrounds. "
                "example for reference : white backgrounds with white text or white buttons that cause readability issues. "
                "To ensure your work is based on the most current version of the code, you have been given a 'file_reader' tool. "
                "You MUST use this tool to read the original file content before applying any changes based on the UI advisor's suggestions. "
                "You MUST NOT add any new, unrequested features, sections, or content to the code."
            ),
            llm=self.llm,
        )

        code_writer_agent = Agent(
            role="Code Writer",
            goal="Take the generated code and write it to the appropriate file.",
            backstory=(
                "You are a meticulous code writer. Your primary function is to take a block of code, "
                "and use the 'file_writer' tool to save it to the correct file path."
            ),
            verbose=False,
            llm=self.llm,
            tools=[self.file_write_tool],
            allow_delegation=False,
        )

        advisory_task = Task(
            description=f"""
            1. **Mandatory First Step: Read the File's Content.**
               You MUST use the 'file_reader' tool to read the full content of the UI file located at the path: '{full_ui_file_path}'.
               Do not proceed without successfully reading the file.

            2. **Analyze and Summarize.**
               Based *only* on the content you just read, create a brief technical summary.

            3. **Provide Context-Specific Suggestions.**
               Based *directly* on your analysis of the code, provide at least 5 concrete and actionable improvement suggestions in a Markdown list.
               The suggestions should follow these UI/UX guidelines and incorporate the user's preferences: '{self.user_preferences}'.
               - Try unique designs for backgrounds, font styles, gradients, animations, and visuals/images for a better UI.
               - Always prioritize readability (use proper color combinations which are readable in different backgrounds; avoid white background with white text or white button that cause readability issues).
                 Example: light backgrounds with light color text or white buttons that cause readability issues.
               - Ensure all visuals, images, and graphs are presentable, well-sized, and do not overflow or break the layout/frame. Suggest using responsive or max-width styles if needed.
               - Tend to make creative changes to design while following these rules.
            """,
            expected_output="""A Markdown-formatted response containing ONLY:
            1. A brief technical summary of the file.
            2. A list of at least 5 actionable UI/UX improvement suggestions based on the user's preferences.
            DO NOT include the original file content in your output.
            """,
            agent=ui_advisor_agent,
        )

        generation_task = Task(
            description=f"""
            Your task is to implement the UI/UX improvement suggestions from the UI Advisor by modifying the original source code, keeping in mind the user's preferences: '{self.user_preferences}'.

            **Mandatory Steps:**
            1. **Read the Original File:** Before writing any code, you MUST use the 'file_reader' tool to read the full content of the original UI file at: '{full_ui_file_path}'.
            2. **Integrate Suggestions:** Take the *entire content* of the original file you just read, and integrate the specific UI/UX improvement suggestions provided by the UI Advisor into it. Do not remove any code unless explicitly part of a your code changes.
               When implementing the changes, you must follow these UI/UX guidelines:
               - Try unique designs for backgrounds, font styles, gradients, animations, and visuals/images for a better UI.
               - Always prioritize readability (use proper color combinations which are readable in different backgrounds; avoid white background with white text or white button that cause readability issues).
                 Example: light backgrounds with light color text or white buttons that cause readability issues.
               - Ensure all visuals, images, and graphs are presentable, well-sized, and do not overflow or break the layout/frame. Use responsive or max-width styles as needed.
               - Tend to make creative changes to design while following these rules.
            3. **Output Entire Modified File:** The output must be the *complete and final content of the entire file*, with all original code preserved and the suggested modifications applied.
            """,
            expected_output="""The complete and final code for the entire file, with the requested UI/UX improvements applied.
                The code should be enclosed in a single markdown code block (e.g., ```python ... ```).
                This output MUST represent the *entire* file content, not just the changes or a partial file.
                """,
            agent=code_generator_agent,
            context=[advisory_task],
        )

        code_writing_task = Task(
            description=f"""
            Take the code generated by the 'Senior Frontend Developer' and write it to the file system.
            - Always prioritize readability (use proper color combinations which are readable in different backgrounds; avoid white background with white text or white button that cause readability issues).
            Example: light backgrounds with light color text or white buttons that cause readability issues.
            - Tend to make creative changes to design while following the rules.
            You MUST use the 'file_writer' tool for this.

            The file path to write to is: '{full_ui_file_path}'

            The content to write is the full code provided in the context from the previous task.
            """,
            expected_output=f"A confirmation message stating that the file '{full_ui_file_path}' was written successfully.",
            agent=code_writer_agent,
            context=[generation_task],
        )

        ui_crew = Crew(
            agents=[ui_advisor_agent, code_generator_agent, code_writer_agent],
            tasks=[advisory_task, generation_task, code_writing_task],
            process=Process.sequential,
            verbose=False,
        )

        logging.info(f"UI Advisor Agent Goal: {ui_advisor_agent.goal}")
        logging.info(f"UI Advisor Agent Backstory: {ui_advisor_agent.backstory}")
        try:
            result = ui_crew.kickoff()
            logging.info("UI Crew Result:\n%s", result)
        except Exception as e:
            logging.error("Exception during UI Crew kickoff: %s", e)
            raise
        return result
