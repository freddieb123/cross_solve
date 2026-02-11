#!/bin/bash

# Backend Test Script
# Tests the new stats and saved clues endpoints

API_URL="http://localhost:5000/api"
echo "Testing Backend Endpoints..."
echo ""

# Test 1: Create Session
echo "1. Testing POST /api/stats/session"
SESSION_RESPONSE=$(curl -s -X POST "$API_URL/stats/session" \
  -H "Content-Type: application/json" \
  -d '{}')
echo "Response: $SESSION_RESPONSE"
SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)
echo "Extracted Session ID: $SESSION_ID"
echo ""

if [ -z "$SESSION_ID" ]; then
  echo "ERROR: Failed to create session"
  exit 1
fi

# Test 2: Record an Attempt
echo "2. Testing POST /api/stats/attempt"
ATTEMPT_RESPONSE=$(curl -s -X POST "$API_URL/stats/attempt" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"clueRowid\": 1,
    \"lettersRevealed\": 3,
    \"totalLetters\": 10,
    \"correct\": true,
    \"puzzleType\": \"cryptic\"
  }")
echo "Response: $ATTEMPT_RESPONSE"
echo ""

# Test 3: Get Stats Summary
echo "3. Testing GET /api/stats/summary/:sessionId"
STATS_RESPONSE=$(curl -s -X GET "$API_URL/stats/summary/$SESSION_ID")
echo "Response: $STATS_RESPONSE"
echo ""

# Test 4: Get Stats History
echo "4. Testing GET /api/stats/history/:sessionId"
HISTORY_RESPONSE=$(curl -s -X GET "$API_URL/stats/history/$SESSION_ID")
echo "Response: $HISTORY_RESPONSE"
echo ""

# Test 5: Save a Clue
echo "5. Testing POST /api/saved-clues"
SAVE_RESPONSE=$(curl -s -X POST "$API_URL/saved-clues" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"clueRowid\": 1
  }")
echo "Response: $SAVE_RESPONSE"
echo ""

# Test 6: Get Saved Clues
echo "6. Testing GET /api/saved-clues/:sessionId"
SAVED_RESPONSE=$(curl -s -X GET "$API_URL/saved-clues/$SESSION_ID")
echo "Response: $SAVED_RESPONSE"
echo ""

# Test 7: Delete Saved Clue
echo "7. Testing DELETE /api/saved-clues/:sessionId/:clueRowid"
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/saved-clues/$SESSION_ID/1")
echo "Response: $DELETE_RESPONSE"
echo ""

echo "Backend test completed!"
