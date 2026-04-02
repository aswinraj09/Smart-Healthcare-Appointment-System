# ai_agent/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from .tools import find_doctor, check_availability
# from langgraph.prebuilt import create_react_agent
# Using simple tool binding for MVP to avoid langgraph complexity overhead if not needed immediately,
# BUT the plan mentioned agent. Let's use simple binding + invoke for reliability first.
# Actually, create_react_agent is cleaner.
from langgraph.prebuilt import create_react_agent

from django.utils import timezone

# Initialize LLM
llm = ChatOllama(model="llama3.2", temperature=0)

# Bind tools
tools = [find_doctor, check_availability]

# Create Agent
agent_executor = create_react_agent(llm, tools)

SYSTEM_PROMPT = """You are a knowledgeable and helpful medical AI assistant.
Current time: {time}

Capabilities:
1. You can answer general medical and health-related questions using your internal knowledge.
2. You can handle small talk (greetings, "how are you", etc.) in a friendly manner.
3. You can find doctors and check their availability using tools.

Rules:
1. ANSWER ANY QUESTION directly. Do not restrict yourself to only doctor search.
2. If the user says "hello" or asks how you are, reply warmly and ask how you can help.
3. When asked to find a doctor, use 'find_doctor'.
4. CRITICAL: When listing a doctor, ALWAYS include a booking button using this EXACT Markdown format:
   [Book Appointment](/appointments/<doctor_id>)
   (Replace <doctor_id> with the doctor's actual ID from the tool output).
5. Use 'check_availability' if the user asks for slots.
6. Be polite, empathetic, professional, and conversational.
7. DO NOT use JSON or tool calls for general conversation. Just speak naturally.
"""

@api_view(["POST"])
def chat_agent(request):
    user_input = request.data.get("message")
    
    if not user_input:
        return Response({"error": "Message required"}, status=400)

    # Convert history to LangChain messages
    formatted_prompt = SYSTEM_PROMPT.format(time=timezone.now())
    messages = [SystemMessage(content=formatted_prompt)]
    
    history = request.data.get("history", [])
    for msg in history:
        role = msg.get("role")
        content = msg.get("content")
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))

    messages.append(HumanMessage(content=user_input))

    try:
        # Run agent
        result = agent_executor.invoke({"messages": messages})
        last_message = result["messages"][-1].content
        
        # FIX: Check if the model hallucinated a tool call as text
        import json
        if isinstance(last_message, str) and last_message.strip().startswith('{') and '"response"' in last_message:
            try:
                # Try to parse hallucinated JSON like {"name": "responds", "parameters": {"response": "..."}}
                data = json.loads(last_message)
                if "parameters" in data and "response" in data["parameters"]:
                    last_message = data["parameters"]["response"]
                elif "response" in data:
                    last_message = data["response"]
            except:
                pass # If parsing fails, use original text

        return Response({"response": last_message})
    except Exception as e:
        print(f"Agent Error: {e}")
        return Response({"response": "I'm having trouble connecting to my brain (Ollama). Please make sure Ollama is running!"})
