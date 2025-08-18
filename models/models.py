from pydantic import BaseModel


class LLMConfig(BaseModel):
    model_name: str = "groq/gpt-oss-20b"
    temperature: float = 0.7
