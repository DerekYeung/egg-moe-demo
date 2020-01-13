# egg-moe 说明

egg-moe是一个基于egg，针对公司业务需求定向开发的企业内部框架，该框架集成了orm、cors、cache、upload/oss、payment、passport等多项常用功能以及各类常用helper函数（如md5,sha1,jwt等）

同时基于egg的框架定制能力，扩展了common公共库，实现了多项目共用同一公共库

# 目录结构说明

common: 在多个项目中需要复用的model、service、config存放目录
app: app相关接口
passport: 统一通用鉴权接口
socket: socket相关接口
backend: 后台相关接口
deploy: 通用部署接口

ps: 在真实开发环境下，common以及不同的项目均为独立的git仓库，除common外，不同的开发人员拥有不同的项目权限，保证了互相之间不会产生冲突以及部分代码安全性问题