// ============================================================
// FIRM DATABASE — PropFirmEdge v3.0
// ============================================================
const FIRMS = {
  topstep: {
    name: "Topstep", cat: "futures", color: "#4da6ff",
    payout: 90, maxPayout: 90, maxFunded: 300000, scaling: true,
    refund: false, newsTrading: true, weekendHold: false, ea: false,
    feature: "90% payout from day 1, no consistency rule",
    description: "Industry pioneer with straightforward EOD trailing rules. Popular among scalpers and day traders who want clean rule sets without consistency requirements.",
    promoCode: "EDGE", promoDiscount: "20% off",
    sizes: {
      "50000":  { "Trading Combine": { target: 3000, maxDD: 2000, daily: 1000, type: "eod", consistency: "0", minDays: 5 } },
      "100000": { "Trading Combine": { target: 6000, maxDD: 3000, daily: 2000, type: "eod", consistency: "0", minDays: 5 } },
      "150000": { "Trading Combine": { target: 9000, maxDD: 4500, daily: 3000, type: "eod", consistency: "0", minDays: 5 } }
    }
  },
  apex: {
    name: "Apex Trader Funding", cat: "futures", color: "#f5a623",
    payout: 100, maxPayout: 100, maxFunded: 300000, scaling: false,
    refund: false, newsTrading: true, weekendHold: false, ea: true,
    feature: "100% of first $25K profit, then 90%",
    description: "Aggressive payout structure with trailing drawdown. Best for traders who can manage intraday equity swings and want maximum payout on initial profits.",
    promoCode: "EDGE", promoDiscount: "80% off",
    sizes: {
      "25000":  { "Full Trailing": { target: 1500, maxDD: 1500, daily: 99999, type: "trailing", consistency: "0", minDays: 7 } },
      "50000":  { "Full Trailing": { target: 3000, maxDD: 2500, daily: 99999, type: "trailing", consistency: "0", minDays: 7 } },
      "100000": { "Full Trailing": { target: 6000, maxDD: 3000, daily: 99999, type: "trailing", consistency: "0", minDays: 7 } },
      "150000": { "Full Trailing": { target: 9000, maxDD: 5000, daily: 99999, type: "trailing", consistency: "0", minDays: 7 } },
      "250000": { "Full Trailing": { target: 15000, maxDD: 6500, daily: 99999, type: "trailing", consistency: "0", minDays: 7 } }
    }
  },
  myfundedfutures: {
    name: "MyFundedFutures", cat: "futures", color: "#22d06c",
    payout: 90, maxPayout: 90, maxFunded: 200000, scaling: false,
    refund: true, newsTrading: true, weekendHold: false, ea: true,
    feature: "Eval fee refunded on first payout",
    description: "Offers both EOD and Static drawdown options. The fee refund policy makes this extremely cost-effective for skilled traders who pass on the first attempt.",
    promoCode: "EDGE", promoDiscount: "10% off",
    sizes: {
      "50000": {
        "Starter (EOD)": { target: 3000, maxDD: 2000, daily: 1100, type: "eod", consistency: "50", minDays: 1 },
        "Expert (Static)": { target: 3000, maxDD: 2000, daily: 1100, type: "static", consistency: "50", minDays: 1 }
      },
      "100000": {
        "Starter (EOD)": { target: 6000, maxDD: 3000, daily: 2200, type: "eod", consistency: "50", minDays: 1 },
        "Expert (Static)": { target: 6000, maxDD: 3000, daily: 2200, type: "static", consistency: "50", minDays: 1 }
      }
    }
  },

  lucid: {
    name: "Lucid Markets", cat: "futures", color: "#a855f7",
    payout: 85, maxPayout: 90, maxFunded: 250000, scaling: true,
    refund: false, newsTrading: false, weekendHold: false, ea: false,
    feature: "Flex or direct allocation paths",
    description: "Two distinct paths: Flex Challenge with lenient static DD, or Direct Allocation with tighter trailing rules for experienced traders seeking faster funding.",
    promoCode: "EDGE", promoDiscount: "15% off",
    sizes: {
      "50000": {
        "Lucid Flex Challenge": { target: 3000, maxDD: 2500, daily: 1500, type: "static", consistency: "50", minDays: 0 },
        "Lucid Direct Allocation": { target: 4000, maxDD: 2000, daily: 1000, type: "trailing", consistency: "20", minDays: 3 }
      },
      "100000": {
        "Lucid Flex Challenge": { target: 6000, maxDD: 5000, daily: 3000, type: "static", consistency: "50", minDays: 0 },
        "Lucid Direct Allocation": { target: 8000, maxDD: 4000, daily: 2000, type: "trailing", consistency: "20", minDays: 3 }
      }
    }
  },
  takeprofit: {
    name: "Take Profit Trader", cat: "futures", color: "#38bdf8",
    payout: 80, maxPayout: 80, maxFunded: 200000, scaling: false,
    refund: false, newsTrading: true, weekendHold: false, ea: false,
    feature: "Simple EOD rules, no consistency",
    description: "Straightforward EOD trailing with no consistency rule. Ideal for consistent traders who want predictable rule sets without profit concentration caps.",
    promoCode: "EDGE", promoDiscount: "15% off",
    sizes: {
      "25000":  { "Standard": { target: 1500, maxDD: 1500, daily: 750, type: "eod", consistency: "0", minDays: 5 } },
      "50000":  { "Standard": { target: 3000, maxDD: 2000, daily: 1000, type: "eod", consistency: "0", minDays: 5 } },
      "100000": { "Standard": { target: 6000, maxDD: 3000, daily: 1500, type: "eod", consistency: "0", minDays: 5 } },
      "150000": { "Standard": { target: 9000, maxDD: 4500, daily: 2250, type: "eod", consistency: "0", minDays: 5 } }
    }
  },
  tradeify: {
    name: "Tradeify", cat: "futures", color: "#f04b6a",
    payout: 90, maxPayout: 90, maxFunded: 150000, scaling: false,
    refund: false, newsTrading: true, weekendHold: false, ea: false,
    feature: "No daily loss limit, trailing DD only",
    description: "Unique in having no daily loss limit — only a trailing drawdown. Perfect for aggressive intraday traders who sometimes have large red candles but recover quickly.",
    promoCode: "EDGE", promoDiscount: "20% off",
    sizes: {
      "25000":  { "Standard": { target: 1500, maxDD: 1500, daily: 99999, type: "trailing", consistency: "0", minDays: 0 } },
      "50000":  { "Standard": { target: 3000, maxDD: 2000, daily: 99999, type: "trailing", consistency: "0", minDays: 0 } },
      "100000": { "Standard": { target: 6000, maxDD: 3000, daily: 99999, type: "trailing", consistency: "0", minDays: 0 } }
    }
  },

  earn2trade: {
    name: "Earn2Trade", cat: "futures", color: "#fb923c",
    payout: 80, maxPayout: 80, maxFunded: 150000, scaling: true,
    refund: false, newsTrading: false, weekendHold: false, ea: false,
    feature: "Scaling plan up to $400K, educational resources",
    description: "Best for developing traders — includes educational resources and a progressive scaling plan. Longer minimum days requirement but generous growth path.",
    promoCode: "EDGE", promoDiscount: "10% off",
    sizes: {
      "50000":  { "Gauntlet Mini": { target: 3000, maxDD: 2000, daily: 1000, type: "eod", consistency: "0", minDays: 15 } },
      "100000": { "Gauntlet Mini": { target: 6000, maxDD: 3500, daily: 1750, type: "eod", consistency: "0", minDays: 15 } }
    }
  },
  ftmo: {
    name: "FTMO", cat: "forex", color: "#4da6ff",
    payout: 80, maxPayout: 90, maxFunded: 400000, scaling: true,
    refund: true, newsTrading: false, weekendHold: true, ea: true,
    feature: "Free trial, refund on first withdrawal, up to 90%",
    description: "The gold standard in forex prop trading. Static drawdown, free trial available, fee refund on first payout, and scaling up to $2M. Weekend holds and EAs permitted.",
    promoCode: "EDGE", promoDiscount: "10% off",
    sizes: {
      "10000":  { "FTMO Challenge": { target: 1000, maxDD: 1000, daily: 500, type: "static", consistency: "0", minDays: 4 } },
      "25000":  { "FTMO Challenge": { target: 2500, maxDD: 2500, daily: 1250, type: "static", consistency: "0", minDays: 4 } },
      "50000":  { "FTMO Challenge": { target: 5000, maxDD: 5000, daily: 2500, type: "static", consistency: "0", minDays: 4 },
                  "Swing Account": { target: 5000, maxDD: 10000, daily: 99999, type: "static", consistency: "0", minDays: 4 } },
      "100000": { "FTMO Challenge": { target: 10000, maxDD: 10000, daily: 5000, type: "static", consistency: "0", minDays: 4 } },
      "200000": { "FTMO Challenge": { target: 20000, maxDD: 20000, daily: 10000, type: "static", consistency: "0", minDays: 4 } }
    }
  },
  thefundedtrader: {
    name: "The Funded Trader", cat: "forex", color: "#22d06c",
    payout: 80, maxPayout: 90, maxFunded: 600000, scaling: true,
    refund: false, newsTrading: false, weekendHold: true, ea: true,
    feature: "Up to $600K funded, aggressive scaling plan",
    description: "One of the highest funded account caps in the industry. Aggressive scaling lets skilled traders grow rapidly. Weekend holds and EA/bot trading permitted.",
    promoCode: "EDGE", promoDiscount: "15% off",
    sizes: {
      "25000":  { "Standard Challenge": { target: 2500, maxDD: 1500, daily: 750, type: "static", consistency: "0", minDays: 5 } },
      "50000":  { "Standard Challenge": { target: 5000, maxDD: 3000, daily: 1500, type: "static", consistency: "0", minDays: 5 } },
      "100000": { "Standard Challenge": { target: 10000, maxDD: 6000, daily: 3000, type: "static", consistency: "0", minDays: 5 } },
      "200000": { "Standard Challenge": { target: 20000, maxDD: 12000, daily: 6000, type: "static", consistency: "0", minDays: 5 } }
    }
  },

  e8funding: {
    name: "E8 Funding", cat: "forex", color: "#a855f7",
    payout: 80, maxPayout: 85, maxFunded: 400000, scaling: true,
    refund: false, newsTrading: true, weekendHold: true, ea: true,
    feature: "News trading allowed, weekend holds OK",
    description: "Permissive rules: news trading, weekend holds, and EAs all allowed. No minimum trading days. Static drawdown makes risk management straightforward.",
    promoCode: "EDGE", promoDiscount: "15% off",
    sizes: {
      "25000":  { "E8 Evaluation": { target: 2000, maxDD: 2000, daily: 1000, type: "static", consistency: "0", minDays: 0 } },
      "50000":  { "E8 Evaluation": { target: 4000, maxDD: 4000, daily: 2000, type: "static", consistency: "0", minDays: 0 } },
      "100000": { "E8 Evaluation": { target: 8000, maxDD: 8000, daily: 4000, type: "static", consistency: "0", minDays: 0 } }
    }
  },
  fundedpips: {
    name: "Funding Pips", cat: "forex", color: "#38bdf8",
    payout: 80, maxPayout: 80, maxFunded: 200000, scaling: false,
    refund: false, newsTrading: false, weekendHold: false, ea: false,
    feature: "No minimum trading days, fast pass possible",
    description: "Zero minimum days means you can pass in a single session if you hit the target. Clean static drawdown with no news trading restriction workarounds needed.",
    promoCode: "EDGE", promoDiscount: "10% off",
    sizes: {
      "25000":  { "Standard": { target: 2000, maxDD: 1500, daily: 750, type: "static", consistency: "0", minDays: 0 } },
      "50000":  { "Standard": { target: 4000, maxDD: 3000, daily: 1500, type: "static", consistency: "0", minDays: 0 } },
      "100000": { "Standard": { target: 8000, maxDD: 6000, daily: 3000, type: "static", consistency: "0", minDays: 0 } }
    }
  },
  fundednext: {
    name: "FundedNext", cat: "forex", color: "#fb923c",
    payout: 90, maxPayout: 95, maxFunded: 300000, scaling: true,
    refund: false, newsTrading: false, weekendHold: true, ea: true,
    feature: "15% of eval phase profits + up to 95% funded",
    description: "Unique model: earn 15% of profits made during evaluation phase. Up to 95% payout when funded with aggressive scaling. Weekend holds and EA trading allowed.",
    promoCode: "EDGE", promoDiscount: "20% off",
    sizes: {
      "15000":  { "Express": { target: 1500, maxDD: 750, daily: 300, type: "static", consistency: "0", minDays: 0 } },
      "25000":  { "Stellar": { target: 2500, maxDD: 1500, daily: 750, type: "static", consistency: "0", minDays: 5 } },
      "50000":  { "Stellar": { target: 5000, maxDD: 3000, daily: 1500, type: "static", consistency: "0", minDays: 5 } },
      "100000": { "Stellar": { target: 10000, maxDD: 6000, daily: 3000, type: "static", consistency: "0", minDays: 5 } }
    }
  }
};


// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('header .tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'firms') renderFirmDirectory('all');
}

// ============================================================
// FIRM DROPDOWN INIT
// ============================================================
function initFirmDropdown() {
  const sel = document.getElementById('propFirm');
  sel.innerHTML = '<option value="custom">── Custom / Manual ──</option>';
  const fg = document.createElement('optgroup'); fg.label = "FUTURES";
  const xg = document.createElement('optgroup'); xg.label = "FOREX / CFD";
  Object.keys(FIRMS).forEach(k => {
    const o = document.createElement('option'); o.value = k; o.textContent = FIRMS[k].name;
    FIRMS[k].cat === 'futures' ? fg.appendChild(o) : xg.appendChild(o);
  });
  sel.appendChild(fg); sel.appendChild(xg);
  // Also init tracker dropdown
  const ts = document.getElementById('track-firm');
  ts.innerHTML = '';
  Object.keys(FIRMS).forEach(k => {
    const o = document.createElement('option'); o.value = k; o.textContent = FIRMS[k].name;
    ts.appendChild(o);
  });
}

function updateSizes() {
  const k = document.getElementById('propFirm').value;
  const sel = document.getElementById('propSize');
  sel.innerHTML = '';
  if (k === 'custom' || !FIRMS[k]) { sel.innerHTML = '<option value="custom">Manual</option>'; updateTypes(); return; }
  Object.keys(FIRMS[k].sizes).forEach(sz => {
    const o = document.createElement('option'); o.value = sz; o.textContent = '$' + parseInt(sz).toLocaleString();
    sel.appendChild(o);
  });
  updateTypes();
}

function updateTypes() {
  const k = document.getElementById('propFirm').value;
  const sz = document.getElementById('propSize').value;
  const sel = document.getElementById('propType');
  sel.innerHTML = '';
  if (k === 'custom' || sz === 'custom' || !FIRMS[k] || !FIRMS[k].sizes[sz]) {
    sel.innerHTML = '<option value="custom">Manual</option>'; return;
  }
  Object.keys(FIRMS[k].sizes[sz]).forEach(t => {
    const o = document.createElement('option'); o.value = t; o.textContent = t;
    sel.appendChild(o);
  });
  applyPreset();
}


function applyPreset() {
  const k = document.getElementById('propFirm').value;
  const sz = document.getElementById('propSize').value;
  const t = document.getElementById('propType').value;
  if (k === 'custom' || sz === 'custom' || t === 'custom') return;
  const p = FIRMS[k].sizes[sz][t];
  if (!p) return;
  document.getElementById('capital').value = sz;
  document.getElementById('propTarget').value = p.target;
  document.getElementById('propMaxDD').value = p.maxDD;
  document.getElementById('propDailyLoss').value = p.daily;
  document.getElementById('propDDType').value = p.type;
  document.getElementById('propConsistency').value = p.consistency;
  document.getElementById('propMinDays').value = p.minDays;
  runSim();
}

function breakToCustom() {
  document.getElementById('propFirm').value = 'custom';
  document.getElementById('propSize').innerHTML = '<option value="custom">Manual</option>';
  document.getElementById('propType').innerHTML = '<option value="custom">Manual</option>';
}

// ============================================================
// SIMULATION ENGINE
// ============================================================
function simulate(capital, wr, rr, riskPct, numTrades, dailyLoss, maxDD, ddType) {
  let bal = capital, curve = [bal], pnlHist = [], ddFloor = [capital - maxDD];
  let peak = capital, dayStart = capital, dayPnl = 0;
  let worstDD = 0, peakDDpct = 0;
  let gp = 0, gl = 0, wins = 0, losses = 0, seq = [];
  let sumW = 0, sumL = 0, hiWin = 0;
  let winDays = 0, lossDays = 0, days = 0;
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

    pnlHist.push(pnl);
    bal += pnl;
    curve.push(bal);
    dayPnl += pnl;

    if (dayPnl < 0 && Math.abs(dayPnl) >= dailyLoss) failReason = "DAILY_LOSS";

    if ((i + 1) % 3 === 0 || i === numTrades - 1) {
      days++;
      if (dayPnl > 0) winDays++; else if (dayPnl < 0) lossDays++;
      if (ddType === 'eod' && bal > dayStart) dayStart = bal;
      dayPnl = 0;
    }

    if (bal > peak) peak = bal;
    let dd = ddType === 'trailing' ? peak - bal
           : ddType === 'eod' ? dayStart - bal
           : capital - bal;
    ddFloor.push(ddType === 'trailing' ? peak - maxDD : ddType === 'eod' ? dayStart - maxDD : capital - maxDD);
    if (dd > worstDD) worstDD = dd;
    if ((peak - bal) / peak > peakDDpct) peakDDpct = (peak - bal) / peak;
    if (dd >= maxDD) failReason = "MAX_DD";
  }

  return { curve, pnlHist, ddFloor, peakDDpct, worstDD, gp, gl, seq, wins, losses, winDays, lossDays, days, totalExec,
    avgW: wins === 0 ? 0 : sumW / wins, avgL: losses === 0 ? 0 : sumL / losses,
    hiWin, failReason };
}


let chartInstances = {};
function destroyChart(id) { if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; } }

function runSim() {
  const capital = parseFloat(document.getElementById('capital').value) || 50000;
  const wr = parseFloat(document.getElementById('winRate').value) / 100;
  const rr = parseFloat(document.getElementById('rrRatio').value);
  const riskPct = parseFloat(document.getElementById('riskPct').value) / 100;
  const numTrades = parseInt(document.getElementById('numTrades').value);
  const target = parseFloat(document.getElementById('propTarget').value) || 0;
  const maxDD = parseFloat(document.getElementById('propMaxDD').value) || 1;
  const daily = parseFloat(document.getElementById('propDailyLoss').value) || 99999;
  const ddType = document.getElementById('propDDType').value;
  const consPct = parseFloat(document.getElementById('propConsistency').value);
  const minDays = parseInt(document.getElementById('propMinDays').value) || 0;

  const path = simulate(capital, wr, rr, riskPct, numTrades, daily, maxDD, ddType);
  const netPnL = path.curve[path.curve.length - 1] - capital;
  const pf = path.gl === 0 ? '∞' : (path.gp / path.gl).toFixed(2);
  const expectancy = (wr * (capital * riskPct * rr)) - ((1 - wr) * (capital * riskPct));

  // Update stats
  document.getElementById('m-equity').textContent = (netPnL >= 0 ? '+$' : '-$') + Math.abs(netPnL).toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('m-equity').style.color = netPnL >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('m-expectancy').textContent = '$' + expectancy.toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('m-drawdown').textContent = (path.peakDDpct * 100).toFixed(2) + '%';
  document.getElementById('m-pf').textContent = pf;
  document.getElementById('m-pf').style.color = parseFloat(pf) > 1 ? 'var(--green)' : 'var(--red)';
  document.getElementById('m-wr').textContent = ((path.wins / path.totalExec) * 100).toFixed(1) + '%';
  document.getElementById('m-avgwl').textContent = '$' + Math.round(path.avgW) + ' / $' + Math.round(path.avgL);
  document.getElementById('m-wdays').textContent = path.winDays + ' / ' + path.days + ' days';
  document.getElementById('m-hiwin').textContent = '$' + Math.round(path.hiWin).toLocaleString();
  document.getElementById('s-win').textContent = path.wins;
  document.getElementById('s-loss').textContent = path.losses;

  // Sequence
  const seqEl = document.getElementById('sequenceTimeline');
  seqEl.innerHTML = '';
  path.seq.forEach(s => {
    const b = document.createElement('div');
    b.className = 'seq-block';
    b.style.background = s === 'W' ? 'var(--green)' : 'var(--red)';
    b.textContent = s;
    seqEl.appendChild(b);
  });

  // Audit
  const consPassed = consPct <= 0 || netPnL <= 0 || (path.hiWin / netPnL * 100) <= consPct;
  const daysPassed = path.days >= minDays;
  const ddPassed = !path.failReason || path.failReason !== 'MAX_DD';
  const dailyOk = !path.failReason || path.failReason !== 'DAILY_LOSS';
  const targetMet = netPnL >= target;

  const auditBox = document.getElementById('auditStatusBox');
  if (path.failReason === 'MAX_DD') {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;">BREACHED — Max Drawdown</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">Account wiped.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--red-dim);display:flex;align-items:center;justify-content:center;color:var(--red);font-weight:700;">✕</div>`;
    auditBox.style.borderColor = 'rgba(239,68,68,0.3)'; auditBox.style.background = 'var(--red-dim)';
  } else if (path.failReason === 'DAILY_LOSS') {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;">BREACHED — Daily Loss</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">Daily cap exceeded.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--red-dim);display:flex;align-items:center;justify-content:center;color:var(--red);font-weight:700;">✕</div>`;
    auditBox.style.borderColor = 'rgba(239,68,68,0.3)'; auditBox.style.background = 'var(--red-dim)';
  } else if (!targetMet) {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;">Target Not Reached</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">Rules clean but target not met.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--amber-dim);display:flex;align-items:center;justify-content:center;color:var(--amber);font-weight:700;">!</div>`;
    auditBox.style.borderColor = 'rgba(245,158,11,0.3)'; auditBox.style.background = 'var(--amber-dim)';
  } else if (!consPassed) {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;">Consistency Violation</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">Profit concentration cap breached.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--amber-dim);display:flex;align-items:center;justify-content:center;color:var(--amber);font-weight:700;">!</div>`;
    auditBox.style.borderColor = 'rgba(245,158,11,0.3)'; auditBox.style.background = 'var(--amber-dim)';
  } else if (!daysPassed) {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;">Min Days Not Met</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">Need more trading days.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--amber-dim);display:flex;align-items:center;justify-content:center;color:var(--amber);font-weight:700;">!</div>`;
    auditBox.style.borderColor = 'rgba(245,158,11,0.3)'; auditBox.style.background = 'var(--amber-dim)';
  } else {
    auditBox.innerHTML = `<div><span style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;">✓ EVAL PASSED</span><p style="font-size:10px;color:var(--muted);margin-top:2px;">All compliance rules verified clean.</p></div><div style="width:28px;height:28px;border-radius:50%;background:var(--green-dim);display:flex;align-items:center;justify-content:center;color:var(--green);font-weight:700;">✓</div>`;
    auditBox.style.borderColor = 'rgba(16,185,129,0.3)'; auditBox.style.background = 'var(--green-dim)';
  }

  document.getElementById('auditTarget').textContent = `$${Math.round(netPnL).toLocaleString()} / $${target.toLocaleString()}`;
  document.getElementById('auditTarget').style.color = targetMet ? 'var(--green)' : 'var(--red)';
  document.getElementById('auditDD').textContent = `$${Math.round(path.worstDD).toLocaleString()} / $${maxDD.toLocaleString()}`;
  document.getElementById('auditDD').style.color = ddPassed ? 'var(--green)' : 'var(--red)';
  const consWeight = netPnL > 0 && consPct > 0 ? (path.hiWin / netPnL * 100).toFixed(1) + '%' : 'N/A';
  document.getElementById('auditCons').textContent = consWeight;
  document.getElementById('auditCons').style.color = consPassed ? 'var(--green)' : 'var(--amber)';
  document.getElementById('auditDaily').textContent = dailyOk ? 'Passed' : 'VIOLATED';
  document.getElementById('auditDaily').style.color = dailyOk ? 'var(--green)' : 'var(--red)';
  document.getElementById('auditDays').textContent = `${path.days} / ${minDays} required`;
  document.getElementById('auditDays').style.color = daysPassed ? 'var(--green)' : 'var(--amber)';

  // Pass Probability
  let passCount = 0;
  for (let i = 0; i < 500; i++) {
    const p2 = simulate(capital, wr, rr, riskPct, numTrades, daily, maxDD, ddType);
    const n2 = p2.curve[p2.curve.length - 1] - capital;
    const c2 = consPct <= 0 || n2 <= 0 || (p2.hiWin / n2 * 100) <= consPct;
    const d2 = p2.days >= minDays;
    if (!p2.failReason && n2 >= target && c2 && d2) passCount++;
  }
  const pct = (passCount / 500 * 100).toFixed(1);
  document.getElementById('passProb').textContent = pct + '%';
  document.getElementById('passProb').style.color = pct >= 60 ? 'var(--green)' : pct >= 35 ? 'var(--amber)' : 'var(--red)';
  document.getElementById('probBar').style.width = pct + '%';
  document.getElementById('probBar').style.background = pct >= 60 ? 'var(--green)' : pct >= 35 ? 'var(--amber)' : 'var(--red)';
  document.getElementById('probLabel').textContent = pct >= 60 ? 'Strong pass probability — strategy aligns with rules.' : pct >= 35 ? 'Moderate — consider adjusting risk parameters.' : 'Low pass rate — strategy frequently violates rules.';

  renderCharts(path, numTrades, capital, riskPct, target, maxDD, ddType, wr, rr);
}


function renderCharts(path, numTrades, capital, riskPct, target, maxDD, ddType, wr, rr) {
  const grid = 'rgba(255,255,255,0.04)';
  Chart.defaults.color = '#64748b';
  Chart.defaults.font.family = "'JetBrains Mono', monospace";
  Chart.defaults.font.size = 10;

  destroyChart('equityChart');
  chartInstances['equityChart'] = new Chart(document.getElementById('equityChart'), {
    type: 'line',
    data: {
      labels: path.curve.map((_, i) => i),
      datasets: [
        { label: 'Balance', data: path.curve, borderColor: '#3b82f6', borderWidth: 2, fill: false, pointRadius: 0, tension: 0.2 },
        { label: 'DD Floor', data: path.ddFloor, borderColor: '#ef4444', borderWidth: 1.5, fill: false, pointRadius: 0 },
        { label: 'Target', data: new Array(path.curve.length).fill(capital + target), borderColor: '#10b981', borderWidth: 1.5, borderDash: [5, 4], fill: false, pointRadius: 0 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 10, font: { size: 9 } } } }, scales: { x: { grid: { color: grid } }, y: { grid: { color: grid } } } }
  });

  destroyChart('monteCarloChart');
  const envelopes = [];
  for (let i = 0; i < 500; i++) {
    const p = simulate(capital, wr, rr, riskPct, numTrades, 99999, maxDD * 2, ddType);
    envelopes.push({ data: p.curve, borderColor: 'rgba(59,130,246,0.04)', borderWidth: 1, fill: false, pointRadius: 0, tension: 0.1 });
  }
  chartInstances['monteCarloChart'] = new Chart(document.getElementById('monteCarloChart'), {
    type: 'line',
    data: { labels: Array.from({ length: numTrades + 1 }, (_, i) => i), datasets: envelopes },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: grid } }, y: { grid: { color: grid } } }, animation: { duration: 0 } }
  });

  destroyChart('distributionChart');
  chartInstances['distributionChart'] = new Chart(document.getElementById('distributionChart'), {
    data: {
      labels: path.pnlHist.map((_, i) => `T${i+1}`),
      datasets: [
        { type: 'bar', data: path.pnlHist, backgroundColor: path.pnlHist.map(v => v >= 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'), borderRadius: 3, barPercentage: 0.55, yAxisID: 'yL' },
        { type: 'line', data: path.curve.slice(1), borderColor: '#8b5cf6', borderWidth: 1.5, fill: false, pointRadius: 0, yAxisID: 'yR' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, yL: { position: 'left', grid: { color: grid } }, yR: { position: 'right', grid: { display: false } } } }
  });

  const rBrackets = ['<-3R', '-3→-2R', '-2→-1R', '-1→0R', '0→1R', '1→2R', '2→3R', '3→4R', '>4R'];
  const counts = new Array(9).fill(0);
  const base = capital * riskPct;
  path.pnlHist.forEach(v => {
    const r = v / base;
    if (r < -3) counts[0]++;
    else if (r >= -3 && r < -2) counts[1]++;
    else if (r >= -2 && r < -1) counts[2]++;
    else if (r >= -1 && r < 0) counts[3]++;
    else if (r >= 0 && r < 1) counts[4]++;
    else if (r >= 1 && r < 2) counts[5]++;
    else if (r >= 2 && r < 3) counts[6]++;
    else if (r >= 3 && r < 4) counts[7]++;
    else counts[8]++;
  });

  destroyChart('histogramChart');
  chartInstances['histogramChart'] = new Chart(document.getElementById('histogramChart'), {
    data: {
      labels: rBrackets,
      datasets: [{ type: 'bar', data: counts, backgroundColor: counts.map((_, i) => i < 4 ? 'rgba(239,68,68,0.65)' : 'rgba(16,185,129,0.65)'), borderRadius: 4, barPercentage: 0.7 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid } } } }
  });
}


// ============================================================
// FIRM DIRECTORY (PropFirmMatch-style)
// ============================================================
function renderFirmDirectory(filter) {
  ['all','futures','forex'].forEach(f => {
    const el = document.getElementById('fd-' + f);
    if (el) el.classList.toggle('active', f === filter);
  });

  const grid = document.getElementById('firmDirectoryGrid');
  grid.innerHTML = '';

  Object.keys(FIRMS).forEach(k => {
    const f = FIRMS[k];
    if (filter !== 'all' && f.cat !== filter) return;

    const maxSizeStr = f.maxFunded >= 1000000 ? '$' + (f.maxFunded / 1000000).toFixed(1) + 'M' : '$' + (f.maxFunded / 1000) + 'K';
    const planCount = Object.values(f.sizes).reduce((n, s) => n + Object.keys(s).length, 0);
    const sizeOptions = Object.keys(f.sizes).map(s => '$' + parseInt(s).toLocaleString()).join(', ');

    // Build plan details table
    let planRows = '';
    Object.keys(f.sizes).forEach(sz => {
      Object.keys(f.sizes[sz]).forEach(t => {
        const p = f.sizes[sz][t];
        const ddLabel = p.type === 'trailing' ? 'Trail' : p.type === 'eod' ? 'EOD' : 'Static';
        planRows += `<div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr 1fr; gap:4px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:10px;" class="mono">
          <span style="color:var(--text);">$${parseInt(sz).toLocaleString()}</span>
          <span style="color:var(--green);">$${p.target.toLocaleString()}</span>
          <span style="color:var(--red);">$${p.maxDD.toLocaleString()}</span>
          <span style="color:var(--muted);">${ddLabel}</span>
          <span style="color:var(--muted);">${p.minDays}d</span>
        </div>`;
      });
    });

    const card = document.createElement('div');
    card.className = 'firm-card';
    card.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:${f.color}20;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:16px;font-weight:800;color:${f.color};">${f.name.charAt(0)}</span>
          </div>
          <div>
            <div style="font-size:15px; font-weight:700;">${f.name}</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <span class="badge badge-b">${f.cat.toUpperCase()}</span>
              <span class="badge badge-p">${planCount} plans</span>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:700;color:${f.color};font-family:'JetBrains Mono',monospace;">${f.payout}%</div>
          <div style="font-size:9px;color:var(--muted);">payout split</div>
        </div>
      </div>

      <p style="font-size:12px; color:var(--muted); margin-bottom:14px; line-height:1.5;">${f.description}</p>

      <div style="background:${f.color}12;border:1px solid ${f.color}30;border-radius:8px;padding:10px 14px;margin-bottom:14px;">
        <p style="font-size:11px;color:${f.color};font-weight:600;">⭐ ${f.feature}</p>
      </div>

      <div class="grid grid-cols-3 gap-2" style="margin-bottom:14px;">
        <div style="background:var(--card-hi);border-radius:8px;padding:10px;">
          <div style="font-size:9px;color:var(--muted);margin-bottom:3px;">MAX FUNDED</div>
          <div class="mono" style="font-size:13px;font-weight:700;">${maxSizeStr}</div>
        </div>
        <div style="background:var(--card-hi);border-radius:8px;padding:10px;">
          <div style="font-size:9px;color:var(--muted);margin-bottom:3px;">MAX PAYOUT</div>
          <div class="mono" style="font-size:13px;font-weight:700;">${f.maxPayout}%</div>
        </div>
        <div style="background:var(--card-hi);border-radius:8px;padding:10px;">
          <div style="font-size:9px;color:var(--muted);margin-bottom:3px;">SIZES</div>
          <div class="mono" style="font-size:11px;font-weight:600;">${Object.keys(f.sizes).length}</div>
        </div>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;">
        <span class="badge ${f.scaling ? 'badge-g' : 'badge-r'}">${f.scaling ? '✓ Scaling' : '✗ No Scaling'}</span>
        <span class="badge ${f.refund ? 'badge-g' : 'badge-r'}">${f.refund ? '✓ Refund' : '✗ No Refund'}</span>
        <span class="badge ${f.newsTrading ? 'badge-g' : 'badge-r'}">${f.newsTrading ? '✓ News' : '✗ No News'}</span>
        <span class="badge ${f.weekendHold ? 'badge-g' : 'badge-r'}">${f.weekendHold ? '✓ Weekend' : '✗ No Weekend'}</span>
        <span class="badge ${f.ea ? 'badge-g' : 'badge-r'}">${f.ea ? '✓ EA/Bots' : '✗ No EA'}</span>
      </div>

      <!-- Plan Table -->
      <div style="background:var(--card-hi);border-radius:8px;padding:12px;border:1px solid var(--border);">
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr 1fr; gap:4px; padding-bottom:6px; border-bottom:1px solid var(--border-hi); margin-bottom:4px;">
          <span style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;">Size</span>
          <span style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;">Target</span>
          <span style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;">Max DD</span>
          <span style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;">DD Type</span>
          <span style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;">Min Days</span>
        </div>
        ${planRows}
      </div>

      <!-- Promo Code -->
      <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(59,130,246,0.1));border:1px solid rgba(139,92,246,0.2);border-radius:8px;padding:10px 14px;">
        <div>
          <span style="font-size:10px;color:var(--muted);">Discount Code:</span>
          <span class="mono" style="font-size:14px;font-weight:700;color:var(--purple);margin-left:6px;">EDGE</span>
        </div>
        <span class="badge badge-g">${f.promoDiscount}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterFirms(f) { renderFirmDirectory(f); }


// ============================================================
// SMART MATCHER
// ============================================================
function runMatcher() {
  const wr = parseFloat(document.getElementById('m-wr-in').value) / 100;
  const rr = parseFloat(document.getElementById('m-rr-in').value);
  const riskPct = parseFloat(document.getElementById('m-risk-in').value) / 100;
  const tpd = parseFloat(document.getElementById('m-tpd-in').value);
  const ddPref = document.getElementById('m-dd-in').value;
  const consPref = document.getElementById('m-cons-in').value;
  const daysPref = document.getElementById('m-days-in').value;
  const mktPref = document.getElementById('m-market-in').value;

  const results = [];

  Object.keys(FIRMS).forEach(k => {
    const f = FIRMS[k];
    if (mktPref !== 'all' && f.cat !== mktPref) return;

    let bestScore = 0, bestSize = null, bestType = null;

    Object.keys(f.sizes).forEach(sz => {
      Object.keys(f.sizes[sz]).forEach(t => {
        const plan = f.sizes[sz][t];
        const cap = parseFloat(sz);
        const reqReturnPct = plan.target / cap;

        const expectancy = (wr * rr) - (1 - wr);
        const achievability = Math.min(30, Math.max(0, (expectancy / reqReturnPct) * 15));

        let ddScore = 10;
        if (ddPref === 'any') ddScore = 20;
        else if (ddPref === plan.type) ddScore = 25;
        else if ((ddPref === 'static' && plan.type === 'eod') || (ddPref === 'eod' && plan.type === 'static')) ddScore = 15;

        const c = parseInt(plan.consistency);
        let consScore = 15;
        if (consPref === 'any') consScore = 15;
        else if (consPref === 'none' && c === 0) consScore = 20;
        else if (consPref === 'none' && c > 0) consScore = 5;
        else if (consPref === 'relaxed' && c >= 40) consScore = 20;
        else if (consPref === 'relaxed' && c === 30) consScore = 15;
        else if (consPref === 'relaxed' && c <= 20) consScore = 8;
        else if (consPref === 'strict') consScore = 20 - Math.max(0, (c - 20) / 3);

        const minD = plan.minDays;
        let daysScore = 10;
        if (daysPref === 'any') daysScore = 12;
        else if (daysPref === 'quick' && minD <= 3) daysScore = 15;
        else if (daysPref === 'moderate' && minD >= 4 && minD <= 7) daysScore = 15;
        else if (daysPref === 'extended' && minD >= 8) daysScore = 15;
        else daysScore = 5;

        const leniency = 10 - (c > 0 ? 3 : 0) - (plan.type === 'trailing' ? 2 : 0) - (minD > 7 ? 2 : 0);
        const total = achievability + ddScore + consScore + daysScore + leniency;
        if (total > bestScore) { bestScore = total; bestSize = sz; bestType = t; }
      });
    });

    if (bestSize) {
      results.push({ key: k, firm: f, score: Math.min(100, Math.round(bestScore)), size: bestSize, type: bestType, plan: f.sizes[bestSize][bestType] });
    }
  });

  results.sort((a, b) => b.score - a.score);
  document.getElementById('matchCount').textContent = `${results.length} firms matched`;
  const container = document.getElementById('matchResults');
  container.innerHTML = '';

  results.forEach((r, idx) => {
    const barColor = r.score >= 75 ? 'var(--green)' : r.score >= 50 ? 'var(--amber)' : 'var(--red)';
    const badge = r.score >= 75 ? 'badge-g' : r.score >= 50 ? 'badge-a' : 'badge-r';
    const ddLabel = r.plan.type === 'trailing' ? 'Intraday Trail' : r.plan.type === 'eod' ? 'EOD Trail' : 'Static Floor';
    const consLabel = parseInt(r.plan.consistency) > 0 ? r.plan.consistency + '% cap' : 'None';

    const row = document.createElement('div');
    row.className = 'match-row';
    row.innerHTML = `
      <div style="width:34px;height:34px;border-radius:9px;background:${r.firm.color}20;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:${r.firm.color};flex-shrink:0;">${idx + 1}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
          <span style="font-size:13px;font-weight:700;">${r.firm.name}</span>
          <span class="badge ${badge}">${r.score}% match</span>
          <span class="badge badge-b">${r.firm.cat.toUpperCase()}</span>
          <span class="badge badge-p">Code: EDGE</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
          <span style="font-size:10px;color:var(--muted);">$${parseInt(r.size).toLocaleString()} — ${r.type}</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span style="font-size:9px;color:var(--muted);">Target: <b style="color:var(--text);">$${r.plan.target.toLocaleString()}</b></span>
          <span style="font-size:9px;color:var(--muted);">MaxDD: <b style="color:var(--text);">$${r.plan.maxDD.toLocaleString()}</b></span>
          <span style="font-size:9px;color:var(--muted);">DD: <b style="color:var(--text);">${ddLabel}</b></span>
          <span style="font-size:9px;color:var(--muted);">Consistency: <b style="color:var(--text);">${consLabel}</b></span>
          <span style="font-size:9px;color:var(--muted);">Min Days: <b style="color:var(--text);">${r.plan.minDays}</b></span>
        </div>
        <div class="match-bar-bg" style="margin-top:8px;">
          <div style="width:${r.score}%;height:100%;background:${barColor};border-radius:4px;transition:width 0.8s;"></div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:22px;font-weight:700;color:${r.firm.color};font-family:'JetBrains Mono',monospace;">${r.firm.payout}%</div>
        <button onclick="loadFirmIntoSim('${r.key}','${r.size}','${r.type}')" style="margin-top:6px;background:${r.firm.color}20;color:${r.firm.color};border:1px solid ${r.firm.color}40;border-radius:6px;padding:5px 12px;font-size:10px;font-weight:700;cursor:pointer;">Simulate →</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function loadFirmIntoSim(firmKey, size, type) {
  switchTab('sim', document.querySelectorAll('header .tab-btn')[0]);
  document.getElementById('propFirm').value = firmKey;
  updateSizes();
  document.getElementById('propSize').value = size;
  updateTypes();
  document.getElementById('propType').value = type;
  applyPreset();
}


// ============================================================
// CALCULATORS
// ============================================================
function calcPosition() {
  const bal = parseFloat(document.getElementById('calc-bal').value);
  const risk = parseFloat(document.getElementById('calc-risk').value) / 100;
  const sl = parseFloat(document.getElementById('calc-sl').value);
  const tv = parseFloat(document.getElementById('calc-tv').value);

  const dollarRisk = bal * risk;
  const contracts = Math.floor(dollarRisk / (sl * tv));
  const actualRisk = contracts * sl * tv;

  document.getElementById('calcResult').style.display = 'block';
  document.getElementById('calcResult').innerHTML = `
    <div class="space-y-3">
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Dollar Risk:</span><span class="mono" style="font-size:13px;font-weight:600;color:var(--amber);">$${dollarRisk.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Max Contracts/Lots:</span><span class="mono" style="font-size:18px;font-weight:700;color:var(--green);">${contracts}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Actual Risk:</span><span class="mono" style="font-size:13px;font-weight:600;">$${actualRisk.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Risk % of Account:</span><span class="mono" style="font-size:13px;font-weight:600;">${(actualRisk/bal*100).toFixed(3)}%</span></div>
      <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;">
        <p style="font-size:10px;color:var(--muted);">With ${sl} tick stop and $${tv}/tick value, ${contracts} contract(s) keep you within risk tolerance.</p>
      </div>
    </div>
  `;
}

function calcRoadmap() {
  const target = parseFloat(document.getElementById('road-target').value);
  const wr = parseFloat(document.getElementById('road-wr').value) / 100;
  const avgW = parseFloat(document.getElementById('road-avgw').value);
  const avgL = parseFloat(document.getElementById('road-avgl').value);
  const tpd = parseFloat(document.getElementById('road-tpd').value);

  const expectPerTrade = (wr * avgW) - ((1 - wr) * avgL);
  const tradesToTarget = Math.ceil(target / expectPerTrade);
  const daysToTarget = Math.ceil(tradesToTarget / tpd);

  document.getElementById('roadResult').style.display = 'block';
  document.getElementById('roadResult').innerHTML = `
    <div class="space-y-3">
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Expectancy/Trade:</span><span class="mono" style="font-size:13px;font-weight:600;color:${expectPerTrade > 0 ? 'var(--green)' : 'var(--red)'};">$${expectPerTrade.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Trades to Target:</span><span class="mono" style="font-size:18px;font-weight:700;color:var(--blue);">${expectPerTrade > 0 ? tradesToTarget : '∞'}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Est. Trading Days:</span><span class="mono" style="font-size:18px;font-weight:700;color:var(--purple);">${expectPerTrade > 0 ? daysToTarget : '∞'}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Daily Expectancy:</span><span class="mono" style="font-size:13px;font-weight:600;">$${(expectPerTrade * tpd).toFixed(2)}</span></div>
      <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;">
        <p style="font-size:10px;color:var(--muted);">${expectPerTrade > 0 ? `At ${tpd} trades/day with $${expectPerTrade.toFixed(0)} edge, target achievable in ~${daysToTarget} days.` : 'Negative expectancy — strategy cannot reach target.'}</p>
      </div>
    </div>
  `;
}

function calcPayout() {
  const fee = parseFloat(document.getElementById('pay-fee').value);
  const funded = parseFloat(document.getElementById('pay-funded').value);
  const profitPct = parseFloat(document.getElementById('pay-profit').value) / 100;
  const split = parseFloat(document.getElementById('pay-split').value) / 100;
  const months = parseInt(document.getElementById('pay-months').value);

  const monthlyProfit = funded * profitPct;
  const monthlyPayout = monthlyProfit * split;
  const totalPayout = monthlyPayout * months;
  const roi = ((totalPayout - fee) / fee * 100);
  const breakeven = fee / monthlyPayout;

  document.getElementById('payResult').style.display = 'block';
  document.getElementById('payResult').innerHTML = `
    <div class="space-y-3">
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Monthly Profit:</span><span class="mono" style="font-size:13px;font-weight:600;color:var(--green);">$${monthlyProfit.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Your Payout/Mo:</span><span class="mono" style="font-size:18px;font-weight:700;color:var(--green);">$${monthlyPayout.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">${months}-Month Total:</span><span class="mono" style="font-size:18px;font-weight:700;color:var(--blue);">$${totalPayout.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">ROI on Fee:</span><span class="mono" style="font-size:15px;font-weight:700;color:var(--purple);">${roi.toFixed(0)}%</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:11px;color:var(--muted);">Breakeven:</span><span class="mono" style="font-size:13px;font-weight:600;">${breakeven.toFixed(1)} months</span></div>
      <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;">
        <p style="font-size:10px;color:var(--muted);">Use code <b style="color:var(--purple);">EDGE</b> to reduce the eval fee and improve ROI further.</p>
      </div>
    </div>
  `;
}


// ============================================================
// EVAL TRACKER
// ============================================================
let evals = JSON.parse(localStorage.getItem('propfirmedge_evals') || '[]');

function saveEvals() {
  localStorage.setItem('propfirmedge_evals', JSON.stringify(evals));
}

function addEval() {
  const firmKey = document.getElementById('track-firm').value;
  const firm = FIRMS[firmKey];
  evals.push({
    id: Date.now(),
    firm: firm.name,
    firmKey: firmKey,
    color: firm.color,
    size: parseFloat(document.getElementById('track-size').value),
    target: parseFloat(document.getElementById('track-target').value),
    maxDD: parseFloat(document.getElementById('track-dd').value),
    pnl: parseFloat(document.getElementById('track-pnl').value),
    days: parseInt(document.getElementById('track-days').value),
    status: document.getElementById('track-status').value,
    date: new Date().toISOString().split('T')[0]
  });
  saveEvals();
  renderTracker();
}

function updateEvalPnl(id, val) {
  const ev = evals.find(e => e.id === id);
  if (ev) { ev.pnl = parseFloat(val) || 0; saveEvals(); renderTracker(); }
}

function updateEvalDays(id, val) {
  const ev = evals.find(e => e.id === id);
  if (ev) { ev.days = parseInt(val) || 0; saveEvals(); renderTracker(); }
}

function updateEvalStatus(id, val) {
  const ev = evals.find(e => e.id === id);
  if (ev) { ev.status = val; saveEvals(); renderTracker(); }
}

function removeEval(id) {
  evals = evals.filter(e => e.id !== id);
  saveEvals();
  renderTracker();
}

function clearEvals() {
  if (confirm('Clear all tracked evaluations?')) {
    evals = [];
    saveEvals();
    renderTracker();
  }
}

function renderTracker() {
  const list = document.getElementById('trackerList');

  // Stats
  const total = evals.length;
  const passed = evals.filter(e => e.status === 'passed').length;
  const failed = evals.filter(e => e.status === 'failed').length;
  const active = evals.filter(e => e.status === 'active').length;
  document.getElementById('ts-total').textContent = total;
  document.getElementById('ts-passed').textContent = passed;
  document.getElementById('ts-failed').textContent = failed;
  document.getElementById('ts-active').textContent = active;
  document.getElementById('ts-rate').textContent = (passed + failed) > 0 ? ((passed / (passed + failed)) * 100).toFixed(0) + '%' : '—';

  if (evals.length === 0) {
    list.innerHTML = '<div class="card p-6 text-center" style="color:var(--muted);"><p>No evaluations tracked yet.</p></div>';
    return;
  }

  list.innerHTML = '';
  evals.forEach(ev => {
    const progress = ev.target > 0 ? Math.min(100, Math.max(0, (ev.pnl / ev.target) * 100)) : 0;
    const ddUsed = ev.pnl < 0 ? Math.min(100, (Math.abs(ev.pnl) / ev.maxDD) * 100) : 0;
    const statusColor = ev.status === 'passed' ? 'var(--green)' : ev.status === 'failed' ? 'var(--red)' : 'var(--blue)';
    const statusBadge = ev.status === 'passed' ? 'badge-g' : ev.status === 'failed' ? 'badge-r' : 'badge-b';

    const row = document.createElement('div');
    row.className = 'tracker-row';
    row.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:8px;background:${ev.color}20;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:12px;font-weight:800;color:${ev.color};">${ev.firm.charAt(0)}</span>
          </div>
          <div>
            <span style="font-size:13px;font-weight:700;">${ev.firm}</span>
            <span class="mono" style="font-size:10px;color:var(--muted);margin-left:8px;">$${ev.size.toLocaleString()}</span>
          </div>
          <span class="badge ${statusBadge}">${ev.status.toUpperCase()}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <select onchange="updateEvalStatus(${ev.id}, this.value)" style="background:var(--card);border:1px solid var(--border);border-radius:5px;color:var(--text);font-size:10px;padding:3px 6px;">
            <option value="active" ${ev.status==='active'?'selected':''}>Active</option>
            <option value="passed" ${ev.status==='passed'?'selected':''}>Passed</option>
            <option value="failed" ${ev.status==='failed'?'selected':''}>Failed</option>
          </select>
          <button onclick="removeEval(${ev.id})" style="background:var(--red-dim);color:var(--red);border:none;border-radius:5px;padding:4px 8px;font-size:9px;font-weight:700;cursor:pointer;">✕</button>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-3" style="margin-bottom:10px;">
        <div>
          <span style="font-size:9px;color:var(--muted);display:block;">Current PnL</span>
          <input type="number" value="${ev.pnl}" onchange="updateEvalPnl(${ev.id}, this.value)" class="inp" style="padding:6px 8px;font-size:11px;margin-top:3px;">
        </div>
        <div>
          <span style="font-size:9px;color:var(--muted);display:block;">Days Traded</span>
          <input type="number" value="${ev.days}" onchange="updateEvalDays(${ev.id}, this.value)" class="inp" style="padding:6px 8px;font-size:11px;margin-top:3px;">
        </div>
        <div>
          <span style="font-size:9px;color:var(--muted);display:block;">Target</span>
          <span class="mono" style="font-size:13px;font-weight:600;color:var(--green);">$${ev.target.toLocaleString()}</span>
        </div>
        <div>
          <span style="font-size:9px;color:var(--muted);display:block;">Max DD</span>
          <span class="mono" style="font-size:13px;font-weight:600;color:var(--red);">$${ev.maxDD.toLocaleString()}</span>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:center;">
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="font-size:9px;color:var(--muted);">Target Progress</span>
            <span class="mono" style="font-size:10px;color:var(--green);">${progress.toFixed(1)}%</span>
          </div>
          <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;overflow:hidden;">
            <div style="width:${progress}%;height:100%;background:var(--green);border-radius:4px;transition:width 0.5s;"></div>
          </div>
        </div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="font-size:9px;color:var(--muted);">DD Used</span>
            <span class="mono" style="font-size:10px;color:var(--red);">${ddUsed.toFixed(1)}%</span>
          </div>
          <div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;overflow:hidden;">
            <div style="width:${ddUsed}%;height:100%;background:var(--red);border-radius:4px;transition:width 0.5s;"></div>
          </div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:9px;color:var(--muted);">Started: ${ev.date}</div>
    `;
    list.appendChild(row);
  });
}


// ============================================================
// BOOT
// ============================================================
window.onload = () => {
  initFirmDropdown();
  renderTracker();
};
