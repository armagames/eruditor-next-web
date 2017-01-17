function ShareBox(context, args) {
  this.services = [
    'vkontakte',
    'twitter',
    'telegram'
  ];

  this.getDefaultContent = function () {
    return {
      url: location.href,
      title: 'Eruditor.Next',
      description: 'когда нечем занять свободное время',
      image: location.origin + '/imgs/book-200.png'
    }
  };

  this.getCurrentContent = function (context) {
    var record = context.dataSources.EruditorDataSource.getSelectedItem();
    if (!record) {
      return;
    }
    var typeName = context.dataSources.TypesDataSource
      .getSelectedItem().Name;
    var contentByService = {};
    for (var i = 0; i < this.services.length; i++) {
      contentByService[this.services[i]] = this.getDefaultContent();
    }

    if (contentByService.vkontakte) {
      contentByService.vkontakte.description = record.text;
      contentByService.vkontakte.title = InfinniUI.StringUtils
        .format('{0} - {1}', [typeName, contentByService.vkontakte.title]);
    }

    if (contentByService.twitter) {
      contentByService.twitter.description = record.text;
      contentByService.twitter.title = contentByService.twitter.description;
    }

    if (contentByService.telegram) {
      contentByService.telegram.description = record.text;
      contentByService.telegram.title = InfinniUI.StringUtils
        .format('{0} - {1}: {2}', [contentByService.telegram.title, typeName, contentByService.telegram.description]);
    }

    return contentByService;
  };

  this.render = function () {
    args.$el.append('<div id="share-box" style="margin: 25px;"></div>');
    window.setTimeout(renderYaShare.bind(this, context), 0);
  };

  context.dataSources.EruditorDataSource.onSelectedItemChanged(update.bind(this));

  function renderYaShare(context) {
    this.shareBox = Ya.share2('share-box', {
      contentByService: this.getCurrentContent(context),
      theme: {
        services: this.services.join(','),
        lang: 'ru'
      }
    });
  }

  function update(context) {
    if (this.shareBox) {
      var record = this.getCurrentContent(context);
      this.shareBox.updateContentByService(record);
    }
  }
}
