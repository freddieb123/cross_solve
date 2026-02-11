#!/bin/bash

echo "🔍 Verifying Implementation Completeness..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
FILES_OK=0
FILES_TOTAL=0

check_file() {
  FILES_TOTAL=$((FILES_TOTAL + 1))
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    FILES_OK=$((FILES_OK + 1))
  else
    echo -e "${RED}✗${NC} $1 (MISSING)"
  fi
}

echo "Backend Files:"
echo "=============="
check_file "backend/schema.sql"
check_file "backend/init-db.js"
check_file "backend/routes/stats.js"
check_file "backend/routes/savedClues.js"
check_file "backend/server.js"
echo ""

echo "Frontend Utils:"
echo "==============="
check_file "frontend/src/utils/session.js"
check_file "frontend/src/utils/api.js"
echo ""

echo "Frontend Components:"
echo "==================="
check_file "frontend/src/components/BurgerMenu.jsx"
check_file "frontend/src/components/StatsModal.jsx"
check_file "frontend/src/components/SavedCluesModal.jsx"
check_file "frontend/src/components/ClueDisplay.jsx"
check_file "frontend/src/App.jsx"
echo ""

echo "Frontend Styles:"
echo "================"
check_file "frontend/src/styles/BurgerMenu.css"
check_file "frontend/src/styles/StatsModal.css"
check_file "frontend/src/styles/SavedCluesModal.css"
check_file "frontend/src/styles/ClueDisplay.css"
check_file "frontend/src/styles/App.css"
echo ""

echo "Documentation:"
echo "=============="
check_file "IMPLEMENTATION_SUMMARY.md"
echo ""

echo "Test Scripts:"
echo "============="
check_file "test-backend.sh"
echo ""

# Summary
PERCENTAGE=$((FILES_OK * 100 / FILES_TOTAL))
echo "═════════════════════════════════════════"
echo -e "Files verified: ${GREEN}${FILES_OK}/${FILES_TOTAL}${NC} (${PERCENTAGE}%)"

if [ $FILES_OK -eq $FILES_TOTAL ]; then
  echo -e "${GREEN}✓ All implementation files are in place!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. cd backend && node init-db.js"
  echo "2. Start backend: npm run start:backend"
  echo "3. Start frontend: npm run start:frontend"
  echo "4. Open http://localhost:3000"
  exit 0
else
  echo -e "${RED}✗ Some files are missing!${NC}"
  exit 1
fi
