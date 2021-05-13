var bridge = {
  default:this,// for typescript
  call: function (method, args, cb) {
      var ret = '';
      if (typeof args == 'function') {
          cb = args;
          args = {};
      }
      var arg={data:args===undefined?null:args}
      if (typeof cb == 'function') {
          var cbName = 'dscb' + window.dscb++;
          window[cbName] = cb;
          arg['_dscbstub'] = cbName;
      }
      arg = JSON.stringify(arg)

      //if in webview that dsBridge provided, call!
      if(window._dsbridge){
         ret=  _dsbridge.call(method, arg)
      }else if(window._dswk||navigator.userAgent.indexOf("_dsbridge")!=-1){
         ret = prompt("_dsbridge=" + method, arg);
      }

     return  JSON.parse(ret||'{}').data
  },
  register: function (name, fun, asyn) {
      var q = asyn ? window._dsaf : window._dsf
      if (!window._dsInit) {
          window._dsInit = true;
          //notify native that js apis register successfully on next event loop
          setTimeout(function () {
              bridge.call("_dsb.dsinit");
          }, 0)
      }
      if (typeof fun == "object") {
          q._obs[name] = fun;
      } else {
          q[name] = fun
      }
  },
  registerAsyn: function (name, fun) {
      this.register(name, fun, true);
  },
  hasNativeMethod: function (name, type) {
      return this.call("_dsb.hasNativeMethod", {name: name, type:type||"all"});
  },
  disableJavascriptDialogBlock: function (disable) {
      this.call("_dsb.disableJavascriptDialogBlock", {
          disable: disable !== false
      })
  }
};

!function () {
  if (window._dsf) return;
  var ob = {
      _dsf: {
          _obs: {}
      },
      _dsaf: {
          _obs: {}
      },
      dscb: 0,
      dsBridge: bridge,
      close: function () {
          bridge.call("_dsb.closePage")
      },
      _handleMessageFromNative: function (info) {
          var arg = JSON.parse(info.data);
          var ret = {
              id: info.callbackId,
              complete: true
          }
          var f = this._dsf[info.method];
          var af = this._dsaf[info.method]
          var callSyn = function (f, ob) {
              ret.data = f.apply(ob, arg)
              bridge.call("_dsb.returnValue", ret)
          }
          var callAsyn = function (f, ob) {
              arg.push(function (data, complete) {
                  ret.data = data;
                  ret.complete = complete!==false;
                  bridge.call("_dsb.returnValue", ret)
              })
              f.apply(ob, arg)
          }
          if (f) {
              callSyn(f, this._dsf);
          } else if (af) {
              callAsyn(af, this._dsaf);
          } else {
              //with namespace
              var name = info.method.split('.');
              if (name.length<2) return;
              var method=name.pop();
              var namespace=name.join('.')
              var obs = this._dsf._obs;
              var ob = obs[namespace] || {};
              var m = ob[method];
              if (m && typeof m == "function") {
                  callSyn(m, ob);
                  return;
              }
              obs = this._dsaf._obs;
              ob = obs[namespace] || {};
              m = ob[method];
              if (m && typeof m == "function") {
                  callAsyn(m, ob);
                  return;
              }
          }
      }
  }
  for (var attr in ob) {
      window[attr] = ob[attr]
  }
  bridge.register("_hasJavascriptMethod", function (method, tag) {
       var name = method.split('.')
       if(name.length<2) {
         return !!(_dsf[name]||_dsaf[name])
       }else{
         // with namespace
         var method=name.pop()
         var namespace=name.join('.')
         var ob=_dsf._obs[namespace]||_dsaf._obs[namespace]
         return ob&&!!ob[method]
       }
  })
}();

module.exports = bridge;




// -------------------------------------------------------------------------------------------




var bridge = {
  default:
      this,

      // js调用Native方法
      call: function(functionName, args, callback) {
          // 如果是无参数的方法  function(functionName,callback)
          "function" == typeof args && (callback = args, args = {});

          //参数对象 {data: args/null}
          args = { data: void 0 === args ? null : args};

          // 如果是异步并且要接收返回值的
          if ("function" == typeof callback) {
              // callback标识,计数器
              var tag = "dscb" + window.dscb++;
              // 保存回调   window[dscbX] = callback Function
              window = callback;
              // args = {data: args/null,_dscbstud:tag}
              args._dscbstub = tag
          }
          // 将参数转成Json字符串
          args = JSON.stringify(args);

          var ret = "";
          // 这里不会走到,目前从源里没有看到有什么地方注入了_dsbridge
          if (window._dsbridge) {
              ret = _dsbridge.call(functionName, args);
          }

          // 客户端会走到这里, webView初始化的时候会给window注入_dswk=true
          // Android低版本 add dsbridge tag in lower android version,settings.setUserAgentString(settings.getUserAgentString() + " _dsbridge");
          else if (window._dswk || -1 != navigator.userAgent.indexOf("_dsbridge")) {
              ret = prompt("_dsbridge=" + functionName, args);
          }
          return JSON.parse(ret || "{}").data
      },

      // js注册供Native调用的方法,如果传入callback,则为异步方法
      register: function(jsFunctionName, receiveParamsFunction, callback) {

          // 判断是同步还是异步  callback = { _obs:{} };
          callback = callback ? window._dsaf : window._dsf;

          //只执行一次,为了调用一次native的dsinit方法
          window._dsInit || (window._dsInit = !0, setTimeout(function() {
              bridge.call("_dsb.dsinit")
          }, 0));

          //将call保存在对应的数据结构中, callback = { jsFunctionName : receiveParamsFunction: , _obs:{} };
          "object" == typeof receiveParamsFunction ? callback._obs[jsFunctionName] = receiveParamsFunction : callback[jsFunctionName] = receiveParamsFunction
      },

      // js注册供Native调用的异步方法
      registerAsyn: function(b, a) {
          this.register(b, a, !0)
      },

      // 是否有Native方法
      hasNativeMethod: function(b, a) {
          return this.call("_dsb.hasNativeMethod", {
              name: b,
              type: a || "all"
          })
      },

      // 禁用Dialog
      disableJavascriptDialogBlock: function(b) {
          this.call("_dsb.disableJavascriptDialogBlock", {
              disable: !1 !== b
          })
      }
  };


  // https://www.cnblogs.com/binbin001/p/11393040.html
  // 立即执行一段代码 ,函数表达示后面跟 `()` 可以立即执行
  // function(){}()
  (function(){

      // js对象动态添加属性
      // obj[property] = xxx. not obj.property = xxx

      // 1. 如果Window已经添加了 `_dsf` 属性直接返回
      if(window._dsf) return;

      // 2. Window添加一个 `_dsf` 对象属性, 保存同步方法
      window["_dsf"] = { _obs:{} };
      // 3. Window添加一个 `_dsaf` 对象属性, 保存异步方法
      window["_dsaf"] = { _obs:{} };
      // 4. Window添加一个callback计数唯一标识
      window["dscb"] = 0;
      // 5. Window添加一个 bridge属性
      window["dsBridge"] =  bridge;
       //6. Window添加一个界面关闭方法
      window["close"] = function(){
          bridge.call("_dsb.closePage");
      };
      // 7. Window添加统一处理Native方法的函数
      //a = { "callbackId":id, "method":name, "data":[x,y,z,..]}
      window["_handleMessageFromNative"] = function(a){
          // 调用方法的参数数组
          var e = JSON.parse(a.data),

          // 临时对象
          b = {
              id: a.callbackId,
              complete: !0
          },
          // 同步方法
          c = this._dsf[a.method],
          // 异步方法
          d = this._dsaf[a.method],


          h = function (a, c){
             b.data = a.apply(c, e);
             bridge.call("_dsb.returnValue", b);
          },

          k = function (a, c){
              e.push(function (a, c){
                  b.data = a;
                  b.complete = !1 !== c;
                  bridge.call("_dsb.returnValue", b)
              });
              a.apply(c, e);
          };

          if(c) h(c, this._dsf);
          else if(d) k(d, this._dsaf);
          else if(c = a.method.split("."), !(2 > c.length)){
              a = c.pop();
              var c = c.join("."),
                  d = this._dsf._obs,
                  d = d[c] ||
                  {},
                  f = d[a];
              f && "function" == typeof f ? h(f, d) : (d = this._dsaf._obs, d = d[c] ||
              {}, (f = d[a]) && "function" == typeof f && k(f, d))
          }
      };

      bridge.register("_hasJavascriptMethod", function(a, b) {
          b = a.split(".");
          if (2 > b.length) return !(!_dsf[b] && !_dsaf[b]);
          a = b.pop();
          b = b.join(".");
          return (b = _dsf._obs[b] || _dsaf._obs[b]) && !! b[a]
      });

  })();