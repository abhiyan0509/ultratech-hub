/* ═══════════════════════════════════════════════════════════════
   UltraTech Intelligence Hub V2 — Dashboard JavaScript
   ═══════════════════════════════════════════════════════════════ */

const API_BASE = '';
let appData = {};
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadAllData();
});

// ─── Theme Management ───────────────────────────────────────────
function initTheme() {
    const themeSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ─── Tab Switching ──────────────────────────────────────────────
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ─── Data Loading ───────────────────────────────────────────────
async function loadAllData() {
    try {
        const datasets = ['company_info', 'financials', 'ma_deals', 'competitors', 'news', 'industry', 'outlook'];
        const results = await Promise.allSettled(
            datasets.map(ds => fetch(`${API_BASE}/api/data/${ds}`).then(r => {
                if (!r.ok) throw new Error(`${ds}: ${r.status}`);
                return r.json();
            }))
        );
        datasets.forEach((ds, i) => {
            if (results[i].status === 'fulfilled') appData[ds] = results[i].value;
            else console.warn(`Failed to load ${ds}:`, results[i].reason);
        });

        renderOverview();
        renderOutlook();
        renderMA();
        renderFinancials();
        renderCompetitors();
        updateStatus('Live', true);

        // Show last updated
        const status = await fetch(`${API_BASE}/api/status`).then(r => r.json()).catch(() => null);
        if (status) {
            const ts = new Date(status.server_time);
            document.getElementById('lastUpdated').textContent =
                `Updated: ${ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
        }
    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error loading data', false);
    }
}

async function refreshData() {
    updateStatus('Refreshing...', false);
    try {
        await fetch(`${API_BASE}/api/refresh`, { method: 'POST' });
        updateStatus('Agents running...', false);
        setTimeout(() => loadAllData(), 5000);
    } catch (e) {
        updateStatus('Refresh failed', false);
    }
}

function updateStatus(text, isLive) {
    const badge = document.getElementById('statusBadge');
    badge.querySelector('span:last-child').textContent = text;
    const dot = badge.querySelector('.status-dot');
    if (isLive) dot.classList.add('live');
    else dot.classList.remove('live');
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────
function renderOverview() {
    const ci = appData.company_info;
    const fin = appData.financials;
    const news = appData.news;
    const outlook = appData.outlook;

    if (!ci) return;

    // Executive summary from outlook
    const execEl = document.getElementById('execSummary');
    if (outlook && outlook.executive_summary) {
        execEl.textContent = outlook.executive_summary;
    } else {
        execEl.textContent = ci.description || '';
    }
    execEl.classList.remove('shimmer');

    // Strategic Pillars (Replacing "essay" description)
    if (ci.strategic_focus) {
        document.getElementById('strategicPillars').innerHTML = ci.strategic_focus.map(p =>
            `<div class="strategic-pill">
                <span class="pill-icon">${p.icon || '🎯'}</span>
                <span class="pill-text">${p.title}</span>
            </div>`
        ).join('');
    } else {
        // Fallback pillars if not in data
        const fallbackPillars = [
            { title: 'Capacity Leader', icon: '🏗️' },
            { title: 'M&A Specialist', icon: '🤝' },
            { title: 'Green Energy', icon: '🍃' },
            { title: 'Pan-India Reach', icon: '🇮🇳' }
        ];
        document.getElementById('strategicPillars').innerHTML = fallbackPillars.map(p =>
            `<div class="strategic-pill">
                <span class="pill-icon">${p.icon}</span>
                <span class="pill-text">${p.title}</span>
            </div>`
        ).join('');
    }

    // Info grid
    const infoItems = [
        ['CEO', ci.ceo], ['Chairman', ci.chairman], ['Parent Group', ci.parent],
        ['Headquarters', ci.headquarters], ['Capacity', ci.capacity_mtpa],
        ['Plants', ci.plants], ['BSE', ci.bse_code], ['NSE', ci.nse_code],
    ];
    document.getElementById('companyInfoGrid').innerHTML = infoItems.map(([label, value]) =>
        `<div class="info-item"><span class="info-label">${label}</span><span class="info-value">${value || 'N/A'}</span></div>`
    ).join('');

    // Key metrics
    if (fin && fin.companies && fin.companies['UltraTech Cement']) {
        const ut = fin.companies['UltraTech Cement'];
        setMetric('metricMarketCap', ut.market_cap || 'N/A');
        setMetric('metricPrice', ut.current_price || 'N/A');
        setMetric('metricPE', ut.pe_ratio || 'N/A');
        const ret = ut.ytd_return || 'N/A';
        const retClass = ut.ytd_return_raw > 0 ? 'positive' : ut.ytd_return_raw < 0 ? 'negative' : '';
        setMetric('metricReturn', ret, retClass);

        if (ut.price_history && ut.price_history.length > 0) renderStockChart(ut.price_history);
    }
    setMetric('metricCapacity', ci.capacity_mtpa || '183+');
    document.querySelectorAll('.metric-card').forEach(c => c.classList.remove('shimmer'));

    // Milestones
    if (ci.key_milestones) {
        document.getElementById('milestoneTimeline').innerHTML = ci.key_milestones.map(m =>
            `<div class="timeline-item">
                <div class="timeline-year">${m.year}</div>
                <div class="timeline-event">${m.event}</div>
            </div>`
        ).join('');
    }

    // Advantages
    if (ci.competitive_advantages) {
        document.getElementById('advantageList').innerHTML = ci.competitive_advantages.map(a =>
            `<li>${a}</li>`
        ).join('');
    }

    // News — CLICKABLE links
    if (news && news.news) {
        document.getElementById('newsGrid').innerHTML = news.news.slice(0, 12).map(n => {
            const url = n.url || '#';
            return `<a href="${url}" target="_blank" rel="noopener" class="news-card">
                <div class="news-title">${n.title}</div>
                <div class="news-meta">
                    <span>${n.source || ''}</span>
                    <span>${n.date || ''}</span>
                </div>
                <div class="news-link-icon">Open article &#x2197;</div>
            </a>`;
        }).join('');
    }
}

function setMetric(id, value, className) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || 'N/A';
        if (className) el.className = `metric-value ${className}`;
    }
}

function renderStockChart(priceHistory) {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    const step = Math.max(1, Math.floor(priceHistory.length / 60));
    const sampled = priceHistory.filter((_, i) => i % step === 0 || i === priceHistory.length - 1);
    if (charts.stock) charts.stock.destroy();
    charts.stock = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampled.map(p => {
                const d = new Date(p.date);
                return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'ULTRACEMCO', data: sampled.map(p => p.close),
                borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)',
                fill: true, tension: 0.3, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2,
            }]
        },
        options: chartOptions('Rs.')
    });
}

// ─── OUTLOOK TAB ────────────────────────────────────────────────
function renderOutlook() {
    const ol = appData.outlook;
    if (!ol) {
        document.getElementById('outlookSummary').textContent = 'Outlook data not yet available. Agents are collecting data...';
        document.getElementById('outlookSummary').classList.remove('shimmer');
        return;
    }

    // Summary
    const sumEl = document.getElementById('outlookSummary');
    sumEl.textContent = ol.executive_summary || '';
    sumEl.classList.remove('shimmer');

    // Predicted moves
    if (ol.predicted_next_moves) {
        document.getElementById('predictedMoves').innerHTML = ol.predicted_next_moves.map(m =>
            `<div class="prediction-item">
                <div class="prediction-title">
                    ${m.move}
                    <span class="badge ${(m.probability || '').toLowerCase()}">${m.probability || ''}</span>
                </div>
                <div class="prediction-desc">${m.rationale || ''}</div>
            </div>`
        ).join('');
    }

    // Future outlook
    if (ol.future_outlook) {
        document.getElementById('futureOutlook').innerHTML = ol.future_outlook.map(o =>
            `<div class="prediction-item">
                <div class="prediction-title">
                    ${o.title}
                    <span class="badge ${(o.probability || '').toLowerCase()}">${o.probability || ''}</span>
                </div>
                <div class="prediction-desc">${o.description || ''}</div>
                ${o.rationale ? `<div class="rationale-box"><strong>Rationale:</strong> ${o.rationale}</div>` : ''}
                <div class="prediction-meta" style="margin-top:8px">
                    <span style="font-size:11px;color:var(--text-muted)">${o.timeframe || ''}</span>
                </div>
            </div>`
        ).join('');
    }

    // Risks
    if (ol.risk_factors) {
        document.getElementById('riskFactors').innerHTML = ol.risk_factors.map(r =>
            `<div class="risk-item ${(r.severity || '').toLowerCase()}">
                <div class="risk-title">
                    ${r.risk}
                    <span class="badge ${(r.severity || '').toLowerCase()}" style="margin-left:8px">${r.severity || ''}</span>
                </div>
                <div class="risk-detail">${r.mitigation || ''}</div>
                ${r.rationale ? `<div class="rationale-box"><strong>Why:</strong> ${r.rationale}</div>` : ''}
            </div>`
        ).join('');
    }

    // Metrics to watch
    if (ol.key_metrics_to_watch) {
        document.getElementById('metricsToWatch').innerHTML = ol.key_metrics_to_watch.map(m =>
            `<div class="watch-item">
                <div class="watch-metric">${m.metric}</div>
                <div class="watch-value">Current: ${m.current_value || 'N/A'}</div>
                <div class="watch-why">${m.significance || ''}</div>
            </div>`
        ).join('');
    }

    // Talking points
    if (ol.interview_talking_points) {
        document.getElementById('talkingPoints').innerHTML = ol.interview_talking_points.map(tp =>
            `<div class="tp-card">
                <div class="tp-point">${tp.point}</div>
                <div class="tp-data">${tp.supporting_data || ''}</div>
            </div>`
        ).join('');
    }
}

// ─── M&A TAB ────────────────────────────────────────────────────
function renderMA() {
    const ma = appData.ma_deals;
    if (!ma) return;

    if (ma.strategy_summary) {
        const ss = ma.strategy_summary;
        document.getElementById('maStrategySummary').innerHTML = `
            <h3 class="section-title">M&A Strategy Overview</h3>
            <p style="color:var(--text-secondary);line-height:1.7;margin-bottom:14px">${ss.approach}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px">
                <div class="info-item"><span class="info-label">Total Deals (Since 2014)</span><span class="info-value">${ss.total_deals_since_2014}</span></div>
                <div class="info-item"><span class="info-label">Capacity Added via M&A</span><span class="info-value">${ss.total_capacity_added_via_ma_mtpa} MTPA</span></div>
            </div>
            <p style="color:var(--yellow);font-size:13px;font-style:italic">${ss.competitive_context}</p>
        `;
    }

    if (ma.deals) {
        document.getElementById('maDealsGrid').innerHTML = ma.deals.map((deal, i) => {
            const statusClass = deal.status === 'Completed' ? 'completed' :
                deal.status === 'In Discussions' ? 'in-progress' : 'stake';
            return `
            <div class="deal-card" id="deal-${i}">
                <div class="deal-header" onclick="toggleDeal(${i})">
                    <div class="deal-title-section">
                        <div class="deal-year">${deal.year}</div>
                        <div>
                            <div class="deal-target">${deal.target}</div>
                            <div class="deal-value">${deal.deal_value} | ${deal.stake_acquired}</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px">
                        <span class="deal-status ${statusClass}">${deal.status}</span>
                        <span class="deal-expand-icon">&#x25BC;</span>
                    </div>
                </div>
                <div class="deal-body">
                    <div class="deal-body-inner">
                        <div class="deal-section">
                            <h4>Rationale</h4>
                            <ul>${(deal.rationale || []).map(r => `<li>${r}</li>`).join('')}</ul>
                        </div>
                        <div class="deal-section">
                            <h4>Risks</h4>
                            <ul>${(deal.risks || []).map(r => `<li>${r}</li>`).join('')}</ul>
                        </div>
                        ${deal.timeline ? `
                        <div class="deal-section" style="grid-column:1/-1">
                            <h4>Timeline</h4>
                            <ul>${deal.timeline.map(t => `<li><strong>${t.date}:</strong> ${t.event}</li>`).join('')}</ul>
                        </div>` : ''}
                        <div class="deal-impact">
                            <strong>Strategic Impact:</strong> ${deal.strategic_impact || ''}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
}

function toggleDeal(index) {
    document.getElementById(`deal-${index}`).classList.toggle('expanded');
}

// ─── FINANCIALS TAB ─────────────────────────────────────────────
function renderFinancials() {
    const fin = appData.financials;
    if (!fin || !fin.companies) return;
    const companies = Object.keys(fin.companies);

    // Table
    const table = document.getElementById('financialTable');
    const thead = table.querySelector('thead tr');
    thead.innerHTML = '<th>Metric</th>' + companies.map(c =>
        `<th class="${c === 'UltraTech Cement' ? 'highlight-col' : ''}">${shortName(c)}</th>`
    ).join('');

    if (fin.comparison_metrics) {
        table.querySelector('tbody').innerHTML = fin.comparison_metrics.map(row =>
            '<tr><td>' + row.metric + '</td>' + companies.map(c =>
                `<td class="${c === 'UltraTech Cement' ? 'highlight-col' : ''}">${row[c] || 'N/A'}</td>`
            ).join('') + '</tr>'
        ).join('');
    }

    // Market cap chart
    const mcCtx = document.getElementById('marketCapChart');
    if (mcCtx) {
        const mcData = companies.map(c => ({
            name: shortName(c),
            value: fin.companies[c]?.market_cap_raw || 0
        })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

        if (charts.marketCap) charts.marketCap.destroy();
        charts.marketCap = new Chart(mcCtx, {
            type: 'bar',
            data: {
                labels: mcData.map(d => d.name),
                datasets: [{
                    label: 'Market Cap (Cr)',
                    data: mcData.map(d => d.value / 1e7),
                    backgroundColor: mcData.map((_, i) => i === 0 ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.25)'),
                    borderColor: mcData.map((_, i) => i === 0 ? '#6366f1' : 'rgba(99,102,241,0.4)'),
                    borderWidth: 1, borderRadius: 6,
                }]
            },
            options: { ...chartOptions('Rs.', ' Cr'), indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // Price comparison chart
    const pcCtx = document.getElementById('priceCompChart');
    if (pcCtx) {
        const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
        const datasets = [];
        let commonLabels = [];

        companies.forEach((c, i) => {
            const hist = fin.companies[c]?.price_history;
            if (hist && hist.length > 0) {
                const step = Math.max(1, Math.floor(hist.length / 50));
                const sampled = hist.filter((_, j) => j % step === 0 || j === hist.length - 1);
                if (commonLabels.length === 0) {
                    commonLabels = sampled.map(p => new Date(p.date).toLocaleDateString('en-IN', { month: 'short' }));
                }
                const base = sampled[0].close;
                datasets.push({
                    label: shortName(c),
                    data: sampled.map(p => ((p.close - base) / base * 100).toFixed(2)),
                    borderColor: colors[i % colors.length], backgroundColor: 'transparent',
                    tension: 0.3, pointRadius: 0, borderWidth: c === 'UltraTech Cement' ? 3 : 1.5,
                });
            }
        });

        if (charts.priceComp) charts.priceComp.destroy();
        charts.priceComp = new Chart(pcCtx, {
            type: 'line',
            data: { labels: commonLabels, datasets },
            options: chartOptions('', '%', 'Normalized % change')
        });
    }
}

// ─── COMPETITORS TAB ────────────────────────────────────────────
function renderCompetitors() {
    const comp = appData.competitors;
    if (!comp || !comp.competitors) return;

    // Capacity chart
    const capCtx = document.getElementById('capacityChart');
    if (capCtx) {
        const entries = Object.entries(comp.competitors)
            .map(([name, d]) => ({ name: shortName(name), capacity: d.capacity_mtpa }))
            .sort((a, b) => b.capacity - a.capacity);
        const colors = entries.map((_, i) => i === 0 ? 'rgba(99,102,241,0.8)' : 'rgba(99,102,241,0.25)');

        if (charts.capacity) charts.capacity.destroy();
        charts.capacity = new Chart(capCtx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e.name),
                datasets: [{
                    label: 'Capacity (MTPA)', data: entries.map(e => e.capacity),
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.25', '0.5').replace('0.8', '1')),
                    borderWidth: 1, borderRadius: 6,
                }]
            },
            options: { ...chartOptions('', ' MTPA'), plugins: { legend: { display: false } } }
        });
    }

    // Cards
    document.getElementById('competitorCards').innerHTML = Object.entries(comp.competitors).map(([name, d]) => `
        <div class="comp-card">
            <div class="comp-card-header">
                <div class="comp-name">${name}</div>
                <div class="comp-capacity">${d.capacity_mtpa} <span>MTPA</span></div>
            </div>
            <div class="comp-meta">
                <div><strong>Group:</strong> ${d.parent_group}</div>
                <div><strong>Share:</strong> ${d.market_share}</div>
                <div><strong>Regions:</strong> ${(d.key_regions || []).join(', ')}</div>
                <div><strong>Target:</strong> ${d.target_capacity_mtpa ? `${d.target_capacity_mtpa} MTPA` : 'N/A'}</div>
            </div>
            <div class="comp-section-title">Strengths</div>
            <ul class="comp-list">${(d.strengths || []).slice(0, 3).map(s => `<li>+ ${s}</li>`).join('')}</ul>
            <div class="comp-section-title weaknesses">Weaknesses</div>
            <ul class="comp-list">${(d.weaknesses || []).slice(0, 3).map(w => `<li>- ${w}</li>`).join('')}</ul>
        </div>
    `).join('');

    // Strategic comparisons
    if (comp.strategic_comparison) {
        let html = '';
        Object.entries(comp.strategic_comparison).forEach(([key, val]) => {
            if (typeof val === 'object' && val.comparison) {
                html += `
                <div class="strat-comparison">
                    <div class="strat-title">${val.comparison}</div>
                    ${val.ultratech_advantage ? `<div class="strat-detail"><strong>UltraTech edge:</strong> ${val.ultratech_advantage}</div>` : ''}
                    ${val.adani_advantage || val.shree_advantage || val.dalmia_advantage ?
                        `<div class="strat-detail"><strong>Challenger edge:</strong> ${val.adani_advantage || val.shree_advantage || val.dalmia_advantage}</div>` : ''}
                    ${val.verdict ? `<div class="strat-verdict">${val.verdict}</div>` : ''}
                </div>`;
            } else if (key === 'industry_outlook' && typeof val === 'object') {
                html += `
                <div class="strat-comparison" style="background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.1)">
                    <div class="strat-title">Industry Outlook</div>
                    ${Object.entries(val).map(([k, v]) =>
                    `<div class="strat-detail"><strong>${k.replace(/_/g, ' ')}:</strong> ${v}</div>`
                ).join('')}
                </div>`;
            }
        });
        document.getElementById('strategicContent').innerHTML = html;
    }
}

// ─── ASK AI ─────────────────────────────────────────────────────
function askSuggestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
    return false;
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    if (!question) return;

    addChatMessage('user', question);
    input.value = '';

    const loadingId = 'loading-' + Date.now();
    addChatMessage('bot', '<div class="loading-dots">Thinking<span>.</span><span>.</span><span>.</span></div>', loadingId);
    document.getElementById('sendBtn').disabled = true;

    try {
        const resp = await fetch(`${API_BASE}/api/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        const data = await resp.json();
        removeEl(loadingId);

        if (resp.ok) addChatMessage('bot', formatMarkdown(data.answer));
        else addChatMessage('bot', `Error: ${data.detail || 'Unknown error'}`);
    } catch (error) {
        removeEl(loadingId);
        addChatMessage('bot', 'Could not reach the server. Make sure the backend is running.');
    }
    document.getElementById('sendBtn').disabled = false;
}

function addChatMessage(role, content, id) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    if (id) div.id = id;
    div.innerHTML = `
        <div class="chat-avatar">${role === 'bot' ? 'AI' : 'You'}</div>
        <div class="chat-bubble">${content}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeEl(id) { const el = document.getElementById(id); if (el) el.remove(); }

function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// ─── Helpers ────────────────────────────────────────────────────
function shortName(c) { return c.replace(' Cements', '').replace(' Cement', '').replace(' Limited', ''); }

function chartOptions(prefix = '', suffix = '', title = '') {
    return {
        responsive: true, maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
            },
            tooltip: {
                backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(99,102,241,0.3)',
                borderWidth: 1, padding: 12, cornerRadius: 8,
                titleFont: { family: 'Inter', size: 13 }, bodyFont: { family: 'Inter', size: 12 },
                callbacks: { label: ctx => `${ctx.dataset.label}: ${prefix}${Number(ctx.raw).toLocaleString()}${suffix}` }
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 10 }, maxTicksLimit: 12 }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 10 }, callback: v => `${prefix}${v.toLocaleString()}${suffix}` },
                title: title ? { display: true, text: title, color: '#64748b', font: { family: 'Inter', size: 11 } } : undefined
            }
        }
    };
}
