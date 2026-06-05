fetch(`/logs/geo-politics/${today}.json`)
  .then(res => res.json())
  .then(data => renderGeoPolitics(data));
