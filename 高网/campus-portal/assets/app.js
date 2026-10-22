const appState = {
  theme: localStorage.getItem('campus-theme') || 'light'
};

function setTheme(theme) {
  const root = document.body;
  appState.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('campus-theme', theme);

  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
  }
}

function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  button.addEventListener('click', () => {
    setTheme(appState.theme === 'light' ? 'dark' : 'light');
  });
}

function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function initTabs() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('active', tab === button));

      document.querySelectorAll('.news-item[data-category]').forEach((item) => {
        const visible = target === 'all' || item.dataset.category === target;
        item.hidden = !visible;
      });

      document.querySelectorAll('.course-card[data-category]').forEach((item) => {
        const visible = target === 'all' || item.dataset.category === target;
        item.hidden = !visible;
      });
    });
  });
}

function initSearchFilter() {
  const input = document.querySelector('[data-search-input]');
  if (!input) return;

  input.addEventListener('input', (event) => {
    const keyword = event.target.value.trim().toLowerCase();
    document.querySelectorAll('[data-search-item]').forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.hidden = keyword && !text.includes(keyword);
    });
  });
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 250);
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSwitches() {
  document.querySelectorAll('.switch').forEach((switchButton) => {
    switchButton.addEventListener('click', () => {
      switchButton.classList.toggle('active');
    });
  });
}

function initAccordion() {
  document.querySelectorAll('[data-accordion]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });
}

async function fetchMockData() {
  try {
    const response = await fetch('./data/mock-data.json');
    if (!response.ok) throw new Error('Mock data request failed');
    return await response.json();
  } catch (error) {
    return window.mockData || {};
  }
}

function renderStats(data) {
  const target = document.querySelector('#statsGrid');
  if (!target || !data.stats) return;

  target.innerHTML = data.stats.map((item) => `
    <article class="stat-card">
      <span class="kicker">${item.label}</span>
      <strong>${item.value}</strong>
      <span class="trend">${item.delta}</span>
    </article>
  `).join('');
}

function renderNews(data) {
  const target = document.querySelector('#homeNewsList');
  if (!target || !data.news) return;
  const items = data.news.slice(0, 4);
  target.innerHTML = items.map((item) => `
    <article class="news-item" data-search-item data-category="${item.category}">
      <div>
        <span class="tag ${item.tag}">${item.category}</span>
        <h4>${item.title}</h4>
        <div class="meta-row">
          <span>${item.meta}</span>
        </div>
      </div>
      <a href="article.html" class="more-link">查看</a>
    </article>
  `).join('');
}

function renderNewsPage(data) {
  const target = document.querySelector('#newsGrid');
  if (!target || !data.news) return;
  target.innerHTML = data.news.map((item) => `
    <article class="news-item" data-search-item data-category="${item.category}">
      <div>
        <span class="tag ${item.tag}">${item.category}</span>
        <h4>${item.title}</h4>
        <div class="meta-row">
          <span>${item.meta}</span>
        </div>
        <p class="page-note">${item.excerpt}</p>
      </div>
      <a href="article.html" class="more-link">查看详情</a>
    </article>
  `).join('');
}

function renderCourses(data) {
  const target = document.querySelector('#courseGrid');
  if (!target || !data.courses) return;
  target.innerHTML = data.courses.map((course) => `
    <article class="course-card" data-category="${course.tag}">
      <span class="course-tag">${course.tag}</span>
      <h3>${course.title}</h3>
      <div class="thumb"></div>
      <div class="course-meta">授课教师：${course.teacher} · ${course.hours}</div>
      <div class="progress-bar"><span style="width: ${course.progress}%"></span></div>
      <div class="meta-row"><span>学习进度：${course.progress}%</span></div>
    </article>
  `).join('');
}

function renderArticle(data) {
  const title = document.querySelector('#articleTitle');
  const meta = document.querySelector('#articleMeta');
  const content = document.querySelector('#articleContent');
  const side = document.querySelector('#relatedList');

  if (!data.news) return;
  const first = data.news[0];

  if (title) title.textContent = first.title;
  if (meta) meta.innerHTML = `${first.meta} · ${first.category}`;
  if (content) {
    content.innerHTML = `
      <p>为进一步推动校园文化建设与学生成长发展，我校于近期开展了丰富多彩的校园主题活动，围绕创新创业、创新实践和学生发展等多方面内容展开。</p>
      <p>${first.excerpt}本次活动以“服务成长、提升能力、启迪未来”为主线，凝聚了教师、学生和校友共同参与的热情与力量。</p>
      <div class="quote-box">“教育的本质，不仅在于知识传授，更在于培养创新精神和实践能力。”</div>
      <p>我校相关负责人表示，下一步将进一步完善校内平台能力建设，拓展实践创新项目，并以更高标准推动学生专业发展和综合素养提升。</p>
    `;
  }

  if (side) {
    const items = data.news.slice(1).map((item) => `
      <li class="focus-item"><span>${item.title}</span><span class="tag ${item.tag}">${item.category}</span></li>
    `).join('');
    side.innerHTML = items;
  }
}

function renderProfile(data) {
  const profile = document.querySelector('#profileCard');
  if (!profile || !data.profile) return;
  const current = data.profile;
  profile.innerHTML = `
    <div class="avatar">${current.name.slice(0, 1)}</div>
    <div>
      <h3>${current.name}</h3>
      <p class="page-note">${current.major} · ${current.grade}</p>
    </div>
    <div class="list-stack">
      <div class="mini-item"><div><h4>邮箱</h4><p class="page-note">${current.email}</p></div></div>
      <div class="mini-item"><div><h4>手机</h4><p class="page-note">${current.phone}</p></div></div>
      <div class="mini-item"><div><h4>个人简介</h4><p class="page-note">${current.bio}</p></div></div>
    </div>
  `;
}

function renderAdmin(data) {
  const cards = document.querySelector('#adminCards');
  const chart = document.querySelector('#adminChart');
  const table = document.querySelector('#adminTable');
  if (!cards && !chart && !table) return;

  if (cards && data.admin) {
    cards.innerHTML = data.admin.cards.map((item) => `
      <article class="dashboard-card">
        <span class="kicker">${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `).join('');
  }

  if (chart && data.admin) {
    chart.innerHTML = data.admin.chart.map((value) => `<span style="height:${value}%"></span>`).join('');
  }

  if (table && data.admin) {
    table.innerHTML = data.admin.table.map((row) => `
      <tr>
        <td>${row.name}</td>
        <td><span class="badge ${row.tag}">${row.status}</span></td>
        <td>已同步</td>
      </tr>
    `).join('');
  }
}

function renderHomeEvents(data) {
  const target = document.querySelector('#eventList');
  if (!target || !data.events) return;
  target.innerHTML = data.events.map((item) => `
    <li class="focus-item"><span>${item}</span><span class="tag info">新</span></li>
  `).join('');
}

function renderPage() {
  fetchMockData().then((data) => {
    renderStats(data);
    renderNews(data);
    renderNewsPage(data);
    renderCourses(data);
    renderArticle(data);
    renderProfile(data);
    renderAdmin(data);
    renderHomeEvents(data);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(appState.theme);
  initThemeToggle();
  initNav();
  initTabs();
  initSearchFilter();
  initBackToTop();
  initSwitches();
  initAccordion();
  renderPage();
});
