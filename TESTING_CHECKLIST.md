# Testing Checklist - Database Stats & Burger Menu Implementation

## Pre-Testing Setup

- [ ] Database is running and accessible
- [ ] `backend/init-db.js` has been executed successfully
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Browser console is open (Ctrl+Shift+I or Cmd+Option+I)

---

## Backend Testing

### Database Schema
- [ ] Run `node backend/init-db.js` and see "✓ Database schema initialized successfully"
- [ ] New tables created:
  - [ ] `user_sessions` table exists
  - [ ] `user_attempts` table exists
  - [ ] `saved_clues` table exists
- [ ] Indexes created on session_id and dates

### API Endpoints - Session Management
- [ ] `POST /api/stats/session` with empty body returns sessionId
- [ ] `POST /api/stats/session` with existing sessionId returns same sessionId with `isNew: false`
- [ ] Response includes `sessionId` (UUID format) and `isNew` boolean

### API Endpoints - Attempt Recording
- [ ] `POST /api/stats/attempt` with valid data returns `success: true`
- [ ] Required fields: sessionId, clueRowid, totalLetters, correct, puzzleType
- [ ] Optional fields: lettersRevealed (defaults to 0)
- [ ] Response includes `attemptId`
- [ ] Invalid requests return 400 error

### API Endpoints - Stats Retrieval
- [ ] `GET /api/stats/summary/:sessionId` returns stats object
  - [ ] `totalAttempts` is a number
  - [ ] `correctAnswers` is a number
  - [ ] `successRate` is a percentage (0-100)
  - [ ] `avgLettersRevealedPct` is a decimal percentage
  - [ ] `last10AvgLettersRevealedPct` is a decimal percentage

- [ ] `GET /api/stats/history/:sessionId` returns array
  - [ ] Each item has: id, clue_rowid, letters_revealed, total_letters, correct, puzzle_type, attempted_at
  - [ ] Results ordered by attempted_at DESC
  - [ ] Limit query param works (defaults to 50)

### API Endpoints - Saved Clues
- [ ] `POST /api/saved-clues` saves a clue and returns success
- [ ] Duplicate saves don't cause errors (UNIQUE constraint handled)
- [ ] `GET /api/saved-clues/:sessionId` returns array of saved clues
  - [ ] Each clue includes: id, clue_rowid, clue text, answer, type, answerLength
- [ ] `DELETE /api/saved-clues/:sessionId/:clueRowid` removes clue successfully

---

## Frontend Testing

### Initial Load
- [ ] App loads without console errors
- [ ] Puzzle type selector appears
- [ ] No hamburger menu visible yet (correct - not in type selector screen)

### Session Initialization
- [ ] After selecting a puzzle type, navigate to clue screen
- [ ] Check localStorage: should have `cryptic_session_id` with a UUID
- [ ] UUID persists across browser refreshes
- [ ] Hamburger menu (☰) appears in top-left of header

### Hamburger Menu
- [ ] Click ☰ icon - menu slides out smoothly from left
- [ ] Menu shows three options:
  - [ ] "Select Type"
  - [ ] "Your Stats"
  - [ ] "Saved for Later"
- [ ] Menu has semi-transparent overlay
- [ ] Click outside menu - menu closes
- [ ] Click overlay - menu closes
- [ ] Menu appears above other content (z-index correct)

### Header Layout
- [ ] Hamburger menu (☰) in top-left
- [ ] "Daily Cryptic Trainer" title centered
- [ ] Subtitle centered below title
- [ ] No back button visible (successfully removed sidebar)
- [ ] Header responsive on mobile

### Main Content Layout
- [ ] Full-width centered puzzle display
- [ ] ClueDisplay card is centered and properly sized
- [ ] Sidebar is completely gone
- [ ] Content is responsive on mobile devices

### Clue Display - Letter Tracking
- [ ] Solve a clue and click "🔤 Reveal Letter" several times
- [ ] Each reveal works and adds a letter to the grid
- [ ] Browser console shows no errors during reveals
- [ ] Internal count `lettersRevealedCount` is tracking (visible in database record)

### Clue Display - Save Button
- [ ] "🕐 Save" button appears in controls section
- [ ] Click "🕐 Save" on an unsolved clue
  - [ ] Green notification appears: "✓ Clue saved for later!"
  - [ ] Notification disappears after 2 seconds
  - [ ] No console errors
- [ ] After submit, save button is disabled (correct)

### Stats Modal
- [ ] Click "Your Stats" from burger menu
- [ ] Modal appears with fade animation
- [ ] Modal shows title "Your Statistics"
- [ ] Close button (✕) in top-right
- [ ] Shows 5 stat cards:
  - [ ] Total Attempts (number)
  - [ ] Correct Answers (number)
  - [ ] Success Rate (%)
  - [ ] Avg % Letters (All Time)
  - [ ] Avg % Letters (Last 10)
- [ ] Shows recent attempts history
  - [ ] Each attempt shows clue text, result (✓/✗), letters revealed %
  - [ ] Results are accurate
- [ ] Click close button - modal disappears
- [ ] Click outside modal - modal disappears

### Stats Calculation
- [ ] Solve and submit a clue with letters revealed
- [ ] Example: Reveal 3 letters for a 9-letter answer = 33.3%
- [ ] Open "Your Stats"
- [ ] Verify the letter percentage is calculated correctly
- [ ] Last 10 average only uses up to 10 recent attempts
- [ ] Success rate = (correct attempts / total attempts) * 100

### Saved Clues Modal
- [ ] Click "Saved for Later" from burger menu
- [ ] Modal appears with title "Saved for Later"
- [ ] Empty state shows: "No saved clues yet. Use the 🕐 button..."
- [ ] Save a clue using the save button
- [ ] Close and reopen "Saved for Later"
- [ ] Saved clue appears in the list with:
  - [ ] Full clue text
  - [ ] Puzzle type badge
  - [ ] Answer length
  - [ ] "Load" button (blue)
  - [ ] Delete button (🗑️)
- [ ] Click "Load" on a saved clue
  - [ ] Modal closes
  - [ ] Clue appears in puzzle area
  - [ ] Can solve the loaded clue
  - [ ] Attempt is recorded with correct data
- [ ] Click 🗑️ on a saved clue
  - [ ] Clue is removed from list
  - [ ] List updates immediately
  - [ ] Clue is deleted from database
- [ ] Close modal with close button (✕)

### Select Type Navigation
- [ ] Click "Select Type" from burger menu
- [ ] Returns to puzzle type selector screen
- [ ] Can select a new puzzle type
- [ ] Stats and saved clues persist (still in database)
- [ ] UUID in localStorage hasn't changed

### Data Persistence
- [ ] Solve several clues with different letter reveals
- [ ] Open "Your Stats" and verify all attempts are listed
- [ ] Close browser completely
- [ ] Reopen app at http://localhost:3000
- [ ] Same UUID should be in localStorage
- [ ] "Your Stats" should show all previous attempts
- [ ] Saved clues should still be there
- [ ] Stats should be calculated from all previous attempts

---

## Mobile Testing

### Portrait Orientation (< 600px)
- [ ] Hamburger menu (☰) is clickable and large enough (44x44px)
- [ ] Menu slides out and doesn't cut off at screen edges
- [ ] Menu content is readable
- [ ] Modal shows properly on small screens
- [ ] Stat cards stack appropriately
- [ ] Answer grid doesn't overflow horizontally
- [ ] Control buttons are properly sized and spaced
- [ ] Save button notification is visible and not cut off

### Landscape Orientation
- [ ] All content fits without horizontal scrolling
- [ ] Menu overlay covers full screen
- [ ] Modals are readable
- [ ] Answer grid displays correctly

### Touch Interactions
- [ ] Can tap answer boxes to input letters
- [ ] Can tap control buttons (no hover issues)
- [ ] Menu swipe-friendly
- [ ] Modal close buttons easy to tap

---

## Error Handling

### Network Errors
- [ ] Disconnect backend temporarily
- [ ] Try to submit a clue
  - [ ] Should show error in result
  - [ ] Clue can be attempted again
- [ ] Reconnect backend
- [ ] Try again - should work

### Missing Database Fields
- [ ] Try recording attempt with missing required fields
- [ ] API should return 400 error
- [ ] Frontend should handle gracefully

### Invalid Session ID
- [ ] Manually set invalid sessionId in localStorage
- [ ] New session should be created on next action
- [ ] App should continue working

### Slow Network
- [ ] Open DevTools > Network tab, set to "Slow 3G"
- [ ] Stats modal should show loading state
- [ ] Saved clues modal should show loading state
- [ ] Both should eventually load correctly

---

## Cross-Browser Testing

Test in at least one browser per category:

### Desktop
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on macOS)
- [ ] Edge (if available)

### Mobile
- [ ] Chrome Mobile
- [ ] Safari Mobile (iOS)
- [ ] Firefox Mobile

### Features to verify per browser:
- [ ] Animations work smoothly
- [ ] Modals render correctly
- [ ] localStorage works
- [ ] UUID generation works
- [ ] All colors display correctly
- [ ] Fonts render properly
- [ ] No console errors

---

## Performance Testing

- [ ] Load stats for session with 50+ attempts - should load in < 1 second
- [ ] Save a clue - should complete instantly (< 100ms)
- [ ] Load saved clues list - should load in < 500ms
- [ ] Reveal letters - should be instant (no lag)
- [ ] Submit answer - should check and record in < 1 second

---

## Accessibility Testing

- [ ] Can navigate menu with keyboard
- [ ] Modal close buttons are keyboard accessible
- [ ] Button text is descriptive (not just emoji)
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] Form inputs are labeled
- [ ] Modals are properly announced to screen readers

---

## Final Verification

### Code Quality
- [ ] No console errors in browser DevTools
- [ ] No console errors in backend terminal
- [ ] No warnings about deprecated APIs
- [ ] No memory leaks detected

### UI/UX
- [ ] All text is readable
- [ ] Color scheme is consistent
- [ ] Animations are smooth (no jank)
- [ ] Buttons have hover/active states
- [ ] Loading states are clear
- [ ] Error messages are helpful

### Data Integrity
- [ ] Attempts are recorded accurately
- [ ] Letter counts are correct
- [ ] Success rates are calculated properly
- [ ] Last 10 average uses correct window
- [ ] Saved clues list is accurate
- [ ] Deleted clues don't reappear

### Session Management
- [ ] Different browsers have different UUIDs
- [ ] Same browser maintains same UUID
- [ ] Session data is isolated per user

---

## Known Limitations (By Design)

- [ ] No user authentication - stats are per-browser UUID
- [ ] No cross-device sync - separate stats per device
- [ ] Session data not backed up if localStorage cleared
- [ ] No user authentication - so no private stats

---

## Sign-Off Checklist

- [ ] Database schema initialized
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] All 19 implementation files present
- [ ] Hamburger menu works as expected
- [ ] Stats modal displays correct data
- [ ] Saved clues modal functions correctly
- [ ] Letter reveal tracking works
- [ ] Mobile responsive design works
- [ ] Session persistence works
- [ ] No console errors
- [ ] Data accuracy verified
- [ ] Cross-browser testing passed

---

## Rollback Instructions (If Needed)

If issues occur that require rollback:

1. **Undo database changes** (keep tables, clear data):
   ```sql
   TRUNCATE user_sessions CASCADE;
   ```

2. **Revert to old UI** (temporarily comment out burger menu in App.jsx):
   - Old sidebar and back button code is still in git history

3. **Clear localStorage** in browser:
   - Open DevTools > Application > Local Storage
   - Delete `cryptic_session_id` key

4. **Fresh start**:
   ```bash
   npm run start:backend
   npm run start:frontend
   # App will work with localStorage stats as before
   ```

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Stats accurately reflect attempts
✅ Letter tracking works correctly
✅ Saved clues persist across sessions
✅ Mobile UI responsive and functional
✅ Performance is acceptable
✅ Accessibility standards met
✅ Burger menu replaces sidebar successfully
✅ New feature provides value to users
