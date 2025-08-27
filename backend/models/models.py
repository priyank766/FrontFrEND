from pydantic import BaseModel


class LLMConfig(BaseModel):
    model_name: str = "ollama/qwen3:0.6b"
    temperature: float = 0.7
    base_url: str = "http://localhost:11434"
