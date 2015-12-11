(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mosaic-adapters"), require("mosaic-dataset"), require("mosaic-dataset-index"));
	else if(typeof define === 'function' && define.amd)
		define(["mosaic-adapters", "mosaic-dataset", "mosaic-dataset-index"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("mosaic-adapters"), require("mosaic-dataset"), require("mosaic-dataset-index")) : factory(root["mosaic-adapters"], root["mosaic-dataset"], root["mosaic-dataset-index"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libAppModel = __webpack_require__(1);

	var _libAppModel2 = _interopRequireDefault(_libAppModel);

	var _libEntitySearchCriteria = __webpack_require__(8);

	var _libEntitySearchCriteria2 = _interopRequireDefault(_libEntitySearchCriteria);

	var _libEnumeratedDataSet = __webpack_require__(6);

	var _libEnumeratedDataSet2 = _interopRequireDefault(_libEnumeratedDataSet);

	var _libResource = __webpack_require__(5);

	var _libResource2 = _interopRequireDefault(_libResource);

	var _libTextSearchCriteria = __webpack_require__(7);

	var _libTextSearchCriteria2 = _interopRequireDefault(_libTextSearchCriteria);

	exports['default'] = {
	    AppModel: _libAppModel2['default'],
	    EntitySearchCriteria: _libEntitySearchCriteria2['default'],
	    EnumeratedDataSet: _libEnumeratedDataSet2['default'],
	    Resource: _libResource2['default'],
	    TextSearchCriteria: _libTextSearchCriteria2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var _bind = Function.prototype.bind;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _mosaicAdapters = __webpack_require__(2);

	var _mosaicDataset = __webpack_require__(3);

	var _mosaicDatasetIndex = __webpack_require__(4);

	var _Resource = __webpack_require__(5);

	var _Resource2 = _interopRequireDefault(_Resource);

	var _EnumeratedDataSet = __webpack_require__(6);

	var _EnumeratedDataSet2 = _interopRequireDefault(_EnumeratedDataSet);

	var _TextSearchCriteria = __webpack_require__(7);

	var _TextSearchCriteria2 = _interopRequireDefault(_TextSearchCriteria);

	/**
	 * Application model contains the following features:
	 * <ul>
	 * <li>It contains a main data set with data</li>
	 * <li>It contains a "searchIndex" data set with multiple full-text indexes for
	 * the main dataset. The method "search" allows to update the content of this
	 * index.</li>
	 * <li>It contains the "searchCriteria" data set with instances of the
	 * "EntitySearchCriteria" class. Changes in this data set automatically updates
	 * the "searchIndex" set. </li>
	 * <li>A "paginatedDataSet" gives access to a limited sub-set of found
	 * elements. It implements pagination of search results</li>
	 * <li>"openItems" data set giving access to open/activated items. It
	 * automatically updates position in the "paginatedDataSet" - it focus the page
	 * with the first open item.</li>
	 * </ul>
	 * Important methods of this class:
	 * <ul>
	 * <li>The "suggest" method allows to retrieve a list of search criteria
	 * objects matching to the specified text mask</li>
	 * <li>The "search" method allows to execute a search using a data set
	 * containing search criteria objects</li>
	 * </ul>
	 */

	var AppModel = (function () {
	    function AppModel(options) {
	        _classCallCheck(this, AppModel);

	        options = options || {};
	        var that = this;
	        that.options = options;
	        if (!that.options.DataType) {
	            that.options.DataType = _Resource2['default'];
	        }

	        for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            params[_key - 1] = arguments[_key];
	        }

	        that.dataSet = that._newDataSet.apply(that, [options].concat(params));
	        that.adapters = that.dataSet.adapters;

	        // Search criteria
	        that.searchCriteria = that._newSearchCriteria();

	        // Search index and suggestion indexes
	        var indexFields = {};
	        that.suggestionIndexes = {};
	        that.searchCriteriaTypes.forEach(function (DataType) {
	            var indexKey = DataType.indexKey;
	            indexFields[indexKey] = DataType.indexFields;
	            that.suggestionIndexes[indexKey] = that._newSuggestionIndex({
	                DataType: DataType,
	                indexFields: DataType.suggestionFields
	            });
	        });
	        that.searchIndex = that.dataSet.newAdapter(_mosaicDatasetIndex.SearchableDataSet, {
	            indexFields: indexFields
	        });
	        that.searchIndex.options.cluster = true;

	        // Paginated data set for search results
	        that.paginatedDataSet = that.searchIndex.getAdapter(_mosaicDataset.DataSetPaginated);
	        that.paginatedDataSet.pageSize = 20;

	        // Open items
	        that.openItems = that.dataSet.getAdapter(_mosaicDataset.DataSetSelection);
	        that.openItems.addListener('update', function (intent) {
	            intent.then(function () {
	                var item = that.openItems.get(0);
	                if (item) {
	                    var pos = that.searchIndex.pos(item) || 0;
	                    that.paginatedDataSet.focusPos(pos);
	                }
	            });
	        });

	        // Bind event listeners to this object
	        that._onDataSetUpdate = that._onDataSetUpdate.bind(that);
	        that._runSearch = that._runSearch.bind(that);
	    }

	    // ------------------------------------------------------------------------

	    _createClass(AppModel, [{
	        key: 'open',
	        value: function open(options) {
	            options = options || {};
	            var that = this;
	            return Promise.resolve().then(function () {
	                that.dataSet.addListener('update', that._onDataSetUpdate);
	                that.searchCriteria.addListener('update', that._runSearch);
	            }).then(function () {
	                // Set configuration parameters;
	                // Initializes suggestion data sets
	                return that.setSuggestions(options);
	            }).then(function () {
	                // Set the resources in the main dataset
	                return that.dataSet.setItems(options.resources);
	            }).then(function () {
	                // Reset search criteria
	                var searchCriteria = options.searchCriteria || [];
	                return that.searchCriteria.setItems(searchCriteria);
	            });
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var that = this;
	            var result = _get(Object.getPrototypeOf(AppModel.prototype), 'close', this).call(this);
	            return Promise.resolve().then(function () {
	                that.searchCriteria.removeListener('update', that._runSearch);
	                that.dataSet.removeListener('update', that._onDataSetUpdate);
	                return result;
	            });
	        }

	        // ------------------------------------------------------------------------

	        /**
	         * Re-initializes suggestion indexes.
	         */
	    }, {
	        key: 'setSuggestions',
	        value: function setSuggestions(options, reset) {
	            var that = this;
	            var promises = [];
	            Object.keys(that.suggestionIndexes).forEach(function (indexKey) {
	                var values = options[indexKey];
	                if (values || !!reset) {
	                    values = values || [];
	                    var set = that.suggestionIndexes[indexKey];
	                    promises.push(set.setItems(values));
	                }
	            });
	            return Promise.all(promises);
	        }

	        // ------------------------------------------------------------------------

	        /**
	         * Returns a promise with SearchCriteria objects corresponding to the
	         * specified query.
	         */
	    }, {
	        key: 'suggest',
	        value: function suggest(query) {
	            var that = this;
	            var maxNumber = this.maxSuggestResults;
	            var promises = [];
	            promises.push(that.suggestTextQuery(query, maxNumber));
	            Object.keys(that.suggestionIndexes).forEach(function (indexKey) {
	                var set = that.suggestionIndexes[indexKey];
	                promises.push(set.search(query, maxNumber));
	            });
	            var adapters = that.adapters;
	            return Promise.all(promises).then(function (dataSets) {
	                var items = [];
	                dataSets.forEach(function (dataSet) {
	                    if (!dataSet || !dataSet.length) return;
	                    items = items.concat(dataSet.items);
	                });
	                return new _mosaicDatasetIndex.SearchCriteriaDataSet({
	                    adapters: adapters,
	                    items: items
	                });
	            });
	        }
	    }, {
	        key: 'suggestTextQuery',
	        value: function suggestTextQuery(query) {
	            var that = this;
	            var adapters = that.adapters;
	            return Promise.resolve().then(function () {
	                var items = [];
	                if (query && query.length) {
	                    var key = query ? '' + query : '';
	                    items.push({
	                        key: key,
	                        values: [query]
	                    });
	                }
	                var result = new _mosaicDataset.DataSet({
	                    adapters: adapters,
	                    DataType: that.TextSearchCriteria
	                });
	                return result.setItems(items).then(function () {
	                    return result;
	                });
	            });
	        }

	        // ------------------------------------------------------------------------

	    }, {
	        key: 'search',
	        value: function search(query) {
	            return this.searchIndex.search(query);
	        }

	        // ------------------------------------------------------------------------

	    }, {
	        key: 'serializeSearchCriteria',
	        value: function serializeSearchCriteria() {
	            var that = this;
	            var result = {};
	            var searchCriteria = this.searchCriteria;
	            searchCriteria.visit({
	                before: function before(criterion) {
	                    var indexKey = criterion.indexKey;
	                    if (!indexKey) return;
	                    var set = that.suggestionIndexes[indexKey];
	                    var value = !!set ? set.getSearchValues(criterion) : undefined;
	                    var prev = result[indexKey] || [];
	                    result[indexKey] = prev.concat(value);
	                }
	            });
	            Object.keys(that.suggestionIndexes).forEach(function (indexKey) {
	                if (indexKey in result) return;
	                result[indexKey] = null;
	            });
	            return result;
	        }
	    }, {
	        key: 'deserializeSearchCriteria',
	        value: function deserializeSearchCriteria(params) {
	            params = params || {};
	            var adapters = this.adapters;
	            var items = [];
	            var that = this;
	            Object.keys(that.suggestionIndexes).forEach(function (indexKey) {
	                var values = params[indexKey];
	                if (!values) return;
	                values = Array.isArray(values) ? values : [values];
	                var set = that.suggestionIndexes[indexKey];
	                if (!set || typeof set.getSearchCriterion !== 'function') return;
	                values.forEach(function (value) {
	                    var item = set.getSearchCriterion(value, true);
	                    if (item) {
	                        items.push(item);
	                    }
	                });
	            });
	            return this.searchCriteria.setItems(items);
	        }

	        // ------------------------------------------------------------------------

	    }, {
	        key: 'serializeOpenItems',
	        value: function serializeOpenItems() {
	            return this.openItems.items.map(function (item) {
	                return item.id;
	            });
	        }
	    }, {
	        key: 'deserializeOpenItems',
	        value: function deserializeOpenItems(ids) {
	            if (!Array.isArray(ids)) {
	                ids = !!ids ? [ids] : [];
	            }
	            var that = this;
	            var items = [];
	            ids.forEach(function (id) {
	                var item = that.dataSet.byId(id);
	                if (item) {
	                    items.push(item);
	                }
	            });
	            return this.openItems.setItems(items);
	        }

	        // ------------------------------------------------------------------------

	    }, {
	        key: 'getSearchCriteria',
	        value: function getSearchCriteria(indexKey, value) {
	            var set = that.suggestionIndexes[indexKey];
	            return set ? set.getItem(value, true) : null;
	        }
	    }, {
	        key: '_newSuggestionIndex',

	        // ------------------------------------------------------------------------

	        value: function _newSuggestionIndex(options) {
	            options.adapters = this.adapters;
	            return new _EnumeratedDataSet2['default'](options);
	        }

	        /** Creates and returns a new dataset */
	    }, {
	        key: '_newDataSet',
	        value: function _newDataSet() {
	            var Type = this.options.DataSetType || _mosaicDataset.DataSet;

	            for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                params[_key2] = arguments[_key2];
	            }

	            return new (_bind.apply(Type, [null].concat(params)))();
	        }
	    }, {
	        key: '_newSearchCriteria',
	        value: function _newSearchCriteria() {
	            var adapters = this.adapters;
	            return new _mosaicDatasetIndex.SearchCriteriaDataSet({
	                adapters: adapters,
	                defaultIndexKey: 'q'
	            });
	        }
	    }, {
	        key: '_onDataSetUpdate',
	        value: function _onDataSetUpdate(intent) {
	            var that = this;
	            intent.then(function () {
	                return Promise.resolve().then(function () {
	                    var promises = [];
	                    // Automatically extracts all fields marked with the "suggest"
	                    // flag
	                    Object.keys(that.suggestionIndexes).forEach(function (indexKey) {
	                        var set = that.suggestionIndexes[indexKey];
	                        var indexFields = set.DataType.indexFields;
	                        Object.keys(indexFields).forEach(function (fieldName) {
	                            var field = indexFields[fieldName];
	                            if (!field.suggest) return;
	                            var values = that._extractFieldValues(fieldName);
	                            promises.push(set.setItems(values));
	                        });
	                    });
	                    promises.push(that.search(that.searchCriteria));
	                    return Promise.all(promises);
	                });
	            });
	        }
	    }, {
	        key: '_extractFieldValues',
	        value: function _extractFieldValues(path) {
	            var index = {};
	            this.dataSet.forEach(function (r) {
	                var values = r.get(path);
	                if (!values) return;
	                if (!Array.isArray(values)) {
	                    values = [values];
	                }
	                values.forEach(function (val) {
	                    var key = val; // val.toLowerCase();
	                    var obj = index[key] = index[key] || {
	                        key: key,
	                        values: []
	                    };
	                    if (obj.values.indexOf(val) < 0) {
	                        obj.values.push(val);
	                        obj.values.sort();
	                    }
	                });
	            });
	            return Object.keys(index).sort().map(function (key) {
	                return index[key];
	            });
	        }
	    }, {
	        key: '_runSearch',
	        value: function _runSearch(intent) {
	            var that = this;
	            var before = that.serializeSearchCriteria();
	            return intent.then(function () {
	                var after = that.serializeSearchCriteria();
	                if (JSON.stringify(before) == JSON.stringify(after)) return;
	                return that.search(that.searchCriteria);
	            });
	        }
	    }, {
	        key: 'maxSuggestResults',
	        get: function get() {
	            return this.options.maxSuggestResults || 3;
	        }

	        // ------------------------------------------------------------------------

	    }, {
	        key: 'TextSearchCriteria',
	        get: function get() {
	            var Type = this.options.TextSearchCriteria || _TextSearchCriteria2['default'];
	            return Type;
	        }
	    }, {
	        key: 'searchCriteriaTypes',
	        get: function get() {
	            if (!this._searchCriteriaTypes) {
	                var types = this.options.searchCriteriaTypes || [];
	                this._searchCriteriaTypes = types;
	            }
	            return this._searchCriteriaTypes;
	        }
	    }]);

	    return AppModel;
	})();

	exports['default'] = AppModel;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _mosaicAdapters = __webpack_require__(2);

	var _mosaicDataset = __webpack_require__(3);

	var TypeKeyCache = {};

	var Resource = (function (_Data) {
	    _inherits(Resource, _Data);

	    function Resource() {
	        _classCallCheck(this, Resource);

	        _get(Object.getPrototypeOf(Resource.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(Resource, [{
	        key: 'getTypeKey',
	        value: function getTypeKey() {
	            if (!this._typeKey) {
	                var type = undefined;
	                var data = this.data;
	                if (data && data.properties) {
	                    var props = data.properties;
	                    type = props.type || props.category || null;
	                }
	                if (type) {
	                    this._typeKey = TypeKeyCache[type];
	                }
	                if (!this._typeKey) {
	                    var rootTypeKey = this.constructor.getTypeKey();
	                    if (type) {
	                        var list = [].concat(rootTypeKey.segments);
	                        list.push(type);
	                        var str = list.join('/');
	                        this._typeKey = TypeKeyCache[type] = _mosaicAdapters.TypeKey['for'](str);
	                    } else {
	                        this._typeKey = rootTypeKey;
	                    }
	                }
	            }
	            return this._typeKey;
	        }
	    }], [{
	        key: 'getTypeKey',
	        value: function getTypeKey() {
	            if (!this._typeKey) {
	                this._typeKey = _mosaicAdapters.TypeKey['for'](this.name);
	            }
	            //        console.log('TYPE KEY', this._typeKey);
	            return this._typeKey;
	        }
	    }]);

	    return Resource;
	})(_mosaicDataset.Data);

	exports['default'] = Resource;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _mosaicDataset = __webpack_require__(3);

	var _mosaicDatasetIndex = __webpack_require__(4);

	/**
	 * Instances of this type are used as containers for enumerated values for
	 * searching. This class exposes two utility methods used to search in the
	 * enumeration. To define search indexes the constructor for this class should
	 * contain the "indexFields" option or the DataType for this enumeration should
	 * contain a static "indexFields" field. This parameter defines how enumerated
	 * objects should be indexed.
	 * 
	 * <pre>
	 * Example of the &quot;indexFields&quot; parameter defining 
	 * the &quot;title&quot; and &quot;tags&quot; as fields used for search:
	 * const indexFields = {
	 *     &quot;title&quot; : {
	 *         &quot;boost&quot; : 10,
	 *         &quot;suggest&quot; : true
	 *     },
	 *     &quot;tags&quot; : {
	 *         &quot;boost&quot; : 2
	 *     }
	 * };
	 * </pre>
	 */

	var EnumeratedDataSet = (function (_DataSet) {
	    _inherits(EnumeratedDataSet, _DataSet);

	    function EnumeratedDataSet() {
	        _classCallCheck(this, EnumeratedDataSet);

	        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
	            params[_key] = arguments[_key];
	        }

	        _get(Object.getPrototypeOf(EnumeratedDataSet.prototype), 'constructor', this).apply(this, params);
	        var indexFields = this.options.indexFields || this.DataType.indexFields || {};
	        this.index = this.getAdapter(_mosaicDatasetIndex.DataSetIndex, {
	            fields: indexFields
	        });
	    }

	    _createClass(EnumeratedDataSet, [{
	        key: 'getSearchValues',
	        value: function getSearchValues(criterion) {
	            var key = criterion.key;
	            return !!key ? [criterion.key] : [];
	        }

	        /** Returns an item corresponding to the specified value key. */
	    }, {
	        key: 'getSearchCriterion',
	        value: function getSearchCriterion(key, create) {
	            var DataType = this.DataType;
	            var id = key;
	            if (typeof DataType.toId === 'function') {
	                id = DataType.toId(key);
	            }
	            var item = this.byId(id);
	            if (!item && create) {
	                item = this._wrap({
	                    id: id,
	                    key: key
	                });
	            }
	            return item;
	        }

	        /**
	         * Search a list of values from this enumerated data set using the specified
	         * query.
	         */
	    }, {
	        key: 'search',
	        value: function search(query, maxNumber) {
	            if (maxNumber === undefined) {
	                maxNumber = 1000;
	            }
	            var promise = this.index.search(query);
	            return promise.then(function (dataSet) {
	                var promise = undefined;
	                if (!!maxNumber && dataSet.length > maxNumber) {
	                    promise = dataSet.setItems(dataSet.items.splice(0, maxNumber));
	                } else {
	                    promise = Promise.resolve();
	                }
	                return promise.then(function () {
	                    return dataSet;
	                });
	            });
	        }
	    }]);

	    return EnumeratedDataSet;
	})(_mosaicDataset.DataSet);

	exports['default'] = EnumeratedDataSet;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _EntitySearchCriteria2 = __webpack_require__(8);

	var _EntitySearchCriteria3 = _interopRequireDefault(_EntitySearchCriteria2);

	var TextSearchCriteria = (function (_EntitySearchCriteria) {
	    _inherits(TextSearchCriteria, _EntitySearchCriteria);

	    function TextSearchCriteria() {
	        _classCallCheck(this, TextSearchCriteria);

	        _get(Object.getPrototypeOf(TextSearchCriteria.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(TextSearchCriteria, [{
	        key: 'search',
	        value: function search(query) {
	            return _get(Object.getPrototypeOf(TextSearchCriteria.prototype), 'search', this).call(this, query, maxNumber).then(function (set) {
	                var items = set.items;
	                if (query && query.length) {
	                    var key = query ? '' + query : '';
	                    items.unshift({
	                        key: key,
	                        values: [query]
	                    });
	                }
	                return set.setItems(items);
	            });
	        }
	    }], [{
	        key: 'indexKey',
	        get: function get() {
	            return 'q';
	        }
	    }, {
	        key: 'indexFields',
	        get: function get() {
	            return {
	                "id": {
	                    "boost": 15
	                },
	                "title": {
	                    "boost": 10,
	                    "suggest": true // Use names to suggest values
	                },
	                "tags": {
	                    "boost": 2
	                }
	            };
	        }
	    }]);

	    return TextSearchCriteria;
	})(_EntitySearchCriteria3['default']);

	exports['default'] = TextSearchCriteria;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _mosaicDatasetIndex = __webpack_require__(4);

	var EntitySearchCriteria = (function (_SearchCriteria) {
	    _inherits(EntitySearchCriteria, _SearchCriteria);

	    function EntitySearchCriteria() {
	        _classCallCheck(this, EntitySearchCriteria);

	        _get(Object.getPrototypeOf(EntitySearchCriteria.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(EntitySearchCriteria, [{
	        key: 'indexKey',
	        get: function get() {
	            return this.constructor.indexKey;
	        }
	    }, {
	        key: 'id',
	        get: function get() {
	            return this.constructor.toId(this.key);
	        }
	    }, {
	        key: 'key',
	        get: function get() {
	            return this.get('key');
	        }
	    }, {
	        key: 'values',
	        get: function get() {
	            var result = _get(Object.getPrototypeOf(EntitySearchCriteria.prototype), 'values', this);
	            if (!result || !result.length) {
	                var key = this.key;
	                if (key) {
	                    result = Array.isArray(key) ? key : [key];
	                }
	            }
	            return result;
	        }
	    }], [{
	        key: 'toId',
	        value: function toId(key) {
	            return this.indexKey + ':' + JSON.stringify(key);
	        }
	    }, {
	        key: 'suggestionFields',
	        get: function get() {
	            return {
	                'values': { boost: 1 }
	            };
	        }
	    }]);

	    return EntitySearchCriteria;
	})(_mosaicDatasetIndex.SearchCriteria);

	exports['default'] = EntitySearchCriteria;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;