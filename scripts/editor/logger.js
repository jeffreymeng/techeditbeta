let logger = (function(console){
	let logger = {};
	let history = [];
	const search = function(array, value, compare, left, right) { // binary search implementation
		left = left || 0;
		right = right || array.length - 1;
		while (left <= right) {
			const mid = left + Math.floor((right - left) / 2);
			if (compare(array[mid], target) == 0) {
				return mid;
			}
			if (compare(array[mid], target) < 0) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}
		return -1;

	}
	const getStackTrace = function() {
		let obj = {};
		Error.captureStackTrace(obj, getStackTrace);
		return obj.stack;
	};
	const isObject = function(value) {
		return value && typeof value === 'object' && value.constructor === Object;
	}

	logger.DEBUG = "debug";
	logger.INFO = "info";
	logger.LOG = "log";
	logger.WARN = "warn";
	logger.ERROR = "error";
	logger.TRACE = "trace";
	logger.history = [];
	logger.level = 5;
	logger.levelOrder = [logger.DEBUG, logger.INFO, logger.LOG, logger.TRACE, logger.WARN, logger.ERROR];
	logger.allowCustomTimestamp = false;

	logger.debug = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.DEBUG,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.DEBUG) >= logger.level && console.debug) {//Only dev mode
			console.debug.apply(this, arguments);
		} else if (logger.devMode) {
			console.log.apply(this, arguments);
		}
	}
	logger.info = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.INFO,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.INFO) >= logger.level && console.info) {//Only dev mode
			console.info.apply(this, arguments);
		} else if (logger.devMode) {
			console.log.apply(this, arguments);
		}
	}
	logger.log = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.LOG,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.LOG) >= logger.level) {//Only dev mode
			console.log.apply(this, arguments);
		}
	}
	logger.warn = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.WARN,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.WARN) >= logger.level) {
			if (console.warn) {
				console.warn.apply(this, arguments);
			} else {
				console.log.apply(this, arguments);
			}

		}
	};
	logger.error = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.ERROR,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.ERROR) >= logger.level) {
			if (console.error) {
				console.error.apply(this, arguments);
			} else {
				console.log.apply(this, arguments);
			}

		}
	};

	logger.trace = function() {
		if (logger.allowCustomTimestamp) {
			timestamp = arguments.shift();
		} else {
			timestamp = false;
		}

		logger.history.push({
			content:arguments,
			stack:getStackTrace(),
			type:logger.TRACE,
			timestamp:(timestamp || new Date().getTime()),
			logged:logger.devMode
		});
		if (logger.levelOrder.indexOf(logger.TRACE) >= logger.level) {
			if (console.trace) {
				console.trace.apply(this, arguments);
			} else {
				console.log(getStackTrace());
			}
		}
	}

	logger.logHistory = function(timestampStart, timestampEnd, filter) {
		if (filter === undefined || filter === null) {
			if (isObject(timestampStart)) {
				filter = timestampStart;
			} else if (typeof timestampStart === "function") {
				let filter = {
					filterFunction:timestampStart
				}
			} else if (isObject(timestampEnd)) {
				filter = timestampEnd;
				filter.start = timestampStart;
			} else {
				filter = {
					start:timestampStart,
					end:timestampEnd
				}
			}
		}

		let historySubset = logger.getHistory(filter.start, filter.end);
		for (let i = 0; i < historySubset.length; i ++) {
			let element = historySubset[i];
			if (filter.logged && filter.logged !== element.logged) continue;
			if (filter.type && filter.type !== element.type) continue;
			if (filter.filterFunction && !filter.filterFunction(element)) continue;
			console[element.type].apply(this, element.content);
		}
	}
	logger.getHistory = function(timestampStart, timestampEnd) {
		if (!timestampStart && !timestampEnd) {
			return logger.history;
		}

		if (timestampStart > timestampEnd) {
			let temp = timestampEnd;
			timestampEnd = timestampStart;
			timestampStart = temp;

		}
		let compareFn = function(a, b) {
			if (a.timestamp > b.timestamp) {
				return 1
			} else if (a.timestamp < b.timestamp) {
				return -1;
			} else {
				return 0;
			}
		}
		//if one is null but the other is not the case will be handled in search.
		let start = search(history, timestampStart, compareFn);
		let end = search(history, timestampEnd, compareFn, start);
		return history.slice(start, end);

	}

	return logger;
})(console);