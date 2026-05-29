// ============================================================
// PropFirmEdge — App Logic
// ============================================================

// ============================================================
// ALL TOP-LEVEL STATE (declared first to avoid TDZ errors)
// ============================================================
let currentTheme = localStorage.getItem('pfe-theme') || 'dark';
let chartInstances = {};
let esCharts = {};
let currentDDFilter = 'all';
let currentSizeFilter = '50000';
let currentFirmFilter = 'all';
let currentSort = 'truecost';
let currentSortDir = 'asc';
let currentPage = 1;
const PAGE_SIZE = 8;
let evals = JSON.parse(localStorage.getItem('pfe_evals') || '[]');
let compareFilters = { mkt: 'all', dd: 'all', sort: 'truecost' };
let simPathCount = 250;

// ============================================================
// THEME TOGGLE
// ============================================================
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = '🌙';
  } else {
    html.removeAttribute('data-theme');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = '☀️';
  }
  currentTheme = theme;
  localStorage.setItem('pfe-theme', theme);
  refreshChartColors();
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function getChartGridColor() {
  return currentTheme === 'dark' ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';
}
function getChartLabelColor() {
  return currentTheme === 'dark' ? '#989898' : '#64748b';
}
function getChartRadarLineColor() {
  return currentTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
}

function refreshChartColors() {
  if (typeof Chart === 'undefined') return;
  const gc = getChartGridColor();
  const lc = getChartLabelColor();
  Chart.defaults.color = lc;
  ['chartEquity','chartMC','chartDist','chartHist'].forEach(id => {
    const c = chartInstances[id];
    if (!c) return;
    const scales = c.options.scales;
    if (scales) {
      if (scales.x && scales.x.grid) scales.x.grid.color = gc;
      if (scales.y && scales.y.grid) scales.y.grid.color = gc;
      if (scales.yL && scales.yL.grid) scales.yL.grid.color = gc;
      if (scales.yR && scales.yR.grid) scales.yR.grid.color = gc;
    }
    c.update('none');
  });
  [esCharts.equity, esCharts.mc, esCharts.overlay, esCharts.hist, esCharts.dd].forEach(c => {
    if (!c) return;
    const scales = c.options.scales;
    if (scales) {
      if (scales.x && scales.x.grid) scales.x.grid.color = gc;
      if (scales.y && scales.y.grid) scales.y.grid.color = gc;
      if (scales.yBar && scales.yBar.grid) scales.yBar.grid.color = gc;
    }
    c.update('none');
  });
  if (esCharts.radar) {
    const rl = getChartRadarLineColor();
    esCharts.radar.options.scales.r.angleLines.color = rl;
    esCharts.radar.options.scales.r.grid.color = rl;
    esCharts.radar.options.scales.r.pointLabels.color = lc;
    esCharts.radar.update('none');
  }
}

// Apply theme to <html> immediately (no DOM access needed here)
(function() {
  const saved = localStorage.getItem('pfe-theme') || 'dark';
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

// FIRM DATABASE
const FIRMS = [
  {
    key: 'lucid', name: 'Lucid Trading', cat: 'futures', color: '#4da6ff',
    payout: 90, maxPayout: 90, maxFunded: 750000, scaling: true,
    refund: false, news: true, weekend: false, ea: false,
    feature: 'No funded consistency rule — buy 5 evals at 40% OFF',
    code: 'EDGE', discount: 40,
    plans: [
      { size: 25000, name: 'Flex', type: 'Challenge', fee: 100, target: 1250, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 25000, name: 'Pro', type: 'Challenge', fee: 120, target: 1250, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Flex', type: 'Challenge', fee: 140, target: 3000, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Pro', type: 'Challenge', fee: 160, target: 3000, dd: 2000, ddType: 'EOD', daily: 1200, minDays: 5 },
      { size: 100000, name: 'Flex', type: 'Challenge', fee: 225, target: 6000, dd: 3000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Pro', type: 'Challenge', fee: 275, target: 6000, dd: 3000, ddType: 'EOD', daily: 1800, minDays: 5 },
      { size: 150000, name: 'Flex', type: 'Challenge', fee: 420, target: 9000, dd: 4500, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 150000, name: 'Pro', type: 'Challenge', fee: 370, target: 9000, dd: 4500, ddType: 'EOD', daily: 2700, minDays: 5 },
    ]
  },
  {
    key: 'tradeify', name: 'Tradeify', cat: 'futures', color: '#f04b6a',
    payout: 90, maxPayout: 90, maxFunded: 750000, scaling: false,
    refund: false, news: true, weekend: false, ea: false,
    feature: '40% OFF + No Activation Fee on all evals',
    code: 'EDGE', discount: 40,
    plans: [
      { size: 25000, name: 'Select', type: 'Challenge', fee: 109, target: 1500, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 25000, name: 'Growth', type: 'Challenge', fee: 99, target: 1500, dd: 1000, ddType: 'EOD', daily: 600, minDays: 5 },
      { size: 50000, name: 'Growth', type: 'Challenge', fee: 145, target: 3000, dd: 2000, ddType: 'EOD', daily: 1250, minDays: 5 },
      { size: 50000, name: 'Select', type: 'Challenge', fee: 165, target: 2500, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Growth', type: 'Challenge', fee: 255, target: 6000, dd: 3500, ddType: 'EOD', daily: 2500, minDays: 5 },
      { size: 100000, name: 'Select', type: 'Challenge', fee: 265, target: 6000, dd: 3000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 150000, name: 'Growth', type: 'Challenge', fee: 369, target: 9000, dd: 5000, ddType: 'EOD', daily: 3750, minDays: 5 },
    ]
  },
  {
    key: 'mff', name: 'MyFundedFutures', cat: 'futures', color: '#22d06c',
    payout: 80, maxPayout: 90, maxFunded: 750000, scaling: false,
    refund: true, news: true, weekend: false, ea: true,
    feature: 'Rapid Plans — take payout up to 100K',
    code: 'EDGE', discount: 12,
    plans: [
      { size: 50000, name: 'Flex Plan', type: 'Challenge', fee: 107, target: 3000, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Rapid Plan', type: 'Challenge', fee: 157, target: 3000, dd: 2000, ddType: 'Intraday Trail', daily: null, minDays: 5 },
      { size: 100000, name: 'Flex Plan', type: 'Challenge', fee: 207, target: 6000, dd: 3000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Rapid Plan', type: 'Challenge', fee: 267, target: 6000, dd: 3000, ddType: 'Intraday Trail', daily: null, minDays: 5 },
      { size: 150000, name: 'Flex Plan', type: 'Challenge', fee: 347, target: 9000, dd: 4500, ddType: 'EOD', daily: null, minDays: 5 },
    ]
  },
  {
    key: 'alphaFutures', name: 'Alpha Futures', cat: 'futures', color: '#fb923c',
    payout: 90, maxPayout: 90, maxFunded: 450000, scaling: true,
    refund: false, news: false, weekend: false, ea: false,
    feature: 'Low-cost evals with EOD trailing and quick payouts',
    code: 'EDGE', discount: 15,
    plans: [
      { size: 25000, name: 'Zero', type: 'Challenge', fee: 79, target: 1500, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Zero', type: 'Challenge', fee: 119, target: 3000, dd: 2000, ddType: 'EOD', daily: 1000, minDays: 5 },
      { size: 50000, name: 'Standard', type: 'Challenge', fee: 79, target: 3000, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Zero', type: 'Challenge', fee: 239, target: 6000, dd: 4000, ddType: 'EOD', daily: 2000, minDays: 5 },
      { size: 150000, name: 'Standard', type: 'Challenge', fee: 239, target: 9000, dd: 6000, ddType: 'EOD', daily: 3000, minDays: 5 },
    ]
  },
  {
    key: 'e8markets', name: 'E8 Markets', cat: 'futures', color: '#a855f7',
    payout: 80, maxPayout: 85, maxFunded: 750000, scaling: true,
    refund: false, news: true, weekend: false, ea: true,
    feature: 'Low fees, no daily loss on Signature plan',
    code: 'EDGE', discount: 40,
    plans: [
      { size: 25000, name: 'Signature', type: 'Challenge', fee: 110, target: 1500, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Signature', type: 'Challenge', fee: 150, target: 3000, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Signature', type: 'Challenge', fee: 260, target: 6000, dd: 3000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 150000, name: 'Signature', type: 'Challenge', fee: 390, target: 9000, dd: 4500, ddType: 'EOD', daily: null, minDays: 5 },
    ]
  },
  {
    key: 'fundedNext', name: 'FundedNext Futures', cat: 'futures', color: '#38bdf8',
    payout: 80, maxPayout: 90, maxFunded: 500000, scaling: true,
    refund: false, news: false, weekend: true, ea: true,
    feature: 'Multiple account types — Bolt, Legacy, Rapid plans',
    code: 'EDGE', discount: 5,
    plans: [
      { size: 25000, name: 'Bolt', type: 'Challenge', fee: 79.99, target: 1500, dd: 1000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Bolt', type: 'Challenge', fee: 99.99, target: 3000, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 50000, name: 'Legacy', type: 'Challenge', fee: 149.99, target: 2500, dd: 2000, ddType: 'EOD', daily: null, minDays: 5 },
      { size: 100000, name: 'Legacy', type: 'Challenge', fee: 249.99, target: 6000, dd: 3000, ddType: 'EOD', daily: null, minDays: 5 },
    ]
  },
  {
    key: 'ftmo', name: 'FTMO', cat: 'forex', color: '#4da6ff',
    payout: 80, maxPayout: 90, maxFunded: 400000, scaling: true,
    refund: true, news: false, weekend: true, ea: true,
    feature: 'Industry standard — fee refund on first withdrawal',
    code: 'EDGE', discount: 10,
    plans: [
      { size: 10000, name: 'FTMO Challenge', type: 'Challenge', fee: 155, target: 1000, dd: 1000, ddType: 'Static', daily: 500, minDays: 4 },
      { size: 25000, name: 'FTMO Challenge', type: 'Challenge', fee: 250, target: 2500, dd: 2500, ddType: 'Static', daily: 1250, minDays: 4 },
      { size: 50000, name: 'FTMO Challenge', type: 'Challenge', fee: 345, target: 5000, dd: 5000, ddType: 'Static', daily: 2500, minDays: 4 },
      { size: 100000, name: 'FTMO Challenge', type: 'Challenge', fee: 540, target: 10000, dd: 10000, ddType: 'Static', daily: 5000, minDays: 4 },
      { size: 200000, name: 'FTMO Challenge', type: 'Challenge', fee: 1080, target: 20000, dd: 20000, ddType: 'Static', daily: 10000, minDays: 4 },
    ]
  },
  {
    key: 'fundedtrader', name: 'The Funded Trader', cat: 'forex', color: '#22d06c',
    payout: 80, maxPayout: 90, maxFunded: 600000, scaling: true,
    refund: false, news: false, weekend: true, ea: true,
    feature: 'Up to $600K funded, aggressive scaling plan',
    code: 'EDGE', discount: 15,
    plans: [
      { size: 25000, name: 'Standard', type: 'Challenge', fee: 119, target: 2500, dd: 1500, ddType: 'Static', daily: 750, minDays: 5 },
      { size: 50000, name: 'Standard', type: 'Challenge', fee: 189, target: 5000, dd: 3000, ddType: 'Static', daily: 1500, minDays: 5 },
      { size: 100000, name: 'Standard', type: 'Challenge', fee: 315, target: 10000, dd: 6000, ddType: 'Static', daily: 3000, minDays: 5 },
      { size: 200000, name: 'Standard', type: 'Challenge', fee: 530, target: 20000, dd: 12000, ddType: 'Static', daily: 6000, minDays: 5 },
    ]
  },
  {
    key: 'fundedpips', name: 'Funding Pips', cat: 'forex', color: '#06b6d4',
    payout: 80, maxPayout: 80, maxFunded: 200000, scaling: false,
    refund: false, news: false, weekend: false, ea: false,
    feature: 'No minimum trading days — fastest possible pass',
    code: 'EDGE', discount: 10,
    plans: [
      { size: 25000, name: 'Standard', type: 'Challenge', fee: 99, target: 2000, dd: 1500, ddType: 'Static', daily: 750, minDays: 0 },
      { size: 50000, name: 'Standard', type: 'Challenge', fee: 165, target: 4000, dd: 3000, ddType: 'Static', daily: 1500, minDays: 0 },
      { size: 100000, name: 'Standard', type: 'Challenge', fee: 279, target: 8000, dd: 6000, ddType: 'Static', daily: 3000, minDays: 0 },
    ]
  },
];


// STATE is declared at the top of the file

// SIMULATION PATHS
function setSimPaths(val, btn) {
  simPathCount = val;
  document.querySelectorAll('.sim-path-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const customIn = document.getElementById('s-paths-custom');
  if (customIn) customIn.value = '';
  updateSimPathUI();
}

function setSimPathsCustom(val) {
  const n = parseInt(val);
  if (!n || n < 10) return;
  simPathCount = Math.min(n, 5000);
  document.querySelectorAll('.sim-path-btn').forEach(b => b.classList.remove('active'));
  updateSimPathUI();
}

function updateSimPathUI() {
  const lbl = document.getElementById('simPathLabel');
  const hint = document.getElementById('simPathsHint');
  const display = document.getElementById('simPathsDisplay');
  const n = simPathCount;
  if (lbl) lbl.textContent = n;
  if (display) display.textContent = n;
  const speed = n <= 100 ? 'Very fast, low accuracy' : n <= 250 ? 'Fast, good accuracy' : n <= 500 ? 'Moderate speed, high accuracy' : 'Slow, very high accuracy';
  if (hint) hint.textContent = `${n} paths selected — ${speed}.`;
}
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('page-' + name);
  if (el) el.classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'compare') renderCompare();
  if (name === 'simulator') initSimFirmDropdown();
  if (name === 'edgesim' && !esCharts.pie) initEdgeSimCharts();
  if (name === 'tracker') renderTracker();
  window.scrollTo(0, 0);
  return false;
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function copyCode() {
  navigator.clipboard.writeText('EDGE').then(() => showToast());
}

function showToast() {
  const t = document.getElementById('toastMsg');
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2500);
}

// ============================================================
// TABLE INIT
// ============================================================
function getFilteredPlans() {
  let plans = [];
  FIRMS.forEach(f => {
    f.plans.forEach(p => {
      plans.push({ ...p, firmKey: f.key, firmName: f.name, firmColor: f.color, payout: f.payout, code: f.code, discount: f.discount });
    });
  });
  if (currentFirmFilter !== 'all') plans = plans.filter(p => p.firmKey === currentFirmFilter);
  if (currentDDFilter !== 'all') {
    if (currentDDFilter === 'funded') plans = plans.filter(p => p.type === 'Funded');
    else plans = plans.filter(p => p.ddType === currentDDFilter);
  }
  if (currentSizeFilter !== 'all') plans = plans.filter(p => p.size === parseInt(currentSizeFilter));
  // sort
  plans.sort((a, b) => {
    const aTc = a.fee * (1 - a.discount / 100);
    const bTc = b.fee * (1 - b.discount / 100);
    if (currentSort === 'truecost') return currentSortDir === 'asc' ? aTc - bTc : bTc - aTc;
    if (currentSort === 'fee') return currentSortDir === 'asc' ? a.fee - b.fee : b.fee - a.fee;
    return 0;
  });
  return plans;
}

function sortTable(col) {
  if (currentSort === col) currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
  else { currentSort = col; currentSortDir = 'asc'; }
  const icon = document.getElementById('sortIcon');
  if (icon) icon.textContent = currentSortDir === 'asc' ? '↑' : '↓';
  renderTable();
}

function filterByDD(type, btn) {
  currentDDFilter = type;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPage = 1;
  renderTable();
}

function filterBySize(size, btn) {
  currentSizeFilter = size;
  document.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPage = 1;
  renderTable();
}

function filterTable() {
  currentFirmFilter = document.getElementById('firmFilter').value;
  currentPage = 1;
  renderTable();
}

function resetFilters() {
  currentFirmFilter = 'all';
  currentDDFilter = 'all';
  currentSizeFilter = '50000';
  currentPage = 1;
  document.getElementById('firmFilter').value = 'all';
  document.querySelectorAll('.filter-pill').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.size-pill').forEach(b => b.classList.toggle('active', b.getAttribute('data-size') === '50000'));
  renderTable();
}

function liveSearch(val) {
  if (!val.trim()) { renderTable(); return; }
  const q = val.toLowerCase();
  const plans = getFilteredPlans().filter(p =>
    p.firmName.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.ddType.toLowerCase().includes(q) ||
    String(p.size).includes(q)
  );
  renderTableRows(plans);
}

function runSearch() {
  liveSearch(document.getElementById('heroSearch').value);
  document.getElementById('firms').scrollIntoView({ behavior: 'smooth' });
}

function renderTable() {
  const plans = getFilteredPlans();
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = plans.slice(start, start + PAGE_SIZE);
  renderTableRows(page);
  renderPagination(plans.length);
}

function renderTableRows(plans) {
  // Desktop table
  const tbody = document.getElementById('challengeTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  plans.forEach(p => {
    const trueCost = (p.fee * (1 - p.discount / 100)).toFixed(2);
    const ddBadgeClass = p.ddType === 'EOD' ? 'dd-eod' : p.ddType === 'Intraday Trail' ? 'dd-trail' : 'dd-static';
    const pts = Math.round(p.fee * (1 - p.discount / 100) * 2.5) + '+ pts';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-firm">
        <div class="firm-cell">
          <div class="firm-logo" style="--fc:${p.firmColor};">${p.firmName.charAt(0)}</div>
          <div>
            <div class="firm-name-link">${p.firmName}</div>
            <div><span class="plan-badge">${p.name}</span></div>
          </div>
        </div>
      </td>
      <td>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <span style="font-size:15px;font-weight:600;font-family:'JetBrains Mono',monospace;">$${p.size.toLocaleString()}</span>
          <span class="acct-badge">${p.type}</span>
        </div>
      </td>
      <td>$${p.target.toLocaleString()}</td>
      <td>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <span style="color:#989898;">${p.dd ? '$' + p.dd.toLocaleString() : '—'}</span>
          <span class="dd-badge ${ddBadgeClass}">${p.ddType}</span>
        </div>
      </td>
      <td style="color:#989898;">${p.daily ? '$' + p.daily.toLocaleString() : 'None'}</td>
      <td style="font-weight:600;">$${p.fee}</td>
      <td>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <span class="true-cost-val">$${trueCost}</span>
          ${parseFloat(trueCost) === Math.min(...getFilteredPlans().map(x => x.fee*(1-x.discount/100))) ? '<span class="cheapest-badge">Cheapest</span>' : ''}
        </div>
      </td>
      <td><span class="pts-val">${pts}</span></td>
      <td>
        <button class="buy-btn" onclick="handleBuy('${p.firmKey}')">
          <span class="buy-info">
            <span class="buy-discount">${p.discount}% OFF</span>
            <span class="buy-label">Buy Now</span>
          </span>
          <span class="buy-cost-wrap">
            <span class="buy-cost-label">True Cost</span>
            <span class="buy-prices">
              <span class="buy-orig">$${p.fee}</span>
              <span class="buy-final">$${trueCost}</span>
            </span>
          </span>
          <span class="buy-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Mobile cards
  const mobileContainer = document.getElementById('mobileFirmCards');
  if (!mobileContainer) return;
  mobileContainer.innerHTML = '';
  plans.forEach(p => {
    const trueCost = (p.fee * (1 - p.discount / 100)).toFixed(2);
    const ddBadgeClass = p.ddType === 'EOD' ? 'dd-eod' : p.ddType === 'Intraday Trail' ? 'dd-trail' : 'dd-static';
    const card = document.createElement('div');
    card.className = 'mobile-firm-card';
    card.innerHTML = `
      <div class="mfc-header">
        <div class="mfc-logo" style="color:${p.firmColor};">${p.firmName.charAt(0)}</div>
        <div class="mfc-info">
          <div class="mfc-name">${p.firmName}</div>
          <div style="margin-top:6px;"><span class="plan-badge">${p.name}</span></div>
        </div>
        <div class="mfc-right">
          <p class="mfc-size-label">Account</p>
          <p class="mfc-size mono">$${p.size.toLocaleString()}</p>
          <span class="acct-badge" style="margin-top:6px;">${p.type}</span>
        </div>
      </div>
      <div class="mfc-stats">
        <div class="mfc-stat"><p class="mfc-stat-label">Profit Target</p><p class="mfc-stat-val">$${p.target.toLocaleString()}</p></div>
        <div class="mfc-stat"><p class="mfc-stat-label">Drawdown</p><div style="margin-top:3px;"><span style="color:#989898;">${p.dd ? '$'+p.dd.toLocaleString() : '—'}</span><br><span class="dd-badge ${ddBadgeClass}" style="margin-top:4px;">${p.ddType}</span></div></div>
        <div class="mfc-stat"><p class="mfc-stat-label">Daily Loss</p><p class="mfc-stat-val" style="color:#989898;">${p.daily ? '$'+p.daily.toLocaleString() : 'None'}</p></div>
        <div class="mfc-stat"><p class="mfc-stat-label">Challenge Fee</p><p class="mfc-stat-val" style="font-weight:600;">$${p.fee}</p></div>
      </div>
      <div class="mfc-buy">
        <button class="buy-btn" style="width:100%;" onclick="handleBuy('${p.firmKey}')">
          <span class="buy-info"><span class="buy-discount">${p.discount}% OFF</span><span class="buy-label">Buy Now</span></span>
          <span class="buy-cost-wrap"><span class="buy-cost-label">True Cost</span><span class="buy-prices"><span class="buy-orig">$${p.fee}</span><span class="buy-final">$${trueCost}</span></span></span>
          <span class="buy-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </button>
      </div>
    `;
    mobileContainer.appendChild(card);
  });
}

function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const pg = document.getElementById('pagination');
  const info = document.getElementById('paginationInfo');
  if (!pg) return;
  pg.innerHTML = '';
  const prev = document.createElement('button');
  prev.className = 'page-btn'; prev.textContent = 'Previous'; prev.disabled = currentPage === 1;
  prev.onclick = () => { currentPage--; renderTable(); };
  pg.appendChild(prev);
  const nums = document.createElement('div');
  nums.style.cssText = 'display:flex;align-items:center;gap:6px;background:#141414;border-radius:7px;padding:4px 8px;';
  for (let i = 1; i <= Math.min(pages, 5); i++) {
    const b = document.createElement('button');
    b.className = 'page-num' + (i === currentPage ? ' active' : '');
    b.textContent = i; b.onclick = () => { currentPage = i; renderTable(); };
    nums.appendChild(b);
  }
  pg.appendChild(nums);
  const next = document.createElement('button');
  next.className = 'page-btn'; next.textContent = 'Next'; next.disabled = currentPage >= pages;
  next.onclick = () => { currentPage++; renderTable(); };
  pg.appendChild(next);
  if (info) info.textContent = `Showing ${(currentPage-1)*PAGE_SIZE+1}–${Math.min(currentPage*PAGE_SIZE, total)} of ${total} options`;
}

function handleBuy(firmKey) {
  showToast();
}

function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'allfirms') renderAllFirms();
}


// ============================================================
// ALL FIRMS GRID
// ============================================================
function renderAllFirms(filterMkt, filterDD) {
  const grid = document.getElementById('allFirmsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let firms = FIRMS;
  if (filterMkt && filterMkt !== 'all') firms = firms.filter(f => f.cat === filterMkt);
  if (filterDD && filterDD !== 'all') firms = firms.filter(f => f.plans.some(p => p.ddType === filterDD));

  firms.forEach(f => {
    const card = document.createElement('div');
    card.className = 'firm-overview-card';
    card.innerHTML = `
      <div class="foc-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="firm-logo" style="--fc:${f.color};">${f.name.charAt(0)}</div>
          <div>
            <div class="foc-name">${f.name}</div>
            <span class="acct-badge" style="margin-top:5px;">${f.cat.toUpperCase()}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="foc-payout" style="color:${f.color};">${f.payout}%</div>
          <div style="font-size:11px;color:#989898;">payout</div>
        </div>
      </div>
      <div class="foc-feature">⭐ ${f.feature}</div>
      <div class="foc-badges">
        <span class="foc-badge ${f.scaling?'yes':'no'}">${f.scaling?'✓ Scaling':'✗ No Scaling'}</span>
        <span class="foc-badge ${f.refund?'yes':'no'}">${f.refund?'✓ Refund':'✗ No Refund'}</span>
        <span class="foc-badge ${f.news?'yes':'no'}">${f.news?'✓ News OK':'✗ No News'}</span>
        <span class="foc-badge ${f.weekend?'yes':'no'}">${f.weekend?'✓ Weekend':'✗ No Weekend'}</span>
        <span class="foc-badge ${f.ea?'yes':'no'}">${f.ea?'✓ EA/Bots':'✗ No EA'}</span>
      </div>
      <div class="foc-code">
        <div>
          <div style="font-size:11px;color:#989898;margin-bottom:2px;">Discount Code</div>
          <span class="foc-code-val">${f.code}</span>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#989898;margin-bottom:2px;">Discount</div>
          <span class="foc-code-disc">${f.discount}% OFF</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================
// COMPARE PAGE
// ============================================================

function filterCompare(type, val, btn) {
  compareFilters[type] = val;
  const attr = type === 'mkt' ? 'data-mkt' : 'data-cdd';
  document.querySelectorAll(`[${attr}]`).forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCompare();
}

function sortCompare(val) { compareFilters.sort = val; renderCompare(); }

function renderCompare() {
  const grid = document.getElementById('compareGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let firms = FIRMS;
  if (compareFilters.mkt !== 'all') firms = firms.filter(f => f.cat === compareFilters.mkt);

  firms.forEach(f => {
    let plans = f.plans;
    if (compareFilters.dd !== 'all') plans = plans.filter(p => p.ddType === compareFilters.dd);
    if (!plans.length) return;

    if (compareFilters.sort === 'truecost') plans.sort((a,b) => (a.fee*(1-a.discount/100)) - (b.fee*(1-b.discount/100)));
    else if (compareFilters.sort === 'payout') plans = plans; // firm level
    else if (compareFilters.sort === 'discount') plans.sort((a,b) => b.discount - a.discount);

    const bestPlan = plans[0];
    const trueCost = (bestPlan.fee * (1 - bestPlan.discount/100)).toFixed(2);
    const ddClass = bestPlan.ddType === 'EOD' ? 'dd-eod' : bestPlan.ddType === 'Intraday Trail' ? 'dd-trail' : 'dd-static';

    const card = document.createElement('div');
    card.className = 'compare-card';
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="firm-logo" style="--fc:${f.color};">${f.name.charAt(0)}</div>
          <div>
            <div style="font-size:15px;font-weight:700;">${f.name}</div>
            <span class="acct-badge" style="margin-top:4px;">${f.cat.toUpperCase()}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:800;color:${f.color};">${f.payout}%</div>
          <div style="font-size:10px;color:#989898;">payout</div>
        </div>
      </div>
      <div style="background:#1b1b1b;border-radius:10px;padding:14px;margin-bottom:14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;">
          <div><span style="color:#989898;display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px;">Best Plan</span>${bestPlan.name} · $${bestPlan.size.toLocaleString()}</div>
          <div><span style="color:#989898;display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px;">Target</span>$${bestPlan.target.toLocaleString()}</div>
          <div><span style="color:#989898;display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px;">Max DD</span><span style="color:#989898;">$${bestPlan.dd ? bestPlan.dd.toLocaleString() : '—'}</span> <span class="dd-badge ${ddClass}" style="margin-left:4px;">${bestPlan.ddType}</span></div>
          <div><span style="color:#989898;display:block;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:3px;">Daily Loss</span><span style="color:#989898;">${bestPlan.daily ? '$'+bestPlan.daily.toLocaleString() : 'None'}</span></div>
        </div>
      </div>
      <button class="buy-btn" style="width:100%;" onclick="handleBuy('${f.key}')">
        <span class="buy-info"><span class="buy-discount">${bestPlan.discount}% OFF</span><span class="buy-label">Buy Now</span></span>
        <span class="buy-cost-wrap">
          <span class="buy-cost-label">True Cost</span>
          <span class="buy-prices"><span class="buy-orig">$${bestPlan.fee}</span><span class="buy-final">$${trueCost}</span></span>
        </span>
        <span class="buy-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </button>
      <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:12px;color:#989898;">
        <span>${plans.length} plan${plans.length > 1 ? 's' : ''} available</span>
        <span>Code: <b style="color:#a78bfa;">${f.code}</b></span>
      </div>
    `;
    grid.appendChild(card);
  });
}


// ============================================================
// FAQ
// ============================================================
const FAQS = [
  { q: 'What is a Proprietary Trading Firm?', a: 'A prop firm provides traders with capital to trade financial markets. In return, traders share a percentage of their profits. Most firms require passing an evaluation challenge first.' },
  { q: 'How does the evaluation process work?', a: 'You pay a fee to take a challenge. You must hit a profit target while staying within drawdown limits. Once passed, you receive a funded account and keep a share of profits — typically 80–90%.' },
  { q: 'What does the discount code EDGE do?', a: 'Using code EDGE at checkout on supported firms gives you a verified percentage discount on the challenge fee — reducing your true cost and improving your ROI on a funded account.' },
  { q: 'What is EOD vs Intraday Trailing drawdown?', a: 'EOD (End-of-Day) trailing only locks in your high-water mark at the end of each day. Intraday trailing moves in real time as your balance grows during the session — making it harder to manage.' },
  { q: 'Which prop firm is the cheapest for a $50K account?', a: 'After applying discount codes, firms like Lucid Trading and Tradeify frequently offer the lowest true cost for a $50K eval. Use the comparison table sorted by True Cost to find the current cheapest option.' },
  { q: 'What is the Eval Pass Simulator?', a: 'The Simulator runs 500 Monte Carlo simulations against real firm rules using your strategy parameters (win rate, risk/reward, risk per trade). It calculates your statistical pass probability before you spend any money.' },
];

function renderFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = '';
  FAQS.forEach(f => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">
        <span>${f.q}</span>
        <svg class="faq-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="faq-a">${f.a}</div>
    `;
    list.appendChild(item);
  });
}

// ============================================================
// SIMULATOR ENGINE
// ============================================================
function simulate(capital, wr, rr, riskPct, numTrades, dailyLoss, maxDD, ddType) {
  let bal = capital, curve = [bal], pnlHist = [], ddFloor = [capital - maxDD];
  let peak = capital, dayStart = capital, dayPnl = 0;
  let worstDD = 0, peakDDpct = 0, gp = 0, gl = 0, wins = 0, losses = 0, seq = [];
  let sumW = 0, sumL = 0, hiWin = 0, winDays = 0, lossDays = 0, days = 0;
  let failReason = null, totalExec = 0;
  const baseRisk = capital * riskPct;
  for (let i = 0; i < numTrades; i++) {
    if (failReason) break;
    totalExec++;
    let pnl = Math.random() <= wr
      ? baseRisk * rr * (0.94 + Math.random() * 0.12)
      : -(baseRisk * (0.98 + Math.random() * 0.04));
    if (pnl > 0) { gp += pnl; sumW += pnl; wins++; seq.push('W'); if (pnl > hiWin) hiWin = pnl; }
    else { gl += Math.abs(pnl); sumL += Math.abs(pnl); losses++; seq.push('L'); }
    pnlHist.push(pnl); bal += pnl; curve.push(bal); dayPnl += pnl;
    if (dayPnl < 0 && Math.abs(dayPnl) >= dailyLoss) failReason = 'DAILY_LOSS';
    if ((i + 1) % 3 === 0 || i === numTrades - 1) {
      days++;
      if (dayPnl > 0) winDays++; else if (dayPnl < 0) lossDays++;
      if (ddType === 'eod' && bal > dayStart) dayStart = bal;
      dayPnl = 0;
    }
    if (bal > peak) peak = bal;
    const dd = ddType === 'trailing' ? peak - bal : ddType === 'eod' ? dayStart - bal : capital - bal;
    ddFloor.push(ddType === 'trailing' ? peak - maxDD : ddType === 'eod' ? dayStart - maxDD : capital - maxDD);
    if (dd > worstDD) worstDD = dd;
    if ((peak - bal) / peak > peakDDpct) peakDDpct = (peak - bal) / peak;
    if (dd >= maxDD) failReason = 'MAX_DD';
  }
  return { curve, pnlHist, ddFloor, peakDDpct, worstDD, gp, gl, seq, wins, losses, winDays, lossDays, days, totalExec,
    avgW: wins === 0 ? 0 : sumW / wins, avgL: losses === 0 ? 0 : sumL / losses, hiWin, failReason };
}

function destroyChart(id) { if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; } }

function initSimFirmDropdown() {
  const sel = document.getElementById('s-firm');
  if (!sel || sel.options.length > 1) return;
  sel.innerHTML = '<option value="custom">── Custom / Manual ──</option>';
  const fg = document.createElement('optgroup'); fg.label = 'FUTURES';
  const xg = document.createElement('optgroup'); xg.label = 'FOREX / CFD';
  FIRMS.forEach(f => {
    const o = document.createElement('option'); o.value = f.key; o.textContent = f.name;
    f.cat === 'futures' ? fg.appendChild(o) : xg.appendChild(o);
  });
  sel.appendChild(fg); sel.appendChild(xg);
  const tf = document.getElementById('t-firm');
  if (tf && !tf.options.length) {
    FIRMS.forEach(f => { const o = document.createElement('option'); o.value = f.key; o.textContent = f.name; tf.appendChild(o); });
  }
}

function simUpdateSizes() {
  const k = document.getElementById('s-firm').value;
  const sel = document.getElementById('s-size');
  sel.innerHTML = '';
  const firm = FIRMS.find(f => f.key === k);
  if (!firm) { sel.innerHTML = '<option value="custom">Manual</option>'; simUpdateTypes(); return; }
  const sizes = [...new Set(firm.plans.map(p => p.size))];
  sizes.forEach(sz => { const o = document.createElement('option'); o.value = sz; o.textContent = '$' + sz.toLocaleString(); sel.appendChild(o); });
  simUpdateTypes();
}

function simUpdateTypes() {
  const k = document.getElementById('s-firm').value;
  const sz = parseInt(document.getElementById('s-size').value);
  const sel = document.getElementById('s-type');
  sel.innerHTML = '';
  const firm = FIRMS.find(f => f.key === k);
  if (!firm) { sel.innerHTML = '<option value="custom">Manual</option>'; return; }
  const plans = firm.plans.filter(p => p.size === sz);
  plans.forEach(p => { const o = document.createElement('option'); o.value = p.name; o.textContent = p.name; sel.appendChild(o); });
  simApplyPreset();
}

function simApplyPreset() {
  const k = document.getElementById('s-firm').value;
  const sz = parseInt(document.getElementById('s-size').value);
  const t = document.getElementById('s-type').value;
  const firm = FIRMS.find(f => f.key === k);
  if (!firm) return;
  const plan = firm.plans.find(p => p.size === sz && p.name === t);
  if (!plan) return;
  document.getElementById('s-capital').value = sz;
  document.getElementById('s-target').value = plan.target;
  document.getElementById('s-maxdd').value = plan.dd || Math.round(sz * 0.04);
  document.getElementById('s-daily').value = plan.daily || 99999;
  document.getElementById('s-ddtype').value = plan.ddType === 'EOD' ? 'eod' : plan.ddType === 'Intraday Trail' ? 'trailing' : 'static';
  document.getElementById('s-mindays').value = plan.minDays;
  runSim();
}

function simBreak() {
  document.getElementById('s-firm').value = 'custom';
}

function runSim() {
  const capital = parseFloat(document.getElementById('s-capital').value) || 50000;
  const wr = parseFloat(document.getElementById('s-wr').value) / 100;
  const rr = parseFloat(document.getElementById('s-rr').value);
  const riskPct = parseFloat(document.getElementById('s-risk').value) / 100;
  const numTrades = parseInt(document.getElementById('s-trades').value);
  const target = parseFloat(document.getElementById('s-target').value) || 0;
  const maxDD = parseFloat(document.getElementById('s-maxdd').value) || 1;
  const daily = parseFloat(document.getElementById('s-daily').value) || 99999;
  const ddType = document.getElementById('s-ddtype').value;
  const consPct = parseFloat(document.getElementById('s-cons').value);
  const minDays = parseInt(document.getElementById('s-mindays').value) || 0;

  const path = simulate(capital, wr, rr, riskPct, numTrades, daily, maxDD, ddType);
  const netPnL = path.curve[path.curve.length - 1] - capital;
  const pf = path.gl === 0 ? '∞' : (path.gp / path.gl).toFixed(2);
  const expectancy = (wr * (capital * riskPct * rr)) - ((1 - wr) * (capital * riskPct));

  const g = (id, val, color) => { const el = document.getElementById(id); if (el) { el.textContent = val; if (color) el.style.color = color; } };
  g('sm-equity', (netPnL >= 0 ? '+$' : '-$') + Math.abs(netPnL).toLocaleString(undefined, {maximumFractionDigits:0}), netPnL >= 0 ? '#24bb78' : '#ef4444');
  g('sm-expect', '$' + expectancy.toLocaleString(undefined, {maximumFractionDigits:0}));
  g('sm-dd', (path.peakDDpct * 100).toFixed(2) + '%');
  g('sm-pf', pf, parseFloat(pf) > 1 ? '#24bb78' : '#ef4444');
  g('sm-wr', ((path.wins / path.totalExec) * 100).toFixed(1) + '%');
  g('sm-avgwl', '$' + Math.round(path.avgW) + ' / $' + Math.round(path.avgL));
  g('sm-wdays', path.winDays + ' / ' + path.days);
  g('sm-hiwin', '$' + Math.round(path.hiWin).toLocaleString());
  g('sm-wins', path.wins); g('sm-losses', path.losses);

  const seq = document.getElementById('simSeqRow');
  if (seq) { seq.innerHTML = ''; path.seq.forEach(s => { const b = document.createElement('div'); b.className = 'seq-block'; b.style.background = s === 'W' ? '#24bb78' : '#ef4444'; b.textContent = s; seq.appendChild(b); }); }

  const consPassed = consPct <= 0 || netPnL <= 0 || (path.hiWin / netPnL * 100) <= consPct;
  const daysPassed = path.days >= minDays;
  const targetMet = netPnL >= target;

  // ── Determine result state ─────────────────────────────────
  let resultState, resultTitle, resultSub, resultIcon;
  if (path.failReason === 'MAX_DD') {
    resultState = 'breach';
    resultTitle = '✕ BREACHED — Max Drawdown';
    resultSub   = 'Account exceeded the maximum drawdown limit. The evaluation is invalidated.';
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`;
  } else if (path.failReason === 'DAILY_LOSS') {
    resultState = 'breach';
    resultTitle = '✕ BREACHED — Daily Loss Limit';
    resultSub   = 'Intraday loss exceeded the daily cap. Evaluation stops here.';
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`;
  } else if (!targetMet) {
    resultState = 'warn';
    resultTitle = '⚠ Target Not Reached';
    resultSub   = `Net PnL $${Math.round(netPnL).toLocaleString()} fell short of the $${target.toLocaleString()} profit target. Rules intact but eval incomplete.`;
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (!consPassed) {
    resultState = 'warn';
    resultTitle = '⚠ Consistency Rule Violated';
    resultSub   = `A single day's profit exceeded the ${consPct}% concentration cap. Target hit but consistency rule failed.`;
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (!daysPassed) {
    resultState = 'warn';
    resultTitle = '⚠ Minimum Trading Days Not Met';
    resultSub   = `Target hit in only ${path.days} days but ${minDays} minimum trading days are required.`;
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    resultState = 'pass';
    resultTitle = '✓ EVALUATION PASSED';
    resultSub   = `Profit target hit, all drawdown rules clean, ${path.days} trading days recorded. Ready for funded account.`;
    resultIcon  = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>`;
  }

  // ── Run Monte Carlo pass probability ──────────────────────
  let passCount = 0;
  for (let i = 0; i < simPathCount; i++) {
    const p2 = simulate(capital, wr, rr, riskPct, numTrades, daily, maxDD, ddType);
    const n2 = p2.curve[p2.curve.length - 1] - capital;
    const c2 = consPct <= 0 || n2 <= 0 || (p2.hiWin / n2 * 100) <= consPct;
    if (!p2.failReason && n2 >= target && c2 && p2.days >= minDays) passCount++;
  }
  const pct = (passCount / simPathCount * 100).toFixed(1);
  const pctColor = pct >= 60 ? '#24bb78' : pct >= 35 ? '#f59e0b' : '#ef4444';

  // ── Update BIG result banner (top of right panel) ─────────
  const banner = document.getElementById('simResultBanner');
  if (banner) {
    banner.className = `sim-result-banner sim-result-${resultState === 'breach' ? 'breach' : resultState === 'warn' ? 'warn' : 'pass'}`;
    const iconEl = document.getElementById('simResultIcon'); if (iconEl) iconEl.innerHTML = resultIcon;
    const titleEl = document.getElementById('simResultTitle'); if (titleEl) titleEl.textContent = resultTitle;
    const subEl = document.getElementById('simResultSub'); if (subEl) subEl.textContent = resultSub;
    const probBig = document.getElementById('simPassProbBig'); if (probBig) { probBig.textContent = pct + '%'; }
    const barBig = document.getElementById('simProbBarBig'); if (barBig) barBig.style.width = pct + '%';
  }

  // ── Update small audit panel (left sidebar) ───────────────
  const auditBox = document.getElementById('simAuditBox');
  if (auditBox) {
    const colors = { breach: '#ef4444', warn: '#f59e0b', pass: '#24bb78' };
    const bgs    = { breach: 'rgba(239,68,68,0.12)', warn: 'rgba(245,158,11,0.12)', pass: 'rgba(36,187,120,0.12)' };
    const marks  = { breach: '✕', warn: '!', pass: '✓' };
    const col = colors[resultState]; const bg = bgs[resultState]; const mark = marks[resultState];
    auditBox.innerHTML = `<div><span style="font-size:12px;font-weight:700;color:${col};">${resultTitle}</span><p style="font-size:11px;color:var(--c-text3);margin-top:2px;">${resultSub}</p></div><div style="width:28px;height:28px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;color:${col};font-weight:800;flex-shrink:0;">${mark}</div>`;
  }

  g('sa-target', `$${Math.round(netPnL).toLocaleString()} / $${target.toLocaleString()}`, targetMet ? '#24bb78' : '#ef4444');
  g('sa-dd', `$${Math.round(path.worstDD).toLocaleString()} / $${maxDD.toLocaleString()}`, !path.failReason ? '#24bb78' : '#ef4444');
  g('sa-cons', netPnL > 0 && consPct > 0 ? (path.hiWin / netPnL * 100).toFixed(1) + '%' : 'N/A', consPassed ? '#24bb78' : '#f59e0b');
  g('sa-daily', path.failReason !== 'DAILY_LOSS' ? 'Passed' : 'VIOLATED', path.failReason !== 'DAILY_LOSS' ? '#24bb78' : '#ef4444');
  g('sa-days', `${path.days} / ${minDays} required`, daysPassed ? '#24bb78' : '#f59e0b');

  // ── Small audit prob bar ───────────────────────────────────
  g('simPassProb', pct + '%', pctColor);
  g('simPathsDisplay', simPathCount);
  const bar = document.getElementById('simProbBar'); if (bar) { bar.style.width = pct + '%'; bar.style.background = pctColor; }
  g('simProbLabel', pct >= 60 ? 'Strong pass probability — strategy aligns well with rules.' : pct >= 35 ? 'Moderate — consider adjusting risk or win rate.' : 'Low pass rate — strategy frequently violates rules.');

  renderSimCharts(path, numTrades, capital, riskPct, target, maxDD, ddType, wr, rr);
}

function renderSimCharts(path, numTrades, capital, riskPct, target, maxDD, ddType, wr, rr) {
  const gc = getChartGridColor();
  const lc = getChartLabelColor();
  Chart.defaults.color = lc;
  Chart.defaults.font.family = "'Plus Jakarta Sans', monospace";
  Chart.defaults.font.size = 10;

  destroyChart('chartEquity');
  chartInstances['chartEquity'] = new Chart(document.getElementById('chartEquity'), {
    type: 'line',
    data: { labels: path.curve.map((_,i)=>i), datasets: [
      { label: 'Balance', data: path.curve, borderColor: '#3b82f6', borderWidth: 2, fill: false, pointRadius: 0, tension: 0.2 },
      { label: 'DD Floor', data: path.ddFloor, borderColor: '#ef4444', borderWidth: 1.5, fill: false, pointRadius: 0, borderDash: [4,2] },
      { label: 'Target', data: new Array(path.curve.length).fill(capital + target), borderColor: '#24bb78', borderWidth: 1.5, borderDash: [6,4], fill: false, pointRadius: 0 }
    ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 8, font: { size: 9 } } } }, scales: { x: { display: false }, y: { grid: { color: gc } } } }
  });

  destroyChart('chartMC');
  const envs = [];
  for (let i = 0; i < 150; i++) { const p = simulate(capital, wr, rr, riskPct, numTrades, 99999, maxDD * 2, ddType); envs.push({ data: p.curve, borderColor: 'rgba(59,130,246,0.07)', borderWidth: 1, fill: false, pointRadius: 0, tension: 0.1 }); }
  chartInstances['chartMC'] = new Chart(document.getElementById('chartMC'), {
    type: 'line', data: { labels: Array.from({length: numTrades+1},(_,i)=>i), datasets: envs },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: gc } } }, animation: { duration: 0 } }
  });

  destroyChart('chartDist');
  chartInstances['chartDist'] = new Chart(document.getElementById('chartDist'), {
    data: { labels: path.pnlHist.map((_,i)=>i+1), datasets: [
      { type: 'bar', data: path.pnlHist, backgroundColor: path.pnlHist.map(v => v >= 0 ? 'rgba(36,187,120,0.6)' : 'rgba(239,68,68,0.6)'), borderRadius: 2, barPercentage: 0.6, yAxisID: 'yL' },
      { type: 'line', data: path.curve.slice(1), borderColor: '#8b5cf6', borderWidth: 1.5, fill: false, pointRadius: 0, yAxisID: 'yR' }
    ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, yL: { position: 'left', grid: { color: gc } }, yR: { position: 'right', grid: { display: false } } } }
  });

  const rBrackets = ['<-2R', '-2→-1R', '-1→0', '0→1R', '1→2R', '2→3R', '>3R'];
  const counts = new Array(7).fill(0);
  const base = capital * riskPct;
  path.pnlHist.forEach(v => { const r = v / base; if (r < -2) counts[0]++; else if (r < -1) counts[1]++; else if (r < 0) counts[2]++; else if (r < 1) counts[3]++; else if (r < 2) counts[4]++; else if (r < 3) counts[5]++; else counts[6]++; });
  destroyChart('chartHist');
  chartInstances['chartHist'] = new Chart(document.getElementById('chartHist'), {
    data: { labels: rBrackets, datasets: [{ type: 'bar', data: counts, backgroundColor: counts.map((_,i) => i < 3 ? 'rgba(239,68,68,0.65)' : 'rgba(36,187,120,0.65)'), borderRadius: 4, barPercentage: 0.7 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: gc } } } }
  });
}


// ============================================================
// EVAL TRACKER
// ============================================================
function saveEvals() { localStorage.setItem('pfe_evals', JSON.stringify(evals)); }

function addTrackerEval() {
  const firmKey = document.getElementById('t-firm').value;
  const firm = FIRMS.find(f => f.key === firmKey);
  evals.push({
    id: Date.now(), firm: firm ? firm.name : firmKey, firmKey,
    color: firm ? firm.color : '#24bb78',
    size: parseFloat(document.getElementById('t-size').value),
    target: parseFloat(document.getElementById('t-target').value),
    maxDD: parseFloat(document.getElementById('t-dd').value),
    pnl: parseFloat(document.getElementById('t-pnl').value),
    days: parseInt(document.getElementById('t-days').value),
    status: document.getElementById('t-status').value,
    date: new Date().toISOString().split('T')[0]
  });
  saveEvals(); renderTracker();
}

function updateEvalField(id, field, val) {
  const ev = evals.find(e => e.id === id);
  if (ev) { ev[field] = field === 'status' ? val : parseFloat(val) || 0; saveEvals(); renderTracker(); }
}

function removeEval(id) { evals = evals.filter(e => e.id !== id); saveEvals(); renderTracker(); }
function clearAllEvals() { if (confirm('Clear all evaluations?')) { evals = []; saveEvals(); renderTracker(); } }

function renderTracker() {
  initSimFirmDropdown();
  const total = evals.length;
  const passed = evals.filter(e => e.status === 'passed').length;
  const failed = evals.filter(e => e.status === 'failed').length;
  const active = evals.filter(e => e.status === 'active').length;
  const g = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  g('ts-total', total); g('ts-passed', passed); g('ts-failed', failed); g('ts-active', active);
  g('ts-rate', (passed + failed) > 0 ? ((passed / (passed + failed)) * 100).toFixed(0) + '%' : '—');
  const list = document.getElementById('trackerList');
  if (!list) return;
  if (!evals.length) {
    list.innerHTML = '<div style="background:#141414;border:1px solid #212121;border-radius:12px;padding:48px;text-align:center;color:#989898;">No evaluations tracked yet. Add one from the left panel.</div>';
    return;
  }
  list.innerHTML = '';
  evals.forEach(ev => {
    const progress = ev.target > 0 ? Math.min(100, Math.max(0, (ev.pnl / ev.target) * 100)) : 0;
    const ddUsed = ev.pnl < 0 ? Math.min(100, (Math.abs(ev.pnl) / ev.maxDD) * 100) : 0;
    const statusColor = ev.status === 'passed' ? '#24bb78' : ev.status === 'failed' ? '#ef4444' : '#3b82f6';
    const statusBg = ev.status === 'passed' ? 'rgba(36,187,120,0.1)' : ev.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)';
    const item = document.createElement('div');
    item.className = 'tracker-item';
    item.innerHTML = `
      <div class="ti-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="firm-logo" style="--fc:${ev.color};width:34px;height:34px;font-size:13px;">${ev.firm.charAt(0)}</div>
          <div>
            <span style="font-size:14px;font-weight:700;">${ev.firm}</span>
            <span class="mono" style="font-size:11px;color:#989898;margin-left:8px;">$${ev.size.toLocaleString()}</span>
          </div>
          <span style="background:${statusBg};color:${statusColor};border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700;text-transform:uppercase;">${ev.status}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <select onchange="updateEvalField(${ev.id},'status',this.value)" style="background:#1b1b1b;border:1px solid #212121;border-radius:7px;color:#f5f5f5;font-size:11px;padding:4px 8px;">
            <option value="active" ${ev.status==='active'?'selected':''}>Active</option>
            <option value="passed" ${ev.status==='passed'?'selected':''}>Passed</option>
            <option value="failed" ${ev.status==='failed'?'selected':''}>Failed</option>
          </select>
          <button onclick="removeEval(${ev.id})" style="background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:7px;padding:5px 10px;font-size:10px;font-weight:700;cursor:pointer;">✕</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
        <div><span style="font-size:10px;color:#989898;display:block;margin-bottom:3px;">PnL</span><input type="number" value="${ev.pnl}" onchange="updateEvalField(${ev.id},'pnl',this.value)" class="sim-input" style="padding:6px 8px;font-size:11px;"></div>
        <div><span style="font-size:10px;color:#989898;display:block;margin-bottom:3px;">Days</span><input type="number" value="${ev.days}" onchange="updateEvalField(${ev.id},'days',this.value)" class="sim-input" style="padding:6px 8px;font-size:11px;"></div>
        <div><span style="font-size:10px;color:#989898;display:block;margin-bottom:3px;">Target</span><span class="mono" style="font-size:15px;font-weight:700;color:#24bb78;">$${ev.target.toLocaleString()}</span></div>
        <div><span style="font-size:10px;color:#989898;display:block;margin-bottom:3px;">Max DD</span><span class="mono" style="font-size:15px;font-weight:700;color:#ef4444;">$${ev.maxDD.toLocaleString()}</span></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:10px;color:#989898;">Target Progress</span><span class="mono" style="font-size:10px;color:#24bb78;">${progress.toFixed(1)}%</span></div>
          <div class="ti-bar-bg"><div class="ti-bar" style="width:${progress}%;background:#24bb78;"></div></div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:10px;color:#989898;">DD Used</span><span class="mono" style="font-size:10px;color:#ef4444;">${ddUsed.toFixed(1)}%</span></div>
          <div class="ti-bar-bg"><div class="ti-bar" style="width:${ddUsed}%;background:#ef4444;"></div></div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:10px;color:#989898;">Started: ${ev.date}</div>
    `;
    list.appendChild(item);
  });
}

// ============================================================
// INIT FIRM FILTER DROPDOWN
// ============================================================
function initFirmFilterDropdown() {
  const sel = document.getElementById('firmFilter');
  if (!sel) return;
  FIRMS.forEach(f => {
    const o = document.createElement('option');
    o.value = f.key; o.textContent = f.name;
    sel.appendChild(o);
  });
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply theme icon (DOM is ready now)
  applyTheme(currentTheme);
  initFirmFilterDropdown();
  initSimFirmDropdown();
  renderTable();
  renderFAQ();
  renderTracker();
});



// ============================================================
// EDGE SIMULATION ENGINE
// ============================================================

function esUpdateSampleMeter() {
  const n = parseInt(document.getElementById('es-numtrades').value) || 0;
  const m = document.getElementById('es-sample-meter');
  if (n <= 50) { m.textContent = 'Extreme Noise'; m.className = 'es-meter es-meter-red'; }
  else if (n <= 100) { m.textContent = 'High Noise'; m.className = 'es-meter es-meter-orange'; }
  else if (n <= 150) { m.textContent = 'Noise'; m.className = 'es-meter es-meter-amber'; }
  else if (n <= 200) { m.textContent = 'Potential Signal'; m.className = 'es-meter es-meter-yellow'; }
  else if (n <= 300) { m.textContent = 'Potential Edge'; m.className = 'es-meter es-meter-teal'; }
  else if (n <= 500) { m.textContent = 'Edge'; m.className = 'es-meter es-meter-green'; }
  else if (n <= 1000) { m.textContent = 'Solid Edge'; m.className = 'es-meter es-meter-green'; }
  else { m.textContent = 'Institutional Sample'; m.className = 'es-meter es-meter-green-solid'; }
}

function initEdgeSimCharts() {
  const gc = getChartGridColor();
  const lc = getChartLabelColor();
  const rl = getChartRadarLineColor();
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = lc;

  // Pie
  esCharts.pie = new Chart(document.getElementById('esPieChart'), {
    type: 'pie',
    data: { labels: ['Wins','Losses','BE'], datasets: [{ data: [0,0,0], backgroundColor: ['#24bb78','#ef4444','#6b7280'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  // Radar
  esCharts.radar = new Chart(document.getElementById('esRadarChart'), {
    type: 'radar',
    data: {
      labels: ['Win %','Profit Factor','Avg Win/Loss','Recovery Factor','Max Drawdown','Consistency'],
      datasets: [{ data: [0,0,0,0,0,0], backgroundColor: 'rgba(36,187,120,0.1)', borderColor: '#24bb78', borderWidth: 2, pointBackgroundColor: '#24bb78', pointBorderColor: '#111111', pointRadius: 3 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { r: { angleLines: { color: rl }, grid: { color: rl }, pointLabels: { font: { size: 9, weight: 'bold' }, color: lc }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 100 } }
    }
  });

  // Equity
  esCharts.equity = new Chart(document.getElementById('esChartEquity'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Capital', data: [], borderColor: '#24bb78', borderWidth: 2, fill: false, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: gc }, display: false }, y: { grid: { color: gc } } }, plugins: { legend: { display: false } } }
  });

  // Monte Carlo
  esCharts.mc = new Chart(document.getElementById('esChartMC'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: gc }, display: false }, y: { grid: { color: gc } } }, plugins: { legend: { display: false } }, animation: { duration: 0 } }
  });

  // Overlay (bar + line)
  esCharts.overlay = new Chart(document.getElementById('esChartOverlay'), {
    data: { labels: [], datasets: [
      { type: 'bar', label: 'Trade PnL', data: [], backgroundColor: '#6b7280', borderRadius: 4, yAxisID: 'yBar' },
      { type: 'line', label: 'Equity', data: [], borderColor: '#24bb78', borderWidth: 1.5, fill: false, pointRadius: 0, yAxisID: 'yLine' }
    ]},
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, display: false }, yBar: { position: 'left', grid: { color: gc } }, yLine: { position: 'right', grid: { display: false } } }, plugins: { legend: { display: false } } }
  });

  // Histogram
  esCharts.hist = new Chart(document.getElementById('esChartHist'), {
    type: 'bar',
    data: { labels: ['<-3R','-3 to -1R','-1 to 0R','0 to 1R','1 to 3R','>3R'], datasets: [{ data: [0,0,0,0,0,0], backgroundColor: '#6b7280', borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { grid: { color: gc } } }, plugins: { legend: { display: false } } }
  });

  // Drawdown
  esCharts.dd = new Chart(document.getElementById('esChartDD'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Drawdown', data: [], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', fill: true, pointRadius: 0, borderWidth: 1.5 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: gc }, display: false }, y: { grid: { color: gc } } }, plugins: { legend: { display: false } } }
  });
}

function runEdgeSimulation() {
  // Init charts if first run
  if (!esCharts.pie) initEdgeSimCharts();

  const capital = parseFloat(document.getElementById('es-capital').value) || 100000;
  const winRateInput = parseFloat(document.getElementById('es-winrate').value) / 100;
  const avgWinR = parseFloat(document.getElementById('es-avgwinr').value);
  const avgLossR = parseFloat(document.getElementById('es-avglossr').value);
  const riskPct = parseFloat(document.getElementById('es-riskpct').value) / 100;
  const numTrades = parseInt(document.getElementById('es-numtrades').value);
  const mcPaths = parseInt(document.getElementById('es-mcpaths').value);

  const useWins = document.getElementById('es-inc-wins').checked;
  const useLosses = document.getElementById('es-inc-losses').checked;
  const useBE = document.getElementById('es-inc-be').checked;

  if (!useWins && !useLosses && !useBE) {
    document.getElementById('es-inc-wins').checked = true;
    document.getElementById('es-inc-losses').checked = true;
    return runEdgeSimulation();
  }

  // Normalize rates
  let rawW = useWins ? winRateInput : 0;
  let rawL = useLosses ? (1 - winRateInput) : 0;
  let rawBE = useBE ? 0.05 : 0;

  if (useBE && !useWins && !useLosses) { rawBE = 1.0; }
  else if (useBE) {
    const rem = 1.0 - rawBE;
    const sumWL = (useWins ? winRateInput : 0) + (useLosses ? (1 - winRateInput) : 0);
    if (sumWL > 0) { rawW = useWins ? (winRateInput / sumWL) * rem : 0; rawL = useLosses ? ((1 - winRateInput) / sumWL) * rem : 0; }
    else { rawBE = 1.0; }
  } else {
    const sumWL = rawW + rawL;
    if (sumWL > 0) { rawW /= sumWL; rawL /= sumWL; }
  }

  const adjWR = rawW, adjLR = rawL;
  const baseRisk = capital * riskPct;

  let bal = capital, curve = [bal], pnlHist = [], ddCurve = [0], peak = capital;
  let wins = 0, losses = 0, bes = 0;
  let curStreak = 0, maxStreak = 0, streakCount = 0, streakSum = 0;
  let seq = [];

  for (let i = 0; i < numTrades; i++) {
    const rand = Math.random();
    let pnl = 0, r = 0;
    if (rand <= adjWR) {
      r = avgWinR * (0.9 + Math.random() * 0.2);
      pnl = baseRisk * r; wins++; seq.push('W');
      if (curStreak > 0) { streakCount++; streakSum += curStreak; curStreak = 0; }
    } else if (rand <= adjWR + adjLR) {
      r = -avgLossR * (0.95 + Math.random() * 0.1);
      pnl = baseRisk * r; losses++; seq.push('L');
      curStreak++; if (curStreak > maxStreak) maxStreak = curStreak;
    } else {
      pnl = 0; bes++; seq.push('BE');
    }
    bal += pnl; pnlHist.push(pnl); curve.push(bal);
    if (bal > peak) peak = bal;
    ddCurve.push(-((peak - bal) / peak) * 100);
  }
  if (curStreak > 0) { streakCount++; streakSum += curStreak; }

  const gp = pnlHist.filter(v => v > 0).reduce((a,b) => a+b, 0);
  const gl = Math.abs(pnlHist.filter(v => v < 0).reduce((a,b) => a+b, 0));
  const net = bal - capital;
  const wr = numTrades === 0 ? 0 : wins / numTrades;
  const totalR = pnlHist.reduce((a,b) => a + (b / baseRisk), 0);
  const wlRatio = gl === 0 ? avgWinR : (gp / (wins || 1)) / (gl / (losses || 1));
  const pf = gl === 0 ? 15 : gp / gl;
  const maxDDval = Math.abs(Math.min(...ddCurve));
  const expectancy = (adjWR * avgWinR) - (adjLR * avgLossR);
  const recovery = maxDDval === 0 ? 20 : Math.abs(net / (capital * (maxDDval / 100)));
  const edgeRatio = avgLossR === 0 ? 0 : avgWinR / avgLossR;
  const wrNorm = (adjWR + adjLR) > 0 ? adjWR / (adjWR + adjLR) : 0;
  const kelly = edgeRatio === 0 ? 0 : wrNorm - ((1 - wrNorm) / edgeRatio);

  // Update metrics
  const g = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  g('es-m-winRatio', (wr * 100).toFixed(1) + '%');
  g('es-m-lossRatio', numTrades === 0 ? '0.0%' : ((losses / numTrades) * 100).toFixed(1) + '%');
  g('es-m-beRatio', numTrades === 0 ? '0.0%' : ((bes / numTrades) * 100).toFixed(1) + '%');
  g('es-m-winsCount', wins);
  g('es-m-lossesCount', losses);
  g('es-m-beCount', bes);
  g('es-m-avgR', numTrades === 0 ? '0.00 R' : (totalR / numTrades).toFixed(2) + ' R');
  g('es-m-avgWinLoss', wlRatio.toFixed(2));
  g('es-m-avgPnl', '$' + Math.round(net / (numTrades || 1)).toLocaleString());
  g('es-m-expectancy', expectancy.toFixed(3) + ' R');
  g('es-m-netPnl', (net >= 0 ? '+$' : '-$') + Math.abs(Math.round(net)).toLocaleString());
  g('es-m-equity', '$' + Math.round(bal).toLocaleString());
  g('es-m-pf', gl === 0 ? '∞' : pf.toFixed(3));
  g('es-m-maxdd', maxDDval.toFixed(2) + '%');
  g('es-m-maxStreak', maxStreak);
  g('es-m-avgStreak', streakCount === 0 ? '0.0' : (streakSum / streakCount).toFixed(1));
  g('es-m-recovery', maxDDval === 0 ? '∞' : recovery.toFixed(2));
  g('es-m-sharpe', pnlHist.length < 2 ? 'N/A' : (expectancy / 1.2).toFixed(2));
  g('es-m-sortino', pnlHist.length < 2 ? 'N/A' : (expectancy / 0.9).toFixed(2));
  g('es-m-kelly', (kelly * 100).toFixed(1) + '%');

  // Edge Score
  const zWin = Math.min(100, Math.max(10, wr * 130));
  const zPF = Math.min(100, Math.max(5, (pf / 3) * 100));
  const zWL = Math.min(100, Math.max(5, (wlRatio / 3.5) * 100));
  const zRF = Math.min(100, Math.max(5, (recovery / 6) * 100));
  const zDD = Math.min(100, Math.max(0, 100 - (maxDDval * 4)));
  let devSum = 0; const meanPnl = net / (numTrades || 1);
  pnlHist.forEach(v => devSum += Math.pow(v - meanPnl, 2));
  const stdDev = numTrades > 1 ? Math.sqrt(devSum / (numTrades - 1)) : 1;
  const zCons = Math.min(100, Math.max(20, 100 - ((stdDev / (baseRisk || 1)) * 15)));
  const totalScore = Math.round((zWin * 0.20) + (zPF * 0.20) + (zWL * 0.15) + (zRF * 0.15) + (zDD * 0.15) + (zCons * 0.15));

  g('es-score-display', totalScore.toFixed(2));
  document.getElementById('es-score-bar').style.width = totalScore + '%';

  // Radar update
  esCharts.radar.data.datasets[0].data = [Math.round(zWin), Math.round(zPF), Math.round(zWL), Math.round(zRF), Math.round(zDD), Math.round(zCons)];
  esCharts.radar.update();

  // Pie labels
  g('es-pie-wins', `${numTrades===0?0:((wins/numTrades)*100).toFixed(0)}% (${wins})`);
  g('es-pie-losses', `${numTrades===0?0:((losses/numTrades)*100).toFixed(0)}% (${losses})`);
  g('es-pie-be', `${numTrades===0?0:((bes/numTrades)*100).toFixed(0)}% (${bes})`);
  g('es-tape-stats', `W: ${wins}  |  L: ${losses}  |  BE: ${bes}`);

  // Tape
  const tape = document.getElementById('es-tape');
  tape.innerHTML = '';
  seq.forEach(s => {
    const d = document.createElement('div');
    d.className = 'seq-block';
    d.style.width = '30px'; d.style.height = '30px'; d.style.fontSize = '10px';
    d.style.background = s === 'W' ? 'rgba(36,187,120,0.8)' : s === 'L' ? 'rgba(239,68,68,0.8)' : 'rgba(107,114,128,0.8)';
    d.style.border = s === 'W' ? '1px solid rgba(36,187,120,0.2)' : s === 'L' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(107,114,128,0.2)';
    d.style.borderRadius = '8px'; d.style.flexShrink = '0';
    d.textContent = s;
    tape.appendChild(d);
  });

  // Charts
  const labelsX = Array.from({ length: numTrades + 1 }, (_, i) => i);

  esCharts.pie.data.datasets[0].data = [wins, losses, bes];
  esCharts.pie.update();

  esCharts.equity.data.labels = labelsX;
  esCharts.equity.data.datasets[0].data = curve;
  esCharts.equity.update();

  esCharts.overlay.data.labels = Array.from({ length: numTrades }, (_, i) => `T${i+1}`);
  esCharts.overlay.data.datasets[0].data = pnlHist;
  esCharts.overlay.data.datasets[0].backgroundColor = pnlHist.map(v => v >= 0 ? 'rgba(36,187,120,0.7)' : 'rgba(239,68,68,0.7)');
  esCharts.overlay.data.datasets[1].data = curve.slice(1);
  esCharts.overlay.update();

  esCharts.dd.data.labels = labelsX;
  esCharts.dd.data.datasets[0].data = ddCurve;
  esCharts.dd.update();

  // Histogram bins
  const bins = [0,0,0,0,0,0];
  pnlHist.forEach(v => {
    const r = v / baseRisk;
    if (r <= -3) bins[0]++;
    else if (r > -3 && r <= -1) bins[1]++;
    else if (r > -1 && r < 0) bins[2]++;
    else if (r >= 0 && r < 1) bins[3]++;
    else if (r >= 1 && r <= 3) bins[4]++;
    else bins[5]++;
  });
  esCharts.hist.data.datasets[0].data = bins;
  esCharts.hist.data.datasets[0].backgroundColor = ['#ef4444','#f87171','#fca5a5','#a7f3d0','#24bb78','#059669'];
  esCharts.hist.update();

  // Monte Carlo
  const mcDatasets = [];
  for (let p = 0; p < mcPaths; p++) {
    let mcBal = capital, mcCurve = [mcBal];
    for (let t = 0; t < numTrades; t++) {
      const r = Math.random();
      let pnl = 0;
      if (r <= adjWR) pnl = baseRisk * (avgWinR * (0.85 + Math.random() * 0.3));
      else if (r <= adjWR + adjLR) pnl = -baseRisk * (avgLossR * (0.95 + Math.random() * 0.1));
      mcBal += pnl; mcCurve.push(mcBal);
    }
    mcDatasets.push({
      data: mcCurve,
      borderColor: p === 0 ? 'rgba(36,187,120,0.8)' : 'rgba(156,163,175,0.06)',
      borderWidth: p === 0 ? 2 : 1,
      fill: false, pointRadius: 0
    });
  }
  esCharts.mc.data.labels = labelsX;
  esCharts.mc.data.datasets = mcDatasets;
  esCharts.mc.update();
}
