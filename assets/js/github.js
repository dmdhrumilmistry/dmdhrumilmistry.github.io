// Live GitHub projects with a 24h localStorage cache and a baked snapshot fallback.
(function () {
  'use strict';

  const USER = 'dmdhrumilmistry';
  const PINNED = ['OWASP/OFFAT'];
  const CACHE_KEY = 'dm-gh-v1';
  const TTL = 24 * 60 * 60 * 1000;
  const SNAPSHOT = 'assets/data/github.json';
  const FIRST_PAGE = 10;

  const list = document.getElementById('repo-list');
  const filters = document.getElementById('repo-filters');
  const more = document.getElementById('repo-more');
  const status = document.getElementById('gh-status');
  if (!list) return;

  let state = { repos: [], lang: 'All', expanded: false };

  function readCache() {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY));
      return c && c.data ? c : null;
    } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch (e) { /* storage blocked */ }
  }

  async function getJSON(url) {
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return r.json();
  }

  const pick = r => ({
    name: r.name, full_name: r.full_name, description: r.description, language: r.language,
    stargazers_count: r.stargazers_count, forks_count: r.forks_count, html_url: r.html_url, pushed_at: r.pushed_at
  });

  async function fetchLive() {
    const api = 'https://api.github.com';
    const [user, repos, ...pinned] = await Promise.all([
      getJSON(`${api}/users/${USER}`),
      getJSON(`${api}/users/${USER}/repos?per_page=100&type=owner&sort=pushed`),
      ...PINNED.map(p => getJSON(`${api}/repos/${p}`))
    ]);
    return {
      user: { login: user.login, public_repos: user.public_repos, followers: user.followers, html_url: user.html_url },
      repos: repos.filter(r => !r.fork && !r.archived).map(pick),
      pinned: pinned.map(pick)
    };
  }

  async function load() {
    const cached = readCache();
    if (cached && Date.now() - cached.t < TTL) return { data: cached.data, source: 'cache', t: cached.t };
    try {
      const data = await fetchLive();
      writeCache(data);
      return { data, source: 'live', t: Date.now() };
    } catch (e) {
      if (cached) return { data: cached.data, source: 'stale', t: cached.t };
      const snap = await getJSON(SNAPSHOT);
      return { data: snap, source: 'snapshot', t: Date.parse(snap.generated) };
    }
  }

  function merge(data) {
    const pinnedNames = new Set(data.pinned.map(p => p.name.toLowerCase()));
    // Drop personal copies of pinned repos (e.g. dmdhrumilmistry/offat vs OWASP/OFFAT).
    const own = data.repos.filter(r => !pinnedNames.has(r.name.toLowerCase()));
    own.sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.pushed_at) - Date.parse(a.pushed_at));
    return [...data.pinned.map(p => ({ ...p, pinned: true })), ...own];
  }

  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);

  function el(tag, props, children) {
    const n = document.createElement(tag);
    if (props) Object.assign(n, props);
    (children || []).forEach(c => n.append(c));
    return n;
  }

  function renderStats(data, repos) {
    const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const vals = { repos: data.user.public_repos, stars: fmt(stars), followers: data.user.followers };
    document.querySelectorAll('[data-gh]').forEach(n => {
      const v = vals[n.dataset.gh];
      if (v !== undefined) n.textContent = v;
    });
  }

  function renderFilters() {
    const counts = {};
    state.repos.forEach(r => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    const langs = ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 7)];
    filters.replaceChildren(...langs.map(l => {
      const b = el('button', { type: 'button', className: 'chip', textContent: l });
      b.setAttribute('aria-pressed', String(l === state.lang));
      b.addEventListener('click', () => { state.lang = l; state.expanded = false; renderFilters(); renderList(); });
      return b;
    }));
  }

  function renderList() {
    const shown = state.repos.filter(r => state.lang === 'All' || r.language === state.lang);
    const visible = state.expanded ? shown : shown.slice(0, FIRST_PAGE);
    list.replaceChildren(...visible.map(r => {
      const title = el('h3', null, [el('a', { href: r.html_url, target: '_blank', rel: 'noopener', textContent: r.pinned ? r.full_name : r.name })]);
      if (r.pinned) title.append(el('span', { className: 'repo-pin', textContent: 'I lead this' }));
      const main = el('div', { className: 'repo-main' }, [title, el('p', { textContent: r.description || 'No description.' })]);
      const meta = el('div', { className: 'repo-meta' }, [
        el('strong', { textContent: fmt(r.stargazers_count) + ' stars' }), el('br'),
        document.createTextNode(`${fmt(r.forks_count)} forks${r.language ? ', ' + r.language : ''}`)
      ]);
      return el('li', { className: 'repo' }, [main, meta]);
    }));
    const rest = shown.length - visible.length;
    more.hidden = rest <= 0;
    more.textContent = `Show ${rest} more`;
  }

  more.addEventListener('click', () => { state.expanded = true; renderList(); });

  load().then(({ data, source, t }) => {
    state.repos = merge(data);
    renderStats(data, state.repos);
    renderFilters();
    renderList();
    const when = new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    status.textContent = {
      live: 'Updated just now.',
      cache: `Cached ${when}, refreshes daily.`,
      stale: `GitHub is unreachable, showing data from ${when}.`,
      snapshot: `GitHub is unreachable, showing a snapshot from ${when}.`
    }[source];
  }).catch(() => {
    status.textContent = 'Could not load projects right now. See them on GitHub.';
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
