API system "with RBAC access-control"
===
E-commerce version

Get started
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
> node server
```