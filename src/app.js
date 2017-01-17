function updateRecord(context, args) {
  var currentFilter = context.dataSources.FilterDataSource.getProperty('$.Filter');
  if (currentFilter && currentFilter.split('/').length === 1) {
    context.dataSources.EruditorDataSource.updateItems();
  } else {
    currentSelectedFilter = context.dataSources.TypesDataSource.getProperty('$.Value');
    context.dataSources.FilterDataSource.setProperty('$.Filter', currentSelectedFilter);
  }
}

function chancheTypeButtonOnClick(context, args) {
  context.dataSources.TypesDataSource.setSelectedItem(args.source.getTag());
  var tag = context.dataSources.TypesDataSource.getSelectedItem();
  var hashParam = getHashParams();

  var type = tag.Value || hashParam.type;

  changeFilterItem(context, type);
  context.dataSources.FilterDataSource.setProperty('$.Filter', type);
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

function onLoaded(context, args) {
  window.onpopstate = function (e) {
    onPopStateFunc(context, args, e);
  }
}

function onPopStateFunc(context, args, e) {
  var hashParams = getHashParams();
  var filter = getValueOrDefault(hashParams);
  changeFilterItem(context, filter);
  context.dataSources.FilterDataSource.setProperty('$.Filter', filter);
}

function filterConverter(context, args) {
  var hashParams = getHashParams();
  var result = args.value || getValueOrDefault(hashParams);

  return result;
}

function getHashParams() {
  return location.hash.slice(1);
}

function getHashFromObject(o) {
  var paramsArray = getParamsAsArrayFromObject(o);
  var hash = paramsArray.join('/');
  return hash;
}

function getParamsAsArrayFromObject(o) {
  var value = o || {};
  return [
    value.type,
    value._id
  ].filter(function (i) {
    return i;
  });
}

function getValueOrDefault(value) {
  return value || 'fact';
}

function changeFilterItem(context, filter) {
  var f = (filter || '').split('/')[0];
  var type = getValueOrDefault(f);

  var items = context.dataSources.TypesDataSource.getItems();

  var item = items.find(function(i) {
    return i.Value === type;
  });

  if (item) {
    context.dataSources.TypesDataSource.setSelectedItem(item);
  }
}
