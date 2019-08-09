

ref:  
https://blog.csdn.net/qq_30604453/article/details/84791069
https://gitee.com/wuchunling/koa2-mysql/tree/master

fixed some bugs.
1. delete can not post an entity body.
ref:  
https://blog.csdn.net/sunny_xisofeixiong/article/details/82657337  
https://github.com/dlau/koa-body  
strict {Boolean} DEPRECATED If enabled, don't parse GET, HEAD, DELETE requests, default true


1. delete rows should take ids string.
   ```

   ```


others:
post rows:
```
[
    {
        "userId": 1,
        "total": 110
    },
    {
        "userId": 2,
        "total": 200
    }
]
```

put rows:
```
[
    {
        "id": 1,
        "total": 110
    },
    {
        "id": 3,
        "total": 200
    }
]
```

delete rows:
```
{
	"ids":"1,2"
}
```