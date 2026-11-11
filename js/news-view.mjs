const dateFormat = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const labels = {
  energy: 'ENERGY & GRIDS',
  nuclear: 'NUCLEAR',
  climate: 'CLIMATE',
  infrastructure: 'INFRASTRUCTURE',
};
const text = (node, value) => {
  if (node.textContent !== value) node.textContent = value;
};

// Keep an article's DOM identity across refreshes, including its focused link.
// Incoming articles have already passed news-core's source and date validation.
export function renderNewsCards(grid, articles, health, emptyMessage) {
  const doc = grid.ownerDocument;
  const focused = doc.activeElement;
  const hadFocus = grid.contains(focused);
  const oldIndex = [...grid.children].indexOf(focused?.closest('.news-card'));
  const existing = new Map(
    [...grid.querySelectorAll('.news-card')].map((card) => [card.dataset.url, card]),
  );
  const wanted = new Set(articles.map((article) => article.url));
  for (const child of [...grid.children]) {
    if (!wanted.has(child.dataset.url)) child.remove();
  }
  articles.forEach((article, index) => {
    let card = existing.get(article.url);
    if (!card) {
      card = doc.createElement('article');
      card.className = 'news-card';
      card.dataset.url = article.url;
      const meta = doc.createElement('div');
      meta.className = 'news-card-meta';
      meta.append(doc.createElement('span'), doc.createElement('time'));
      const link = doc.createElement('a');
      link.href = article.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(meta, doc.createElement('h3'), link);
    }
    card.dataset.topic = article.topic;
    text(card.querySelector('.news-card-meta span'), labels[article.topic] || 'NEWS');
    const time = card.querySelector('time');
    time.dateTime = article.publishedAt;
    text(time, dateFormat.format(new Date(article.publishedAt)));
    text(card.querySelector('h3'), article.title);
    const link = card.querySelector('a');
    text(link, article.publisher + (health[article.source]?.state === 'live' ? '' : ' · saved'));
    link.setAttribute('aria-label', `Read ${article.title}; ${article.publisher}`);
    if (grid.children[index] !== card) grid.insertBefore(card, grid.children[index] || null);
  });
  if (!articles.length) {
    const empty = doc.createElement('p');
    empty.className = 'news-empty';
    empty.textContent = emptyMessage;
    grid.append(empty);
  }
  if (hadFocus && doc.activeElement !== focused) {
    const target = focused.isConnected
      ? focused
      : grid.children[Math.max(0, Math.min(oldIndex, articles.length - 1))]?.querySelector('a');
    if (target) target.focus({ preventScroll: true });
    else {
      grid.tabIndex = -1;
      grid.focus({ preventScroll: true });
    }
  }
}
