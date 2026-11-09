/* ==========================================================================
   VibeCoding 分享会 · 交互脚本（无依赖）
   ========================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- nav / progress / active section ---------- */
  var nav = $('#nav');
  var progress = $('#progress');
  var navLinks = $$('.nav__link');
  var railLinks = $$('.rail a');

  var darkSections = $$('.hero, .section--night');
  function updateNavTone() {
    if (!nav) return;
    var probe = 34, dark = false;
    darkSections.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) dark = true;
    });
    nav.classList.toggle('is-dark', dark);
  }

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-scrolled', y > 12);
    updateNavTone();
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var sections = $$('main section[id]');
  function setActive(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    railLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-rail') === id);
    });
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- mobile menu ---------- */
  var toggle = $('#navToggle');
  var links = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- tabs ---------- */
  var tabs = $$('.tab');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var k = e.key, next = null;
      if (k === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (k === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === 'Home') next = tabs[0];
      else if (k === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); next.focus(); selectTab(next); }
    });
  });

  /* ---------- copy prompt ---------- */
  var copyBtn = $('#copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var code = document.getElementById(copyBtn.dataset.target);
      if (!code) return;
      var text = code.innerText;
      var done = function () {
        copyBtn.classList.add('is-done');
        var label = $('#copyText');
        if (label) label.textContent = '已复制';
        setTimeout(function () {
          copyBtn.classList.remove('is-done');
          if (label) label.textContent = '复制';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lastFocus = null;
  function openLb(src, cap, alt) {
    if (!lb) return;
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || cap || '截图';
    lbCap.textContent = cap || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var c = $('#lbClose');
    if (c) c.focus();
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-zoom]').forEach(function (el) {
    el.addEventListener('click', function () {
      var img = el.querySelector('img');
      openLb(el.dataset.zoom, el.dataset.cap, img ? img.alt : '');
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLb();
    });
    $('#lbClose').addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
    });
  }

  /* ---------- loop stepper ---------- */
  var loopNodes = $$('.loop__node');
  var loopItems = $$('.loop__ditem');
  function selectLoop(i) {
    loopNodes.forEach(function (n) {
      var on = n.dataset.loop === String(i);
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-pressed', String(on));
    });
    loopItems.forEach(function (d) {
      d.hidden = d.dataset.i !== String(i);
    });
  }
  loopNodes.forEach(function (n) {
    n.addEventListener('click', function () { selectLoop(n.dataset.loop); });
  });

  /* ---------- hero demo timeline ---------- */
  var demo = $('#demo');
  var typedEl = $('#typed');
  var logEl = $('#demoLog');
  var miniTitle = $('#miniTitle');
  var miniDesc = $('#miniDesc');
  var mini = $('#mini');
  var caret = $('#caret');
  var PROMPT = '把首页标题改成「拥抱 AI，拒绝焦虑」，主色换成品牌蓝';
  var FINAL_TITLE = '拥抱 AI，拒绝焦虑';
  var FINAL_DESC = '从一句自然语言，到一个真正上线的网站。';
  var timers = [];
  var started = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function resetDemo() {
    clearTimers();
    if (!typedEl) return;
    typedEl.textContent = '';
    logEl.querySelectorAll('li').forEach(function (li) { li.classList.remove('on'); });
    miniTitle.textContent = '未命名页面';
    miniDesc.textContent = '这是一段占位文案，等待一句自然语言把它变成真正的首页。';
    mini.classList.remove('is-flash');
    if (caret) caret.style.display = '';
  }

  function finishDemo() {
    clearTimers();
    typedEl.textContent = PROMPT;
    logEl.querySelectorAll('li').forEach(function (li) { li.classList.add('on'); });
    miniTitle.textContent = FINAL_TITLE;
    miniDesc.textContent = FINAL_DESC;
    if (caret) caret.style.display = 'none';
  }

  function runDemo() {
    if (!typedEl || started) return;
    started = true;
    resetDemo();
    if (reduce) { finishDemo(); return; }

    var i = 0;
    (function type() {
      if (i <= PROMPT.length) {
        typedEl.textContent = PROMPT.slice(0, i);
        i++;
        timers.push(setTimeout(type, 42 + Math.random() * 40));
      } else {
        timers.push(setTimeout(function () {
          logEl.querySelectorAll('li').forEach(function (li, n) {
            timers.push(setTimeout(function () { li.classList.add('on'); }, n * 420));
          });
          timers.push(setTimeout(function () {
            miniTitle.textContent = FINAL_TITLE;
            miniDesc.textContent = FINAL_DESC;
            mini.classList.add('is-flash');
            timers.push(setTimeout(function () { mini.classList.remove('is-flash'); }, 900));
          }, 4 * 420 + 260));
        }, 320));
      }
    })();
  }

  if (demo && 'IntersectionObserver' in window) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runDemo(); dio.disconnect(); }
      });
    }, { threshold: 0.35 });
    dio.observe(demo);
  } else {
    runDemo();
  }

  // 点击顶栏或预览区可重播
  if (demo) {
    [demo.querySelector('.demo__bar'), demo.querySelector('.demo__right')].forEach(function (zone) {
      if (!zone) return;
      zone.style.cursor = 'pointer';
      zone.addEventListener('click', function () {
        if (!started) return;
        started = false;
        runDemo();
      });
    });
  }

  /* ---------- presenter: ← / → 切换章节 ---------- */
  var jumpTargets = sections.map(function (s) { return s.id; });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var el = document.activeElement;
    if (el && (el.closest('.tabs') || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
    if (document.getElementById('lightbox').classList.contains('is-open')) return;
    var current = -1;
    var mid = window.innerHeight * 0.35;
    jumpTargets.forEach(function (id, i) {
      var r = document.getElementById(id).getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = i;
    });
    if (current < 0) return;
    var next = e.key === 'ArrowRight' ? current + 1 : current - 1;
    if (next < 0 || next >= jumpTargets.length) return;
    e.preventDefault();
    document.getElementById(jumpTargets[next]).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
})();
