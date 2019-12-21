# git 常用命令总结

## 基本命令
```
1、git init
2、git remote add origin http://192.168.10.250/t3-web-frontend/t3-web-operation.git
拉取远程分支
3、git fetch origin dev-xxx
 根据远程分支创建本地分支,并切换到当前分支
4、git checkout -b dev20190622 origin/dev-xxx

修改代码
6、git status
7、git add vue.config.js
8、git diff vue.config.js
9、git commit -m "注释"
推送远程
10、git push origin dev20190622:dev-xxx
11、git log
12、git checkout dev20190623

git push <远程主机名> <本地分支名>  <远程分支名>
例如 git push origin master：refs/for/master ，
即是将本地的master分支推送到远程主机origin上的对应master分支， origin 是远程主机名，

第一个master是本地分支名，第二个master是远程分支名。

    1.1 git push origin master

    如果远程分支被省略，如上则表示将本地分支推送到与之存在追踪关系的远程分支
    （通常两者同名），如果该远程分支不存在，则会被新建

     1.2 git push origin ：refs/for/master 

　　如果省略本地分支名，则表示删除指定的远程分支，
　　因为这等同于推送一个空的本地分支到远程分支，等同于 git push origin --delete master

    1.3 git push origin

　　 如果当前分支与远程分支存在追踪关系，则本地分支和远程分支都可以省略，
　　 将当前分支推送到origin主机的对应分支 

　1.4 git push

　　如果当前分支只有一个远程分支，那么主机名都可以省略，形如 git push，可以使用git branch -r ，查看远程的分支名

```

## git rm
```
移除cache 状态, 
git rm --cache 文件名

移除cache 状态, 并直接删除
git rm -f 文件名

```

## git reset
```
取消暂存的文件
git reset HEAD 文件名1 文件名2 ...

撤消对文件的修改
git checkout -- 文件名


工作区域

暂存区域

提交的历史

git reset

三种模式 soft,mixed,hard
```


## git branch
```
查看远程分支
git branch -r

创建分支
git branch 分支名

删除分支
git branch -D 分支名

切换分支
git checkout 分支名

创建和切换合起来
git checkout -b iss53
相等于
$ git branch iss53
$ git checkout iss53

合并分支
git merge 覆盖分支名

如果有冲突, 先解决冲突,然后commit


需要查看每一个分支的最后一次提交
git branch -v 

创建一个本地分支跟踪远程分支:
1. serverfix 分支上工作，可以将其建立在远程跟踪分支之上
git checkout -b serverfix origin/serverfix

2. 快捷方式
git checkout --track origin/serverfix

如果想要将本地分支与远程分支设置为不同名字
git checkout -b 别名 origin/serverfix

⭐️
设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，或者想要修改正在跟踪的上游分支，
你可以在任意时间使用 -u 或 --set-upstream-to 选项运行 git branch 来显式地设置。

$ git branch -u origin/serverfix


想要查看设置的所有跟踪分支，可以使用 git branch 的 -vv 选项。 
这会将所有的本地分支列出来并且包含更多的信息，
如每一个分支正在跟踪哪个远程分支与本地分支是否是领先、落后
git branch -vv


git pull 大多数情况等于 git fetch + git merge

删除远程分支
git push origin --delete 分支名


```


## tag
```
查询tag
git tag

关键字查询tag
git tag -l 'develop_v*'

创建tag
git tag -a tag名 -m "注释内容"
轻量标签: 不需要使用 -a、-s 或 -m 选项，只需要提供标签名字

删除标签
git tag -d <tagname>
本地tag删除了，再执行该句，删除线上tag
git push origin :refs/tags/v1.4-lw

标签信息与对应的提交信息：
git show tag名

基于tag 创建新分支:
git checkout -b 分支名 tag名

拉取远程tag
git fetch origin tag tag名

推送tag到远程
git push origin --tags

```

## git config

```
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status

取消暂存文件
git config --global alias.unstage 'reset HEAD --'

$ git config --global alias.last 'log -1 HEAD'

演示将 git visual 定义为 gitk 的别名：
$ git config --global alias.visual '!gitk'

取消别名
git config --global --unset alias.st

```


## git mv
```
其实，运行 git mv 就相当于运行了下面三条命令：

$ mv README.md README
$ git rm README.md
$ git add README
```


## git log
```
一个常用的选项是 -p，用来显示每次提交的内容差异。 你也可以加上 -2 来仅显示最近两次提交：
git log -p -2

看简略的信息
git log --stat

git log --pretty=oneline

查看每次提交的详细时间
git log --pretty=format:"%h - %an, %ad : %s"

git log --since=2.weeks

-(n)

仅显示最近的 n 条提交

--since, --after

仅显示指定时间之后的提交。

--until, --before

仅显示指定时间之前的提交。

```

## git commit 
```
有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 
此时，可以运行带有 --amend 选项的提交命令尝试重新提交：

$ git commit --amend

这个命令会将暂存区中的文件提交。

$ git commit -m 'initial commit'
$ git add forgotten_file
$ git commit --amend
最终你只会有一个提交——第二次提交将代替第一次提交的结果。

取消暂存的文件
git reset HEAD [filename]

撤销文件的修改
git checkout -- [filename]

```

## git tag
```
创建tag

轻量标签
git tag [tag-name]

带描述信息
git tag -a [tag-name] -m "[message]"


tag 列表
git tag

只对 1.8.5 系列感兴趣
git tag -l 'v1.8.5*'


tag 提交信息
git show [tag-name]

删除本地标签
git tag -d v1.4-lw

更新远程仓库标签
git push origin :refs/tags/v1.4-lw

```



## git branch
```
分支创建
git branch [branch-name]

分支切换
git checkout [branch-name]


git checkout -b [branch-name] 
==
git branch [branch-name]
git checkout [branch-name]


查看每个分支最后一次提交
git branch -v


查看哪些分支已经合到当前分支
git branch --merged

查看哪些分支未合到当前分支
git branch --no-merged

删除远程分支
git push origin --delete serverfix



分支变基
git rebase [basebranch] [topicbranch] 

git checkout [experiment]
git rebase master
(它的原理是首先找到这两个分支（即当前分支 experiment、变基操作的目标基底分支 master）的最近共同祖先 C2，
然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件，
然后将当前分支指向目标基底 C3, 最后以此将之前另存为临时文件的修改依序应用)

将 C4 中的修改变基到 C3 上
现在回到 master 分支，进行一次快进合并。

$ git checkout master
$ git merge experiment

你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的，但它们看上去就像是串行的一样，提交历史是一条直线没有分叉。

```















# git config
```


git config --list

命令别名
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status

alias.st=status
alias.co=checkout
alias.br=branch
alias.ci=commit
alias.df=diff


// 删除别名
git config --global --unset alias.l

// 删除所有别名
git config --global --remove-section alias




git clone [url] [本地仓库名]

查看远程仓库
git remove -v


重命名远程仓库
git remote rename [name1] [destname]

删除远程仓库
git remote rm [remote-name]


```

# git stash

```

默认情况下，git stash 只会储藏已经在索引中的文件。 

git stash

// 如果指定 --include-untracked 或 -u 标记，Git 也会储藏任何创建的未跟踪文件。
git stash -u  或 git stash --unclude-untracked


// 查看存储的
git stash list

如果不指定一个储藏，Git 认为指定的是最近的储藏
git stash apply

git stash apply stash@{2}

// 从栈顶弹出一个
git stash pop


// 从栈里直接丢弃
git stash drop stash@{0}

git stash show  stash@{$num}  -p


常规 git stash 的一个限制是它会一下暂存所有的文件。有时，只备份某些文件更为方便，让另外一些与代码库保持一致。一个非常有用的技巧，用来备份部分文件：

它告诉 Git 不要储藏任何你通过 git add 命令已暂存的东西

add 那些你不想备份的文件（例如： git add file1.js, file2.js）
调用 git stash –-keep-index。只会备份那些没有被add的文件。
调用 git reset 取消已经add的文件的备份，继续自己的工作。


场景
开发到一半,同步远端代码
工作流被打断,需要先做别的需求


```

HEAD 是当前分支引用的指针，它总是指向该分支上的最后一次提交。

从根本上来讲 Git 是一个内容寻址（content-addressable）文件系统




# git grep
```
git grep [关键字]

-n 显示行号 
git grep -n [关键字] [分支名]

只显示文件名
git grep --name-only [关键字]

```








