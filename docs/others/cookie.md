## cookie
定义:
Cookie是一个保存在浏览器中的简单的文本文件，该文件与特定的Web文档关联在一起，保存了该浏览器访问这个Web文档时的信息，当浏览器再次访问这个Web文档时这些信息可供该文档使用。（HTTP是无状态的协议，即HTTP协议本身不对请求和响应之间的通信状态进行保存，为了实现期望的保存状态功能，引入了cookie技术）

组成:

NAME=VALUE
Cookie的名称和值，其中NAME是唯一标识cookie的名称，不区分大小写；VALUE是存储在Cookie里的字符串值，该值必须经过URL编码。

Domain=域名
Cookie有效的域，发送到这个域的所有请求都会包含对应的Cookie。（若不指定则默认为创建Cookie的服务器的域名）

Path=PATH
请求URL中包含这个路径才会把Cookie发送到服务器（若不指定则默认为文档所在的文件目录）

Expires=DATE
Cookie的有效期，默认情况下，浏览器会话结束后会删除所有cookie。

Secure
设置后仅在HTTPS安全通信时才会发送Cookie

HttpOnly
设置后只能在服务器上读取，不能再通过JavaScript读取Cookie

特点:
每个Cookie不超过4096字节；
每个域中Cookie个数有限制，就拿最新版来说：IE和Edge不超过50个；Firefox不超过150个；Opera不超过180个；Safari和Chrome没有限制；
Cookie超过单个域的上限，浏览器会删除之前设置的Cookie；
创建的Cookie超过最大限制，该Cookie会被静默删除；
可设置失效时间，没有设置则会话结束会删除Cookie；
每个请求均会携带Cookie，若Cookie过来会带来性能问题；
受同源策略限制

操作:
```
class CookieUtil {
    // 获取Cookie中的对应属性
    static get(name) {
        const cookies = document.cookie;
        const cookiesArr = cookies.split(';');
        for (let index = 0; index < cookiesArr.length; index++) {
            const presentCookieArr = cookiesArr[index].split('=');
            if (presentCookieArr[0] === name) {
                return presentCookieArr[1];
            }
        }

        return null;
    }

    // 设置对应的Cookie值
    static set(name, value, expires, path, domain, secure) {
        let cookieText = `${name}=${value}`;
        if (expires instanceof Date) {
            cookieText += `; expire=${expires.toGMTString()}`;
        }
        if (path) {
            cookieText += `; path=${path}`;
        }
        if (domain) {
            cookieText += `; domain=${domain}`;
        }
        if (secure) {
            cookieText += `; secure`;
        }
        document.cookie = cookieText;
    }

    // 删除对应的Cookie
    static deleteCookie(name) {
        CookieUtil.set(name, '', new Date(0));
    }
}
```


## web Storage

sessionStorage
特点:
sessionStorage对象值存储会话数据，其生命周期会存储到浏览器关闭。（在该过程中刷新页面其数据不受影响）
浏览器在实现存储写入时使用同步阻塞方式，数据会被立即提交到存储。
独立打开同一个窗口同一个页面或一个Tab，sessionStorage也是不一样的。
存储空间大小限制为每个源不超过5M。

 localStorage
生命周期是永久的，除非被清除，否则永久保存。
存储空间大小限制为每个源不超过5M。
受同源策略限制。
浏览器存储时采用同步存储方式。

localStorage.setItem(k, v)
localStorage.getItem(k)
localStorage.removeItem(k)
localStorage.clear()
localStorage.key(index)

## indexedDB


一个域名下可以包含多个数据库；
一个数据库中包含多个对象仓库，就类似于Mysql一个库中有多张表一样。
每个对象仓库中包含多条数据记录。

特点:
IndexedDB是浏览器中存储结构化数据的一个方案，其设计几乎是完全异步的

键值对存储
在对象仓库中，数据以“键值对”形式保存，每个数据记录都有独一无二的主键。

异步
IndexedDB操作时不会锁死浏览器，用户依然可以进行其它操作。

支持事务
一些列操作步骤之中只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。

受同源策略限制
只能访问自身域名下的数据库，不能跨域访问数据库。

存储空间大
每个源都有存储空间的限制，而且这个限制跟浏览器有关，例如Firefox限制每个源50MB，Chrome为5MB。

支持二进制存储
不仅可以存储字符串，还可以存储二进制数据（ArrayBuffer和Blob）

操作:

```
class IndexedDBOperation {
  constructor(databaseName, version) {
      this.atabaseName = databaseName;
      this.version = version;
      this.request = null;
      this.db = null;
  }

  // 数据库初始化操作
  init() {
      this.request = window.indexedDB.open(this.databaseName, this.version);
      return new Promise((resolve, reject) => {
          this.request.onsuccess = event => {
              this.db = event.target.result;
              console.log('数据库打开成功');
              resolve('success');
          };
          this.request.onerror = event => {
              console.log('数据库打开报错');
              reject('error');
          };
          this.request.onupgradeneeded = event =>{
              this.db = event.target.result;
              console.log('数据库升级');
              resolve('upgradeneeded');
          };
      });
  }
}


class IndexedDBOperation {
  // ……
  // 创建数据仓库
  createObjectStore(objectStoreName, options) {
      let objectStore = null;
      if (!this.db.objectStoreNames.contains(objectStoreName)) {
          objectStore = this.db.createObjectStore(objectStoreName, options);
      }
      return objectStore;
  }
}


// 数据操作

class IndexedDBOperation {
  // ……
  // 新增内容
  add(objectStore, content) {
      objectStore.add(content);
  }

  // 获取内容
  get(objectStore, id) {
      const request = objectStore.get(id);
      return new Promise((resolve, reject) => {
          request.onsuccess = resolve;
          request.onerror = reject;
      });
  }

  // 更新内容
  update(objectStore, content) {
      const request = objectStore.put(content);
      request.onsuccess = event => {
          console.log('更新成功');
      };
      request.onerror = event => {
          console.log('更新失败');
      };
  }

  // 删除内容
  remove(objectStore, deleteId) {
      const request = objectStore.delete(deleteId);
      request.onsuccess = event => {
          console.log('删除成功');
      };
      request.onerror = event => {
          console.log('删除失败');
      };
  }
}


// 遍历内容
class IndexedDBOperation {
  // ……
  // 打印全部数据
  printAllDataByCursor(objectStore) {
      const cursorRequest = objectStore.openCursor();
      cursorRequest.onsuccess = event => {
          const cursor = event.target.result;
          if (cursor) {
              console.log(`利用游标打印的内容，id为${cursor.key}, 值为${cursor.value}`);
              // 移动到下一条记录
              cursor.continue();
          }
      };
  }
}


// 调用

const indexedDBOperation = new IndexedDBOperation('dbName1', 1);
indexedDBOperation
.init()
.then(type => {
    const objectStoreName = 'testObjectStore';
    if (type === 'upgradeneeded') {
        indexedDBOperation.createObjectStore(objectStoreName, {
            keyPath: 'id'
        });
    }
    const transaction = indexedDBOperation.db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    indexedDBOperation
    .get(objectStore, 1)
    .then(event => {
        if (event.target.result) {
            indexedDBOperation.update(objectStore, {
                id: 1,
                name: '执鸢者+纸鸢'
            });
            console.log('数据库中已经存在', event.target.result, '，则进行更新操作');
        }
        else {
            indexedDBOperation.add(objectStore, {
                id: 1,
                name: '执鸢者'
            });
            console.log('数据库中不存在，则进行添加');
        }
    })
    .catch(console.log);

    indexedDBOperation.printAllDataByCursor(objectStore);

    transaction.onsuccess = event => {
        console.log('事务操作成功');
    };
    transaction.onerror = event => {
        console.log('事务操作失败');
    };
    transaction.oncomplete = event => {
        console.log('整个事务成功完成');
    }
})
.catch(console.log);

```



```
一般来说，安全起见，cookie 都是依靠 set-cookie 头设置，且不允许 JavaScript 设置。
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

// Multiple attributes are also possible, for example:
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly

其中 <cookie-name>=<cookie-value> 这样的 kv 对，内容随你定，另外还有 HttpOnly、SameSite 等配置，一条 Set-Cookie 只配置一项 cookie



Expires 设置 cookie 的过期时间（时间戳），这个时间是客户端时间。
Max-Age 设置 cookie 的保留时长（秒数），同时存在 Expires 和 Max-Age 的话，Max-Age 优先
Domain 设置生效的域名，默认就是当前域名，不包含子域名
Path 设置生效路径，/ 全匹配
Secure 设置 cookie 只在 https 下发送，防止中间人攻击
HttpOnly 设置禁止 JavaScript 访问 cookie，防止XSS
SameSite 设置跨域时不携带 cookie，防止CSRF


Secure 和 HttpOnly 是强烈建议开启的。
SameSite 选项需要根据实际情况讨论，因为 SameSite 可能会导致即使你用 CORS 解决了跨越问题，
依然会因为请求没自带 cookie 引起一系列问题，一开始还以为是 axios 配置问题，绕了一大圈，然而根本没关系。





OAuth2.0 的流程和重点：
为你的应用申请 ID 和 Secret
准备好重定向接口
正确传参获取 code <- 重要
code 传入你的重定向接口
在重定向接口中使用 code 获取 token <- 重要
传入 token 使用微信接口
OAuth2.0 着重于第三方登录和权限限制。


```