function updateRecord(context, args) {
  context.dataSources.EruditorDataSource.updateItems();
}

function chancheTypeButtonOnClick(context, args) {
  context.dataSources.TypesDataSource.setSelectedItem(args.source.getTag());
}

function responseConverter(context, args) {
  var value = args.value || {};
  var currentHash = location.hash.slice(1);
  var targetHash = getHashFromObject(value);

  if (currentHash !== targetHash) {
    var newUrl = InfinniUI.StringUtils.format('{0}/#{1}', [location.origin, targetHash]);
    history.pushState(null, null, newUrl);
  }

  return [value];
}

function getHashParams() {
  var params = {};

  location.hash.slice(1).split('&')
    .filter(function(i) {
      return i;
    })
    .forEach(function(i) {
      var a=i.split('=');
      params[a[0]] = a[1];
    });

  return params;
}

function getHashFromObject(o) {
  var value = o || {};
  var params = [
    ['type', value.type],
    ['id', value.id]
  ];

  var hash = params.filter(function(i) {
    return i[1];
  }).map(function(i) {
    return i.join('=');
  }).join('&');

  return hash;
}
