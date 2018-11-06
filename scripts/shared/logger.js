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

	logger.logHistory = function(start, end, filter) {
		if (filter === undefined || filter === null) {
			if (isObject(start)) {
				filter = start;
			} else if (typeof start === "function") {
				let filter = {
					filterFunction:start
				}
			} else if (isObject(end)) {
				filter = end;
				filter.start = start;
			} else {
				filter = {
					start:start,
					end:end
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
	logger.getHistory = function(start, end) {
		if (!start && !end) {
			return logger.history;
		}

		if (start > end) {
			let temp = end;
			end = start;
			start = temp;

		}
		if (!start || start < 0) {
			start = 0;
		}
		if (!end || end > history.length - 1) {
			end = history.length - 1;
		}

		return history.slice(start, end);

	}

	return logger;
})(console);