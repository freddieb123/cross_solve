/**
 * Categorize a puzzle by its name
 * Returns: 'quick_cryptic' | 'cryptic' | 'jumbo' | 'mephisto'
 */
function getPuzzleType(puzzleName) {
  const name = puzzleName.toLowerCase();

  if (name.includes('quick cryptic')) {
    return 'quick_cryptic';
  }
  if (name.includes('jumbo')) {
    return 'jumbo';
  }
  if (name.includes('mephisto')) {
    return 'mephisto';
  }

  // Default to regular cryptic (includes Times Saturday)
  return 'cryptic';
}

/**
 * Get all valid puzzle types
 */
function getPuzzleTypes() {
  return ['quick_cryptic', 'cryptic', 'jumbo', 'mephisto'];
}

/**
 * Get human-readable label for puzzle type
 */
function getPuzzleTypeLabel(type) {
  const labels = {
    quick_cryptic: 'Times Quick Cryptic',
    cryptic: 'Times Cryptic',
    jumbo: 'Jumbo',
    mephisto: 'Mephisto',
  };
  return labels[type] || type;
}

module.exports = {
  getPuzzleType,
  getPuzzleTypes,
  getPuzzleTypeLabel,
};
