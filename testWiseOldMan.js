const axios = require('axios');

async function getPlayerSnapshots(username) {
  const url = `https://api.wiseoldman.net/v2/players/${encodeURIComponent(username)}/snapshots`;
  const response = await axios.get(url);
  return response.data;
}

(async () => {
  const username = 'syntaxsx';
  try {
    const snapshots = await getPlayerSnapshots(username);

    if (!snapshots || snapshots.length === 0) {
      console.log(`No snapshots found for player ${username}.`);
      return;
    }

    console.log(`Found ${snapshots.length} snapshots for player ${username}:`);

    snapshots.forEach((snap, i) => {
      // Defensive check for skills and overall
      if (!snap.data || !snap.data.skills || !snap.data.skills.overall) {
        console.log(`${i + 1}. Snapshot missing overall skill data, skipping.`);
        return;
      }

      const ts = new Date(snap.createdAt || snap.timestamp).toLocaleString();
      const overall = snap.data.skills.overall;

      console.log(
        `${i + 1}. Date: ${ts}, Level: ${overall.level}, XP: ${overall.experience.toLocaleString()}`
      );
    });
  } catch (error) {
    console.log('Failed to fetch snapshots.');
    console.error(error);
  }
})();
