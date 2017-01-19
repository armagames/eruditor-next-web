function updateRecord(context) {
  var currentFilter = context.dataSources.FilterDataSource.getProperty('$.Filter');
  if (currentFilter && currentFilter.split('/').length === 1) {
    context.dataSources.EruditorDataSource.updateItems();
  } else {
    currentSelectedFilter = context.dataSources.TypesDataSource.getProperty('$.Value');
    context.dataSources.FilterDataSource.setProperty('$.Filter', currentSelectedFilter);
  }
}

function chancheTypeButtonOnClick(context, args) {
  context.dataSources.EruditorDataSource.suspendUpdate();
  var tag = args.source.getTag();
  var hashParam = getHashParams();

  var type = tag.Value || hashParam.type;

  changeFilterItem(context, type);
  context.dataSources.FilterDataSource.setProperty('$.Filter', type);
  context.dataSources.EruditorDataSource.updateItems();
  context.dataSources.EruditorDataSource.resumeUpdate();
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

  changeFilterItem(context, result);
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

  var item = items.find(function (i) {
    return i.Value === type;
  });

  if (item) {
    context.dataSources.TypesDataSource.setSelectedItem(item);
  }
}

function settingsUpdate(context, args) {
  var period = args.value && args.value.Value;

  if (period) {
    console.log(period);
  } else {
    console.log('no autoupdate');
  }

  autoUpdateFunc(context, period, 0);
}

function autoUpdateFunc(context, targetPeriod, count) {
  var settingDataSource = context.dataSources.SettingsDataSource;
  var period = settingDataSource && settingDataSource.getProperty('$.Value');

  if (period && period === targetPeriod) {
    if (count > 0) {
      context.dataSources.EruditorDataSource.updateItems();
    }
    window.setTimeout(autoUpdateFunc.bind(null, context, period, ++count), period);
  }
}

function setPeriodesToDataSource(context) {
  var items = [
    {
      Text: 'Не обновлять',
      Value: 0
    },
    {
      Text: 'Обновлять каждую минуту',
      Value: 60000
    },
    {
      Text: 'Обновлять каждые 5 минут',
      Value: 300000
    },
    {
      Text: 'Обновлять каждые 10 минут',
      Value: 600000
    },
    {
      Text: 'Обновлять каждые 15 минут',
      Value: 900000
    }
  ]

  context.dataSources.PeriodesDataSource.setItems(items);
}