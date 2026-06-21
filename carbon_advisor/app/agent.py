import datetime
from functools import cached_property

from google.adk.agents.llm_agent import Agent
from google.adk.models import Gemini
from google.genai import Client

# In-memory store for registered users
REGISTERED_USERS = {
    "user-me",
    "eco_shivam",
    "user-123",
    "aria_wood",
    "zoe_sanchez",
    "kai_chen",
}

# In-memory store for logged activities: key is (user_id, activity_category, date_str)
LOGGED_ACTIVITIES = {}


def register_user(user_id: str) -> str:
    """Registers a new user ID so they can log activities.

    Args:
        user_id: The unique user ID to register.
    """
    user_id_clean = user_id.strip()
    if not user_id_clean:
        return "Error: User ID cannot be empty."
    if user_id_clean in REGISTERED_USERS:
        return f"User ID '{user_id_clean}' is already registered."
    REGISTERED_USERS.add(user_id_clean)
    return f"Successfully registered user ID '{user_id_clean}'."


def log_daily_activity(user_id: str, activity_category: str) -> str:
    """Logs a carbon-emitting activity (e.g., 'COMMUTE_CAR', 'HOME_ELEC') for a registered user.
    Ensures that a specific activity category can only be logged once per day per person.

    Args:
        user_id: The registered user ID.
        activity_category: The category of the activity (e.g. 'COMMUTE_CAR', 'HOME_ELEC').
    """
    user_id_clean = user_id.strip()
    category_clean = activity_category.strip().upper()

    if user_id_clean not in REGISTERED_USERS:
        return f"Error: User ID '{user_id_clean}' is not registered. Please register first using register_user."

    today_str = datetime.date.today().isoformat()
    key = (user_id_clean, category_clean, today_str)

    if key in LOGGED_ACTIVITIES:
        return f"Error: Activity category '{category_clean}' has already been logged for user '{user_id_clean}' today ({today_str}). Each category can only be logged once per day per person."

    LOGGED_ACTIVITIES[key] = datetime.datetime.now().isoformat()
    return f"Success: Logged activity '{category_clean}' for user '{user_id_clean}' on {today_str}."


class CustomGemini(Gemini):
    @cached_property
    def api_client(self) -> Client:
        import os

        # Load real API key from environment, falling back to simulated key for pre-commit check demo
        api_key = (
            os.environ.get("GEMINI_API_KEY")
            or os.environ.get("GOOGLE_API_KEY")
            or "AIzaSyD-mock-key-value-12345"
        )
        return Client(api_key=api_key)


root_agent = Agent(
    model=CustomGemini(model="gemini-2.5-flash"),
    name="carbon_advisor",
    description="AI environmental advisor helping users track and reduce their carbon footprint.",
    instruction=(
        "You are an AI Environmental Advisor. Your job is to help users track and reduce "
        "their carbon footprint. Use the log_daily_activity tool when they tell you about "
        "daily carbon-emitting activities like COMMUTE_CAR or HOME_ELEC. If their user ID is "
        "not registered, prompt them to register using register_user first. Encourage "
        "sustainable behaviors and advise on carbon footprint reduction."
    ),
    tools=[log_daily_activity, register_user],
)
