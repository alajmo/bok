"use strict";
/*
 * @license
 *
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Copyright (c) 2018, Костя Третяк. (MIT Licensed)
 * https://github.com/ts-stack/markdown
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ExtendRegexp = /** @class */ (function () {
    function ExtendRegexp(regex, flags) {
        if (flags === void 0) { flags = ''; }
        this.source = regex.source;
        this.flags = flags;
    }
    /**
     * Extend regular expression.
     *
     * @param groupName Regular expression for search a group name.
     * @param groupRegexp Regular expression of named group.
     */
    ExtendRegexp.prototype.setGroup = function (groupName, groupRegexp) {
        var newRegexp = typeof groupRegexp == 'string' ? groupRegexp : groupRegexp.source;
        newRegexp = newRegexp.replace(/(^|[^\[])\^/g, '$1');
        // Extend regexp.
        this.source = this.source.replace(groupName, newRegexp);
        return this;
    };
    /**
     * Returns a result of extending a regular expression.
     */
    ExtendRegexp.prototype.getRegexp = function () {
        return new RegExp(this.source, this.flags);
    };
    return ExtendRegexp;
}());
exports.ExtendRegexp = ExtendRegexp;
