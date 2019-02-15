var strict = (function(){return !this;}());
console.log('----------------------------------------');
console.log(strict ? 'strict model' : 'Non-strict model');
console.log('----------------------------------------');

/**
 * 声明全局变量Set
 * 如果想让代码在一个私有命名空间中运行，可以将代码放在(function namespace(){ 代码 }())格式里；
 * namespace 经常用来强调这个函数被用做命名空间
 * 下面重写Set，注意v2s方法不在是类的方法，而是放在私有命名空间中；
 */
var Set = (function namespace(){
	
	// 这个构造函数是局部变量
	function Set() {
		this.values = {};                 
		this.n = 0;                       
		this.add.apply(this, arguments);  
		
	}

	Set.prototype.add = function() {
		for(var i=0; i<arguments.length; i++){
			var val = arguments[i];
			var str = v2s(val);
			if(!this.values.hasOwnProperty(str)){
				this.values[str] = val;
				this.n++;
			}
		}
		return this;
	};

	Set.prototype.remove = function() {
		for(var i=0; i<arguments.length;i++){
			var str = v2s(arguments[i]);
			if(this.values.hasOwnProperty(str)){
				delete this.values[str];
				this.n--;
			}
		}
		return this;
	};

	Set.prototype.contains = function(value) {
		return this.values.hasOwnProperty(v2s(value));
	};

	Set.prototype.size = function() {
		return this.n;
	};

	Set.prototype.foreach = function(f, context) {
		for(var s in this.values){
			if(this.values.hasOwnProperty(s))
				f.call(context, this.values[s]);
		}
	};

	// 这里是上面方法用到的一些辅助函数和变量
	// 他们不属于模块的共有API，但它们都隐藏在这个函数的作用域内
	// 因此我们不必将它们定义为Set的属性或使用下划线作为其前缀
	function v2s = function(val) {
		switch(val){
			case undefined: return 'u';
			case null:      return 'n';
			case true:      return 't';
			case false:     return 'f';
			default: switch (typeof val) {
						 case 'number': return '#'+val;
						 case 'string': return '"'+val;
						 default:       return '@'+objectId(val);
					 }
		}
	};
	
	function objectId(o) {
		var prop = "|**objectid**|";
		if(!o.hasownProperty(prop))
			o[prop] = next++;
		return o[prop];
	}

	var next = 100;
	
	// 这个模块的共有API是Set()构造函数
	// 我们需要把这个函数从私有命名空间中导出来
	// 以便在外部也可以使用它，在这种情况下，我们通过返回这个构造函数来导出它
	// 它变成第一行代码所指的表达式的值
	return Set;
}());

// 导出命名空间对象
var collections;
if(!collections) collections = {};

collections.sets = (function namespace() {
	// 在这里定义多种集合类，使用局部变量和函数
	// ......这里省略很多代码......
	
	// 通过返回命名空间对象将API导出
	return {
		// 导出的属性名：局部变量名字
		AbstractSet: AbstractSet,
		NotSet: NotSet,
		// ....
		ArraySet: ArraySet
	}
}());

