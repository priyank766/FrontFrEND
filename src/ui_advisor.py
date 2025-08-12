import os
from crewai import Agent, Task, Crew, Process, LLM
from tools import read_file, write_file


class UIAdvisorCrew:
    def __init__(self, ui_detection_output: dict):
        """
        Initializes the UIAdvisorCrew with UI detection data.
        """
        self.ui_detection_output = ui_detection_output
        self.gemini_llm = LLM(model="gemini/gemini-2.5-pro", temperature=0.7)
        self.file_read_tool = read_file

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

        ui_advisor_agent = Agent(
            role="Expert UI/UX and Accessibility Consultant",
            goal="Provide actionable, high-level suggestions to improve the UI/UX and accessibility of the provided code.",
            backstory=(
                "You are a world-renowned UI/UX consultant with a passion for creative and readable design. "
                "You should try unique designs for backgrounds, font styles, gradients, and animations for a better UI. "
                "Don't make changes if it is already good, and always prioritize readability. "
                "This means using proper color combinations which are readable in different backgrounds. "
                "Avoid white backgrounds with white text or white buttons that cause readability issues. Be creative. "
                "You have a keen eye for detail and a deep understanding of "
                "user psychology and design principles. You have been equipped with a special 'file_reader' tool that allows you to securely "
                "read the content of files from the user's code repository. You MUST use this tool to ground your analysis and suggestions "
                "in the actual code provided."
            ),
            verbose=False,
            llm=self.gemini_llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        code_generator_agent = Agent(
            role="Senior Frontend Developer",
            goal="Generate production-ready frontend code based on UI/UX suggestions.",
            backstory=(
                "You are a meticulous senior frontend developer who excels at implementing modern and creative frontend practices. "
                "You should try unique designs for backgrounds, font styles, gradients, and animations for a better UI. "
                "Don't make changes if it is already good, and always prioritize readability. "
                "This means using proper color combinations which are readable in different backgrounds. "
                "Avoid white backgrounds with white text or white buttons that cause readability issues. Be creative. "
                "To ensure your work is based on the most current version of the code, you have been given a 'file_reader' tool. "
                "You MUST use this tool to read the original file content before applying any changes based on the UI advisor's suggestions."
            ),
            verbose=False,
            llm=self.gemini_llm,
            tools=[self.file_read_tool],
            allow_delegation=False,
        )

        code_writer_agent = Agent(
            role="Code Writer",
            goal="Take the generated code and write it to the appropriate file.",
            backstory=(
                "You are a meticulous code writer. Your primary function is to take a block of code, "
                "and use the 'file_writer' tool to save it to the correct file path."
            ),
            verbose=False,
            llm=self.gemini_llm,
            tools=[write_file],
            allow_delegation=False,
        )

        advisory_task = Task(
            description=f"""
            1. **Mandatory First Step: Read the File's Content.**
               You MUST use the 'file_reader' tool to read the full content of the UI file located at the relative path: '{ui_file_relative_path}'.
               Do not proceed without successfully reading the file.

            2. **Analyze and Summarize.**
               Based *only* on the content you just read, create a brief technical summary.

            3. **Provide Context-Specific Suggestions.**
               Based *directly* on your analysis of the code, provide at least 5 concrete and actionable improvement suggestions in a Markdown list.
               The suggestions should follow these UI/UX guidelines:
               - Try unique designs for backgrounds, font styles, gradients, and animations for a better UI.
               - Don't make changes if it is already good.
               - Always prioritize readability (use proper color combinations which are readable in different backgrounds; avoid white background with white text or white button that cause readability issues).
               - Be creative.
            """,
            expected_output="""A Markdown-formatted response containing ONLY:
            1. A brief technical summary of the file.
            2. A list of at least 5 actionable UI/UX improvement suggestions.
            DO NOT include the original file content in your output.
            """,
            agent=ui_advisor_agent,
        )

        generation_task = Task(
            description=f"""
            Your task is to implement the UI/UX improvement suggestions from the UI Advisor by modifying the original source code.

            **Mandatory Steps:**
            1. **Read the Original File:** Before writing any code, you MUST use the 'file_reader' tool to read the full content of the original UI file at: '{ui_file_relative_path}'.
            2. **Implement the Suggestions:** Modify the original code *only* to implement the specific suggestions provided.
               When implementing the changes, you must follow these UI/UX guidelines:
               - Try unique designs for backgrounds, font styles, gradients, and animations for a better UI.
               - Don't make changes if it is already good.
               - Always prioritize readability (use proper color combinations which are readable in different backgrounds; avoid white background with white text or white button that cause readability issues).
               - Be creative.
            3. **Preserve Original Code:** The output must be the *entire file content*, with the suggested modifications applied.
            """,
            expected_output="""The complete and final code for the entire file, with the requested UI/UX improvements applied.
            The code should be enclosed in a single markdown code block (e.g., ```python ... ```).
            DO NOT include the original file content you read, only the final, modified code.
            """,
            agent=code_generator_agent,
            context=[advisory_task],
        )

        code_writing_task = Task(
            description=f"""
            Take the code generated by the 'Senior Frontend Developer' and write it to the file system.

            You MUST use the 'file_writer' tool for this.

            The file path to write to is: '{ui_file_relative_path}'

            The content to write is the full code provided in the context from the previous task.
            """,
            expected_output=f"A confirmation message stating that the file '{ui_file_relative_path}' was written successfully.",
            agent=code_writer_agent,
            context=[generation_task],
        )

        ui_crew = Crew(
            agents=[ui_advisor_agent, code_generator_agent, code_writer_agent],
            tasks=[advisory_task, generation_task, code_writing_task],
            process=Process.sequential,
            verbose=False,
        )

        result = ui_crew.kickoff()
        return result
