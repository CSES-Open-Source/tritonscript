#!/bin/bash

# TritonScript Notes API Test Script
# This script tests all note endpoints without authentication

BASE_URL="http://localhost:3000"
echo "🧪 Testing TritonScript Notes API (No Auth)"
echo "============================================"
echo ""

# Test 1: Get all notes
echo "1️⃣  Testing GET /api/notes (Get all notes)"
curl -s $BASE_URL/api/notes | jq '.'
echo ""
echo ""

# Test 2: Generate upload URL
echo "2️⃣  Testing POST /api/notes/get-upload-url (Generate upload URL)"
UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/api/notes/get-upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-notes.pdf",
    "title": "Test Notes",
    "className": "CSE",
    "classNumber": "100",
    "instructorName": "Dr. Test",
    "quarter": "Fall 2024"
  }')
echo $UPLOAD_RESPONSE | jq '.'
S3_KEY=$(echo $UPLOAD_RESPONSE | jq -r '.s3Key')
echo ""
echo "📝 S3 Key: $S3_KEY"
echo ""
echo ""

# Test 3: Create a note (simulating after upload)
echo "3️⃣  Testing POST /api/notes/create (Create note)"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/notes/create \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"CSE 100 Data Structures\",
    \"className\": \"CSE\",
    \"classNumber\": \"100\",
    \"instructorName\": \"Dr. Test\",
    \"quarter\": \"Fall 2024\",
    \"s3Key\": \"$S3_KEY\",
    \"fileSize\": 2048000
  }")
echo $CREATE_RESPONSE | jq '.'
NOTE_ID=$(echo $CREATE_RESPONSE | jq -r '.note._id')
echo ""
echo "📝 Note ID: $NOTE_ID"
echo ""
echo ""

# Test 4: Get specific note by ID
echo "4️⃣  Testing GET /api/notes/:noteId (Get note by ID)"
curl -s $BASE_URL/api/notes/$NOTE_ID | jq '.'
echo ""
echo ""

# Test 5: Get download URL
echo "5️⃣  Testing GET /api/notes/:noteId/download (Get download URL)"
curl -s $BASE_URL/api/notes/$NOTE_ID/download | jq '.'
echo ""
echo ""

# Test 6: Get all notes again (should show the new note)
echo "6️⃣  Testing GET /api/notes (Get all notes - should include new note)"
curl -s $BASE_URL/api/notes | jq '.'
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "Note: To test DELETE endpoint, run:"
echo "curl -X DELETE $BASE_URL/api/notes/$NOTE_ID"
