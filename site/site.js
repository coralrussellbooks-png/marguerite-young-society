(function () {
  document.documentElement.lang = 'en';
  var SITE = 'The Marguerite Young Society';
  var HOME = 'the-marguerite-young-society';
  /* STATIC is true on the version built for the new host, where every page has its own address (page-name.html).
     On the preview here it is false and pages live behind a "#". */
  var STATIC = document.documentElement.getAttribute('data-static') === '1';
  var PAGE_ID = document.documentElement.getAttribute('data-page') || '';
  var M = null, cache = {}, textCache = {}, current = null;
  var page = document.getElementById('page'), crumb = document.getElementById('crumb');
  var results = document.getElementById('results'), q = document.getElementById('q'), side = document.getElementById('side');
  try { if (window.matchMedia('(max-width: 520px)').matches) q.placeholder = 'Search'; } catch (err) {}

  /* ---------- Substack settings: edit these lines to update the Substack page ----------
     embedForm: leave false while the site is hosted here (outside forms cannot load inside it).
     Set it to true once the site moves to its own host, and Substack's own signup box will appear. */
  var SUBSTACK = {
    url: 'https://coralrussell.substack.com',
    name: 'Radical Immanence',
    author: 'The Marguerite Young Society',
    embedForm: true,
    featured: [
      ['To All My Darlings', 'https://coralrussell.substack.com/p/to-all-my-darlings-coral-russell-miss-macintosh-my-darling-marguerite-young', 'Reading Miss MacIntosh, My Darling together.'],
      ['Harp Song for a Radical, Chapter 142', 'https://coralrussell.substack.com/p/chapter-142-part-of-144-harp-song', 'A recent chapter in the reading of Young’s life of Eugene Debs.'],
      ['Harp Song for a Radical, Chapter 54', 'https://coralrussell.substack.com/p/chapter-54', 'A good place to drop into the series.']
    ]
  };
  function renderSubstack() {
    var S = SUBSTACK, h = '';
    h += '<h1>' + esc(S.name) + ' on Substack</h1>';
    h += '<p>New essays, chapter readings, and reflections on Marguerite Young go out first on Substack. Subscribing is free, and each new post arrives by email.</p>';
    h += '<div class="sub-card"><p class="sub-meta">Newsletter by ' + esc(S.author) + '</p><p class="sub-name">' + esc(S.name) + '</p>';
    if (S.embedForm) {
      h += '<iframe class="sub-embed" src="' + esc(S.url) + '/embed" title="Subscribe to ' + esc(S.name) + '" frameborder="0" scrolling="no"></iframe>';
    } else {
      h += '<p>Join the readers following Young’s work one chapter at a time.</p>';
    }
    h += '<div class="sub-actions"><a class="sub-go" href="' + esc(S.url) + '/subscribe" target="_blank" rel="noopener">Subscribe on Substack</a>';
    h += '<a class="sub-alt" href="' + esc(S.url) + '" target="_blank" rel="noopener">Visit the newsletter</a></div></div>';
    h += '<h2>Start reading</h2><ul class="sub-list">';
    S.featured.forEach(function (f) {
      h += '<li><a href="' + esc(f[1]) + '" target="_blank" rel="noopener">' + esc(f[0]) + '</a>' + (f[2] ? '<span>' + esc(f[2]) + '</span>' : '') + '</li>';
    });
    h += '</ul><p><a href="' + esc(S.url) + '/archive" target="_blank" rel="noopener">Browse the full archive</a></p>';
    return h;
  }
  function renderAllPages() {
    var groups = [], seen = {};
    for (var id in M.pages) {
      var g = M.pages[id][1];
      if (!seen[g]) { seen[g] = []; groups.push(g); }
      seen[g].push(id);
    }
    var h = '<h1>All pages</h1><p>Every page on the site, grouped by book and section.</p>';
    groups.forEach(function (g) {
      h += '<div class="all-group"><h2>' + esc(g) + '</h2><ul>';
      seen[g].forEach(function (id) { h += '<li><a href="' + link(id) + '">' + esc(M.pages[id][0]) + '</a></li>'; });
      h += '</ul></div>';
    });
    return h;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function link(id, sec, find) {
    if (STATIC) {
      return (id === HOME ? 'index.html' : id + '.html') + (find ? '#~f=' + encodeURIComponent(find) : (sec ? '#s-' + sec : ''));
    }
    return '#' + id + (sec ? '--' + sec : '') + (find ? '~f=' + encodeURIComponent(find) : '');
  }
  function setTitle(t) { document.title = t && t !== SITE ? t + ' | ' + SITE : SITE; }
  function load(file) {
    if (!cache[file]) cache[file] = fetch('data/' + file + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) { cacheValue[file] = d; return d; });
    return cache[file];
  }
  var cacheValue = {};
  function chapterOf(id) {
    var m = id.match(/^(?:chapter|wheel-chapter|index-chapter|comedy-chapter|religion-chapter|llt-chapter|woman-chapter)-(\d\d)(?:-hub)?$/) || id.match(/^guide-(\d\d)-/);
    return m ? parseInt(m[1], 10) : null;
  }

  function buildSide() {
    var S = M.special, h = '';
    function li(id, label) { return '<li><a href="' + link(id) + '" data-id="' + id + '">' + esc(label) + '</a></li>'; }
    h += '<div><ul>' + li(S['The Marguerite Young Society'], 'The Marguerite Young Society') + li('substack', 'Read on Substack') + li('audio', 'Audio') + '</ul></div>';
    h += '<div><h2>Radical Immanence</h2><ul>' + li(S['Radical Immanence the Philosophy of Marguerite Young'], 'The Philosophy of Marguerite Young') + li(S['The Eleven Pillars'], 'The Eleven Pillars') + li(S['Collection Home'], 'Radical Immanence Collection') + li(S['Writing Life Home'], 'Across Her Writing Life') + li(S['Whale Home'], 'Be Bak in a Whale') + li(S['Creative Home'], 'The Creative Radical Collection') + li(S['Art Home'], 'Art When Here Is Enough') + li(S['A Course in Radical Immanence'], 'A Course in Radical Immanence') + '</ul></div>';
    h += '<div><h2>Her works</h2><ul>' + li(S['Miss MacIntosh, My Darling'], 'Miss MacIntosh, My Darling') + li(S['Angel in the Forest'], 'Angel in the Forest') + li(S['Harp Song for a Radical'], 'Harp Song for a Radical') + li(S['Inviting the Muses'], 'Inviting the Muses') + li(S['The Collected Poems of Marguerite Young'], 'The Collected Poems') + '</ul></div>';
    h += '<div><h2>More About Young</h2><ul>' + li(S["Psychology in Young's Works"], "Psychology in Young's Works") + li(S["Politics in Young's Works"], "Politics in Young's Works") + li(S['Marguerite Young, Our Darling'], 'Marguerite Young, Our Darling') + li(S["Young's Interviews Analyzed"], "Young's Interviews Analyzed") + '</ul></div>';
    h += '<div id="mmmdNav" class="mmmd-nav"><div class="work-head">Inside Miss MacIntosh, My Darling</div><div><ul>' + li(S['Start Here'], 'Start Here') + '</ul></div>';
    h += '<div><h2>Read the novel</h2><ul>' + li(S['Chapter Hubs Home'], 'Chapter Hubs') + li(S['Story Arcs Home'], 'Story Arcs') + li('story-in-time', 'The Story in Time') + '</ul></div>';
    h += '<div><h2>Follow an idea</h2><ul>' + li(S['Pillar Crosswalks Home'], 'Pillar Crosswalks') + li(S['Character Hubs Home'], 'Character Hubs') + '</ul></div>';
    h += '<div><h2>The books</h2><ul>' +
      li(S['Home'], 'To All My Darlings') + li(S['Guide Home'], 'A Guide to Reading MMMD') + li(S['Wheel and Spokes Home'], 'The Wheel and the Spokes') +
      li(S['Architecture Home'], 'The Deep Architecture') + li(S['Philosophy of MMMD Home'], 'The Philosophy in MMMD') + li(S['History in MMMD Home'], 'The History in MMMD') +
      li(S['Intertextuality in MMMD Home'], 'Intertextuality in MMMD') + li(S['Intertextual Index Home'], 'Intertextual Index') + li(S['Comedy in MMMD Home'], 'Comedy in MMMD') +
      li(S['Religion in MMMD Home'], 'Christianity and Religion') + li(S['Index of MMMD Home'], 'Index of MMMD') + li(S['LLT Home'], 'Life, Love, and Truth') + li(S['Master Class Home'], 'Teaching a Writing Masterclass') + li(S['Woman in MMMD Home'], "Woman in Young's Magnum Opus") + li(S['Reality Home'], 'Reality and Illusion') + '</ul></div>';
    var arcs = [], seen = {};
    for (var c = 1; c <= 82; c++) {
      var a = M.arcOf[c];
      if (!seen[a]) { seen[a] = { id: a, chs: [] }; arcs.push(seen[a]); }
      seen[a].chs.push(c);
    }
    h += '<div><h2>Chapters by story arc</h2><div style="display:grid;gap:0.8rem">';
    arcs.forEach(function (a) {
      h += '<div class="arc"><a class="arc-name" href="' + link(a.id) + '" data-id="' + a.id + '">' + esc(M.arcNames[a.id]) + '</a><div class="chips">';
      a.chs.forEach(function (c) { h += '<a class="chip" href="' + link(M.hubs[c]) + '" data-ch="' + c + '" aria-label="Chapter ' + c + '">' + c + '</a>'; });
      h += '</div></div>';
    });
    h += '</div></div></div>';
    side.innerHTML = h;
  }

  var MMMD_GROUPS = { chapters: 1, concepts: 1, guide: 1, curious: 1, architecture: 1, pillars: 1, wheel: 1, references: 1, refindex: 1, essays: 1, nav: 1, hubs: 1, llt: 1, masterclass: 1, woman: 1 };
  function markHere(id) {
    if (!M) return;
    var ch = chapterOf(id);
    var inNovel = (M.pages[id] && MMMD_GROUPS[M.pages[id][2]]) || id === M.special['Miss MacIntosh, My Darling'];
    var mn = document.getElementById('mmmdNav'); if (mn) mn.hidden = !inNovel;
    side.querySelectorAll('.here').forEach(function (el) { el.classList.remove('here'); });
    side.querySelectorAll('[data-id="' + id + '"]').forEach(function (el) { el.classList.add('here'); });
    if (ch) { var chip = side.querySelector('[data-ch="' + ch + '"]'); if (chip) chip.classList.add('here'); }
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  }

  function slugify(t) { return t.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, ''); }

  /* Finishing touches on a page once its text is in place: wide tables, the book cover, the bottom links, section anchors. */
  function enhance(id, sec) {
    page.querySelectorAll('table').forEach(function (t) {
      if (t.parentNode.classList && t.parentNode.classList.contains('tablewrap')) return;
      var w = document.createElement('div'); w.className = 'tablewrap'; t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
    addCover(id);
    addBottomNav();
    var target = null;
    page.querySelectorAll('h2, h3').forEach(function (h) { var s = slugify(h.textContent); h.id = 's-' + s; if (sec && !target && s === sec) target = h; });
    return target;
  }
  function settle(target, find) {
    findHits = [];
    if (find) openFind(find);
    else { findBar.hidden = true; if (target) { target.style.scrollMarginTop = '4.5rem'; target.scrollIntoView(); } else window.scrollTo(0, 0); }
  }

  function show(full) {
    if (!M) return;
    var fi = (full || '').indexOf('~f=');
    if (fi !== -1) { pendingFind = decodeURIComponent(full.slice(fi + 3)); full = full.slice(0, fi); }
    var parts = (full || '').split('--'), id = parts[0], sec = parts[1] || '';
    if (id === 'substack' || id === 'all-pages') {
      current = id;
      results.hidden = true; page.hidden = false; findBar.hidden = true; pendingFind = '';
      crumb.textContent = 'The Society';
      page.innerHTML = id === 'substack' ? renderSubstack() : renderAllPages();
      setTitle(id === 'substack' ? SUBSTACK.name + ' on Substack' : 'All pages');
      window.scrollTo(0, 0);
      markHere(id);
      closeNav();
      return;
    }
    if (!id || !M.pages[id]) { id = HOME; sec = ''; }
    var p = M.pages[id];
    current = id;
    results.hidden = true; page.hidden = false;
    crumb.textContent = p[1];
    setTitle(id === HOME ? SITE : p[0]);
    page.innerHTML = '<p class="status">Loading…</p>';
    load(p[2]).then(function (data) {
      if (current !== id) return;
      page.innerHTML = data[id] || '<p class="status">This page is missing from the data file.</p>';
      var target = enhance(id, sec);
      var f = pendingFind; pendingFind = '';
      settle(target, f);
    }).catch(function () {
      page.innerHTML = '<p class="status">This section did not load. Check your connection and reload the page.</p>';
    });
    markHere(id);
    closeNav();
  }

  var pendingFind = '', findHits = [], findIdx = 0, findTimer = null;
  var findBar = document.getElementById('findBar'), findInput = document.getElementById('findInput'), findCount = document.getElementById('findCount');
  function clearHits() {
    page.querySelectorAll('mark.hit').forEach(function (m) { var t = document.createTextNode(m.textContent); m.parentNode.replaceChild(t, m); });
    page.normalize(); findHits = []; findIdx = 0;
  }
  function runFind(term) {
    clearHits();
    term = (term || '').trim();
    if (term.length < 2) { findCount.textContent = ''; return; }
    var low = term.toLowerCase(), nodes = [], w = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()) { if (w.currentNode.nodeValue.toLowerCase().indexOf(low) !== -1) nodes.push(w.currentNode); }
    nodes.forEach(function (n) {
      var text = n.nodeValue, lt = text.toLowerCase(), pos = 0, i, frag = document.createDocumentFragment();
      while ((i = lt.indexOf(low, pos)) !== -1) {
        if (i > pos) frag.appendChild(document.createTextNode(text.slice(pos, i)));
        var m = document.createElement('mark'); m.className = 'hit'; m.textContent = text.slice(i, i + term.length);
        frag.appendChild(m); findHits.push(m); pos = i + term.length;
      }
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      n.parentNode.replaceChild(frag, n);
    });
    if (findHits.length) { findIdx = 0; focusHit(); } else findCount.textContent = 'No matches on this page';
  }
  function focusHit() {
    findHits.forEach(function (m) { m.classList.remove('hit-now'); });
    var m = findHits[findIdx]; if (!m) return;
    m.classList.add('hit-now'); m.scrollIntoView({ block: 'center' });
    findCount.textContent = (findIdx + 1) + ' of ' + findHits.length;
  }
  function stepFind(d) { if (!findHits.length) return; findIdx = (findIdx + d + findHits.length) % findHits.length; focusHit(); }
  function openFind(term) { findBar.hidden = false; findInput.value = term; if (term) runFind(term); else { findCount.textContent = ''; findInput.focus(); } }
  function closeFind() { clearHits(); findBar.hidden = true; findCount.textContent = ''; }

  var COVERS = {
    'home': 'To All My Darlings', 'guide-home': 'A Guide to Reading Miss MacIntosh, My Darling', 'wheel-and-spokes-home': 'The Wheel and the Spokes',
    'architecture-home': 'The Deep Architecture of Miss MacIntosh, My Darling', 'llt-home': 'Life, Love, and Truth That Doesn’t Fail',
    'master-class-home': 'Teaching a Writing Masterclass', 'woman-in-mmmd-home': "Woman in Young's Magnum Opus", 'reality-home': 'Exploring Reality and Illusion in Miss MacIntosh, My Darling',
    'collection-home': 'Radical Immanence: The Complete Collection', 'writing-life-home': "Radical Immanence Across Marguerite Young's Writing Life", 'whale-home': 'Be Bak in a Whale',
    'creative-home': 'The Creative Radical Collection', 'art-home': 'Art When Here Is Enough', 'poetry-home': "Exploring Young's Poetry",
    'weather-never-home': 'The Weather You Were Never Allowed to Have', 'weather-inside-home': 'The Weather Inside', 'floor-home': 'The Floor and the Framework',
    'religion-in-mmmd-home': 'Christianity, Religion, Comedy, History, Philosophy, Intertextuality in Miss MacIntosh, My Darling',
    'comedy-in-mmmd-home': 'Christianity, Religion, Comedy, History, Philosophy, Intertextuality in Miss MacIntosh, My Darling',
    'history-in-mmmd-home': 'Christianity, Religion, Comedy, History, Philosophy, Intertextuality in Miss MacIntosh, My Darling',
    'philosophy-of-mmmd-home': 'Christianity, Religion, Comedy, History, Philosophy, Intertextuality in Miss MacIntosh, My Darling',
    'intertextuality-in-mmmd-home': 'Christianity, Religion, Comedy, History, Philosophy, Intertextuality in Miss MacIntosh, My Darling'
  };
  var YOUNG_WORKS = {
    'harp-song-for-a-radical': ['Harp Song for a Radical', 'work-harp'],
    'the-collected-poems-of-marguerite-young': ['The Collected Poems of Marguerite Young', 'work-poems'],
    'miss-macintosh-my-darling': ['Miss MacIntosh, My Darling', 'work-mmmd'],
    'angel-in-the-forest': ['Angel in the Forest', 'work-angel'],
    'inviting-the-muses': ['Inviting the Muses', 'work-muses'],
    'marguerite-young-our-darling': ['Marguerite Young, Our Darling', 'work-our-darling', 'Cover of Marguerite Young, Our Darling: Tributes and Essays, edited by Miriam Fuchs']
  };
  var COVER_FILE = {
    'religion-in-mmmd-home': 'mmmd-studies', 'comedy-in-mmmd-home': 'mmmd-studies', 'history-in-mmmd-home': 'mmmd-studies',
    'philosophy-of-mmmd-home': 'mmmd-studies', 'intertextuality-in-mmmd-home': 'mmmd-studies'
  };
  function addCover(id) {
    var work = YOUNG_WORKS[id];
    if ((!COVERS[id] && !work) || page.querySelector('img.cover')) return;
    var img = document.createElement('img');
    img.decoding = 'async';
    if (work) { img.className = 'cover natural'; img.src = 'img/covers/' + work[1] + '.jpg'; img.alt = work[2] || ('Cover of ' + work[0] + ' by Marguerite Young'); }
    else { img.className = 'cover'; img.src = 'img/covers/' + (COVER_FILE[id] || id) + '.jpg'; img.alt = 'Cover of ' + COVERS[id] + ' by Coral Russell'; }
    var h1 = page.querySelector('h1');
    if (h1) h1.insertAdjacentElement('afterend', img); else page.insertBefore(img, page.firstChild);
  }
  function addBottomNav() {
    if (page.querySelector('.bottomnav')) return;
    var ps = page.querySelectorAll(':scope > p'), nav = null;
    for (var i = 0; i < ps.length && i < 4; i++) {
      var t = ps[i].textContent;
      if ((t.indexOf('←') !== -1 || t.indexOf('→') !== -1) && ps[i].querySelector('a')) { nav = ps[i]; break; }
    }
    if (!nav) return;
    var c = nav.cloneNode(true); c.className = 'bottomnav'; c.removeAttribute('id');
    page.appendChild(c);
  }
  function route() { show(decodeURIComponent(location.hash.slice(1))); }

  /* ---------- search ---------- */
  var timer = null;
  function titleSearch(term) {
    var t = term.toLowerCase(), out = [];
    for (var id in M.pages) { if (M.pages[id][0].toLowerCase().indexOf(t) !== -1) out.push(id); }
    out.sort(function (a, b) { return M.pages[a][0].length - M.pages[b][0].length; });
    return out.slice(0, 40);
  }
  function renderResults(term) {
    if (!M) return;
    var ids = titleSearch(term);
    var h = '<h1>Search: ' + esc(term) + '</h1>';
    h += '<div class="row"><button class="btn" id="fullBtn" type="button">Search the full text of every page</button><span class="status" id="fullStatus"></span>';
    h += '<p class="search-note">This downloads about 17 MB of text, so it may take a moment on a phone or a slow connection.</p></div>';
    h += '<p class="res-label">Page titles</p>';
    h += ids.length ? '<ul class="res-list">' + ids.map(function (id) {
      return '<li><span class="res-label">' + esc(M.pages[id][1]) + '</span><a href="' + link(id) + '">' + esc(M.pages[id][0]) + '</a></li>';
    }).join('') + '</ul>' : '<p class="status">No page titles match. Try the full-text search.</p>';
    h += '<div id="fullResults"></div>';
    results.innerHTML = h; results.hidden = false; page.hidden = true; crumb.textContent = 'Search';
    setTitle('Search: ' + term);
    document.getElementById('fullBtn').addEventListener('click', function () { fullSearch(term, this); });
  }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' '); }
  function fullSearch(term, btn) {
    var files = {}; for (var id in M.pages) files[M.pages[id][2]] = 1;
    var names = Object.keys(files), done = 0, status = document.getElementById('fullStatus');
    btn.disabled = true; status.textContent = 'Loading every book…';
    Promise.all(names.map(function (f) { return load(f).then(function (d) { done++; status.textContent = 'Loaded ' + done + ' of ' + names.length + ' sections…'; return d; }); }))
      .then(function () {
        var t = term.toLowerCase(), hits = [];
        for (var id in M.pages) {
          var html = cacheValue[M.pages[id][2]] ? cacheValue[M.pages[id][2]][id] : null;
          if (!html) continue;
          var txt = textCache[id] || (textCache[id] = plain(html));
          var i = txt.toLowerCase().indexOf(t);
          if (i !== -1) hits.push([id, txt, i]);
          if (hits.length >= 80) break;
        }
        status.textContent = hits.length ? (hits.length >= 80 ? 'Showing the first 80 matches.' : hits.length + ' pages match.') : 'No pages contain that text.';
        document.getElementById('fullResults').innerHTML = hits.length ? '<p class="res-label" style="margin-top:1.2rem">Full text</p><ul class="res-list">' + hits.map(function (x) {
          var s = Math.max(0, x[2] - 90), e = Math.min(x[1].length, x[2] + term.length + 110);
          var snip = (s > 0 ? '…' : '') + esc(x[1].slice(s, x[2])) + '<mark>' + esc(x[1].substr(x[2], term.length)) + '</mark>' + esc(x[1].slice(x[2] + term.length, e)) + (e < x[1].length ? '…' : '');
          return '<li><span class="res-label">' + esc(M.pages[x[0]][1]) + '</span><a href="' + (STATIC ? link(x[0], '', term) : link(x[0])) + '" data-find="' + esc(term) + '">' + esc(M.pages[x[0]][0]) + '</a><span class="res-snip">' + snip + '</span></li>';
        }).join('') + '</ul>' : '';
      }).catch(function () { status.textContent = 'Some books did not load. Check your connection and try again.'; btn.disabled = false; });
  }

  function backToPage() {
    results.hidden = true; page.hidden = false;
    var p = M && M.pages[current];
    crumb.textContent = p ? p[1] : 'The Society';
    setTitle(current === HOME ? SITE : p ? p[0] : current === 'substack' ? SUBSTACK.name + ' on Substack' : current === 'all-pages' ? 'All pages' : SITE);
  }
  q.addEventListener('input', function () {
    clearTimeout(timer);
    var term = q.value.trim();
    timer = setTimeout(function () { if (term.length >= 2) renderResults(term); else if (current) backToPage(); }, 180);
  });
  q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; q.dispatchEvent(new Event('input')); } });
  results.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href');
    var f = a.getAttribute('data-find') || '';
    if (STATIC) {
      /* the result may be the page already open: just close the results and find on it */
      if (h.split('#')[0] === location.pathname.split('/').pop() || (h.split('#')[0] === 'index.html' && PAGE_ID === HOME)) {
        e.preventDefault(); q.value = ''; backToPage(); if (f) openFind(f); else window.scrollTo(0, 0);
      }
      return;
    }
    if (h.charAt(0) !== '#') return;
    e.preventDefault();
    pendingFind = f;
    q.value = '';
    h = h.slice(1);
    if (decodeURIComponent(location.hash.slice(1)) === h) show(h); else location.hash = h;
  });
  side.addEventListener('click', function (e) {
    if (STATIC) return;
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault();
    clearTimeout(timer); clearTimeout(findTimer);
    q.value = ''; pendingFind = '';
    closeFind();
    var h = a.getAttribute('href').slice(1);
    if (decodeURIComponent(location.hash.slice(1)) === h) show(h); else location.hash = h;
  });
  document.getElementById('findOpen').addEventListener('click', function () { openFind(''); });
  findInput.addEventListener('input', function () { clearTimeout(findTimer); var v = this.value; findTimer = setTimeout(function () { runFind(v); }, 200); });
  findInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); stepFind(e.shiftKey ? -1 : 1); }
    if (e.key === 'Escape') closeFind();
  });
  document.getElementById('findNext').addEventListener('click', function () { stepFind(1); });
  document.getElementById('findPrev').addEventListener('click', function () { stepFind(-1); });
  document.getElementById('findClose').addEventListener('click', closeFind);

  document.getElementById('menuBtn').addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelector('main').addEventListener('click', function () {
    if (document.body.classList.contains('nav-open')) closeNav();
  });

  if (STATIC) {
    current = PAGE_ID;
    var hashNow = function () {
      var hh = decodeURIComponent(location.hash.slice(1));
      if (hh.indexOf('~f=') === 0) return { find: hh.slice(3) };
      if (hh.indexOf('s-') === 0) return { sec: hh.slice(2) };
      return {};
    };
    if (PAGE_ID === 'substack') page.innerHTML = renderSubstack();
    var st = hashNow();
    var tgt = enhance(PAGE_ID, st.sec);
    if (st.find || tgt) settle(tgt, st.find);
    window.addEventListener('hashchange', function () { var s = hashNow(); if (s.find) openFind(s.find); else if (s.sec) { var t = document.getElementById('s-' + s.sec); if (t) t.scrollIntoView(); } });
    fetch('data/manifest.json').then(function (r) { return r.json(); }).then(function (m) {
      M = m;
      /* An old link from the "#" version (index.html#chapter-01) is sent to that page's own address. */
      var old = decodeURIComponent(location.hash.slice(1));
      if (old && old.indexOf('s-') !== 0 && old.indexOf('~f=') !== 0) {
        var oi = old.split('~f=')[0].split('--'), of = old.indexOf('~f=') !== -1 ? old.slice(old.indexOf('~f=') + 3) : '';
        if ((M.pages[oi[0]] || oi[0] === 'substack' || oi[0] === 'all-pages') && oi[0] !== PAGE_ID) { location.replace(link(oi[0], oi[1] || '', of)); return; }
      }
      buildSide(); markHere(PAGE_ID);
    }).catch(function () { side.innerHTML = '<p class="status">The contents list did not load. Reload the page to try again.</p>'; });
    return;
  }

  document.getElementById('brand').addEventListener('click', function (e) { e.preventDefault(); location.hash = HOME; });
  window.addEventListener('hashchange', route);
  fetch('data/manifest.json').then(function (r) { return r.json(); }).then(function (m) {
    M = m; buildSide();
    /* Every visit opens on the home page unless the address points to a specific page. */
    var start = location.hash.slice(1);
    var base = decodeURIComponent(start).split('~f=')[0].split('--')[0];
    if (!start || !(M.pages[base] || base === 'substack' || base === 'all-pages')) start = HOME;
    if (location.hash.slice(1) !== start) location.hash = start; else show(decodeURIComponent(start));
  }).catch(function () { page.innerHTML = '<p class="status">The Society could not load its contents. Reload the page to try again.</p>'; });
})();
