# fif-changeScore

可以修改fif口语的成绩

需要配合Fiddler食用

## 使用指南

1. 安装并打开[Fiddler](https://telerik-fiddler.s3.amazonaws.com/fiddler/FiddlerSetup.exe)
2. 点击菜单栏的 "Tools" -> "Options" -> "HTTPS"

   首次运行会提示配置 HTTPS
   
   点击 "Yes" 允许捕获 HTTPS 流量
   
   点击 "Yes" 安装证书
   
   如果出现 Windows 安全警告，点击 "是"
   
   勾选 "Capture HTTPS CONNECTs"
   
   勾选 "Decrypt HTTPS traffic"
   
   点击 "OK"
   
3. 点击顶部菜单 "Rules"
   
   点击 "Customize Rules"

   "file" -> "open" 打开本仓库中的fif.js，或将内容复制替换上去即可

4. 保持 Fiddler 运行，正常进行考试/练习，提交答案时，Fiddler 会自动修改分数（95-100），在 Fiddler 界面中寻找带有橙色标记的请求即修改成功

## 注意事项

本脚本编写初衷只是因为AI评分过于迷惑+分数会算到平时分中所以想要提高fif的成绩
还是建议大家按照要求阅读训练口语能力
（排行榜上是能听到别人的音频的）


实现思路详见博客

[脚本初尝试——FIF口语修改成绩！ | Rainnn の Blog](https://blog.rainnn.top/article/2999a3ed-3c36-4d96-b740-a664f6aa1302)

