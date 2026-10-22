const appData = {
  books: [
    { title: '山海巡夜人', type: '悬疑', author: '纸灯照夜', status: '连载', chapters: 326, desc: '每逢子夜，旧城巷口便会出现一盏不该亮起的灯。', color: 'green', score: '9.8分' },
    { title: '长风渡月', type: '古言', author: '南枝客', status: '连载', chapters: 218, desc: '一封迟到十年的家书，牵出两代人的江湖旧事。', color: 'blue', score: '9.6分' },
    { title: '星河彼岸', type: '科幻', author: '林间电波', status: '连载', chapters: 492, desc: '人类第一次收到来自星海深处的回信。', color: 'purple', score: '9.7分' },
    { title: '雾海来信', type: '悬疑', author: '白鲸先生', status: '连载', chapters: 174, desc: '海雾散去后，岛上每个人都收到了一封信。', color: 'teal', score: '9.5分' },
    { title: '春日来信', type: '言情', author: '七分甜', status: '完结', chapters: 108, desc: '从一场雨开始的故事，在盛夏里有了答案。', color: 'pink', score: '9.4分' },
    { title: '云上便利店', type: '都市', author: '晚风汽水', status: '连载', chapters: 265, desc: '凌晨两点营业的小店，收藏着城市里的温柔。', color: 'orange', score: '9.6分' },
    { title: '拾光事务所', type: '都市', author: '木子由', status: '连载', chapters: 199, desc: '替人寻找遗失记忆的事务所，迎来一位特殊客人。', color: 'red', score: '9.3分' },
    { title: '青崖问道', type: '玄幻', author: '山中客', status: '连载', chapters: 580, desc: '山门之外，少年带着一把旧剑走入天地之间。', color: 'gold', score: '9.7分' },
    { title: '夏夜观测站', type: '青春', author: '柠檬海', status: '完结', chapters: 96, desc: '一群年轻人在海边天文台，记录夏夜与成长。', color: 'sky', score: '9.5分' },
    { title: '纸城旧梦', type: '悬疑', author: '闻钟', status: '连载', chapters: 142, desc: '一座地图上不存在的城，住着记得所有往事的人。', color: 'slate', score: '9.2分' }
  ],
  categories: [
    { name: '玄幻奇幻', icon: '✧', filter: '玄幻' },
    { name: '现代言情', icon: '♡', filter: '言情' },
    { name: '都市生活', icon: '⌂', filter: '都市' },
    { name: '悬疑推理', icon: '◉', filter: '悬疑' },
    { name: '科幻末世', icon: '✦', filter: '科幻' }
  ],
  rankings: [
    { title: '本周人气榜', list: ['山海巡夜人', '星河彼岸', '青崖问道', '长风渡月', '云上便利店'] },
    { title: '新书潜力榜', list: ['雾海来信', '春日来信', '拾光事务所', '夏夜观测站', '纸城旧梦'] },
    { title: '读者收藏榜', list: ['星河彼岸', '山海巡夜人', '云上便利店', '青崖问道', '长风渡月'] }
  ]
};

function renderBooks(target, list = appData.books) {
  const container = document.querySelector(target);
  if (!container) return;

  container.innerHTML = list.length ? list.map((book) => `
    <a class="book-card" href="detail.html?book=${encodeURIComponent(book.title)}" aria-label="查看《${book.title}》详情">
      <div class="cover cover-${book.color}">
        <span class="cover-label">原创好书</span>
        <strong>${book.title}</strong>
        <small>${book.author} 著</small>
      </div>
      <div class="body">
        <h3>${book.title}</h3>
        <p class="book-desc">${book.desc}</p>
        <div class="meta-row"><span>${book.type}</span><span>${book.score}</span></div>
      </div>
    </a>
  `).join('') : '<p class="empty-state">没有找到相关作品，试试其他关键词吧。</p>';
}

function renderCategories() {
  const container = document.querySelector('#categoryGrid');
  if (!container) return;

  container.innerHTML = appData.categories.map((cat) => `
    <a class="category-card" href="category.html?type=${encodeURIComponent(cat.filter)}">
      <div class="category-icon">${cat.icon}</div>
      <h3>${cat.name}</h3>
      <span>探索作品 ›</span>
    </a>
  `).join('');
}

function renderRankings() {
  const container = document.querySelector('#rankGrid');
  if (!container) return;

  container.innerHTML = appData.rankings.map((rank) => `
    <div class="rank-card">
      <div class="rank-header">
        <h3>${rank.title}</h3>
        <span class="rank-pill">TOP</span>
      </div>
      <ul class="rank-list">
        ${rank.list.map((item, index) => `
          <li>
            <a class="rank-name" href="detail.html?book=${encodeURIComponent(item)}">${index + 1}. ${item}</a>
            <span class="rank-score">${(9.8 - index * 0.2).toFixed(1)}分</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function initSearch() {
  const input = document.querySelector('[data-search-input]');
  if (!input) return;
  input.addEventListener('input', (event) => {
    const keyword = event.target.value.trim().toLowerCase();
    const filtered = appData.books.filter((book) => {
      return book.title.toLowerCase().includes(keyword) || book.author.toLowerCase().includes(keyword) || book.type.toLowerCase().includes(keyword);
    });
    renderBooks('#bookGrid', filtered);
  });
}

function initFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      const active = button.dataset.filter;
      const filtered = active === 'all' ? appData.books : appData.books.filter((book) => book.type === active || book.status === active || book.title.includes(active));
      renderBooks('#bookGrid', filtered);
    });
  });

  const requestedType = new URLSearchParams(location.search).get('type');
  const matchingButton = [...buttons].find((button) => button.dataset.filter === requestedType);
  if (matchingButton) matchingButton.click();
}

function initReaderControls() {
  const reader = document.querySelector('.reader-page');
  const content = document.querySelector('.read-content');
  if (!reader || !content) return;

  let fontSize = Number(localStorage.getItem('reader-font-size')) || 18;
  const applyFontSize = () => {
    content.style.setProperty('--reader-font-size', `${fontSize}px`);
  };
  applyFontSize();

  document.querySelectorAll('[data-reader-font]').forEach((button) => {
    button.addEventListener('click', () => {
      fontSize = Math.min(26, Math.max(14, fontSize + (button.dataset.readerFont === 'plus' ? 2 : -2)));
      localStorage.setItem('reader-font-size', String(fontSize));
      applyFontSize();
    });
  });

  const themeButton = document.querySelector('[data-reader-theme]');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const themes = ['', 'theme-white', 'theme-dark'];
      const current = reader.classList.contains('theme-dark') ? 2 : reader.classList.contains('theme-white') ? 1 : 0;
      reader.classList.remove('theme-white', 'theme-dark');
      const next = themes[(current + 1) % themes.length];
      if (next) reader.classList.add(next);
      localStorage.setItem('reader-theme', next);
    });
    const savedTheme = localStorage.getItem('reader-theme');
    if (savedTheme) reader.classList.add(savedTheme);
  }
}

function initFavorite() {
  const button = document.querySelector('[data-favorite]');
  if (!button) return;
  const key = 'novel-favorites';
  const title = button.dataset.favorite;
  const getSaved = () => JSON.parse(localStorage.getItem(key) || '[]');
  const update = () => {
    const saved = getSaved();
    const isSaved = saved.includes(title);
    button.classList.toggle('saved', isSaved);
    button.textContent = isSaved ? '♥ 已加入书架' : '♡ 加入书架';
  };
  button.addEventListener('click', () => {
    const saved = getSaved();
    const next = saved.includes(title) ? saved.filter((item) => item !== title) : [...saved, title];
    localStorage.setItem(key, JSON.stringify(next));
    update();
  });
  update();
}

function renderBookshelf() {
  const container = document.querySelector('#bookGrid');
  if (!container) return;
  const saved = JSON.parse(localStorage.getItem('novel-favorites') || '[]');
  const books = appData.books.filter((book) => saved.includes(book.title));
  renderBooks('#bookGrid', books);
  if (!books.length) {
    container.innerHTML = '<div class="empty-shelf"><span>♡</span><h2>书架还是空的</h2><p>遇到喜欢的故事，加入书架后就能在这里继续阅读。</p><a class="primary-btn" href="category.html">去发现好书</a></div>';
  }
}

function renderDetail() {
  const titleElement = document.querySelector('#detailTitle');
  if (!titleElement) return;

  const requestedTitle = new URLSearchParams(location.search).get('book');
  const book = appData.books.find((item) => item.title === requestedTitle) || appData.books[0];
  const title = document.querySelector('#detailTitle');
  const meta = document.querySelector('#detailMeta');
  const description = document.querySelector('#detailDescription');
  const cover = document.querySelector('#detailCover');
  const favorite = document.querySelector('[data-favorite]');
  const readLink = document.querySelector('#startReading');
  const chapterList = document.querySelector('#detailChapterList');
  const chapters = book.title === '山海巡夜人'
    ? ['雨夜旧灯', '没有影子的客人', '山海旧约', '渡口来信', '灯下的名字']
    : ['故事开始', '新的线索', '意外来客', '命运转折', '下一段旅程'];

  title.textContent = book.title;
  if (meta) meta.innerHTML = `<span>作者：${book.author}</span><span>分类：${book.type}</span><span>更新：今天 08:30</span><span>章节：${book.chapters}</span>`;
  if (description) description.textContent = book.desc;
  if (cover) {
    cover.className = `book-cover-large cover-${book.color}`;
    cover.innerHTML = `<span class="cover-label">原创好书</span><strong>${book.title}</strong><small>${book.author} 著</small>`;
  }
  if (favorite) favorite.dataset.favorite = book.title;
  const readUrl = `read.html?book=${encodeURIComponent(book.title)}`;
  if (readLink) readLink.href = readUrl;
  if (chapterList) {
    chapterList.innerHTML = chapters.map((chapter, index) => `
      <div class="chapter-item"><a href="${readUrl}">第${index + 1}章 ${chapter}</a><span>${index === 0 ? '已更新' : '目录'}</span></div>
    `).join('');
  }
}

function renderReaderTitle() {
  const title = document.querySelector('#readerBookTitle');
  if (!title) return;
  const requestedTitle = new URLSearchParams(location.search).get('book');
  const book = appData.books.find((item) => item.title === requestedTitle) || appData.books[0];
  title.textContent = book.title;
  document.title = `阅读《${book.title}》 - 番茄小说`;
  const chapterTitle = document.querySelector('#readerChapterTitle');
  if (chapterTitle && book.title !== '山海巡夜人') chapterTitle.textContent = '第一章 故事开始';
  const author = document.querySelector('#readerAuthor');
  if (author) author.textContent = `${book.author} · 阅读体验演示`;

  const bookUrl = `detail.html?book=${encodeURIComponent(book.title)}`;
  const readUrl = `read.html?book=${encodeURIComponent(book.title)}`;
  document.querySelectorAll('[data-reader-back]').forEach((link) => {
    link.href = bookUrl;
  });
  const nextLink = document.querySelector('[data-reader-next]');
  if (nextLink) nextLink.href = readUrl;

  const chapterList = document.querySelector('.reader-page .chapter-list');
  if (chapterList && book.title !== '山海巡夜人') {
    const chapters = ['故事开始', '新的线索', '意外来客', '命运转折', '下一段旅程'];
    chapterList.innerHTML = chapters.map((chapter, index) => `
      <div class="chapter-item${index === 0 ? ' current' : ''}"><a href="${readUrl}">第${index + 1}章 ${chapter}</a><span>${index === 0 ? '正在阅读' : '未读'}</span></div>
    `).join('');
  }

  if (book.title !== '山海巡夜人') {
    const content = document.querySelector('.read-content');
    if (content) {
      const paragraphs = [
        `${book.desc}`,
        `故事从一个寻常的清晨开始。${book.author}笔下的人物，在熟悉的生活里发现了意料之外的变化。`,
        `他们不知道前方会遇见什么，只能带着心里的疑问继续向前。每一次选择，都让这个故事离它真正的答案更近一步。`
      ];
      content.replaceChildren(...paragraphs.map((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
    }
  }
}

async function loadBooks() {
  try {
    const response = await fetch('assets/books.json');
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.books) || payload.books.length < 4) {
      throw new Error('Book data must contain at least four records');
    }
    appData.books = payload.books;
  } catch (error) {
    console.error('无法加载小说列表数据，当前使用内置演示数据。', error);
  }

  renderCategories();
  renderRankings();
  if (document.querySelector('[data-bookshelf]')) renderBookshelf();
  else renderBooks('#bookGrid');
  renderDetail();
  renderReaderTitle();
  initSearch();
  initFilters();
  initReaderControls();
  initFavorite();
}

document.addEventListener('DOMContentLoaded', loadBooks);
