var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.Animal = $hxClasses["co.doubleduck.Animal"] = function(type) {
	this._dead = false;
	this._type = type;
	this._swingingDuration = co.doubleduck.DataLoader.getSwing() | 0;
	if(co.doubleduck.Animal._sheets == null) co.doubleduck.Animal._sheets = new Hash();
	var key = type[0];
	if(co.doubleduck.Animal._sheets.get(key) == null) {
		var bmp = this.getBitmap();
		var initObject = { };
		initObject.images = [bmp.image];
		initObject.frames = { width : this.getWidth(), height : this.getHeight(), regX : 0, regY : 0};
		initObject.animations = { };
		initObject.animations.normal = { frames : [0]};
		if(this._type != co.doubleduck.AnimalType.HEDGEHOG) {
			initObject.animations.surprised = { frames : [1,0], frequency : 10, next : "normal"};
			initObject.animations.ohNo = { frames : [1]};
		}
		co.doubleduck.Animal._sheets.set(key,new createjs.SpriteSheet(initObject));
	}
	this._graphics = new createjs.BitmapAnimation(co.doubleduck.Animal._sheets.get(key));
	this._graphics.scaleX = this._graphics.scaleY = co.doubleduck.BaseGame.getScale();
	this._graphics.gotoAndStop("normal");
	this._graphics.alpha = 0;
	this._moving = false;
	this._appearingTween = createjs.Tween.get(this._graphics).to({ alpha : 1},250);
};
co.doubleduck.Animal.__name__ = ["co","doubleduck","Animal"];
co.doubleduck.Animal._sheets = null;
co.doubleduck.Animal.prototype = {
	getWidth: function() {
		return co.doubleduck.DataLoader.getAnimal(this._type).width | 0;
	}
	,getHeight: function() {
		return co.doubleduck.DataLoader.getAnimal(this._type).height | 0;
	}
	,getBitmap: function() {
		return co.doubleduck.BaseAssets.getImage("images/session/animals/" + this._type[0].toLowerCase() + ".png");
	}
	,toString: function() {
		return Std.string(this._type) + ": <" + this._graphics.x + "," + this._graphics.y + ">";
	}
	,getGraphics: function() {
		return this._graphics;
	}
	,stopMoving: function() {
		this._moving = false;
		this._graphics.alpha = 1;
		createjs.Tween.removeTweens(this._graphics);
	}
	,moveLeft: function() {
		var wiggleRoom = co.doubleduck.BaseGame.getViewport().width - this.getBottomLength() * co.doubleduck.BaseGame.getScale();
		var wiggleRoomRatio = wiggleRoom / co.doubleduck.BaseGame.getViewport().width;
		var duration = wiggleRoomRatio * this._swingingDuration * this._speedFactor | 0;
		var toX = 0 - this.getBottomBounds()[0] * co.doubleduck.BaseGame.getScale();
		var tween = createjs.Tween.get(this._graphics).to({ x : toX},duration,createjs.Ease.sineInOut);
		if(this._moving) tween.call($bind(this,this.moveRight));
	}
	,moveRight: function() {
		var wiggleRoom = co.doubleduck.BaseGame.getViewport().width - this.getBottomLength() * co.doubleduck.BaseGame.getScale();
		var wiggleRoomRatio = wiggleRoom / co.doubleduck.BaseGame.getViewport().width;
		var ratioFromCurrentPosition = 1 - this._graphics.x / wiggleRoom;
		var duration = this._swingingDuration * ratioFromCurrentPosition * wiggleRoomRatio * this._speedFactor | 0;
		var toX = co.doubleduck.BaseGame.getViewport().width - this.getBottomBounds()[1] * co.doubleduck.BaseGame.getScale();
		var tween = createjs.Tween.get(this._graphics).to({ x : toX},duration,createjs.Ease.sineInOut);
		if(this._moving) tween.call($bind(this,this.moveLeft));
	}
	,getBounds: function() {
		return co.doubleduck.DataLoader.getAnimal(this._type);
	}
	,getBottomLength: function() {
		var btm = this.getBottomBounds();
		return btm[1] - btm[0];
	}
	,getBottomBounds: function() {
		var bounds = this.getBounds();
		return [bounds.bottom_from | 0,bounds.bottom_to | 0];
	}
	,getBottom: function() {
		var bounds = this.getBounds();
		var xFrom = this._graphics.x - this._graphics.regX * co.doubleduck.BaseGame.getScale() + (bounds.bottom_from | 0) * co.doubleduck.BaseGame.getScale();
		var xTo = this._graphics.x - this._graphics.regX * co.doubleduck.BaseGame.getScale() + (bounds.bottom_to | 0) * co.doubleduck.BaseGame.getScale();
		return [xFrom,xTo];
	}
	,getTop: function() {
		var bounds = this.getBounds();
		var xFrom = this._graphics.x - this._graphics.regX * co.doubleduck.BaseGame.getScale() + (bounds.top_from | 0) * co.doubleduck.BaseGame.getScale();
		var xTo = this._graphics.x - this._graphics.regX * co.doubleduck.BaseGame.getScale() + (bounds.top_to | 0) * co.doubleduck.BaseGame.getScale();
		return [xFrom,xTo];
	}
	,startMoving: function(speedFactor) {
		this._speedFactor = speedFactor;
		this._moving = true;
		this.moveRight();
	}
	,getAppearingTween: function() {
		return this._appearingTween;
	}
	,getType: function() {
		return this._type;
	}
	,setOnNo: function() {
		if(this._type != co.doubleduck.AnimalType.HEDGEHOG) this._graphics.gotoAndPlay("ohNo");
	}
	,setSurprised: function() {
		if(this._type != co.doubleduck.AnimalType.HEDGEHOG) this._graphics.gotoAndPlay("surprised");
	}
	,squish: function() {
		this.setSquishRegs();
		return createjs.Tween.get(this.getGraphics()).to({ scaleX : 0.90 * co.doubleduck.BaseGame.getScale(), scaleY : 1.1 * co.doubleduck.BaseGame.getScale()},75,createjs.Ease.sineInOut).to({ scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},75,createjs.Ease.sineInOut).call($bind(this,this.unsetSquishRegs));
	}
	,setHitRegs: function() {
		this.getGraphics().regX = this.getWidth() / 2;
		this.getGraphics().x += co.doubleduck.BaseGame.getScale() * this.getWidth() / 2;
		this.getGraphics().regY = this.getHeight() / 2;
		this.getGraphics().y += co.doubleduck.BaseGame.getScale() * this.getHeight() / 2;
	}
	,unsetSquishRegs: function() {
		this.getGraphics().regX = 0;
		this.getGraphics().x -= co.doubleduck.BaseGame.getScale() * this.getWidth() / 2;
		this.getGraphics().regY = 0;
		this.getGraphics().y -= co.doubleduck.BaseGame.getScale() * this.getHeight();
	}
	,setSquishRegs: function() {
		this.getGraphics().regX = this.getWidth() / 2;
		this.getGraphics().x += co.doubleduck.BaseGame.getScale() * this.getWidth() / 2;
		this.getGraphics().regY = this.getHeight();
		this.getGraphics().y += co.doubleduck.BaseGame.getScale() * this.getHeight();
	}
	,isAlive: function() {
		return !this._dead;
	}
	,setDead: function() {
		this._dead = true;
		this._graphics.visible = false;
	}
	,_appearingTween: null
	,_speedFactor: null
	,_moving: null
	,_graphics: null
	,_type: null
	,_dead: null
	,_swingingDuration: null
	,__class__: co.doubleduck.Animal
}
co.doubleduck.AnimalType = $hxClasses["co.doubleduck.AnimalType"] = { __ename__ : ["co","doubleduck","AnimalType"], __constructs__ : ["BABOON","BEAVER","ELEPHANT","FLAMINGO","GIRAFFE","HEDGEHOG","HIPPO","LION","SEAL","ZEBRA"] }
co.doubleduck.AnimalType.BABOON = ["BABOON",0];
co.doubleduck.AnimalType.BABOON.toString = $estr;
co.doubleduck.AnimalType.BABOON.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.BEAVER = ["BEAVER",1];
co.doubleduck.AnimalType.BEAVER.toString = $estr;
co.doubleduck.AnimalType.BEAVER.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.ELEPHANT = ["ELEPHANT",2];
co.doubleduck.AnimalType.ELEPHANT.toString = $estr;
co.doubleduck.AnimalType.ELEPHANT.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.FLAMINGO = ["FLAMINGO",3];
co.doubleduck.AnimalType.FLAMINGO.toString = $estr;
co.doubleduck.AnimalType.FLAMINGO.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.GIRAFFE = ["GIRAFFE",4];
co.doubleduck.AnimalType.GIRAFFE.toString = $estr;
co.doubleduck.AnimalType.GIRAFFE.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.HEDGEHOG = ["HEDGEHOG",5];
co.doubleduck.AnimalType.HEDGEHOG.toString = $estr;
co.doubleduck.AnimalType.HEDGEHOG.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.HIPPO = ["HIPPO",6];
co.doubleduck.AnimalType.HIPPO.toString = $estr;
co.doubleduck.AnimalType.HIPPO.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.LION = ["LION",7];
co.doubleduck.AnimalType.LION.toString = $estr;
co.doubleduck.AnimalType.LION.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.SEAL = ["SEAL",8];
co.doubleduck.AnimalType.SEAL.toString = $estr;
co.doubleduck.AnimalType.SEAL.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.AnimalType.ZEBRA = ["ZEBRA",9];
co.doubleduck.AnimalType.ZEBRA.toString = $estr;
co.doubleduck.AnimalType.ZEBRA.__enum__ = co.doubleduck.AnimalType;
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.LoadQueue(true);
		co.doubleduck.BaseAssets._loader.installPlugin(createjs.LoadQueue.SOUND);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var currSound = _g1++;
			manifest.push(sounds[currSound] + co.doubleduck.SoundManager.EXTENSION);
			co.doubleduck.SoundManager.initSound(sounds[currSound]);
		}
	}
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.item.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.item.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.item.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.item.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.item.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri);
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds.push("sound/animal_hit");
	sounds.push("sound/animals_fall_1");
	sounds.push("sound/animals_fall_2");
	sounds.push("sound/animals_fall_3");
	sounds.push("sound/anticipation_view");
	sounds.push("sound/Boing_sound_heavy");
	sounds.push("sound/Boing_sound_light");
	sounds.push("sound/Boing_sound_medium");
	sounds.push("sound/Button_click");
	sounds.push("sound/cake_hit");
	sounds.push("sound/cake_miss");
	sounds.push("sound/Losing_life_end");
	sounds.push("sound/Menu_music_new");
	sounds.push("sound/new_animal_unlock");
	sounds.push("sound/score_bonus");
	sounds.push("sound/session_end_with_a_hit");
	sounds.push("sound/session_end_with_a_miss");
	sounds.push("sound/tremolo_score");
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	manifest.push("images/duckling/loading_fill.png");
	manifest.push("images/duckling/loading_stroke.png");
	manifest.push("images/duckling/splash_logo.png");
	manifest.push("images/general/best.png");
	manifest.push("images/general/bg_1.png");
	manifest.push("images/general/bg_2.png");
	manifest.push("images/general/stage.png");
	var _g = 0;
	while(_g < 10) {
		var f = _g++;
		manifest.push("images/general/font_orange/" + f + ".png");
		manifest.push("images/general/font_red/" + f + ".png");
	}
	manifest.push("images/general/font_orange/comma.png");
	manifest.push("images/general/font_red/comma.png");
	manifest.push("images/general/font_red/m.png");
	manifest.push("images/menu/alert_best.png");
	manifest.push("images/menu/btn_help.png");
	manifest.push("images/menu/btn_mute.png");
	manifest.push("images/menu/btn_play.png");
	manifest.push("images/menu/h1_hooray.png");
	manifest.push("images/menu/h1_menu.png");
	manifest.push("images/menu/help/btn_gotit.png");
	manifest.push("images/menu/help/help.png");
	manifest.push("images/menu/level_bar_empty.png");
	manifest.push("images/menu/level_bar_fill.png");
	manifest.push("images/menu/menu_bg.png");
	manifest.push("images/menu/unlocks/baboon.png");
	manifest.push("images/menu/unlocks/beaver.png");
	manifest.push("images/menu/unlocks/flamingo.png");
	manifest.push("images/menu/unlocks/giraffe.png");
	manifest.push("images/menu/unlocks/hippo.png");
	manifest.push("images/menu/unlocks/lion.png");
	manifest.push("images/menu/unlocks/seal.png");
	manifest.push("images/menu/unlocks/zebra.png");
	manifest.push("images/menu/unlocks/baboon_on.png");
	manifest.push("images/menu/unlocks/beaver_on.png");
	manifest.push("images/menu/unlocks/flamingo_on.png");
	manifest.push("images/menu/unlocks/giraffe_on.png");
	manifest.push("images/menu/unlocks/hippo_on.png");
	manifest.push("images/menu/unlocks/lion_on.png");
	manifest.push("images/menu/unlocks/seal_on.png");
	manifest.push("images/menu/unlocks/zebra_on.png");
	manifest.push("images/menu/unlocks/done.png");
	manifest.push("images/session/alert_bonus100.png");
	manifest.push("images/session/aim.png");
	manifest.push("images/session/alert_bee.png");
	manifest.push("images/session/alert_closecall.png");
	manifest.push("images/session/alert_miss.png");
	manifest.push("images/session/alert_splat.png");
	manifest.push("images/session/alert_spoton.png");
	manifest.push("images/session/animals/baboon.png");
	manifest.push("images/session/animals/beaver.png");
	manifest.push("images/session/animals/elephant.png");
	manifest.push("images/session/animals/flamingo.png");
	manifest.push("images/session/animals/giraffe.png");
	manifest.push("images/session/animals/hedgehog.png");
	manifest.push("images/session/animals/hippo.png");
	manifest.push("images/session/animals/lion.png");
	manifest.push("images/session/animals/seal.png");
	manifest.push("images/session/animals/zebra.png");
	manifest.push("images/session/btn_pause.png");
	manifest.push("images/session/cake.png");
	manifest.push("images/session/cake_big.png");
	manifest.push("images/session/cake_rest.png");
	manifest.push("images/session/dust.png");
	manifest.push("images/session/floatables/alien.png");
	manifest.push("images/session/floatables/astroid.png");
	manifest.push("images/session/floatables/cloud_1.png");
	manifest.push("images/session/floatables/cloud_2.png");
	manifest.push("images/session/floatables/cloud_3.png");
	manifest.push("images/session/floatables/ducks_dark.png");
	manifest.push("images/session/floatables/ducks_light.png");
	manifest.push("images/session/floatables/haze_1.png");
	manifest.push("images/session/floatables/haze_2.png");
	manifest.push("images/session/floatables/haze_3.png");
	manifest.push("images/session/floatables/hippostronaut.png");
	manifest.push("images/session/floatables/moon.png");
	manifest.push("images/session/floatables/nebula_1.png");
	manifest.push("images/session/floatables/nebula_2.png");
	manifest.push("images/session/floatables/plane.png");
	manifest.push("images/session/floatables/planet_1.png");
	manifest.push("images/session/floatables/planet_2.png");
	manifest.push("images/session/floatables/sat_1.png");
	manifest.push("images/session/floatables/sat_2.png");
	manifest.push("images/session/floatables/stars.png");
	manifest.push("images/session/flying_bee.png");
	manifest.push("images/session/flying_bonus.png");
	manifest.push("images/session/misses.png");
	manifest.push("images/session/miss_1.png");
	manifest.push("images/session/miss_2.png");
	manifest.push("images/session/miss_3.png");
	manifest.push("images/session/pause/btn_menu.png");
	manifest.push("images/session/pause/btn_restart.png");
	manifest.push("images/session/pause/btn_resume.png");
	manifest.push("images/session/pause/paused.png");
	manifest.push("images/session/tap2throw.png");
	manifest.push("images/splash/logo.png");
	manifest.push("images/splash/tap2play.png");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		var loc = window.location.href;
		if(loc.lastIndexOf("index.html") != -1) loc = HxOverrides.substr(loc,0,loc.lastIndexOf("index.html"));
		loc += "error.html";
		window.location.href=loc;
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(false); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute(false);
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.getDynamicValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return { };
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setDynamicValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.initDynamicVar = function(initedVar,defaultVal) {
	var value = co.doubleduck.BasePersistence.getDynamicValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setDynamicValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.printAll = function() {
	var ls = localStorage;
	var localStorageLength = ls.length;
	var _g = 0;
	while(_g < localStorageLength) {
		var entry = _g++;
		null;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function(properties) {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart(properties);
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.Pickupable = $hxClasses["co.doubleduck.Pickupable"] = function() {
	var key = this.getKey();
	if(co.doubleduck.Pickupable.sheets == null) co.doubleduck.Pickupable.sheets = new Hash();
	if(co.doubleduck.Pickupable.sheets.get(key) == null) {
		var bmp = co.doubleduck.BaseAssets.getImage(this._sheetFile);
		var initObject = { };
		initObject.images = [bmp.image];
		initObject.frames = { width : this.getWidth(), height : this.getHeight(), regX : 0, regY : 0};
		initObject.animations = { };
		this.setAnimations(initObject);
		co.doubleduck.Pickupable.sheets.set(key,new createjs.SpriteSheet(initObject));
	}
	this._graphics = new createjs.BitmapAnimation(co.doubleduck.Pickupable.sheets.get(key));
	this._graphics.scaleX = this._graphics.scaleY = co.doubleduck.BaseGame.getScale();
	if(this._alertFile != null) {
		this._alert = co.doubleduck.BaseAssets.getImage(this._alertFile);
		this._alert.scaleX = this._alert.scaleY = co.doubleduck.BaseGame.getScale();
	}
};
co.doubleduck.Pickupable.__name__ = ["co","doubleduck","Pickupable"];
co.doubleduck.Pickupable.sheets = null;
co.doubleduck.Pickupable.prototype = {
	getAlertGraphics: function() {
		return this._alert;
	}
	,getGraphics: function() {
		return this._graphics;
	}
	,setAnimations: function(initObject) {
		throw "override this function";
	}
	,getHeight: function() {
		throw "override this function";
		return -1;
	}
	,getWidth: function() {
		throw "override this function";
		return -1;
	}
	,getKey: function() {
		return Type.getClassName(Type.getClass(this));
	}
	,_graphics: null
	,_alert: null
	,_sheetFile: null
	,_alertFile: null
	,__class__: co.doubleduck.Pickupable
}
co.doubleduck.Bee = $hxClasses["co.doubleduck.Bee"] = function() {
	this._alertFile = "images/session/alert_bee.png";
	this._sheetFile = "images/session/flying_bee.png";
	co.doubleduck.Pickupable.call(this);
	this._graphics.gotoAndPlay("fly");
};
co.doubleduck.Bee.__name__ = ["co","doubleduck","Bee"];
co.doubleduck.Bee.__super__ = co.doubleduck.Pickupable;
co.doubleduck.Bee.prototype = $extend(co.doubleduck.Pickupable.prototype,{
	setAnimations: function(initObject) {
		initObject.animations.fly = { frames : [0,1], frequency : 2};
	}
	,getHeight: function() {
		return 65;
	}
	,getWidth: function() {
		return 70;
	}
	,__class__: co.doubleduck.Bee
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding,centered);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,getBitmapLabelWidth: function() {
		var maxWidth = 0;
		var _g1 = 0, _g = this._bitmapText.getNumChildren();
		while(_g1 < _g) {
			var digit = _g1++;
			var currentDigit = js.Boot.__cast(this._bitmapText.getChildAt(digit) , createjs.Bitmap);
			var endsAt = currentDigit.x + currentDigit.image.width;
			if(endsAt > maxWidth) maxWidth = endsAt;
		}
		return maxWidth;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	this._lastClickTime = 0;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function(e) {
		if(this.onToggle == null) return;
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_lastClickPos: null
	,_lastClickTime: null
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Cake = $hxClasses["co.doubleduck.Cake"] = function() {
	if(co.doubleduck.Cake._cakeSheet == null) {
		var bmp = co.doubleduck.BaseAssets.getImage(co.doubleduck.Cake.CAKE);
		var initObject = { };
		initObject.images = [bmp.image];
		initObject.frames = { width : 75, height : 85, regX : 37.5, regY : 42.5};
		initObject.animations = { };
		initObject.animations.splat = { frames : [0,1,2], frequency : 5};
		co.doubleduck.Cake._cakeSheet = new createjs.SpriteSheet(initObject);
	}
	this._graphics = new createjs.Container();
	this._cake = new createjs.BitmapAnimation(co.doubleduck.Cake._cakeSheet);
	this._cake.scaleX = this._cake.scaleY = co.doubleduck.BaseGame.getScale();
	this._cake.onAnimationEnd = $bind(this,this.handleAnimationEnd);
	this._cakeBig = co.doubleduck.Utils.getCenteredImage(co.doubleduck.Cake.CAKE_BIG,true);
	this._cakeRest = co.doubleduck.Utils.getCenteredImage(co.doubleduck.Cake.CAKE_REST,true);
	this._graphics.addChild(this._cake);
	this._graphics.addChild(this._cakeBig);
	this._graphics.addChild(this._cakeRest);
	this._cake.visible = false;
	this._cakeBig.visible = false;
	this._cakeRest.visible = false;
};
co.doubleduck.Cake.__name__ = ["co","doubleduck","Cake"];
co.doubleduck.Cake._cakeSheet = null;
co.doubleduck.Cake.prototype = {
	getHeight: function() {
		return this._cakeRest.image.height;
	}
	,getWidth: function() {
		return this._cakeRest.image.width;
	}
	,setSplat: function() {
		this._cake.visible = true;
		this._cakeBig.visible = false;
		this._cakeRest.visible = false;
		this._cake.gotoAndPlay("splat");
	}
	,setBig: function() {
		this._cake.visible = false;
		this._cakeBig.visible = true;
		this._cakeRest.visible = false;
	}
	,setRest: function() {
		this._cake.visible = false;
		this._cakeBig.visible = false;
		this._cakeRest.visible = true;
	}
	,handleAnimationEnd: function() {
		this._cake.stop();
		this.handleSplatFinished();
		createjs.Tween.get(this._graphics).to({ alpha : 0},150);
	}
	,handleSplatFinished: function() {
		if(this.onFinishedSplat) this.onFinishedSplat();
	}
	,getGraphics: function() {
		return this._graphics;
	}
	,onFinishedSplat: null
	,_cakeRest: null
	,_cakeBig: null
	,_cake: null
	,_graphics: null
	,__class__: co.doubleduck.Cake
}
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() { }
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getLatestUnlock = function() {
	var unlock = co.doubleduck.DataLoader.getCurrentUnlock(co.doubleduck.Persistence.getXp());
	if(unlock == null) unlock = co.doubleduck.DataLoader.getLastUnlock();
	return unlock;
}
co.doubleduck.DataLoader.getSwing = function() {
	return co.doubleduck.DataLoader.getLatestUnlock().swing_duration;
}
co.doubleduck.DataLoader.getAcceleration = function() {
	return co.doubleduck.DataLoader.getLatestUnlock().acceleration_factor;
}
co.doubleduck.DataLoader.getSkillBonusPoints = function() {
	return co.doubleduck.DataLoader.getLatestUnlock().skill_bonus;
}
co.doubleduck.DataLoader.getProbabilityData = function() {
	return co.doubleduck.DataLoader.getLatestUnlock().probabilities;
}
co.doubleduck.DataLoader.getAimAnimationData = function() {
	var unlock = co.doubleduck.DataLoader.getCurrentUnlock(co.doubleduck.Persistence.getXp());
	if(unlock == null) unlock = co.doubleduck.DataLoader.getLastUnlock();
	return unlock.aim;
}
co.doubleduck.DataLoader.getAnimalCakeScore = function(type) {
	return co.doubleduck.DataLoader.getAnimal(type).cake_score | 0;
}
co.doubleduck.DataLoader.getAnimal = function(type) {
	return Reflect.field(co.doubleduck.DataLoader.getAllAnimals(),type[0]);
}
co.doubleduck.DataLoader.getAllAnimals = function() {
	return new AnimalDB().getAnimalData();
}
co.doubleduck.DataLoader.getAllBgData = function() {
	return new BGDataDB().getBgData();
}
co.doubleduck.DataLoader.getAllSkyColors = function() {
	return co.doubleduck.DataLoader.getAllBgData().skyColors;
}
co.doubleduck.DataLoader.getFloatablesWithIds = function(ids) {
	var floatables = new Array();
	var _g = 0, _g1 = js.Boot.__cast(co.doubleduck.DataLoader.getAllBgData().floatables , Array);
	while(_g < _g1.length) {
		var floatable = _g1[_g];
		++_g;
		if(co.doubleduck.Utils.contains(ids,floatable.id | 0)) {
			var name = js.Boot.__cast(floatable.file , String);
			name = name.split(".")[0];
			name = name.toUpperCase();
			floatables.push(Type.createEnum(co.doubleduck.FloatableType,name));
		}
	}
	return floatables;
}
co.doubleduck.DataLoader.getFloatsForHeight = function(height) {
	var latestRange = null;
	var _g = 0, _g1 = js.Boot.__cast(co.doubleduck.DataLoader.getAllBgData().floatRanges , Array);
	while(_g < _g1.length) {
		var range = _g1[_g];
		++_g;
		latestRange = range;
		if((range.from | 0) <= height && (range.to == null || (range.to | 0) >= height)) return co.doubleduck.DataLoader.getFloatablesWithIds(range.images);
	}
	return [];
}
co.doubleduck.DataLoader.getFloatOfType = function(floatType) {
	var _g = 0, _g1 = js.Boot.__cast(co.doubleduck.DataLoader.getAllBgData().floatables , Array);
	while(_g < _g1.length) {
		var floatable = _g1[_g];
		++_g;
		var name = js.Boot.__cast(floatable.file , String);
		name = name.split(".")[0];
		name = name.toUpperCase();
		var type = Type.createEnum(co.doubleduck.FloatableType,name);
		if(type == floatType) return floatable;
	}
	return null;
}
co.doubleduck.DataLoader.getSkyColor = function(height) {
	var skyColor = 0;
	var _g = 0, _g1 = js.Boot.__cast(co.doubleduck.DataLoader.getAllBgData().skyColors , Array);
	while(_g < _g1.length) {
		var color = _g1[_g];
		++_g;
		var from = color.atHeight | 0;
		if(height > from) skyColor = color.colorCode;
	}
	return skyColor;
}
co.doubleduck.DataLoader.getAllLevels = function() {
	return new LevelDB().getLevelData();
}
co.doubleduck.DataLoader.getCurrentlyUnlocked = function(currentXp) {
	var unlocked = new Array();
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllLevels();
	while(_g < _g1.length) {
		var level = _g1[_g];
		++_g;
		if((level.xp | 0) <= currentXp) {
			var animals = level.animals_unlocked;
			var _g2 = 0;
			while(_g2 < animals.length) {
				var animalType = animals[_g2];
				++_g2;
				unlocked.push(Type.createEnum(co.doubleduck.AnimalType,animalType));
			}
		}
	}
	return unlocked;
}
co.doubleduck.DataLoader.getCurrentBaseAnimal = function(currentXp) {
	var currBase = null;
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllLevels();
	while(_g < _g1.length) {
		var level = _g1[_g];
		++_g;
		if((level.xp | 0) <= currentXp) currBase = level.base;
	}
	return Type.createEnum(co.doubleduck.AnimalType,currBase);
}
co.doubleduck.DataLoader.getLastUnlock = function() {
	var levels = co.doubleduck.DataLoader.getAllLevels();
	return levels[levels.length - 1];
}
co.doubleduck.DataLoader.getCurrentUnlock = function(currentXp) {
	var nextLevel = co.doubleduck.DataLoader.getNextUnlock(currentXp);
	if(nextLevel == null) return null; else return co.doubleduck.DataLoader.getLevelWithId((nextLevel.id | 0) - 1);
}
co.doubleduck.DataLoader.getLevelWithId = function(id) {
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllLevels();
	while(_g < _g1.length) {
		var level = _g1[_g];
		++_g;
		if((level.id | 0) == id) return level;
	}
	return null;
}
co.doubleduck.DataLoader.getNextUnlock = function(currentXp) {
	var nextLevel = null;
	var _g = 0, _g1 = co.doubleduck.DataLoader.getAllLevels();
	while(_g < _g1.length) {
		var level = _g1[_g];
		++_g;
		if((level.xp | 0) > currentXp) {
			if(nextLevel == null || (level.xp | 0) < (nextLevel.xp | 0)) nextLevel = level;
		}
	}
	return nextLevel;
}
co.doubleduck.Dropper = $hxClasses["co.doubleduck.Dropper"] = function() {
	createjs.Container.call(this);
	this._spawnHeight = co.doubleduck.BaseGame.getViewport().y - co.doubleduck.BaseGame.getViewport().height / 2;
	this._killHeight = co.doubleduck.BaseGame.getViewport().height + 100;
};
co.doubleduck.Dropper.__name__ = ["co","doubleduck","Dropper"];
co.doubleduck.Dropper.__super__ = createjs.Container;
co.doubleduck.Dropper.prototype = $extend(createjs.Container.prototype,{
	handleDropletDead: function(e) {
		if(this.getChildIndex(e.target) != -1) this.removeChild(e.target);
	}
	,getRandDroplet: function() {
		var animal = co.doubleduck.Utils.getRandomElement(co.doubleduck.DataLoader.getCurrentlyUnlocked(co.doubleduck.Persistence.getXp()));
		var animName = animal[0].toLowerCase();
		var droplet;
		droplet = co.doubleduck.BaseAssets.getImage(co.doubleduck.Dropper.PREFIX + animName + ".png");
		droplet.scaleX = droplet.scaleY = co.doubleduck.BaseGame.getScale();
		droplet.regX = droplet.image.width / 2;
		droplet.regY = droplet.image.height / 2;
		return droplet;
	}
	,fireBurst: function(amount,timeInterval) {
		var interTime = Math.floor(timeInterval / amount);
		var _g = 0;
		while(_g < amount) {
			var i = _g++;
			var currDroplet = this.getRandDroplet();
			var distance = Math.random() * 0.5 + 0.25;
			currDroplet.y = this._spawnHeight;
			currDroplet.x = Math.random() * co.doubleduck.BaseGame.getViewport().width;
			currDroplet.scaleX = -(1 - distance);
			currDroplet.scaleY *= -(1 - distance);
			var randomAngle = Std.random(45);
			if(Math.random() < 0.5) randomAngle *= -1;
			currDroplet.rotation = randomAngle;
			createjs.Tween.get(currDroplet).wait(i * interTime).to({ y : this._killHeight},co.doubleduck.Dropper.DROP_TIME * distance).call($bind(this,this.handleDropletDead));
			this.addChild(currDroplet);
		}
	}
	,_killHeight: null
	,_spawnHeight: null
	,_droplets: null
	,__class__: co.doubleduck.Dropper
});
co.doubleduck.Floatable = $hxClasses["co.doubleduck.Floatable"] = function(type,from,duration) {
	this._type = type;
	this._graphics = co.doubleduck.Utils.getCenteredImage("images/session/floatables/" + type[0].toLowerCase() + ".png");
	this._graphics.regY = this._graphics.image.height;
	this._graphics.x = from.x;
	this._graphics.y = from.y;
	this._duration = duration;
};
co.doubleduck.Floatable.__name__ = ["co","doubleduck","Floatable"];
co.doubleduck.Floatable.prototype = {
	tweenTo: function(to) {
		if(this._duration == 0) {
			this._graphics.x = to.x;
			this._graphics.y = to.y;
		}
		return createjs.Tween.get(this._graphics).to({ x : to.x, y : to.y},this._duration);
	}
	,getGraphics: function() {
		return this._graphics;
	}
	,_type: null
	,_graphics: null
	,_duration: null
	,__class__: co.doubleduck.Floatable
}
co.doubleduck.FloatableType = $hxClasses["co.doubleduck.FloatableType"] = { __ename__ : ["co","doubleduck","FloatableType"], __constructs__ : ["ALIEN","ASTROID","CLOUD_1","CLOUD_2","CLOUD_3","DUCKS_DARK","DUCKS_LIGHT","HAZE_1","HAZE_2","HAZE_3","HIPPOSTRONAUT","MOON","NEBULA_1","NEBULA_2","PLANE","PLANET_1","PLANET_2","SAT_1","SAT_2","STARS"] }
co.doubleduck.FloatableType.ALIEN = ["ALIEN",0];
co.doubleduck.FloatableType.ALIEN.toString = $estr;
co.doubleduck.FloatableType.ALIEN.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.ASTROID = ["ASTROID",1];
co.doubleduck.FloatableType.ASTROID.toString = $estr;
co.doubleduck.FloatableType.ASTROID.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.CLOUD_1 = ["CLOUD_1",2];
co.doubleduck.FloatableType.CLOUD_1.toString = $estr;
co.doubleduck.FloatableType.CLOUD_1.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.CLOUD_2 = ["CLOUD_2",3];
co.doubleduck.FloatableType.CLOUD_2.toString = $estr;
co.doubleduck.FloatableType.CLOUD_2.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.CLOUD_3 = ["CLOUD_3",4];
co.doubleduck.FloatableType.CLOUD_3.toString = $estr;
co.doubleduck.FloatableType.CLOUD_3.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.DUCKS_DARK = ["DUCKS_DARK",5];
co.doubleduck.FloatableType.DUCKS_DARK.toString = $estr;
co.doubleduck.FloatableType.DUCKS_DARK.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.DUCKS_LIGHT = ["DUCKS_LIGHT",6];
co.doubleduck.FloatableType.DUCKS_LIGHT.toString = $estr;
co.doubleduck.FloatableType.DUCKS_LIGHT.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.HAZE_1 = ["HAZE_1",7];
co.doubleduck.FloatableType.HAZE_1.toString = $estr;
co.doubleduck.FloatableType.HAZE_1.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.HAZE_2 = ["HAZE_2",8];
co.doubleduck.FloatableType.HAZE_2.toString = $estr;
co.doubleduck.FloatableType.HAZE_2.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.HAZE_3 = ["HAZE_3",9];
co.doubleduck.FloatableType.HAZE_3.toString = $estr;
co.doubleduck.FloatableType.HAZE_3.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.HIPPOSTRONAUT = ["HIPPOSTRONAUT",10];
co.doubleduck.FloatableType.HIPPOSTRONAUT.toString = $estr;
co.doubleduck.FloatableType.HIPPOSTRONAUT.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.MOON = ["MOON",11];
co.doubleduck.FloatableType.MOON.toString = $estr;
co.doubleduck.FloatableType.MOON.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.NEBULA_1 = ["NEBULA_1",12];
co.doubleduck.FloatableType.NEBULA_1.toString = $estr;
co.doubleduck.FloatableType.NEBULA_1.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.NEBULA_2 = ["NEBULA_2",13];
co.doubleduck.FloatableType.NEBULA_2.toString = $estr;
co.doubleduck.FloatableType.NEBULA_2.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.PLANE = ["PLANE",14];
co.doubleduck.FloatableType.PLANE.toString = $estr;
co.doubleduck.FloatableType.PLANE.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.PLANET_1 = ["PLANET_1",15];
co.doubleduck.FloatableType.PLANET_1.toString = $estr;
co.doubleduck.FloatableType.PLANET_1.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.PLANET_2 = ["PLANET_2",16];
co.doubleduck.FloatableType.PLANET_2.toString = $estr;
co.doubleduck.FloatableType.PLANET_2.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.SAT_1 = ["SAT_1",17];
co.doubleduck.FloatableType.SAT_1.toString = $estr;
co.doubleduck.FloatableType.SAT_1.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.SAT_2 = ["SAT_2",18];
co.doubleduck.FloatableType.SAT_2.toString = $estr;
co.doubleduck.FloatableType.SAT_2.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FloatableType.STARS = ["STARS",19];
co.doubleduck.FloatableType.STARS.toString = $estr;
co.doubleduck.FloatableType.STARS.__enum__ = co.doubleduck.FloatableType;
co.doubleduck.FlyingBonus = $hxClasses["co.doubleduck.FlyingBonus"] = function(points) {
	if(points != 200 && points != 500 && points != 100) throw "Invalid bonus: " + points;
	this._points = points;
	this._sheetFile = "images/session/flying_bonus.png";
	co.doubleduck.Pickupable.call(this);
	this._graphics.gotoAndPlay("fly");
	var key = this.getKey();
	this._notification = new createjs.BitmapAnimation(co.doubleduck.Pickupable.sheets.get(key));
	this._notification.scaleX = this._notification.scaleY = co.doubleduck.BaseGame.getScale();
};
co.doubleduck.FlyingBonus.__name__ = ["co","doubleduck","FlyingBonus"];
co.doubleduck.FlyingBonus.__super__ = co.doubleduck.Pickupable;
co.doubleduck.FlyingBonus.prototype = $extend(co.doubleduck.Pickupable.prototype,{
	setAnimations: function(initObject) {
		switch(this._points) {
		case 200:
			initObject.animations.fly = { frames : [0,1], frequency : 4};
			initObject.animations.notification = { frames : [2]};
			break;
		case 500:
			initObject.animations.fly = { frames : [3,4], frequency : 4};
			initObject.animations.notification = { frames : [5]};
			break;
		case 100:
			initObject.animations.fly = { frames : [6,7], frequency : 4};
			initObject.animations.notification = { frames : [8]};
			break;
		default:
			throw "Invalid bonus: " + this._points;
		}
	}
	,getAlertGraphics: function() {
		this._notification.gotoAndStop("notification");
		return this._notification;
	}
	,getHeight: function() {
		return 40;
	}
	,getWidth: function() {
		return 125;
	}
	,getPoints: function() {
		return this._points;
	}
	,_notification: null
	,_points: null
	,__class__: co.doubleduck.FlyingBonus
});
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			if(centered) {
				result.regX = bmp.image.width / 2;
				result.regY = bmp.image.height / 2;
			}
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			if(centered) {
				result.regX = totalWidth / 2;
				result.regY = digits[0].image.height / 2;
			}
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + "comma.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = false;
	co.doubleduck.BaseGame.call(this,stage);
	co.doubleduck.Button.setDefaultSound("sound/Button_click");
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	handleNextLevel: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,startSession: function(properties) {
		co.doubleduck.BaseGame.prototype.startSession.call(this,properties);
		this._session.onNextLevel = $bind(this,this.handleNextLevel);
	}
	,makeTheSwitch: function() {
		this._bg1.visible = this._bg2.visible = false;
		co.doubleduck.BaseGame._stage.removeChild(this._bg1);
		co.doubleduck.BaseGame._stage.removeChild(this._bg2);
		co.doubleduck.BaseGame._stage.removeChild(this._stage);
		this.showMenu();
	}
	,removeSplashElements: function() {
		co.doubleduck.BaseGame._stage.removeChild(this._splashLogo);
		co.doubleduck.BaseGame._stage.removeChild(this._tapToPlay);
		createjs.Tween.get(this._stage).to({ y : co.doubleduck.BaseGame.getViewport().height},750,createjs.Ease.sineInOut);
		createjs.Tween.get(this._bg1).to({ y : co.doubleduck.BaseGame.getViewport().height},750,createjs.Ease.sineInOut);
		createjs.Tween.get(this._bg2).to({ y : co.doubleduck.BaseGame.getViewport().height - this._bg1.image.height * co.doubleduck.BaseGame.getScale()},750,createjs.Ease.sineInOut).call($bind(this,this.makeTheSwitch));
	}
	,switchToMenu: function() {
		this._bg1.mouseEnabled = this._bg2.mouseEnabled = false;
		this._bg1.onClick = this._bg2.onClick = null;
		createjs.Tween.removeTweens(this._tapToPlay);
		createjs.Tween.get(this._tapToPlay).to({ alpha : 0},200);
		createjs.Tween.get(this._splashLogo).to({ alpha : 0},350).call($bind(this,this.removeSplashElements));
	}
	,showTap2Play: function() {
		this.alphaFade(this._tapToPlay);
		this._bg1.mouseEnabled = this._bg2.mouseEnabled = true;
		this._bg1.onClick = this._bg2.onClick = $bind(this,this.switchToMenu);
	}
	,showLogo: function() {
		createjs.Tween.get(this._splashLogo).to({ alpha : 1},750).call($bind(this,this.showTap2Play));
	}
	,showGameSplash: function() {
		var offset = -350 * co.doubleduck.BaseGame.getScale();
		this._bg2 = co.doubleduck.Utils.getCenteredImage("images/general/bg_2.png",true);
		this._bg2.regY = this._bg2.image.height;
		this._bg2.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._bg2.y = co.doubleduck.BaseGame.getViewport().height + offset;
		co.doubleduck.BaseGame._stage.addChild(this._bg2);
		this._bg1 = co.doubleduck.Utils.getCenteredImage("images/general/bg_1.png",true);
		this._bg1.regY = this._bg1.image.height;
		this._bg1.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._bg1.y = this._bg1.image.height * co.doubleduck.BaseGame.getScale() + this._bg2.y - 1;
		co.doubleduck.BaseGame._stage.addChild(this._bg1);
		this._stage = co.doubleduck.Utils.getCenteredImage("images/general/stage.png",true);
		this._stage.x = this._bg1.x;
		this._stage.regY = this._stage.image.height;
		this._stage.y = this._bg1.y;
		co.doubleduck.BaseGame._stage.addChild(this._stage);
		this._splashLogo = co.doubleduck.Utils.getCenteredImage("images/splash/logo.png",true);
		this._splashLogo.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._splashLogo.y = co.doubleduck.BaseGame.getViewport().height / 3;
		this._splashLogo.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._splashLogo);
		this._tapToPlay = co.doubleduck.Utils.getCenteredImage("images/splash/tap2play.png",true);
		this._tapToPlay.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._tapToPlay.y = this._splashLogo.y;
		this._tapToPlay.y += (this._splashLogo.image.height - this._tapToPlay.image.height) * co.doubleduck.BaseGame.getScale();
		this._tapToPlay.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._tapToPlay);
		this.showLogo();
	}
	,_tapToPlay: null
	,_splashLogo: null
	,_stage: null
	,_bg2: null
	,_bg1: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.HelpScreen = $hxClasses["co.doubleduck.HelpScreen"] = function() {
	createjs.Container.call(this);
	this.alpha = 0;
	this._background = co.doubleduck.Utils.getCenteredImage("images/menu/help/help.png",true);
	this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._background);
	this._continueButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/help/btn_gotit.png"),true);
	this._continueButton.scaleX = this._continueButton.scaleY = co.doubleduck.BaseGame.getScale();
	this._continueButton.x = this._background.x;
	this._continueButton.y = this._background.y + this._background.image.height * co.doubleduck.BaseGame.getScale() * 0.32;
	this.addChild(this._continueButton);
	this._continueButton.mouseEnabled = true;
	this._continueButton.onClick = $bind(this,this.handleContinue);
};
co.doubleduck.HelpScreen.__name__ = ["co","doubleduck","HelpScreen"];
co.doubleduck.HelpScreen.__super__ = createjs.Container;
co.doubleduck.HelpScreen.prototype = $extend(createjs.Container.prototype,{
	show: function() {
		createjs.Tween.get(this).to({ alpha : 1},400);
	}
	,handleContinue: function() {
		createjs.Tween.get(this).to({ alpha : 0},400).call(this.onContinue);
	}
	,_continueButton: null
	,_background: null
	,onContinue: null
	,__class__: co.doubleduck.HelpScreen
});
co.doubleduck.Level = $hxClasses["co.doubleduck.Level"] = function() {
	this._lastMoonHeight = 0;
	this._accelerationFactor = co.doubleduck.DataLoader.getAcceleration();
	this._speedFactor = 1;
	this._currentFloatables = new Array();
	var probabilities = co.doubleduck.DataLoader.getProbabilityData();
	this.beeChance = probabilities.bee;
	this.bonusChance = probabilities.flyingBonus;
	this.hedgehogChance = probabilities.hedgehog;
	this._active = false;
	this._graphics = new createjs.Container();
	this._sky = new createjs.Container();
	this._background = new createjs.Container();
	this._tower = new createjs.Container();
	this._bonusesAndAlerts = new createjs.Container();
	this._graphics.addChild(this._sky);
	this._graphics.addChild(this._background);
	this._graphics.addChild(this._tower);
	this._graphics.addChild(this._bonusesAndAlerts);
	this._height = 0;
	this._bonusPoints = 0;
	this._bonuses = new Array();
	this._bees = new Array();
	this.addBackgrounds();
	this.addSkyColors();
	this._stage = co.doubleduck.Utils.getCenteredImage("images/general/stage.png",true);
	this._stage.x = this._background2.x;
	this._stage.mouseEnabled = true;
	this._stage.regY = this._stage.image.height;
	this._stage.y = (this._background1.image.height + this._background2.image.height) * co.doubleduck.BaseGame.getScale();
	this._tower.addChild(this._stage);
	this._animals = new Array();
	var bg1Shift = this._background1.image.height * co.doubleduck.BaseGame.getScale();
	var bg2Shift = this._background2.image.height * co.doubleduck.BaseGame.getScale();
	this._background.y = co.doubleduck.BaseGame.getViewport().height - bg1Shift - bg2Shift;
	this._bonusesAndAlerts.y = co.doubleduck.BaseGame.getViewport().height - bg1Shift - bg2Shift;
	this._tower.y = co.doubleduck.BaseGame.getViewport().height - bg1Shift - bg2Shift;
	this._overlay = new createjs.Shape();
	this._overlay.graphics.beginFill("0xffffff");
	this._overlay.graphics.rect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._overlay.alpha = 0.01;
	this._cake = new co.doubleduck.Cake();
	this._cake.getGraphics().x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * this._cake.getWidth() / 2;
	this._cake.getGraphics().y = this._stage.y - co.doubleduck.BaseGame.getScale() * this._cake.getHeight() / 2;
	this._cake.getGraphics().alpha = 0;
	createjs.Tween.get(this).wait(co.doubleduck.Session.FADE_IN).call($bind(this,this.startGame));
};
co.doubleduck.Level.__name__ = ["co","doubleduck","Level"];
co.doubleduck.Level.prototype = {
	destroy: function() {
		this._active = false;
		this._graphics.removeAllChildren();
		var _g = 0, _g1 = this._currentFloatables;
		while(_g < _g1.length) {
			var $float = _g1[_g];
			++_g;
			createjs.Tween.removeTweens($float);
		}
		this._currentFloatables = null;
		this._graphics = null;
		this._background = null;
		this._sky = null;
		this._tower = null;
		this._bonusesAndAlerts = null;
		this._background1 = null;
		this._background2 = null;
		this._stage = null;
		this._animals = null;
		this._topAnimal = null;
		this._currentAnimal = null;
		createjs.Tween.removeTweens(this._aim);
		this._aim = null;
		this.onRestart = null;
		this.onMenu = null;
		this.onMiss = null;
	}
	,getGraphics: function() {
		return this._graphics;
	}
	,getTapOverlay: function() {
		return this._overlay;
	}
	,getBackground: function(bg) {
		return "images/general/bg_" + bg + ".png";
	}
	,enable: function() {
		this._active = true;
	}
	,listenToTaps: function() {
		this._overlay.mouseEnabled = true;
		if(this._aim.visible) this._overlay.onClick = $bind(this,this.handleThrowCake); else this._overlay.onClick = $bind(this,this.handleDrop);
	}
	,checkSpotOn: function(newAnimal,oldAnimal) {
		var range1 = newAnimal.getBottom();
		var range2 = oldAnimal.getTop();
		var mid1 = Math.round(range1[0] + Math.abs((range1[1] - range1[0]) / 2));
		var mid2 = Math.round(range2[0] + Math.abs((range2[1] - range2[0]) / 2));
		if(Math.abs(mid2 - mid1) <= 5 * co.doubleduck.BaseGame.getScale()) this.getSkillBonus(true);
		if(Math.abs(range1[1] - range2[0]) <= 5 * co.doubleduck.BaseGame.getScale() || Math.abs(range1[0] - range2[1]) <= 5 * co.doubleduck.BaseGame.getScale()) this.getSkillBonus(false);
	}
	,getBottomOfScreen: function() {
		return (this._background1.image.height + this._background2.image.height) * co.doubleduck.BaseGame.getScale();
	}
	,getSkillBonus: function(isSpotOn) {
		var points = co.doubleduck.Utils.getCenteredImage("images/session/alert_bonus100.png",true);
		points.regY = points.image.height * 2;
		points.y = this._topAnimal.getGraphics().y;
		points.x = this._topAnimal.getGraphics().x + co.doubleduck.BaseGame.getScale() * this._topAnimal.getWidth() / 2;
		this.updateHeightWithPoints(co.doubleduck.DataLoader.getSkillBonusPoints());
		points.alpha = 0;
		this._bonusesAndAlerts.addChild(points);
		createjs.Tween.get(points).to({ alpha : 1, y : this._topAnimal.getGraphics().y - 50 * co.doubleduck.BaseGame.getScale()},750).to({ alpha : 0, y : this._topAnimal.getGraphics().y - 100 * co.doubleduck.BaseGame.getScale()},750).call(($_=this._bonusesAndAlerts,$bind($_,$_.removeChild)),[points]);
		var title = null;
		if(isSpotOn) title = co.doubleduck.Utils.getCenteredImage("images/session/alert_spoton.png",true); else title = co.doubleduck.Utils.getCenteredImage("images/session/alert_closecall.png",true);
		title.y = points.y;
		title.x = points.x;
		title.regY = title.image.height;
		title.alpha = 0;
		createjs.Tween.get(title).to({ alpha : 1, y : this._topAnimal.getGraphics().y - 50 * co.doubleduck.BaseGame.getScale()},750).to({ alpha : 0, y : this._topAnimal.getGraphics().y - 100 * co.doubleduck.BaseGame.getScale()},750).call(($_=this._bonusesAndAlerts,$bind($_,$_.removeChild)),[title]);
		this._bonusesAndAlerts.addChild(title);
	}
	,handleDrop: function(e) {
		var _g = this;
		this._overlay.mouseEnabled = false;
		if(this._currentAnimal == null) return;
		this._currentAnimal.stopMoving();
		if(this.isCurrentAnimalInBounds()) {
			var bottomPadding = this.getBottomPadding(this._currentAnimal);
			var topPadding = this.getTopPadding(this._topAnimal);
			var dest = this._topAnimal.getGraphics().y - this._currentAnimal.getHeight() * co.doubleduck.BaseGame.getScale() + bottomPadding + topPadding;
			if(this._currentAnimal.getType() == co.doubleduck.AnimalType.HEDGEHOG) {
				var tween = createjs.Tween.get(this._currentAnimal.getGraphics()).to({ y : dest},250,createjs.Ease.sineInOut).call($bind(this,this.handleHedgeHogHits),[this._currentAnimal]);
			} else {
				var oldTop = this._topAnimal;
				this._topAnimal = this._currentAnimal;
				this._justGotStung = false;
				createjs.Tween.get(this._currentAnimal.getGraphics()).to({ y : dest},250,createjs.Ease.sineInOut).call($bind(this,this.checkOvelappingPickupables),[this._currentAnimal]).call(function() {
					if(!_g._justGotStung) _g.checkSpotOn(_g._topAnimal,oldTop);
				}).call(function() {
					if(!_g._justGotStung) _g._topAnimal.squish();
				}).call(function() {
					if(!_g._justGotStung) oldTop.setSurprised();
				});
				this.spawnFloatable();
				this.panCameraUp(this._topAnimal);
			}
		} else {
			HxOverrides.remove(this._animals,this._currentAnimal);
			if(this._currentAnimal.getType() == co.doubleduck.AnimalType.HEDGEHOG) {
				var fallingTween = this.tweenAnimalFall(this._currentAnimal);
				var randomAnimal = this.getRandomAnimal();
				fallingTween.call($bind(this,this.addAnimal),[randomAnimal]);
			} else this.handleMiss();
		}
		this._currentAnimal = null;
	}
	,getTopPadding: function(animal) {
		return (animal.getBounds().bottom_padding | 0) * co.doubleduck.BaseGame.getScale();
	}
	,getBottomPadding: function(animal) {
		return (this._currentAnimal.getBounds().bottom_padding | 0) * co.doubleduck.BaseGame.getScale();
	}
	,handleHedgeHogHits: function(hedgehog) {
		var animalToRemove = this._topAnimal;
		HxOverrides.remove(this._animals,animalToRemove);
		HxOverrides.remove(this._animals,hedgehog);
		this._topAnimal = this._animals[this._animals.length - 1];
		var animalFallingTween = this.tweenAnimalFall(animalToRemove);
		this._currentAnimal = hedgehog;
		var hedgehogFallingTween = this.handleMiss();
		this._currentAnimal = null;
		this._topOfScreen += animalToRemove.getHeight() * co.doubleduck.BaseGame.getScale();
		if(hedgehogFallingTween != null) hedgehogFallingTween.call($bind(this,this.panCameraBackDown),[animalToRemove]);
		co.doubleduck.SoundManager.playEffect("sound/animal_hit");
	}
	,handleBeeHit: function() {
		var animalToRemove = this._topAnimal;
		HxOverrides.remove(this._animals,animalToRemove);
		this._topAnimal = this._animals[this._animals.length - 1];
		var animalFallingTween = this.tweenAnimalFall(animalToRemove);
		var gameOver = this.onMiss();
		if(gameOver) {
			this.handleGameOver();
			return null;
		}
		this._topOfScreen += animalToRemove.getHeight() * co.doubleduck.BaseGame.getScale();
		animalFallingTween = animalFallingTween.call($bind(this,this.panCameraBackDown),[animalToRemove]);
		return animalFallingTween;
	}
	,chooseNewAnimal: function() {
		var randomAnimal = this.getRandomAnimal();
		if(Math.random() < this.hedgehogChance) randomAnimal = co.doubleduck.AnimalType.HEDGEHOG;
		this.addAnimal(randomAnimal);
	}
	,checkOvelappingPickupables: function(animal) {
		this._justGotStung = false;
		var usedBonii = new Array();
		var _g = 0, _g1 = this._bonuses;
		while(_g < _g1.length) {
			var bonus = _g1[_g];
			++_g;
			if(co.doubleduck.Utils.overlap(bonus.getGraphics(),bonus.getWidth(),bonus.getHeight(),animal.getGraphics(),animal.getWidth(),animal.getHeight())) {
				this._bonusesAndAlerts.removeChild(bonus.getGraphics());
				bonus.getAlertGraphics().y = bonus.getGraphics().y;
				bonus.getAlertGraphics().x = bonus.getGraphics().x;
				this._bonusesAndAlerts.addChild(bonus.getAlertGraphics());
				createjs.Tween.get(bonus.getAlertGraphics()).to({ alpha : 0, y : bonus.getGraphics().y - 100 * co.doubleduck.BaseGame.getScale()},1000).call(($_=this._bonusesAndAlerts,$bind($_,$_.removeChild)),[bonus.getAlertGraphics()]);
				usedBonii.push(bonus);
				co.doubleduck.SoundManager.playEffect("sound/score_bonus");
			}
		}
		var _g = 0;
		while(_g < usedBonii.length) {
			var bonus = usedBonii[_g];
			++_g;
			HxOverrides.remove(this._bonuses,bonus);
			this.updateHeightWithPoints(bonus.getPoints());
		}
		var beeSoundPlayed = false;
		var usedBees = new Array();
		var _g = 0, _g1 = this._bees;
		while(_g < _g1.length) {
			var bee = _g1[_g];
			++_g;
			if(co.doubleduck.Utils.overlap(bee.getGraphics(),bee.getWidth(),bee.getHeight(),animal.getGraphics(),animal.getWidth(),animal.getHeight())) {
				this._bonusesAndAlerts.removeChild(bee.getGraphics());
				this._bonusesAndAlerts.addChild(bee.getAlertGraphics());
				createjs.Tween.get(bee.getAlertGraphics()).to({ alpha : 0},1000).call(($_=this._bonusesAndAlerts,$bind($_,$_.removeChild)),[bee.getAlertGraphics()]);
				usedBees.push(bee);
				co.doubleduck.SoundManager.playEffect("sound/animal_hit");
				beeSoundPlayed = true;
			}
		}
		if(usedBees.length > 0) {
			this._justGotStung = true;
			var lastBeeRelatedTween = null;
			var _g = 0;
			while(_g < usedBees.length) {
				var bee = usedBees[_g];
				++_g;
				HxOverrides.remove(this._bees,bee);
				lastBeeRelatedTween = this.handleBeeHit();
			}
			if(lastBeeRelatedTween != null) lastBeeRelatedTween.call($bind(this,this.chooseNewAnimal));
		} else this.chooseNewAnimal();
		if(!beeSoundPlayed) this.playAnimalSound(animal);
	}
	,checkBgChange: function() {
		if(this._currentColor == null || this._currentColor.to == null) return;
		if(this._height >= this._currentColor.to) {
			this._skyColors[this._currentColorIndex].visible = false;
			this._previousTo = this._currentColor.to;
			this._currentColorIndex++;
			this._currentColor = co.doubleduck.DataLoader.getAllSkyColors()[this._currentColorIndex];
			this.tweenColors();
		}
	}
	,tweenColors: function() {
		if(this._currentColor == null || this._currentColor.to == null) {
			var last = this._skyColors[this._skyColors.length - 1];
			createjs.Tween.get(last).to({ alpha : 0},350,createjs.Ease.sineInOut);
			return;
		}
		var newAlpha = 1 - Math.min(1,(this._height - this._previousTo) / (this._currentColor.to - this._previousTo));
		createjs.Tween.get(this._skyColors[this._currentColorIndex]).to({ alpha : newAlpha},350,createjs.Ease.sineInOut).call($bind(this,this.checkBgChange));
	}
	,removeAlertIfCloseToBee: function(bee) {
		if(bee.getAlertGraphics().y <= bee.getGraphics().y - co.doubleduck.BaseGame.getScale() * bee.getHeight() / 2) bee.getAlertGraphics().visible = false;
	}
	,panCameraUp: function(animal,overrideDistance) {
		if(overrideDistance == null) this._speedFactor *= this._accelerationFactor;
		var dest = null;
		if(overrideDistance == null) {
			this._topOfScreen -= animal.getHeight() * co.doubleduck.BaseGame.getScale() - this.getTopPadding(animal) - this.getBottomPadding(animal);
			dest = this._tower.y + (animal.getHeight() * co.doubleduck.BaseGame.getScale() - this.getTopPadding(animal) - this.getBottomPadding(animal));
		} else {
			this._topOfScreen -= overrideDistance;
			dest = this._tower.y + overrideDistance;
		}
		createjs.Tween.get(this._background).to({ y : dest},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._tower).to({ y : dest},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._bonusesAndAlerts).to({ y : dest},350,createjs.Ease.sineInOut);
		this.tweenColors();
		if(overrideDistance == null) this.updateHeight(animal,true);
		var _g = 0, _g1 = this._bees;
		while(_g < _g1.length) {
			var bee = _g1[_g];
			++_g;
			if(bee.getAlertGraphics().visible) createjs.Tween.get(bee.getAlertGraphics()).to({ y : this._topOfScreen},350,createjs.Ease.sineInOut).call($bind(this,this.removeAlertIfCloseToBee),[bee]);
		}
	}
	,panCameraBackDown: function(animalToRemove) {
		var dest = this._tower.y - animalToRemove.getHeight() * co.doubleduck.BaseGame.getScale();
		createjs.Tween.get(this._background).to({ y : dest},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._tower).to({ y : dest},350,createjs.Ease.sineInOut);
		var tween = createjs.Tween.get(this._bonusesAndAlerts).to({ y : dest},350,createjs.Ease.sineInOut);
		this.tweenColors();
		this.updateHeight(animalToRemove,false);
		return tween;
	}
	,getRandomAnimal: function() {
		return co.doubleduck.Utils.getRandomElement(co.doubleduck.DataLoader.getCurrentlyUnlocked(co.doubleduck.Persistence.getXp()));
	}
	,isCurrentAnimalInBounds: function() {
		var oldAnimalBounds = this._topAnimal.getBounds();
		var newAnimalBounds = this._currentAnimal.getBounds();
		var floorFrom = co.doubleduck.BaseGame.getScale() * (oldAnimalBounds.top_from | 0) + this._topAnimal.getGraphics().x;
		var floorTo = co.doubleduck.BaseGame.getScale() * (oldAnimalBounds.top_to | 0) + this._topAnimal.getGraphics().x;
		var dropFrom = co.doubleduck.BaseGame.getScale() * (newAnimalBounds.bottom_from | 0) + this._currentAnimal.getGraphics().x;
		var dropTo = co.doubleduck.BaseGame.getScale() * (newAnimalBounds.bottom_to | 0) + this._currentAnimal.getGraphics().x;
		if(dropFrom > floorTo || dropTo < floorFrom) return false; else return true;
	}
	,addAnimal: function(type,firstAfterBaseAnimal) {
		if(firstAfterBaseAnimal == null) firstAfterBaseAnimal = false;
		this._currentAnimal = new co.doubleduck.Animal(type);
		this._currentAnimal.getAppearingTween().call($bind(this,this.listenToTaps));
		this._currentAnimal.getGraphics().y = this._topOfScreen + 10 * co.doubleduck.BaseGame.getScale();
		var bottomOfNewAnimal = this._currentAnimal.getGraphics().y + this._currentAnimal.getHeight() * co.doubleduck.BaseGame.getScale();
		var topOfOldAnimal = this._topAnimal.getGraphics().y - this._topAnimal.getGraphics().regY * co.doubleduck.BaseGame.getScale();
		var adjustment = 0;
		while(bottomOfNewAnimal - adjustment > topOfOldAnimal - 120 * co.doubleduck.BaseGame.getScale()) adjustment += co.doubleduck.BaseGame.getScale() * 120;
		if(adjustment > 0) this._currentAnimal.getGraphics().y -= adjustment;
		this._currentAnimal.getGraphics().x = (co.doubleduck.BaseGame.getViewport().width - this._currentAnimal.getWidth() * co.doubleduck.BaseGame.getScale()) * Math.random();
		this._currentAnimal.startMoving(this._speedFactor);
		this._tower.addChild(this._currentAnimal.getGraphics());
		this._animals.push(this._currentAnimal);
		if(type != co.doubleduck.AnimalType.HEDGEHOG) {
			if(Math.random() <= this.bonusChance) {
				var points = co.doubleduck.Utils.getRandomElement([200,500,100]);
				var bonus = new co.doubleduck.FlyingBonus(points);
				this._bonuses.push(bonus);
				bonus.getGraphics().y = this._topOfScreen - co.doubleduck.BaseGame.getViewport().height * 3 / 4;
				bonus.getGraphics().x = (co.doubleduck.BaseGame.getViewport().width - bonus.getWidth() * co.doubleduck.BaseGame.getScale()) * Math.random();
				this._bonusesAndAlerts.addChild(bonus.getGraphics());
			} else if(Math.random() <= this.beeChance) {
				var newBeePosition = this._topOfScreen - co.doubleduck.BaseGame.getViewport().height * 3 / 4;
				if(this._bees.length > 0) {
					var oldBeePosition = this._bees[this._bees.length - 1].getGraphics().y;
					if(Math.abs(oldBeePosition - newBeePosition) < co.doubleduck.BaseGame.getViewport().height) return;
				}
				var bee = new co.doubleduck.Bee();
				this._bees.push(bee);
				bee.getGraphics().y = newBeePosition;
				bee.getGraphics().x = (co.doubleduck.BaseGame.getViewport().width - bee.getWidth() * co.doubleduck.BaseGame.getScale()) * Math.random();
				this._bonusesAndAlerts.addChild(bee.getGraphics());
				bee.getAlertGraphics().y = this._topOfScreen;
				bee.getAlertGraphics().x = bee.getGraphics().x;
				this._bonusesAndAlerts.addChild(bee.getAlertGraphics());
			}
		}
	}
	,playAnimalSound: function(anim) {
		if(anim.getType() == co.doubleduck.AnimalType.BEAVER) co.doubleduck.SoundManager.playEffect("sound/Boing_sound_light"); else if(anim.getType() == co.doubleduck.AnimalType.BABOON || anim.getType() == co.doubleduck.AnimalType.FLAMINGO || anim.getType() == co.doubleduck.AnimalType.LION || anim.getType() == co.doubleduck.AnimalType.SEAL || anim.getType() == co.doubleduck.AnimalType.ZEBRA) co.doubleduck.SoundManager.playEffect("sound/Boing_sound_medium"); else co.doubleduck.SoundManager.playEffect("sound/Boing_sound_heavy");
	}
	,addFirstAnimal: function(type) {
		this._overlay.mouseEnabled = false;
		this._baseAnimal = this._topAnimal = new co.doubleduck.Animal(type);
		this._animals.push(this._topAnimal);
		var bounds = this._topAnimal.getBounds();
		var bottomPadding = (bounds.bottom_padding | 0) * co.doubleduck.BaseGame.getScale();
		var stagePadding = 4 * co.doubleduck.BaseGame.getScale();
		this._topAnimal.stopMoving();
		var diff = co.doubleduck.BaseGame.getViewport().height;
		this._topOfScreen = this._topAnimal.getGraphics().y = this._stage.y - diff;
		this._topAnimal.getGraphics().x = (co.doubleduck.BaseGame.getViewport().width - this._topAnimal.getWidth() * co.doubleduck.BaseGame.getScale()) / 2;
		this.updateHeight(this._topAnimal,true);
		this._tower.addChild(this._topAnimal.getGraphics());
		var dest = this._stage.y - (this._stage.regY + this._topAnimal.getHeight()) * co.doubleduck.BaseGame.getScale() + bottomPadding + stagePadding;
		var randomAnimal = this.getRandomAnimal();
		createjs.Tween.get(this._topAnimal.getGraphics()).to({ y : dest},350,createjs.Ease.sineInOut).call(($_=this._topAnimal,$bind($_,$_.squish))).call($bind(this,this.panCameraUp),[null,this._stage.image.height * 0.5 * co.doubleduck.BaseGame.getScale()]).call($bind(this,this.addAnimal),[randomAnimal,true]).call($bind(this,this.addCrosshair)).call($bind(this,this.playAnimalSound),[this._topAnimal]);
	}
	,updateHeightWithPoints: function(points) {
		this._bonusPoints += points;
		if(this.onHeightUpdate != null) this.onHeightUpdate(this._height + this._bonusPoints);
	}
	,updateHeight: function(animal,isGoingUp) {
		if(isGoingUp) this._height += animal.getHeight() / 5; else this._height -= animal.getHeight() / 5;
		if(this.onHeightUpdate != null) this.onHeightUpdate(this._height + this._bonusPoints);
	}
	,handleRestart: function() {
		if(this.onRestart != null) this.onRestart();
	}
	,getPoints: function() {
		return this._height + this._bonusPoints;
	}
	,handleMenu: function(missed) {
		if(missed == null) missed = false;
		if(this.onMenu != null) {
			var points = this.getPoints();
			createjs.Tween.get(this._tower).to({ alpha : 0},500);
			createjs.Tween.get(this._graphics).wait(750).call(this.onMenu,[points]);
		}
	}
	,handleGameOver: function() {
		this._overlay.mouseEnabled = false;
		var dest = -this._background1.image.height * co.doubleduck.BaseGame.getScale() - this._background2.image.height * co.doubleduck.BaseGame.getScale() + co.doubleduck.BaseGame.getViewport().height;
		var delta = Math.max(500,Math.abs(dest - this._background.y));
		createjs.Tween.get(this._background).to({ y : dest},delta / 3,createjs.Ease.sineInOut);
		createjs.Tween.get(this._tower).to({ y : dest},delta / 3,createjs.Ease.sineInOut);
		createjs.Tween.get(this._bonusesAndAlerts).to({ y : dest},delta / 3,createjs.Ease.sineInOut);
		this.showAim();
	}
	,handleMiss: function() {
		this._overlay.mouseEnabled = false;
		var fallingTween = this.tweenAnimalFall(this._currentAnimal);
		if(this.onMiss != null) {
			var gameOver = this.onMiss();
			this._currentAnimal.setOnNo();
			if(gameOver) {
				this.handleGameOver();
				return null;
			} else {
				var randomAnimal = this.getRandomAnimal();
				return fallingTween.call($bind(this,this.addAnimal),[randomAnimal]);
			}
		}
		return null;
	}
	,tweenAnimalFall: function(animal,speed,distance) {
		if(speed == null) speed = 750;
		var randomAngle = 45 + Std.random(15);
		if(Math.random() < 0.5) randomAngle *= -1;
		if(distance == null) distance = animal.getHeight() * co.doubleduck.BaseGame.getScale();
		var dest = this._stage.y + distance;
		return createjs.Tween.get(animal.getGraphics()).to({ y : dest, rotation : randomAngle},speed,createjs.Ease.sineIn).call($bind(animal,animal.setDead));
	}
	,moveAimDown: function() {
		var tween = createjs.Tween.get(this._aim).to({ y : this._baseAnimal.getGraphics().y + this._baseAnimal.getHeight() * co.doubleduck.BaseGame.getScale()},500,createjs.Ease.sineInOut);
		tween.call($bind(this,this.moveAimUp));
	}
	,moveAimUp: function() {
		var durationY = co.doubleduck.DataLoader.getAimAnimationData().durationY | 0;
		var minY = this._baseAnimal.getGraphics().y;
		var maxY = this._baseAnimal.getGraphics().y + this._baseAnimal.getHeight() * co.doubleduck.BaseGame.getScale();
		var location = (this._aim.y - minY) / (maxY - minY);
		var duration = durationY * location | 0;
		var tween = createjs.Tween.get(this._aim).to({ y : this._baseAnimal.getGraphics().y},duration,createjs.Ease.sineInOut);
		tween.call($bind(this,this.moveAimDown));
	}
	,moveAimLeft: function() {
		this._aimBounces++;
		var durationX = co.doubleduck.DataLoader.getAimAnimationData().durationX | 0;
		var tween = createjs.Tween.get(this._aim).to({ x : 0},durationX,createjs.Ease.sineInOut);
		tween.call($bind(this,this.moveAimRight));
	}
	,moveAimRight: function() {
		this._aimBounces++;
		var durationX = co.doubleduck.DataLoader.getAimAnimationData().durationX | 0;
		var location = 1 - this._aim.x / co.doubleduck.BaseGame.getViewport().width;
		var duration;
		var destination;
		if(this._aimBounces < 3) {
			duration = durationX * location | 0;
			destination = co.doubleduck.BaseGame.getViewport().width;
			var tween = createjs.Tween.get(this._aim).to({ x : destination},duration,createjs.Ease.sineInOut);
			tween.call($bind(this,this.moveAimLeft));
		} else {
			duration = durationX * location / 2 | 0;
			destination = co.doubleduck.BaseGame.getViewport().width / 2;
			var tween = createjs.Tween.get(this._aim).to({ x : destination},duration,createjs.Ease.sineInOut);
			tween.call($bind(this,this.resetAim));
		}
	}
	,playCakeSound: function(didHit) {
		if(didHit) co.doubleduck.SoundManager.playEffect("sound/cake_hit"); else co.doubleduck.SoundManager.playEffect("sound/cake_miss");
	}
	,handleThrowCake: function(event) {
		this._overlay.onClick = null;
		createjs.Tween.removeTweens(this._aim);
		createjs.Tween.get(this._aim).to({ alpha : 0},150);
		var localPoint = this._aim.localToLocal(0,0,this._baseAnimal.getGraphics());
		var hit = this._baseAnimal.getGraphics().hitTest(localPoint.x,localPoint.y);
		createjs.Tween.removeTweens(this._cake.getGraphics());
		this._cake.setBig();
		var targetX = this._aim.x;
		var targetY = this._aim.y;
		var scale = 0.5;
		if(hit) {
			this._cakeHit = true;
			this._cake.onFinishedSplat = $bind(this,this.handleSplatFinished);
			createjs.Tween.get(this._cake.getGraphics()).to({ x : targetX, y : targetY, scaleX : scale, scaleY : scale},350,createjs.Ease.sineIn).call($bind(this,this.updateHeightWithPoints),[co.doubleduck.DataLoader.getAnimalCakeScore(this._baseAnimal.getType())]).call($bind(this,this.cakeSplat),[false]).call($bind(this,this.playCakeSound),[this._cakeHit]);
		} else {
			this._cakeHit = false;
			this._cake.onFinishedSplat = $bind(this,this.handleMissedFinished);
			createjs.Tween.get(this._cake.getGraphics()).to({ x : targetX, y : targetY, scaleX : scale / 3, scaleY : scale / 3},350,createjs.Ease.sineIn).call($bind(this,this.cakeSplat),[true]).call($bind(this,this.playCakeSound),[this._cakeHit]);
		}
	}
	,handleMissedFinished: function() {
		this._cake.onFinishedSplat = null;
		this.handleMenu();
	}
	,handleSplatFinished: function() {
		this.dropFirstAnimal().call($bind(this,this.towerFalls));
		this._cake.onFinishedSplat = null;
	}
	,cakeSplat: function(missed) {
		if(missed) {
			this._cake.getGraphics().scaleX = this._cake.getGraphics().scaleY = 1 / 3;
			this._cake.setSplat();
			var miss = co.doubleduck.Utils.getCenteredImage("images/session/alert_miss.png",true);
			miss.regY = miss.image.height;
			miss.y = this._baseAnimal.getGraphics().y;
			miss.x = co.doubleduck.BaseGame.getViewport().width / 2;
			this._bonusesAndAlerts.addChild(miss);
			createjs.Tween.get(miss).to({ alpha : 0},750);
		} else {
			var splat = co.doubleduck.Utils.getCenteredImage("images/session/alert_splat.png",true);
			splat.regY = splat.image.height;
			splat.y = this._baseAnimal.getGraphics().y;
			splat.x = co.doubleduck.BaseGame.getViewport().width / 2;
			this._bonusesAndAlerts.addChild(splat);
			createjs.Tween.get(splat).to({ alpha : 0},750);
			var pointsBonus = co.doubleduck.DataLoader.getAnimalCakeScore(this._baseAnimal.getType());
			var pointLabel = new co.doubleduck.LabeledContainer(null);
			pointLabel.scaleX = pointLabel.scaleY = co.doubleduck.BaseGame.getScale();
			pointLabel.addBitmapLabel("" + pointsBonus,"images/general/font_red/");
			pointLabel.setBitmapLabelY(-80);
			pointLabel.setBitmapLabelX(0);
			pointLabel.x = splat.x;
			pointLabel.y = splat.y;
			this._bonusesAndAlerts.addChild(pointLabel);
			createjs.Tween.get(pointLabel).to({ alpha : 0, y : splat.y - 100 * co.doubleduck.BaseGame.getScale()},750);
			this._cake.getGraphics().scaleX = this._cake.getGraphics().scaleY = 1;
			this._cake.setSplat();
			this._baseAnimal.setSurprised();
			createjs.Tween.get(this._cake.getGraphics()).to({ scaleX : 0.85 * co.doubleduck.BaseGame.getScale(), scaleY : 0.85 * co.doubleduck.BaseGame.getScale()},150);
			this._baseAnimal.setHitRegs();
			createjs.Tween.get(this._baseAnimal.getGraphics()).to({ scaleX : 0.85 * co.doubleduck.BaseGame.getScale(), scaleY : 0.85 * co.doubleduck.BaseGame.getScale()},150);
		}
	}
	,towerFalls: function() {
		this.dropVisibleAnimals();
		this.dropLotsOfAnimals();
		this.cloudRising().call($bind(this,this.handleMenu));
	}
	,dropLotsOfAnimals: function() {
		this._dropper = new co.doubleduck.Dropper();
		this._graphics.addChild(this._dropper);
		var unseenAnimals = this._animals.length - this._visibleAnimalsIndex - 1;
		if(unseenAnimals > 0) this._dropper.fireBurst(unseenAnimals,500);
		if(this._animals.length < 3) co.doubleduck.SoundManager.playEffect("sound/animals_fall_1"); else if(this._animals.length < 8) co.doubleduck.SoundManager.playEffect("sound/animals_fall_2"); else co.doubleduck.SoundManager.playEffect("sound/animals_fall_3");
		return createjs.Tween.get(this._tower);
	}
	,cloudRising: function() {
		var rightCloud = new createjs.Container();
		var leftCloud = new createjs.Container();
		rightCloud.y = co.doubleduck.BaseGame.getViewport().height;
		leftCloud.y = co.doubleduck.BaseGame.getViewport().height;
		var rightDustBmp = co.doubleduck.BaseAssets.getImage("images/session/dust.png");
		rightDustBmp.regX = rightDustBmp.image.width;
		rightDustBmp.scaleX = co.doubleduck.BaseGame.getScale();
		rightDustBmp.scaleY = co.doubleduck.BaseGame.getScale();
		rightDustBmp.x = co.doubleduck.BaseGame.getViewport().width;
		var leftDustBmp = co.doubleduck.BaseAssets.getImage("images/session/dust.png");
		leftDustBmp.scaleX = -co.doubleduck.BaseGame.getScale();
		leftDustBmp.scaleY = co.doubleduck.BaseGame.getScale();
		leftDustBmp.x = leftDustBmp.image.width * co.doubleduck.BaseGame.getScale();
		var rightDustShape = new createjs.Shape();
		var dustColor = "#c6ae93";
		rightDustShape.graphics.beginFill(dustColor);
		rightDustShape.graphics.rect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
		rightDustShape.y = leftDustBmp.image.height * co.doubleduck.BaseGame.getScale();
		var leftDustShape = new createjs.Shape();
		leftDustShape.graphics.beginFill(dustColor);
		leftDustShape.graphics.rect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
		leftDustShape.y = leftDustBmp.image.height * co.doubleduck.BaseGame.getScale();
		rightCloud.addChild(rightDustBmp);
		leftCloud.addChild(leftDustBmp);
		rightCloud.addChild(rightDustShape);
		leftCloud.addChild(leftDustShape);
		this._graphics.addChild(rightCloud);
		this._graphics.addChild(leftCloud);
		rightCloud.alpha = 0.3;
		leftCloud.alpha = 0.3;
		createjs.Tween.get(rightCloud).to({ alpha : 1, y : rightCloud.y - rightDustBmp.image.height * co.doubleduck.BaseGame.getScale() - co.doubleduck.BaseGame.getViewport().height},1500,createjs.Ease.sineIn);
		return createjs.Tween.get(leftCloud).wait(250).to({ alpha : 1, y : leftCloud.y - leftDustBmp.image.height * co.doubleduck.BaseGame.getScale() - co.doubleduck.BaseGame.getViewport().height},1250,createjs.Ease.sineIn);
	}
	,dropVisibleAnimals: function() {
		if(this._animals.length < 2) return;
		this._animals[1].setOnNo();
		var diff = co.doubleduck.BaseGame.getViewport().height - this._stage.image.height * co.doubleduck.BaseGame.getScale();
		var lastVisiblePixel = this.getTowerBottom() - diff;
		this._visibleAnimalsIndex = 0;
		var _g = 0, _g1 = this._animals;
		while(_g < _g1.length) {
			var animal = _g1[_g];
			++_g;
			if(animal.isAlive() && animal.getGraphics().y + animal.getHeight() * co.doubleduck.BaseGame.getScale() > lastVisiblePixel) {
				this._visibleAnimalsIndex++;
				this.tweenAnimalFall(animal);
			}
		}
	}
	,dropFirstAnimal: function() {
		this._tower.swapChildren(this._stage,this._tower.getChildAt(this._tower.getNumChildren() - 1));
		return this.tweenAnimalFall(this._baseAnimal,500);
	}
	,getTowerBottom: function() {
		return this._stage.y - this._stage.regY * co.doubleduck.BaseGame.getScale();
	}
	,resetCake: function() {
		if(!this._active) return;
		var origX = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * this._cake.getWidth() / 2;
		var origY = this._stage.y - co.doubleduck.BaseGame.getScale() * this._cake.getHeight() / 2;
		createjs.Tween.get(this._cake.getGraphics()).to({ x : origX, y : origY},1000).call($bind(this,this.moveCakeRandomly));
	}
	,moveCakeRandomly: function() {
		var randX = this._cake.getGraphics().x + Std.random(Math.round((-5 + Math.round(11)) * co.doubleduck.BaseGame.getScale()));
		var randY = this._cake.getGraphics().y + Std.random(Math.round((-5 + Math.round(11)) * co.doubleduck.BaseGame.getScale()));
		createjs.Tween.get(this._cake.getGraphics()).to({ x : randX, y : randY},1000).call($bind(this,this.resetCake));
	}
	,CakeSound: function() {
		co.doubleduck.SoundManager.playEffect("sound/anticipation_view");
	}
	,showAim: function() {
		this._overlay.mouseEnabled = false;
		if(this.onHideMisses != null) this.onHideMisses();
		this._aim.visible = true;
		this.resetAim();
		this._cake.setRest();
		this._bonusesAndAlerts.addChild(this._cake.getGraphics());
		this.moveCakeRandomly();
		createjs.Tween.get(this._cake.getGraphics()).to({ alpha : 1},500).call($bind(this,this.listenToTaps)).call($bind(this,this.CakeSound));
	}
	,addCrosshair: function() {
		this._aim = co.doubleduck.Utils.getCenteredImage("images/session/aim.png",true);
		this._aim.visible = false;
		this._bonusesAndAlerts.addChild(this._aim);
	}
	,resetAim: function() {
		createjs.Tween.removeTweens(this._aim);
		this._aimBounces = 0;
		this._aim.x = this._baseAnimal.getGraphics().x + this._baseAnimal.getWidth() * co.doubleduck.BaseGame.getScale() / 2;
		this._aim.y = this._baseAnimal.getGraphics().y + this._baseAnimal.getHeight() * co.doubleduck.BaseGame.getScale() / 2;
		this.moveAimRight();
		this.moveAimUp();
	}
	,addBackgrounds: function() {
		this._background2 = co.doubleduck.Utils.getCenteredImage(this.getBackground(2),true);
		this._background2.mouseEnabled = true;
		this._background2.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._background2.regY = 0;
		this._background2.y = co.doubleduck.BaseGame.getScale();
		this._background.addChild(this._background2);
		this._background1 = co.doubleduck.Utils.getCenteredImage(this.getBackground(1),true);
		this._background1.mouseEnabled = true;
		this._background1.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._background1.regY = 0;
		this._background1.y = this._background2.image.height * co.doubleduck.BaseGame.getScale();
		this._background.addChild(this._background1);
	}
	,addSkyColors: function() {
		this._skyColors = new Array();
		var _g = 0, _g1 = co.doubleduck.DataLoader.getAllSkyColors();
		while(_g < _g1.length) {
			var skyColorData = _g1[_g];
			++_g;
			var color = new createjs.Shape();
			color.graphics.beginFill(skyColorData.colorCode);
			color.graphics.rect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
			this._skyColors.push(color);
			this._sky.addChildAt(color,0);
		}
		this._currentColorIndex = 0;
		this._previousTo = 0;
		this._currentColor = co.doubleduck.DataLoader.getAllSkyColors()[this._currentColorIndex];
	}
	,spawnFloatable: function() {
		if(!this._active) return;
		var height = this._topOfScreen;
		var floats = co.doubleduck.DataLoader.getFloatsForHeight(this._height);
		var floatType = co.doubleduck.Utils.getRandomElement(floats);
		var floatData = co.doubleduck.DataLoader.getFloatOfType(floatType);
		if(floatData == null) return;
		if(floatData.type != null) {
			if(floatData.type == "moon") {
				if(this._lastMoonHeight != 0 && this._height < this._lastMoonHeight + co.doubleduck.BaseGame.getViewport().height * 2) return;
				this._lastMoonHeight = this._height;
			}
		}
		var from = new createjs.Point((floatData.startX | 0) / 100 * co.doubleduck.BaseGame.getViewport().width,height);
		if(floatType != null) {
			var $float = new co.doubleduck.Floatable(floatType,from,floatData.duration | 0);
			this._currentFloatables.push($float);
			this._background.addChild($float.getGraphics());
			var to = new createjs.Point((floatData.endX | 0) / 100 * co.doubleduck.BaseGame.getViewport().width,height);
			$float.tweenTo(to);
		}
	}
	,startGame: function() {
		var baseAnimal = co.doubleduck.DataLoader.getCurrentBaseAnimal(co.doubleduck.Persistence.getXp());
		this.enable();
		this.addFirstAnimal(baseAnimal);
		this.spawnFloatable();
	}
	,stopAnimal: function() {
		var _g1 = 0, _g = this._bonusesAndAlerts.getNumChildren();
		while(_g1 < _g) {
			var bonus = _g1++;
			createjs.Tween.removeTweens(this._bonusesAndAlerts.getChildAt(bonus));
		}
		if(this._currentAnimal != null) createjs.Tween.removeTweens(this._currentAnimal.getGraphics());
	}
	,_lastMoonHeight: null
	,_visibleAnimalsIndex: null
	,hedgehogChance: null
	,bonusChance: null
	,beeChance: null
	,onHideMisses: null
	,onHeightUpdate: null
	,onMiss: null
	,onMenu: null
	,onRestart: null
	,_speedFactor: null
	,_accelerationFactor: null
	,_dropper: null
	,_topOfScreen: null
	,_height: null
	,_bonusPoints: null
	,_cakeHit: null
	,_cake: null
	,_aim: null
	,_aimBounces: null
	,_currentAnimal: null
	,_topAnimal: null
	,_baseAnimal: null
	,_bees: null
	,_bonuses: null
	,_animals: null
	,_currentFloatables: null
	,_overlay: null
	,_stage: null
	,_background2: null
	,_background1: null
	,_previousTo: null
	,_currentColorIndex: null
	,_currentColor: null
	,_skyColors: null
	,_bonusesAndAlerts: null
	,_tower: null
	,_background: null
	,_sky: null
	,_graphics: null
	,_justGotStung: null
	,_active: null
	,__class__: co.doubleduck.Level
}
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function() {
	if(co.doubleduck.Menu.newBest == null) co.doubleduck.Menu.newBest = false;
	co.doubleduck.BaseMenu.call(this);
	this._active = true;
	this._forestBack = co.doubleduck.Utils.getCenteredImage("images/general/bg_1.png",true);
	this._forestBack.regY = this._forestBack.image.height;
	this._forestBack.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._forestBack.y = co.doubleduck.BaseGame.getViewport().height;
	this.addChild(this._forestBack);
	this._stage = co.doubleduck.Utils.getCenteredImage("images/general/stage.png",true);
	this._stage.x = this._forestBack.x;
	this._stage.regY = this._stage.image.height;
	this._stage.y = co.doubleduck.BaseGame.getViewport().height;
	this.addChild(this._stage);
	this._background = co.doubleduck.Utils.getCenteredImage("images/menu/menu_bg.png",true);
	this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._background);
	this._firstTime = false;
	var currXp = co.doubleduck.Persistence.getXp();
	if(co.doubleduck.Menu.oldXp == null) {
		this._firstTime = true;
		co.doubleduck.Menu.oldXp = currXp;
	}
	if(this._firstTime) this._title = co.doubleduck.Utils.getCenteredImage("images/menu/h1_menu.png",true); else this._title = co.doubleduck.Utils.getCenteredImage("images/menu/h1_hooray.png",true);
	this._title.x = this._background.x;
	this._title.y = this._background.y - this._background.image.height * 0.48 * co.doubleduck.BaseGame.getScale();
	this.addChild(this._title);
	this._oldUnlock = co.doubleduck.DataLoader.getNextUnlock(co.doubleduck.Menu.oldXp);
	this._nextUnlock = co.doubleduck.DataLoader.getNextUnlock(currXp);
	this._barContainer = new createjs.Container();
	this._barContainer.x = this._background.x - co.doubleduck.BaseGame.getScale() * (this._background.image.width * 0.37);
	this._barContainer.y = this._background.y - co.doubleduck.BaseGame.getScale() * this._background.image.height * 0.24 + co.doubleduck.BaseGame.getScale() * 109 / 2;
	this._barContainer.scaleX = this._barContainer.scaleY = co.doubleduck.BaseGame.getScale();
	this._barBg = co.doubleduck.BaseAssets.getImage("images/menu/level_bar_empty.png");
	this._barContainer.addChild(this._barBg);
	this._barFill = co.doubleduck.BaseAssets.getImage("images/menu/level_bar_fill.png");
	this._barContainer.addChild(this._barFill);
	this._barMask = new createjs.Shape();
	this._barMask.graphics.beginFill("#000000");
	this._barMask.graphics.drawRect(this._barFill.x,this._barFill.y,this._barFill.image.width,this._barFill.image.height);
	this._barMask.graphics.endFill();
	this._barMask.regX = this._barFill.image.width;
	this._barFill.mask = this._barMask;
	this.addChild(this._barContainer);
	this._best = new co.doubleduck.LabeledContainer(co.doubleduck.BaseAssets.getImage("images/general/best.png"));
	this._best.scaleX = this._best.scaleY = co.doubleduck.BaseGame.getScale();
	this._best.x = this._background.x - this._background.image.width * 0.35 * co.doubleduck.BaseGame.getScale();
	this._best.y = this._barContainer.y + this._barBg.image.height * co.doubleduck.BaseGame.getScale();
	this._best.addBitmap();
	this._best.addBitmapLabel("" + co.doubleduck.Persistence.getBest(),"images/general/font_orange/",-1,false);
	this._best.setBitmapLabelX(this._best.image.width * 1.05);
	this._best.setBitmapLabelY(0);
	this._best.shiftLabel(1,1.2);
	this._best.alpha = 0;
	this.addChild(this._best);
	if(co.doubleduck.Menu.newBest) {
		this._newBestNotification = co.doubleduck.Utils.getCenteredImage("images/menu/alert_best.png",true);
		this._newBestNotification.x = co.doubleduck.BaseGame.getViewport().width / 2 + this._background.image.width * co.doubleduck.BaseGame.getScale() / 3;
		this._newBestNotification.y = this._best.y - this._background.image.height * co.doubleduck.BaseGame.getScale() / 3;
		this._newBestNotification.regY = this._newBestNotification.image.height;
		this._newBestNotification.alpha = 0;
		this.addChild(this._newBestNotification);
	}
	this._play = new co.doubleduck.Button(co.doubleduck.Utils.getCenteredImage("images/menu/btn_play.png"));
	this._play.scaleX = this._play.scaleY = co.doubleduck.BaseGame.getScale();
	this._play.regX = this._play.image.width;
	this._play.regY = this._play.image.height;
	this._play.x = this._background.x + co.doubleduck.BaseGame.getScale() * (this._background.image.width * 0.38);
	this._play.y = this._background.y + co.doubleduck.BaseGame.getScale() * (this._background.image.height * 0.42);
	this.addChild(this._play);
	this._helpButton = new co.doubleduck.Button(co.doubleduck.Utils.getCenteredImage("images/menu/btn_help.png"));
	this._helpButton.scaleX = this._helpButton.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpButton.regX = this._helpButton.image.width * 1.8;
	this._helpButton.regY = this._helpButton.image.height;
	this._helpButton.x = this._play.x - this._play.image.width * co.doubleduck.BaseGame.getScale();
	this._helpButton.y = this._play.y;
	this.addChild(this._helpButton);
	this._muteButton = new co.doubleduck.Button(co.doubleduck.Utils.getCenteredImage("images/menu/btn_mute.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
	if(co.doubleduck.SoundManager.available) {
		this._muteButton.scaleX = this._muteButton.scaleY = co.doubleduck.BaseGame.getScale();
		this._muteButton.regX = this._helpButton.image.width * 2.35;
		this._muteButton.regY = this._helpButton.image.height * 0.5;
		this._muteButton.x = this._play.x - this._play.image.width * co.doubleduck.BaseGame.getScale();
		this._muteButton.setToggle(co.doubleduck.SoundManager.isMuted());
		this._muteButton.y = this._play.y;
		this.addChild(this._muteButton);
	}
	this._helpScreen = new co.doubleduck.HelpScreen();
	this._helpScreen.onContinue = $bind(this,this.handleBackFromHelp);
	if(this._unlocks != null) this._unlocks.alpha = 0;
	this._background.alpha = 0;
	this._title.alpha = 0;
	this._play.alpha = 0;
	this._helpButton.alpha = 0;
	this._muteButton.alpha = 0;
	this._barContainer.alpha = 0;
	createjs.Tween.get(this._background).to({ alpha : 1},1000);
	createjs.Tween.get(this._title).to({ alpha : 1},1000);
	createjs.Tween.get(this._play).to({ alpha : 1},1000);
	createjs.Tween.get(this._helpButton).to({ alpha : 1},1000);
	createjs.Tween.get(this._muteButton).to({ alpha : 1},1000);
	createjs.Tween.get(this._best).to({ alpha : 1},1000);
	var tween = createjs.Tween.get(this._barContainer).to({ alpha : 1},1000);
	var oldRatio = 1;
	try {
		var getCurrentUnlock = co.doubleduck.DataLoader.getCurrentUnlock(co.doubleduck.Persistence.getXp());
		oldRatio = (co.doubleduck.Menu.oldXp - getCurrentUnlock.xp) / (this._nextUnlock.xp - getCurrentUnlock.xp);
	} catch( err ) {
		null;
	}
	this.setBar(oldRatio);
	this.setHandlers();
	if(this._firstTime) {
		this._themeMusic = co.doubleduck.SoundManager.playMusic("sound/Menu_music_new");
		this.startXpAnimation();
	} else this.startScoreAnimation().call($bind(this,this.startXpAnimation)).wait(5000).call($bind(this,this.playMenuMusic));
	this._musicPlayed = false;
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.oldXp = null;
co.doubleduck.Menu.newPoints = null;
co.doubleduck.Menu.newBest = null;
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	destroy: function() {
		co.doubleduck.BaseMenu.prototype.destroy.call(this);
		this.removeAllChildren();
		this._background = null;
		this._title = null;
		this._play.onClick = null;
		this._play = null;
		this._helpButton = null;
		this._muteButton = null;
		this._helpScreen = null;
		this._barBg = null;
		this._barFill = null;
		this._barMask = null;
	}
	,handlePlayClick: function() {
	  var self = this;
	  function startPlay() {
  		if(!self._active) return;
  		if(self._themeMusic != null) self._themeMusic.stop();
  		self._active = false;
  		self._play.mouseEnabled = false;
  		self.removeTweensFromAllChildren(self);
  		if(self.onPlayClick != null) {
  			if(self._unlocks != null) {
  				createjs.Tween.removeTweens(self._unlocks);
  				createjs.Tween.get(self._unlocks).to({ alpha : 0},1000);
  			}
  			createjs.Tween.get(self._background).to({ alpha : 0},1000);
  			createjs.Tween.get(self._title).to({ alpha : 0},1000);
  			createjs.Tween.get(self._play).to({ alpha : 0},1000);
  			createjs.Tween.get(self._helpButton).to({ alpha : 0},1000);
  			createjs.Tween.get(self._muteButton).to({ alpha : 0},1000);
  			createjs.Tween.get(self._best).to({ alpha : 0},1000);
  			if(self._oldPointLabel != null) createjs.Tween.get(self._oldPointLabel).to({ alpha : 0},1000);
  			createjs.Tween.get(self._barContainer).to({ alpha : 0},1000).call(self.onPlayClick);
  			if(self._newBestNotification != null) createjs.Tween.get(self._newBestNotification).to({ alpha : 0},1000);
  		}
		}
		
    if (window.InAppOffer) {
      new window.InAppOffer({
        "onRemove": startPlay
      });
    } else {
      startPlay();
    }
	}
	,removeTweensFromAllChildren: function(container) {
		createjs.Tween.removeTweens(container);
		var _g = 0, _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			createjs.Tween.removeTweens(child);
			if(js.Boot.__instanceof(child,createjs.Container)) {
				var containerChild = js.Boot.__cast(child , createjs.Container);
				var _g2 = 0, _g3 = containerChild.children;
				while(_g2 < _g3.length) {
					var grandchild = _g3[_g2];
					++_g2;
					createjs.Tween.removeTweens(grandchild);
				}
			}
		}
	}
	,handleBackFromHelp: function() {
		this._play.mouseEnabled = true;
		this._helpButton.mouseEnabled = true;
		(js.Boot.__cast(this.parent , createjs.Stage)).removeChild(this._helpScreen);
		createjs.Tween.get(this._helpButton).to({ alpha : 1},300);
	}
	,handleHelp: function() {
		this._play.mouseEnabled = false;
		this._helpButton.mouseEnabled = false;
		(js.Boot.__cast(this.parent , createjs.Stage)).addChild(this._helpScreen);
		createjs.Tween.get(this._helpButton).to({ alpha : 0},300);
		this._helpScreen.show();
	}
	,handleMute: function() {
		co.doubleduck.SoundManager.toggleMute();
	}
	,playMenuMusic: function() {
		if(!this._firstTime && !this._musicPlayed && this._oldUnlock == this._nextUnlock) {
			this._themeMusic = co.doubleduck.SoundManager.playMusic("sound/Menu_music_new");
			this._musicPlayed = true;
		}
	}
	,animateBarTo: function(fill) {
		return createjs.Tween.get(this._barMask).to({ x : this._barFill.image.width * fill},750,createjs.Ease.sineInOut).call($bind(this,this.playMenuMusic));
	}
	,setBar: function(fill) {
		this._barMask.x = this._barFill.image.width * fill;
	}
	,applyXp: function() {
		if(this._oldUnlock != this._nextUnlock) {
			co.doubleduck.Menu.oldXp = this._oldUnlock.xp;
			this.animateBarTo(1).call($bind(this,this.switchUnlocks));
		} else {
			var getCurrentUnlock = co.doubleduck.DataLoader.getCurrentUnlock(co.doubleduck.Persistence.getXp());
			if(getCurrentUnlock == null) return;
			var oldRatio = (co.doubleduck.Menu.oldXp - getCurrentUnlock.xp) / (this._nextUnlock.xp - getCurrentUnlock.xp);
			this.setBar(oldRatio);
			var newRatio = (co.doubleduck.Persistence.getXp() - getCurrentUnlock.xp) / (this._nextUnlock.xp - getCurrentUnlock.xp);
			this.animateBarTo(newRatio);
		}
	}
	,switchUnlocks: function() {
		var tween = this.turnUnlockOn(this._oldUnlock);
		this._oldUnlock = this._nextUnlock;
		co.doubleduck.SoundManager.playEffect("sound/new_animal_unlock");
		tween.call($bind(this,this.addUnlock),[this._nextUnlock]).call($bind(this,this.applyXp));
	}
	,turnUnlockOn: function(unlockData) {
		var unlockFileName = "images/menu/unlocks/" + (js.Boot.__cast(unlockData.animals_unlocked[0] , String)).toLowerCase() + "_on.png";
		var oldUnlock = this._unlocks;
		this._unlocks = co.doubleduck.Utils.getCenteredImage(unlockFileName,true);
		this._unlocks.x = this._background.x;
		this._unlocks.y = this.getUnlockY();
		this._unlocks.alpha = 0;
		this._unlocks.scaleX = this._unlocks.scaleY = 1.1 * co.doubleduck.BaseGame.getScale();
		this.addChild(this._unlocks);
		createjs.Tween.removeTweens(oldUnlock);
		createjs.Tween.get(oldUnlock).to({ scaleX : 1.1 * co.doubleduck.BaseGame.getScale(), scaleY : 1.1 * co.doubleduck.BaseGame.getScale()},200,createjs.Ease.sineIn);
		var tween = createjs.Tween.get(this._unlocks).wait(250).to({ alpha : 1},500).call($bind(this,this.removeChild),[oldUnlock]).wait(1000).to({ alpha : 0, scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},500);
		return tween;
	}
	,getUnlockY: function() {
		return this._background.y - co.doubleduck.BaseGame.getScale() * this._background.image.height * 0.23;
	}
	,addUnlock: function(unlockData,flip) {
		if(!this._active) return;
		if(this._unlocks != null) {
			this._unlocks = null;
			this.addUnlock(unlockData,false);
			return;
		}
		if(unlockData == null) {
			var unlockFileName = "images/menu/unlocks/done.png";
			this._unlocks = co.doubleduck.Utils.getCenteredImage(unlockFileName,true);
		} else {
			var unlockFileName = "images/menu/unlocks/" + (js.Boot.__cast(unlockData.animals_unlocked[0] , String)).toLowerCase() + ".png";
			this._unlocks = co.doubleduck.Utils.getCenteredImage(unlockFileName,true);
		}
		this._unlocks.x = this._background.x;
		this._unlocks.y = this.getUnlockY();
		if(flip) this._unlocks.scaleY = 0; else this._unlocks.alpha = 0;
		this.addChild(this._unlocks);
		if(flip) createjs.Tween.get(this._unlocks).to({ scaleY : co.doubleduck.BaseGame.getScale()},120).wait(350); else createjs.Tween.get(this._unlocks).to({ alpha : 1},500);
	}
	,startXpAnimation: function() {
		this.addUnlock(this._oldUnlock,!this._firstTime);
		var tween = createjs.Tween.get(this._barContainer).wait(500);
		if(this._firstTime || this._oldUnlock == this._nextUnlock) this.applyXp(); else {
			if(this._oldUnlock != this._nextUnlock) tween = tween.wait(250);
			tween.call($bind(this,this.applyXp));
		}
		if(this._nextUnlock == null) this.setBar(1);
	}
	,setHandlers: function() {
		this._play.onClick = $bind(this,this.handlePlayClick);
		this._helpButton.onClick = $bind(this,this.handleHelp);
		this._muteButton.onToggle = $bind(this,this.handleMute);
	}
	,startScoreAnimation: function() {
		var _g = this;
		this._oldPointLabel = new co.doubleduck.LabeledContainer(null);
		this._oldPointLabel.scaleX = this._oldPointLabel.scaleY = co.doubleduck.BaseGame.getScale();
		this._oldPointLabel.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._oldPointLabel.y = this._background.y - co.doubleduck.BaseGame.getScale() * this._background.image.height * 0.23;
		this._oldPointLabel.addBitmapLabel("" + co.doubleduck.Menu.newPoints,"images/general/font_red/",0,true);
		var m = co.doubleduck.Utils.getCenteredImage("images/general/font_red/m.png");
		m.x = (this._oldPointLabel.getBitmapLabelWidth() + m.image.width) / 2;
		this._oldPointLabel.addChild(m);
		this._oldPointLabel.x -= co.doubleduck.BaseGame.getScale() * m.image.width / 2;
		this._oldPointLabel.alpha = 0;
		this.addChild(this._oldPointLabel);
		var preFlitDuration = 2500;
		var flitDuration = 120;
		var totalFlipDuration = preFlitDuration + flitDuration;
		var tween = createjs.Tween.get(this._oldPointLabel).to({ alpha : 1},preFlitDuration / 3 | 0).wait(preFlitDuration * 2 / 3 | 0).to({ scaleY : 0},flitDuration,createjs.Ease.sineIn);
		var newTitle = co.doubleduck.Utils.getCenteredImage("images/menu/h1_menu.png",true);
		newTitle.x = this._title.x;
		newTitle.y = this._title.y;
		newTitle.scaleY = 0;
		this.addChild(newTitle);
		createjs.Tween.get(this._title).wait(preFlitDuration).to({ scaleY : 0},flitDuration,createjs.Ease.sineIn).call($bind(this,this.removeChild),[this._title]);
		createjs.Tween.get(newTitle).wait(totalFlipDuration).to({ scaleY : co.doubleduck.BaseGame.getScale()},flitDuration).call(function() {
			_g._title = newTitle;
		});
		if(this._newBestNotification != null) createjs.Tween.get(this._newBestNotification).wait(totalFlipDuration * 0.4 | 0).to({ alpha : 1},totalFlipDuration * 0.1).wait(totalFlipDuration * 0.3 | 0).to({ alpha : 0},totalFlipDuration * 0.1);
		return tween;
	}
	,_active: null
	,_firstTime: null
	,_nextUnlock: null
	,_oldUnlock: null
	,_oldPointLabel: null
	,_barFillPercent: null
	,_barMask: null
	,_barFill: null
	,_barBg: null
	,_barContainer: null
	,_musicPlayed: null
	,_themeMusic: null
	,_newBestNotification: null
	,_best: null
	,_helpScreen: null
	,_muteButton: null
	,_helpButton: null
	,_play: null
	,_title: null
	,_unlocks: null
	,_stage: null
	,_background: null
	,_forestBack: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "SAFARI_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar("xp","0");
	co.doubleduck.BasePersistence.initVar("best","0");
}
co.doubleduck.Persistence.getBest = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("best"));
}
co.doubleduck.Persistence.setBest = function(best) {
	co.doubleduck.BasePersistence.setValue("best","" + best);
}
co.doubleduck.Persistence.getXp = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("xp"));
}
co.doubleduck.Persistence.setXp = function(xp) {
	co.doubleduck.BasePersistence.setValue("xp","" + xp);
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.Popup = $hxClasses["co.doubleduck.Popup"] = function() {
	createjs.Container.call(this);
	this.visible = false;
	this._overlay = new createjs.Shape();
	this._overlay.graphics.beginFill("#FFFFFF");
	this._overlay.graphics.rect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._overlay.alpha = 0.5;
	this.addChild(this._overlay);
	this._title = co.doubleduck.Utils.getCenteredImage("images/session/pause/paused.png",true);
	this._title.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._title.y = co.doubleduck.BaseGame.getViewport().height / 2 - 1.5 * this._title.image.height * co.doubleduck.BaseGame.getScale();
	this.addChild(this._title);
	this._menuButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.MENU),true);
	this._menuButton.regY = this._menuButton.image.height;
	this._menuButton.y = co.doubleduck.BaseGame.getViewport().height / 2 - co.doubleduck.BaseGame.getScale() * this._menuButton.image.height * 0.4;
	this._menuButton.scaleX = this._menuButton.scaleY = co.doubleduck.BaseGame.getScale();
	this.addChild(this._menuButton);
	this._menuButton.mouseEnabled = true;
	this._menuButton.onClick = $bind(this,this.handleMenu);
	this._replayButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.RESTART),true);
	this._replayButton.x = this._title.x + 3 * co.doubleduck.BaseGame.getScale();
	this._menuButton.x = this._replayButton.x - (this._menuButton.image.width + 3) * co.doubleduck.BaseGame.getScale();
	this._replayButton.regY = this._replayButton.image.height;
	this._replayButton.y = this._menuButton.y;
	this._replayButton.scaleX = this._replayButton.scaleY = co.doubleduck.BaseGame.getScale();
	this.addChild(this._replayButton);
	this._replayButton.mouseEnabled = true;
	this._replayButton.onClick = $bind(this,this.handleRestart);
	this._continueButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.RESUME),true);
	this._continueButton.x = this._title.x - co.doubleduck.BaseGame.getScale() * this._continueButton.image.width / 2;
	this._continueButton.regY = 0;
	this._continueButton.y = this._menuButton.y;
	this._continueButton.scaleX = this._continueButton.scaleY = co.doubleduck.BaseGame.getScale();
	this.addChild(this._continueButton);
	this._continueButton.mouseEnabled = true;
	this._continueButton.onClick = $bind(this,this.handleContinue);
	var menuDistance = this._title.x - this._menuButton.x;
	var replayDistance = this._replayButton.x + this._replayButton.image.width * co.doubleduck.BaseGame.getScale() - this._title.x;
	this._menuButton.x -= (replayDistance - menuDistance) / 2;
	this._replayButton.x -= (replayDistance - menuDistance) / 2;
};
co.doubleduck.Popup.__name__ = ["co","doubleduck","Popup"];
co.doubleduck.Popup.__super__ = createjs.Container;
co.doubleduck.Popup.prototype = $extend(createjs.Container.prototype,{
	handleContinue: function() {
		this.onContinue();
	}
	,handleRestart: function() {
		this.onRestart();
	}
	,handleMenu: function() {
		co.doubleduck.Menu.oldXp = null;
		co.doubleduck.Menu.newPoints = null;
		this.onMenu(0,true);
	}
	,_continueButton: null
	,_replayButton: null
	,_menuButton: null
	,_title: null
	,_overlay: null
	,onNext: null
	,onMenu: null
	,onContinue: null
	,onRestart: null
	,__class__: co.doubleduck.Popup
});
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	co.doubleduck.BaseSession.call(this);
	this._allMissesBitmaps = new Array();
	this._misses = 0;
	this._hud = new createjs.Container();
	this.initHud();
	this._level = new co.doubleduck.Level();
	this._level.onRestart = $bind(this,this.handleRestart);
	this._level.onMenu = $bind(this,this.handleMenu);
	this._level.onMiss = $bind(this,this.handleMiss);
	this._level.onHeightUpdate = $bind(this,this.handleHeightUpdate);
	this._level.onHideMisses = $bind(this,this.handleonHideMisses);
	this.addChild(this._level.getGraphics());
	this.addChild(this._level.getTapOverlay());
	this._hud.alpha = 0;
	this.addChild(this._hud);
	createjs.Tween.get(this._hud).to({ alpha : 1},co.doubleduck.Session.FADE_IN);
	this._pauseScreen = new co.doubleduck.Popup();
	this._pauseScreen.onMenu = $bind(this,this.handleMenu);
	this._pauseScreen.onRestart = $bind(this,this.handleRestart);
	this._pauseScreen.onContinue = $bind(this,this.handleUnpause);
	this.addChild(this._pauseScreen);
	this._pauseScreen.visible = false;
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	destroy: function() {
		co.doubleduck.BaseSession.prototype.destroy.call(this);
		this._level.destroy();
	}
	,handleRestart: function() {
		createjs.Ticker.setPaused(false);
		if(this.onRestart != null) this.onRestart();
	}
	,handleMenu: function(points,fromMenu) {
		if(fromMenu == null) fromMenu = false;
		co.doubleduck.Menu.newBest = false;
		if(!fromMenu) {
			if(co.doubleduck.Persistence.getBest() < (points | 0)) {
				co.doubleduck.Persistence.setBest(points | 0);
				co.doubleduck.Menu.newBest = true;
			}
		}
		createjs.Ticker.setPaused(false);
		this._level.stopAnimal();
		createjs.Tween.get(this._pauseScreen).to({ alpha : 0},co.doubleduck.Session.FADE_IN / 2);
		if(!fromMenu) {
			co.doubleduck.Menu.oldXp = co.doubleduck.Persistence.getXp();
			co.doubleduck.Persistence.setXp(co.doubleduck.Persistence.getXp() + (points | 0));
		}
		if(this.onBackToMenu != null) {
			co.doubleduck.Menu.newPoints = points | 0;
			createjs.Tween.get(this._hud).to({ alpha : 0},co.doubleduck.Session.FADE_IN).call(this.onBackToMenu);
		}
		if(this._level._cakeHit) co.doubleduck.SoundManager.playEffect("sound/session_end_with_a_hit"); else co.doubleduck.SoundManager.playEffect("sound/session_end_with_a_miss");
	}
	,getMissImage: function(miss) {
		var fileName = "";
		var reg = 0;
		switch(miss) {
		case 0:
			fileName = "images/session/misses.png";
			break;
		case 1:
			fileName = "images/session/miss_1.png";
			reg = 25;
			break;
		case 2:
			fileName = "images/session/miss_2.png";
			reg = 65;
			break;
		case 3:
			fileName = "images/session/miss_3.png";
			reg = 110;
			break;
		}
		this._currMissesBitmap = co.doubleduck.BaseAssets.getImage(fileName);
		this._currMissesBitmap.regX = reg;
		this._currMissesBitmap.scaleX = this._currMissesBitmap.scaleY = co.doubleduck.BaseGame.getScale();
		this._currMissesBitmap.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getViewport().width / 25 + (this._currMissesBitmap.regX - this._currMissesBitmap.image.width) * co.doubleduck.BaseGame.getScale();
		this._currMissesBitmap.y = co.doubleduck.BaseGame.getViewport().height - this._currMissesBitmap.image.height * co.doubleduck.BaseGame.getScale() - co.doubleduck.BaseGame.getViewport().width / 25;
		this._allMissesBitmaps.push(this._currMissesBitmap);
		if(miss > 0) {
			this._currMissesBitmap.scaleX = this._currMissesBitmap.scaleY = co.doubleduck.BaseGame.getScale() * 0.9;
			this._currMissesBitmap.alpha = 0;
			createjs.Tween.get(this._currMissesBitmap).to({ scaleX : co.doubleduck.BaseGame.getScale() * 1.1, scaleY : co.doubleduck.BaseGame.getScale() * 1.1, alpha : 1},120,createjs.Ease.sineInOut).to({ scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},120,createjs.Ease.sineInOut);
		}
		return this._currMissesBitmap;
	}
	,setBestContainer: function(best) {
		if(this._best != null) this._hud.removeChild(this._best);
		this._best = new co.doubleduck.LabeledContainer(co.doubleduck.BaseAssets.getImage("images/general/best.png"));
		this._best.scaleX = this._best.scaleY = co.doubleduck.BaseGame.getScale();
		this._best.x = co.doubleduck.BaseGame.getViewport().width / 25;
		this._best.y = co.doubleduck.BaseGame.getViewport().height - this._best.image.height * co.doubleduck.BaseGame.getScale() - co.doubleduck.BaseGame.getViewport().width / 25;
		this._best.addBitmap();
		this._best.addBitmapLabel("" + best,"images/general/font_orange/",-1,false);
		this._best.setBitmapLabelX(this._best.image.width * 1.05);
		this._best.setBitmapLabelY(0);
		this._hud.addChild(this._best);
	}
	,setHeightContainer: function(height) {
		if(this._height != null) this._hud.removeChild(this._height);
		this._height = new co.doubleduck.LabeledContainer(null);
		this._height.scaleX = this._height.scaleY = co.doubleduck.BaseGame.getScale();
		this._height.x = co.doubleduck.BaseGame.getViewport().width / 25;
		this._height.y = this._best.y - 56 * co.doubleduck.BaseGame.getScale();
		this._height.addBitmapLabel("" + height,"images/general/font_red/",0,false);
		var m = co.doubleduck.BaseAssets.getImage("images/general/font_red/m.png");
		m.x = this._height.getBitmapLabelWidth();
		this._height.addChild(m);
		this._hud.addChild(this._height);
	}
	,handlePause: function() {
		this._pauseScreen.visible = true;
		this._pauseButton.visible = false;
		createjs.Tween.get(this._pauseButton).wait(50).call(createjs.Ticker.setPaused,[true]);
	}
	,initHud: function() {
		this._currMissesBitmap = this.getMissImage(0);
		this._hud.addChild(this._currMissesBitmap);
		var pauseBmp = co.doubleduck.BaseAssets.getImage("images/session/btn_pause.png");
		this._pauseButton = new co.doubleduck.Button(pauseBmp,false);
		this._pauseButton.scaleX = this._pauseButton.scaleY = co.doubleduck.BaseGame.getScale();
		this._pauseButton.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getViewport().width / 25;
		this._pauseButton.y = co.doubleduck.BaseGame.getViewport().width / 25;
		this._pauseButton.regX = pauseBmp.image.width;
		this._pauseButton.onClick = $bind(this,this.handlePause);
		this._hud.addChild(this._pauseButton);
		this.setBestContainer(co.doubleduck.Persistence.getBest());
		this.setHeightContainer(0);
	}
	,handleMiss: function() {
		this._misses++;
		this.getMissImage(this._misses);
		this._hud.addChild(this._currMissesBitmap);
		if(this._misses >= co.doubleduck.Session.MAX_MISSES) return true; else return false;
	}
	,handleUnpause: function() {
		this._pauseScreen.visible = false;
		this._pauseButton.visible = true;
		createjs.Ticker.setPaused(false);
	}
	,handleHeightUpdate: function(height) {
		this.setHeightContainer(Math.round(height));
	}
	,handleonHideMisses: function() {
		var _g = 0, _g1 = this._allMissesBitmaps;
		while(_g < _g1.length) {
			var bmp = _g1[_g];
			++_g;
			createjs.Tween.get(bmp).to({ alpha : 0},500);
		}
	}
	,_pauseButton: null
	,_pauseScreen: null
	,_height: null
	,_best: null
	,_currMissesBitmap: null
	,_allMissesBitmaps: null
	,_misses: null
	,_hud: null
	,_level: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	co.doubleduck.BasePersistence.initVar("mute");
	return false;
}
co.doubleduck.SoundManager.mute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	try {
		var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
		while(_g1 < _g) {
			var currSound = _g1++;
			var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
			if(mySound != null) mySound.setVolume(1);
		}
	} catch( e ) {
		null;
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.dateDeltaInDays = function(day1,day2) {
	var delta = Math.abs(day2.getTime() - day1.getTime());
	return delta / 86400000;
}
co.doubleduck.Utils.getTodayDate = function() {
	var newDate = new Date();
	return HxOverrides.dateStr(newDate);
}
co.doubleduck.Utils.getHour = function() {
	var newDate = new Date();
	return newDate.getHours();
}
co.doubleduck.Utils.rectOverlap = function(r1,r2) {
	var r1TopLeft = new createjs.Point(r1.x,r1.y);
	var r1BottomRight = new createjs.Point(r1.x + r1.width,r1.y + r1.height);
	var r1TopRight = new createjs.Point(r1.x + r1.width,r1.y);
	var r1BottomLeft = new createjs.Point(r1.x,r1.y + r1.height);
	var r2TopLeft = new createjs.Point(r2.x,r2.y);
	var r2BottomRight = new createjs.Point(r2.x + r2.width,r2.y + r2.height);
	var r2TopRight = new createjs.Point(r2.x + r2.width,r2.y);
	var r2BottomLeft = new createjs.Point(r2.x,r2.y + r2.height);
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.overlap = function(obj1,obj1Width,obj1Height,obj2,obj2Width,obj2Height) {
	var o1TopLeft = new createjs.Point(obj1.x - obj1.regX * co.doubleduck.BaseGame.getScale(),obj1.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomRight = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale() + obj1Width * co.doubleduck.BaseGame.getScale(),o1TopLeft.y + obj1Height * co.doubleduck.BaseGame.getScale() - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1TopRight = new createjs.Point(o1BottomRight.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1TopLeft.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomLeft = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1BottomRight.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o2TopLeft = new createjs.Point(obj2.x - obj2.regX * co.doubleduck.BaseGame.getScale(),obj2.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomRight = new createjs.Point(o2TopLeft.x + obj2Width * co.doubleduck.BaseGame.getScale() - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y + obj2Height * co.doubleduck.BaseGame.getScale() - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2TopRight = new createjs.Point(o2BottomRight.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomLeft = new createjs.Point(o2TopLeft.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2BottomRight.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.rectContainPoint = function(rectTopLeft,rectBottomRight,point) {
	return point.x >= rectTopLeft.x && point.x <= rectBottomRight.x && point.y >= rectTopLeft.y && point.y <= rectBottomRight.y;
}
co.doubleduck.Utils.objectContains = function(dyn,memberName) {
	return Reflect.hasField(dyn,memberName);
}
co.doubleduck.Utils.contains = function(arr,obj) {
	var _g = 0;
	while(_g < arr.length) {
		var element = arr[_g];
		++_g;
		if(element == obj) return true;
	}
	return false;
}
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.Cake.CAKE = "images/session/cake.png";
co.doubleduck.Cake.CAKE_BIG = "images/session/cake_big.png";
co.doubleduck.Cake.CAKE_REST = "images/session/cake_rest.png";
co.doubleduck.Dropper.PREFIX = "images/session/animals/";
co.doubleduck.Dropper.DROPLET_SIZE = 115;
co.doubleduck.Dropper.DROPLET_COUNT = 7;
co.doubleduck.Dropper.DROP_TIME = 1800;
co.doubleduck.Level.PIXELS_PER_METER = 5;
co.doubleduck.Level.STAGE_HEIGHT = 193;
co.doubleduck.Level.PIXELS_FOR_ACCURACY = 5;
co.doubleduck.Level.MINIMUM_DISTANCE = 120;
co.doubleduck.Popup.MENU = "images/session/pause/btn_menu.png";
co.doubleduck.Popup.RESTART = "images/session/pause/btn_restart.png";
co.doubleduck.Popup.RESUME = "images/session/pause/btn_resume.png";
co.doubleduck.Session.MAX_MISSES = 3;
co.doubleduck.Session.FADE_IN = 750;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
