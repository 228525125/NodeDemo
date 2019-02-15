/**
 * 返回函数的名字，不是函数的话返回null
 * @returns
 */
Function.prototype.getName = function() {
    if("name" in this) return this.name;
    return this.name = this.toString().match(/ function\s*([^(]*)\(/)[1];
};

/**
 * 创建一个子类
 * @param constructor 子类的构造函数
 * @param methods 实例方法，复制到原型中
 * @param statics 类属性，复制到构造函数中
 * @returns
 */
Function.prototype.extend = function(constructor, methods, statics) {
	return defineSubclass(this, constructor, methods, statics);
};

/**
* 以字符串形式返回o的类型
*/
function type(o) {
    var t,c,n;

    //处理null值的情况
    if(o === null) return 'null';
    
    //处理NaN的情况
    if(o !== o) return 'nan';

    //如果typeof的值不是“object”，则返回这个值
    //这可以识别出原始值的类型和函数
    if((t = typeof o) !== "object") return t;    
    
    //返回对象的类名，除非为“Object”
    //这可以识别出大多数内置对象
    if((c = classof(o)) !== "Object") return c;

    //如果对象构造函数的名字存在的话，则返回它
    if(o.constructor && typeof o.constructor === 'function' && (n = o.constructor.getName())) return n;
    
    //其他的类型都无法判别
    return "Object";
}

/**
 * 返回对象的类型
 */
function classof(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
};

/**
 * 使用原型创建对象 
 * @param p 原型对象
 * @returns
 */
function inherit(p) {
    if(p == null) throw TypeError();        //p不能是null
    if(Object.create)                               //如果Object.create存在
        return Object.create(p);
    var t = typeof p;
    if(t !== "object" && t !== "function") throw TypeError();
    function f(){};                                   //定义一个空的构造函数
    f.prototype = p;                              //将其原型属性设置为p
    return new f();                                //使用发f()创建p的继承对象
}

/**
 * 把p中的可枚举属性复制到o中，并返回o；
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
 * @param o
 * @param p
 * @returns o
 */
function extend(o, p) {
	for(prop in p){
		o[prop] = p[prop];
	}
	return o;
}

/**
 * 将p中的可枚举属性复制到o中，并返回o
 * 如果o和p中有同名的属性，o中的属性将不受影响
 * 这个函数并不处理getter和setter以及复制属性
 * @param o
 * @param p
 * @returns o
 */
function merge(o, p) {
	for(prop in p){
		if(o.hasOwnProperty[prop]) continue;
		o[prop] = p[prop];
	}
	return o;
}

/**
 * 创建子类
 * 这种方式与借用方法不同，它是动态地从父类继承方法，当父类的原型添加新方法时，
 * 子类也会立即拥有这个方法
 * @param superclass 父类的构造函数
 * @param constructor 新的子类的构造函数
 * @param methods 实例方法：复制到原型中
 * @param statics 类属性：复制到构造函数中
 */
function defineSubclass(superclass,constructor,methods,statics) {
	
	//建立子类的原型对象
	constructor.prototype = inherit(superclass.prototype);
	constructor.prototype.constructor = constructor;
	
	//像对常规类一样复制方法和类属性
	if(methods) extend(constructor.prototype, methods);
	if(statics) extend(constructor, statics);
	
	//返回这个类
	return constructor;
}

/**
 * Set是一种数据结构，用以表示非重复值的无序集合
 */
function Set() {
	this.values = {};                 //集合数据保存在对象的属性里
	this.n = 0;                       //集合中值的个数
	this.add.apply(this, arguments);  //把所有参数都添加进这个集合
	
}

// 将每个参数都添加至集合中
Set.prototype.add = function() {
	for(var i=0; i<arguments.length; i++){     //遍历每个参数
		var val = arguments[i];                //待添加到集合中的值
		var str = Set._v2s(val);               //把它转换为字符串
		if(!this.values.hasOwnProperty(str)){  //如果不在集合中
			this.values[str] = val;            //将字符串和值对应起来
			this.n++;                          //集合中值的计数加一
		}
	}
	return this;
};

// 从集合删除元素，这些元素由参数指定
Set.prototype.remove = function() {
	for(var i=0; i<arguments.length;i++){
		var str = Set._v2s(arguments[i]);       
		if(this.values.hasOwnProperty(str)){   //如果它在集合中
			delete this.values[str];           //删除它
			this.n--;                          //计数器减一
		}
	}
	return this;
};

// 如果集合包含这个值，则返回true，否则，返回false
Set.prototype.contains = function(value) {
	return this.values.hasOwnProperty(Set._v2s(value));
};

// 返回集合大小
Set.prototype.size = function() {
	return this.n;
};

// 遍历集合中的所有元素，在指定的上下文中调用f
Set.prototype.foreach = function(f, context) {
	for(var s in this.values){                    //遍历集合中的所有字符串
		if(this.values.hasOwnProperty(s))         //忽略继承的属性
			f.call(context, this.values[s]);      //调用f，传入value
	}
};

Set._v2s = function(val) {
	switch(val){
		case undefined: return 'u';                               //特殊的原始值
		case null:      return 'n';                               //值只有一个字母
		case true:      return 't';
		case false:     return 'f';
		default: switch (typeof val) {
					 case 'number': return '#'+val;               //数字都带有#前缀
					 case 'string': return '"'+val;               //字符串都带有"前缀
					 default:       return '@'+objectId(val);     //对象 和 函数 都带有@前缀
				 }
	}
	
	function objectId(o) {
		var prop = "|**objectid**|";            //私有的属性，用以存放id
		if(!o.hasownProperty(prop))             //如果对象没有id
			o[prop] = Set._v2s.next++;          //将下一个值赋给
		return o[prop];                         //返回这个id
	}
};

Set._v2s.next = 100;           //设置初始id的值；


