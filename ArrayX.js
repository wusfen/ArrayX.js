/*!
 * Array 补丁 与 增强
 * https://github.com/wusfen/ArrayX.js
 * 2016.04.01 c
 * 2016.12.15 u
 */
(function() {
    // Object
    Object.values = function(obj) {
        var values = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            values.push(obj[i]);
        }
        return values;
    };
    Object.extend = function(obj, obj2) {
        for (var i in obj2) {
            obj[i] = obj2[i];
        }
        return obj;
    };

    function orExtend(obj, obj2) {
        for (var i in obj2) {
            obj[i] || (obj[i] = obj2[i]);
        }
        return obj;
    }

    // extend Array.prototype
    var selectOne;
    var aprox = {
        forEach: function(fn, contex) {
            for (var i = 0; i < this.length; i++) {
                fn.call(contex, this[i], i, this);
            }
            return this;
        },
        select: function(_w) {
            var findArr = [];
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                var eq = true;

                if (typeof _w == 'string') {
                    with(obj) {
                        eq = eval(_w);
                    }
                } else if (typeof _w == 'function') {
                    if (!_w(obj, i, this)) {
                        eq = false;
                    }
                } else {
                    for (var key in _w) {
                        if (obj[key] != _w[key]) { // ==
                            eq = false;
                        }
                    }
                }

                if (eq) {
                    findArr.push(obj);
                    if (selectOne) break;
                }
            }
            return findArr;
        },
        get: function(_w) {
            if (!isNaN(+_w)) {
                _w = { id: _w };
            }
            selectOne = 1;
            var obj = this.select(_w)[0];
            selectOne = 0;
            return obj;
        },
        set: function(fiels) {
            for (var i = 0; i < this.length; i++) {
                var obj = this[i];
                for (var key in fiels) {
                    obj[key] = fiels[key];
                }
            }
            return this;
        },
        save: function(obj, pk) {
            pk = pk || 'id';
            if (pk in Object(obj)) {
                var kv = {};
                kv[pk] = obj[pk];
                var findObj = this.get(kv);
                if (findObj) {
                    for (var key in obj) {
                        findObj[key] = obj[key];
                    }
                    return this;
                }
            }

            this.push(obj);
            return this;
        },
        'delete': function(_w) {
            if (typeof _w == 'number') {
                this.splice(_w, 1);
                return this;
            }
            var findArr = this.select(_w);
            for (var i = 0; i < findArr.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    if (findArr[i] == this[j]) {
                        this.splice(j--, 1);
                    }
                }
            }
            return this;
        },
        remove: function(item) {
            for (var i = 0; i < this.length; i++) {
                if (item === this[i]) {
                    this.splice(i--, 1);
                }
            }
            return this;
        },
        orderBy: function(field) {
            // number 'number' 'string' obj
            this.sort(function(a, b) {
                return field ? b[field] < a[field] : b < a
            });
            return this;
        },
        indexOf: function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        },
        contains: function(item) {
            return this.indexOf(item) != -1;
        },
        ensure: function(item) {
            !this.contains(item) && this.push(item);
            return this;
        },
        uniq: function() {
            var rs = [];
            this.each(function(item) {
                rs.ensure(item);
            });
            return rs;
        },
        map: function (fn) {
            var rs = [];
            this.each(function(item) {
                rs.push(fn(item));
            });
            return rs;
        },
        toArray: function() {
            return this;
        },
        // 不要写 toJSON。 JSON.stringify 会先调用对象的 toJSON
        toJson: function() {
            return JSON.stringify(this);
        }
    };

    aprox.filter = aprox.select;
    aprox.where = aprox.select;
    aprox.each = aprox.forEach;
    aprox.has = aprox.contains;

    orExtend(Array.prototype, aprox);

}());
