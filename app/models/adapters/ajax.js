Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
    initAdapter: function () {
        this.hostsByType = {};
    },

    get: function (type, uri, success) {
        var host = this.getHostForType(type);

        // HACK this goes away when we have oAuth
        var authedUri = uri;
        if(type.requiresMarketplaceParamForFind) {
            authedUri = this._appendMarketplaceAuthParam(uri);
        }

        this.ajax(host + authedUri, 'GET').then(function (json) {
            success(json);
        });
    },

    create: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        var host = this.getHostForType(type);

        // HACK this goes away when we have oAuth
        var authedUri = uri;
        if(type.requiresMarketplaceParamForCreate) {
            authedUri = this._appendMarketplaceAuthParam(uri);
        }

        this.ajax(host + authedUri, 'POST', settings).then(function (json) {
            success(json);
        });
    },

    update: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        var host = this.getHostForType(type);

        // HACK this goes away when we have oAuth
        var authedUri = uri;
        if(type.requiresMarketplaceParamForUpdate) {
            authedUri = this._appendMarketplaceAuthParam(uri);
        }

        this.ajax(host + authedUri, 'PUT', settings).then(function (json) {
            success(json);
        });
    },

    delete: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        var host = this.getHostForType(type);

        // HACK this goes away when we have oAuth
        var authedUri = uri;
        if(type.requiresMarketplaceParamForDelete) {
            authedUri = this._appendMarketplaceAuthParam(uri);
        }

        this.ajax(host + authedUri, 'DELETE', settings).then(function (json) {
            success(json);
        });
    },

    ajax: function (url, type, settings) {
        settings = settings || {};
        settings.url = url;
        settings.type = type;
        settings.context = this;
        return Balanced.Auth.send(settings);
    },

    registerHostForType: function (type, host) {
        this.hostsByType[type] = host;
    },

    getHostForType: function (type) {
        var host = ENV.BALANCED.API;
        if (this.hostsByType[type]) {
            host = this.hostsByType[type];
        }
        return host;
    },

    _appendMarketplaceAuthParam: function(uri) {
        if(Balanced.currentMarketplace) {
            return uri + '?marketplace=' + Balanced.currentMarketplace.get('id');
        } else {
            return uri;
        }
    }
});
