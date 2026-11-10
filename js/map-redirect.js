const views = {
  '#grid-map': 'reliability',
  '#load-growth': 'forecast',
  '#supply-deficit': 'deficit',
  '#off-grid': 'offgrid',
};
location.replace('index.html?view=' + (views[location.hash] || 'reliability') + '#lab');
