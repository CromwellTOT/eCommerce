API system "with RBAC"
===
E-commerce version

Getting started
---
1. Create `config.json` at root dir, like this
```JSON
{
	"port": 5000,
	"mongodb_url": "xxx",
	"jwt_secret": "somethingsecret"
}
```
2, 
```sh
> npm install
> npm start
```

Unit Test
---
```sh
> npm test
```

Role management system UI
---
Use [this link](http://localhost:5000)