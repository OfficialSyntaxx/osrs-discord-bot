const axios = require('axios');

async function getPlayerStats(username) {
  try {
    const url = `https://api.wiseoldman.net/v2/players/${encodeURIComponent(username)}`;
    const response = await axios.get(url);
    const player = response.data;
    return player;
  } catch (error) {
    console.error('Error fetching player stats:', error.response?.data || error.message);
    throw error;
  }
}

// Test run:
(async () => {
  const username = 'ZeahWalker';  // Replace with real OSRS username
  const player = await getPlayerStats(username);
  console.log(`Player ${username} total level:`, player.latestSnapshot.data.overall.level);
})();
