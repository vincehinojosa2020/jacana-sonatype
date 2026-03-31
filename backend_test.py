import requests
import sys
import json
from datetime import datetime

class RealEstateAPITester:
    def __init__(self, base_url="https://crimson-gold-home.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout} seconds")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_property_info(self):
        """Test property information endpoint"""
        success, response = self.run_test("Property Info", "GET", "property", 200)
        
        if success and isinstance(response, dict):
            # Verify required property fields
            required_fields = ['address', 'price', 'bedrooms', 'bathrooms', 'sqft', 'agent_name']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"⚠️  Warning: Missing fields in property info: {missing_fields}")
            else:
                print("✅ All required property fields present")
                
            # Verify specific values
            expected_values = {
                'address': '5214 Jacana Lane, San Jose, CA 95123',
                'price': '$950,000',
                'bedrooms': 3,
                'bathrooms': 2.5,
                'sqft': 1142,
                'agent_name': 'George Toscano'
            }
            
            for field, expected in expected_values.items():
                if field in response and response[field] == expected:
                    print(f"✅ {field}: {response[field]} (correct)")
                else:
                    print(f"❌ {field}: Expected {expected}, got {response.get(field)}")
        
        return success, response

    def test_chat_functionality(self):
        """Test AI chatbot functionality"""
        test_message = "What is the price of this house?"
        
        success, response = self.run_test(
            "AI Chat", 
            "POST", 
            "chat", 
            200,
            data={
                "session_id": self.session_id,
                "message": test_message
            },
            timeout=45  # Longer timeout for AI response
        )
        
        if success and isinstance(response, dict):
            if 'response' in response and 'session_id' in response:
                print(f"✅ Chat response received: {response['response'][:100]}...")
                print(f"✅ Session ID matches: {response['session_id'] == self.session_id}")
                
                # Check if response mentions the price
                if '$950,000' in response['response'] or '950000' in response['response'] or 'nine hundred fifty thousand' in response['response'].lower():
                    print("✅ AI correctly mentioned the property price")
                else:
                    print("⚠️  AI response may not contain expected price information")
            else:
                print("❌ Chat response missing required fields")
                
        return success, response

    def test_chat_history(self):
        """Test chat history retrieval"""
        return self.run_test("Chat History", "GET", f"chat/history/{self.session_id}", 200)

    def test_property_specific_questions(self):
        """Test AI responses to specific property questions"""
        questions = [
            "How many bedrooms does this house have?",
            "What is the square footage?",
            "Who is the listing agent?",
            "What are the special features?"
        ]
        
        all_passed = True
        for i, question in enumerate(questions):
            print(f"\n🤖 Testing AI Question {i+1}: {question}")
            success, response = self.run_test(
                f"AI Question {i+1}",
                "POST",
                "chat",
                200,
                data={
                    "session_id": f"{self.session_id}_q{i+1}",
                    "message": question
                },
                timeout=45
            )
            
            if not success:
                all_passed = False
            elif isinstance(response, dict) and 'response' in response:
                print(f"   AI Response: {response['response'][:150]}...")
        
        return all_passed, {}

def main():
    print("🏠 Starting Real Estate Website API Tests")
    print("=" * 50)
    
    # Setup
    tester = RealEstateAPITester()
    
    # Run basic API tests
    print("\n📡 Testing Basic API Endpoints...")
    tester.test_root_endpoint()
    tester.test_property_info()
    
    # Test chat functionality
    print("\n🤖 Testing AI Chatbot...")
    tester.test_chat_functionality()
    tester.test_chat_history()
    
    # Test specific property questions
    print("\n❓ Testing Property-Specific AI Questions...")
    tester.test_property_specific_questions()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All API tests passed!")
        return 0
    else:
        print("⚠️  Some API tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())