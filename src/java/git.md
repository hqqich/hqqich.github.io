## 一、安装git

```shell
sudo apt-get install git
```





## 二、配置git

### 1. 配置用户名和密码

```shell
git config --global user.name hqqich
git config --global user.email hqqich1314@yeah.net
```



查看配置信息：`git config --global -l`

![image.png](https://upload-images.jianshu.io/upload_images/26046629-e8e826f479ed3304.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2. 生成git密钥

```shell
ssh-keygen -c hqqich1314@yeah.net -t rsa
```

![image.png](https://upload-images.jianshu.io/upload_images/26046629-827f23ad358a163f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



root@2:/# ssh-keygen -C hqqich1314@yeah.net -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Passphrases do not match.  Try again.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa
Your public key has been saved in /root/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:JEl2aQq3q0Kx7Yo7v1cm4ZUxfo64LY44V7KAglUkU3g hqqich1314@yeah.net
The key's randomart image is:
+---[RSA 3072]----+
|  o+o o ..       |
|  .oEo+oo        |
|   o +oB.        |
|  o . *o.        |
|o. = + =S        |
|= + * = .        |
|.o = B           |
|oo+.* .          |
|+*=*..           |
+----[SHA256]-----+



进入   `/root/.ssh`复制`id_rsa.pub`文件中的内容

```shell
vim /root/.ssh/id_rsa.pub
```





![image.png](https://upload-images.jianshu.io/upload_images/26046629-60e6ab2deda9d27e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/26046629-d0e41007411415d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



测试连接

```shell
ssh -T git@github.com
```

![image.png](https://upload-images.jianshu.io/upload_images/26046629-0e953e3c3ef602b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)





可以下载代码了

```shell
git clone git@github.com:ningbonb/HTML5.git
```

