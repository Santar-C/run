/**
 * BEASTBORNE SHARED STORE v3.0
 * ────────────────────────────
 * Include via <script src="store.js"> in beastborne.html and draglak.html
 * Provides cross-page sync: run/bike data → RPG XP & history
 *
 * Usage inside RPG pages:
 *   BbStore.syncFromActivity()   — pull latest run/bike km into RPG state
 *   BbStore.getRuns()            — get all GPS runs
 *   BbStore.getBikes()           — get all GPS bike rides
 *   BbStore.getTotalRunKm()      — number
 *   BbStore.getTotalBikeKm()     — number
 */
const BbStore = (() => {
  const K = {
    runs  : 'BB_Runs',
    bikes : 'BB_Bikes',
    beast : 'BB_State',
    drag  : 'GJL_State',
    mode  : 'BB_LastMode',
  };

  const ld = (key, def = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
  };
  const sv = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

  // ── Activity getters ──
  const getRuns   = () => ld(K.runs,  []);
  const getBikes  = () => ld(K.bikes, []);

  const getTotalRunKm  = () => getRuns().reduce((s, r) => s + (r.distance || 0) / 1000, 0);
  const getTotalBikeKm = () => getBikes().reduce((s, r) => s + (r.distance || 0) / 1000, 0);

  // Count activities in date range (for streaks/readiness)
  const getRunsInDays = (days) => {
    const cutoff = Date.now() - days * 86400000;
    return getRuns().filter(r => r.ts > cutoff);
  };
  const getBikesInDays = (days) => {
    const cutoff = Date.now() - days * 86400000;
    return getBikes().filter(r => r.ts > cutoff);
  };

  /**
   * syncFromActivity()
   * ──────────────────
   * Call this when a beastborne/draglak page loads, or after returning from run.html.
   * It:
   *  1. Reads all GPS runs + bikes
   *  2. Injects missing runs into RPG history (so readiness calc works)
   *  3. Updates _syncedRunKm / _syncedBikeKm on the RPG state
   */
  const syncFromActivity = () => {
    const runs  = getRuns();
    const bikes = getBikes();
    const runKm  = Math.round(getTotalRunKm()  * 10) / 10;
    const bikeKm = Math.round(getTotalBikeKm() * 10) / 10;

    [K.beast, K.drag].forEach(stateKey => {
      const state = ld(stateKey);
      if (!state) return;

      state._syncedRunKm  = runKm;
      state._syncedBikeKm = bikeKm;

      // Inject GPS runs into RPG history array (avoid duplicates by id)
      if (!state.history) state.history = [];
      const existingIds = new Set(state.history.map(h => h._gpsId).filter(Boolean));

      runs.forEach(run => {
        if (existingIds.has(run.id)) return;
        const km = run.distance / 1000;
        state.history.push({
          _gpsId   : run.id,
          dateRaw  : run.ts,
          dateStr  : _fmtDate(run.ts),
          weight   : state.history.length > 0 ? (state.history[state.history.length - 1].weight || 0) : 0,
          dist     : km,
          duration : run.duration,
          hr       : 0,
          rpe      : 6,
          sleep    : 7,
          diet     : 'perfect',
          cals     : Math.round(km * 62),
          feedback : `🏃 วิ่ง ${km.toFixed(2)} km ผ่าน GPS Tracker`,
          color    : 'var(--sapphire)',
          emoji    : '🏃',
        });
      });

      bikes.forEach(ride => {
        if (existingIds.has(ride.id)) return;
        const km = ride.distance / 1000;
        state.history.push({
          _gpsId   : ride.id,
          dateRaw  : ride.ts,
          dateStr  : _fmtDate(ride.ts),
          weight   : state.history.length > 0 ? (state.history[state.history.length - 1].weight || 0) : 0,
          dist     : km,
          duration : ride.duration,
          hr       : 0,
          rpe      : 5,
          sleep    : 7,
          diet     : 'perfect',
          cals     : Math.round(km * 22),
          feedback : `🚴 ปั่น ${km.toFixed(2)} km ผ่าน GPS Tracker`,
          color    : 'var(--emerald)',
          emoji    : '🚴',
        });
      });

      // Sort history by date
      state.history.sort((a, b) => a.dateRaw - b.dateRaw);
      sv(stateKey, state);
    });
  };

  // ── Helpers ──
  const _fmtDate = ts => {
    const d = new Date(ts);
    const days = ['อา','จ','อ','พ','พฤ','ศ','ส'];
    return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  };

  const getMode  = () => ld(K.mode, null) || localStorage.getItem('selectedMode');
  const setMode  = m  => { sv(K.mode, m); localStorage.setItem('selectedMode', m); };

  // Navigate back to correct RPG page from run.html
  const goBack = () => {
    const m = getMode();
    if (m === 'beastborne') window.location.href = 'beastborne.html';
    else if (m === 'draglak') window.location.href = 'draglak.html';
    else window.location.href = 'index.html';
  };

  return {
    K, ld, sv,
    getRuns, getBikes,
    getTotalRunKm, getTotalBikeKm,
    getRunsInDays, getBikesInDays,
    syncFromActivity,
    getMode, setMode, goBack,
  };
})();

// Auto-sync on every page load that imports this script
document.addEventListener('DOMContentLoaded', () => {
  BbStore.syncFromActivity();
});
