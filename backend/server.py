from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Property data for the chatbot
PROPERTY_INFO = """
## Property: 5214 Jacana Lane, San Jose, CA 95123

### Basic Information
- **Price**: $950,000 ($832 per sq ft)
- **Bedrooms**: 3
- **Bathrooms**: 2.5
- **Square Footage**: 1,142 sq ft
- **Type**: Townhouse
- **Stories**: 2
- **Year Built**: 1988
- **Style**: Contemporary
- **Foundation**: Slab
- **Roof**: Composition

### HOA Information
- **Monthly HOA**: $255
- **HOA Includes**: Public utilities, sewer, water

### Property Features
- **Kitchen**: Granite countertops, modern stainless steel appliances (dishwasher, microwave, electric cooktop, oven range, refrigerator - all Energy Star rated)
- **Flooring**: Laminate wood-style and tile
- **Ceilings**: Vaulted ceilings throughout
- **Living Room**: Fireplace connecting to dining area
- **Laundry**: Upper-floor laundry room
- **Windows**: Double-pane windows
- **Climate**: Central AC and heating
- **EV Ready**: EV charging hookup available

### Exterior & Parking
- 1 attached garage space + common parking
- Balcony/patio
- Fenced backyard

### Location
- Oak Grove Elementary School District
- Near shops, parks, and recreation
- San Jose, California

### Listing Information
- **Listed**: December 12, 2025
- **MLS#**: ML82029348
- **Listing Agents**: George Toscano and AJ Del Rosario (Kollab Real Estate)

### Property History
- **Prior Sale**: Sold for $900,000 on September 18, 2024

### Agent Information
- **George Toscano**
- DRE# 02213878
- Kollab Real Estate
- Phone: 408.603.6603
- Email: gtdrums@gmail.com
- Bay Area Realtor with 20+ years in tech and data analytics

### Why This Home?
This contemporary townhouse offers modern living with vaulted ceilings creating an open, airy feel. The updated kitchen features granite countertops and Energy Star appliances. Perfect for EV owners with a dedicated charging hookup. Located in a prime San Jose neighborhood near excellent schools, shopping, and recreation.
"""

# Models
class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

class PropertyInfo(BaseModel):
    address: str = "5214 Jacana Lane, San Jose, CA 95123"
    price: str = "$950,000"
    price_per_sqft: str = "$832"
    bedrooms: int = 3
    bathrooms: float = 2.5
    sqft: int = 1142
    year_built: int = 1988
    style: str = "Contemporary"
    stories: int = 2
    hoa: str = "$255/month"
    agent_name: str = "George Toscano"
    agent_license: str = "DRE# 02213878"
    agent_phone: str = "408.603.6603"
    agent_email: str = "gtdrums@gmail.com"
    agent_company: str = "Kollab Real Estate"
    agent_linkedin: str = "https://www.linkedin.com/in/george-toscano-6b979821/"
    features: List[str] = [
        "Granite countertops",
        "Stainless steel appliances",
        "Vaulted ceilings",
        "Fireplace",
        "EV charging hookup",
        "Central AC & heating",
        "Double-pane windows",
        "Upper-floor laundry",
        "Attached garage",
        "Fenced backyard"
    ]

# Routes
@api_router.get("/")
async def root():
    return {"message": "5214 Jacana Lane API"}

@api_router.get("/property", response_model=PropertyInfo)
async def get_property_info():
    return PropertyInfo()

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        llm_key = os.environ.get('EMERGENT_LLM_KEY')
        if not llm_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Get chat history for this session
        history = await db.chat_messages.find(
            {"session_id": request.session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(20)
        
        # Build system message
        system_message = f"""You are a helpful real estate assistant for the property at 5214 Jacana Lane, San Jose, CA.

You have complete knowledge of this property and can answer ANY question about it. Be friendly, professional, and helpful.

Here is all the information about the property:

{PROPERTY_INFO}

Guidelines:
- Answer questions accurately based on the property information above
- If asked about something not in the data, say you'd be happy to have the agent George Toscano provide more details
- Be enthusiastic but professional about the property
- Keep responses concise but helpful
- If someone wants to schedule a viewing or has buying interest, encourage them to contact George via LinkedIn or call 408.603.6603
- You can discuss the neighborhood, schools, local amenities based on the San Jose area
- For mortgage or financing questions, provide general guidance but recommend speaking with a lender
"""
        
        # Initialize chat
        chat = LlmChat(
            api_key=llm_key,
            session_id=request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        # Add history to context
        for msg in history[-10:]:  # Last 10 messages for context
            if msg['role'] == 'user':
                await chat.send_message(UserMessage(text=msg['content']))
            # Assistant messages are already in the chat history via the library
        
        # Create user message and get response
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Store messages in database
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        assistant_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=response
        )
        
        # Convert to dict and serialize datetime
        user_doc = user_msg.model_dump()
        user_doc['timestamp'] = user_doc['timestamp'].isoformat()
        assistant_doc = assistant_msg.model_dump()
        assistant_doc['timestamp'] = assistant_doc['timestamp'].isoformat()
        
        await db.chat_messages.insert_many([user_doc, assistant_doc])
        
        return ChatResponse(response=response, session_id=request.session_id)
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    return {"messages": messages}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
