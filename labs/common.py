"""Shared helper: one chat client for every lab.

Groq exposes an OpenAI-compatible Chat Completions endpoint, so we plug it into
Microsoft Agent Framework through ``OpenAIChatCompletionClient``.
Swap this single function to move the whole workshop to Azure OpenAI / Foundry.
"""

import os

from dotenv import load_dotenv
from agent_framework.openai import OpenAIChatCompletionClient

load_dotenv()

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


def make_client() -> OpenAIChatCompletionClient:
    """Return a chat client wired to Groq (Bring Your Own Key)."""
    return OpenAIChatCompletionClient(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        api_key=os.environ["GROQ_API_KEY"],
        # Any OpenAI-compatible endpoint works (Groq, Ollama, LM Studio, vLLM ...)
        base_url=os.getenv("OPENAI_COMPAT_BASE_URL", GROQ_BASE_URL),
    )


# --- Enterprise alternative (Module 2) ------------------------------------
# from agent_framework.openai import OpenAIChatCompletionClient
# from azure.identity import AzureCliCredential
#
# client = OpenAIChatCompletionClient(
#     model="gpt-4o-mini",                                # your deployment name
#     azure_endpoint="https://<resource>.openai.azure.com",
#     credential=AzureCliCredential(),                    # keyless, Entra ID
# )
