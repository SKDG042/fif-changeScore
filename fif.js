// 引入所需的库
// 添加 Newtonsoft.Json 的引用
//@assembly Newtonsoft.Json

// 使用JScript.NET正确的引用方式
import System;
import System.Windows.Forms;
import Fiddler;

// INTRODUCTION
//
// Well, hello there!
//
// Don't be scared! :-)
//
// This is the FiddlerScript Rules file, which creates some of the menu commands and
// other features of Progress Telerik Fiddler Classic. You can edit this file to modify or add new commands.
//
// The original version of this file is named SampleRules.js and it is in the
// \Program Files\Fiddler\ folder. When Fiddler Classic first runs, it creates a copy named
// CustomRules.js inside your \Documents\Fiddler2\Scripts folder. If you make a 
// mistake in editing this file, simply delete the CustomRules.js file and restart
// Fiddler Classic. A fresh copy of the default rules will be created from the original
// sample rules file.

class Handlers
{
    // *****************
    //
    // This is the Handlers class. Pretty much everything you ever add to FiddlerScript
    // belongs right inside here, or inside one of the already-existing functions below.
    //
    // *****************

    // The following snippet demonstrates a custom-bound column for the Web Sessions list.
    // See http://fiddler2.com/r/?fiddlercolumns for more info
    /*
    public static BindUIColumn("Method", 60)
    function FillMethodColumn(oS: Session): String {
        return oS.RequestMethod;
    }
    */

    // The following snippet demonstrates how to create a custom tab that shows simple text
    /*
    public BindUITab("Flags")
    static function FlagsReport(arrSess: Session[]):String {
        var oSB: System.Text.StringBuilder = new System.Text.StringBuilder();
        for (var i:int = 0; i<arrSess.Length; i++)
        {
            oSB.AppendLine("SESSION FLAGS");
            oSB.AppendFormat("{0}: {1}\n", arrSess[i].id, arrSess[i].fullUrl);
            for(var sFlag in arrSess[i].oFlags)
            {
                oSB.AppendFormat("\t{0}:\t\t{1}\n", sFlag.Key, sFlag.Value);
            }
        }
        return oSB.ToString();
    }
    */

    // 隐藏304响应选项
    public static RulesOption("Hide 304s")
    BindPref("fiddlerscript.rules.Hide304s")
    var m_Hide304s = false;

    // 请求日语内容选项
    public static RulesOption("Request &Japanese Content")
    var m_Japanese = false;

    // 自动认证选项
    public static RulesOption("&Automatically Authenticate")
    BindPref("fiddlerscript.rules.AutoAuth")
    var m_AutoAuth = false;

    // 用户代理选项
    RulesString("&User-Agents", true) 
    BindPref("fiddlerscript.ephemeral.UserAgentString")
    RulesStringValue(0,"Netscape &3", "Mozilla/3.0 (Win95; I)")
    RulesStringValue(1,"WinPhone8.1", "Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537")
    RulesStringValue(2,"&Safari5 (Win7)", "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1")
    public static var sUA = null;

    // 模拟调制解调器速度选项
    public static RulesOption("Simulate &Modem Speeds", "Per&formance")
    var m_SimulateModem = false;

    // 禁用缓存选项
    public static RulesOption("&Disable Caching", "Per&formance")
    var m_DisableCaching = false;

    // 缓存始终新鲜选项
    public static RulesOption("Cache Always &Fresh", "Per&formance")
    var m_AlwaysFresh = false;
        
    // 重置脚本
    public static ToolsAction("Reset Script")
    function DoManualReload() { 
        FiddlerObject.ReloadScript();
    }

    // 解码选定会话
    public static ContextAction("Decode Selected Sessions")
    function DoRemoveEncoding(oSessions) {
        for (var x = 0; x < oSessions.Length; x++){
            oSessions[x].utilDecodeRequest();
            oSessions[x].utilDecodeResponse();
        }
        UI.actUpdateInspector(true,true);
    }

    // 请求前处理
    static function OnBeforeRequest(oSession: Session) {
        // 处理特定请求
        if (oSession.RequestMethod == "POST" && oSession.fullUrl.Contains("moral.fifedu.com")) {
            FiddlerApplication.Log.LogString("检测到 moral.fifedu.com 的请求");
            FiddlerApplication.Log.LogString("完整URL: " + oSession.fullUrl);
            
            if (oSession.fullUrl.Contains("submitChallengeResults")) {
                FiddlerApplication.Log.LogString("找到目标请求!");
                oSession["ui-color"] = "orange";
                
                var requestBody = oSession.GetRequestBodyAsString();
                FiddlerApplication.Log.LogString("请求体: " + requestBody);
                
                // 将 requestBody 解码
                var decodedRequestBody = decodeURIComponent(requestBody);
                
                try {
                    // 提取 resultJson 后面的内容
                    var startIndex = decodedRequestBody.indexOf("resultJson=") + "resultJson=".length;
                    var endIndex = decodedRequestBody.length;
                    var resultJsonString = decodedRequestBody.substring(startIndex, endIndex);

                    FiddlerApplication.Log.LogString("提取的resultJsonString: " + resultJsonString);

                    // 手动修改JSON字符串 - 我们知道它是一个包含特定字段的数组
                    // 使用正则表达式查找字段并替换值
                    var modifiedJsonString = resultJsonString;
                    
                    // 创建一个映射到随机值的函数
                    function getRandomScore() {
                        return (Math.floor(Math.random() * (100 - 95 + 1)) + 95).toString();
                    }
                    
                    function getRandomTime() {
                        return (Math.floor(Math.random() * (150 - 85 + 1)) + 85).toString();
                    }
                    
                    // 使用正则表达式替换字段值
                    modifiedJsonString = modifiedJsonString.replace(/"score":\s*\d+/g, '"score": ' + getRandomScore());
                    modifiedJsonString = modifiedJsonString.replace(/"semantic":\s*\d+/g, '"semantic": ' + getRandomScore());
                    modifiedJsonString = modifiedJsonString.replace(/"accuracy":\s*\d+/g, '"accuracy": ' + getRandomScore());
                    modifiedJsonString = modifiedJsonString.replace(/"fluency":\s*\d+/g, '"fluency": ' + getRandomScore());
                    modifiedJsonString = modifiedJsonString.replace(/"complete":\s*\d+/g, '"complete": 100');
                    modifiedJsonString = modifiedJsonString.replace(/"learn_time":\s*\d+/g, '"learn_time": ' + getRandomTime());
                    
                    FiddlerApplication.Log.LogString("修改后的JSON: " + modifiedJsonString);

                    // 替换原始的 resultJson 字符串
                    var modifiedRequestBody = decodedRequestBody.replace(resultJsonString, encodeURIComponent(modifiedJsonString));
                    
                    FiddlerApplication.Log.LogString("修改后的请求体: " + modifiedRequestBody);

                    // 设置修改后的请求正文内容
                    oSession.utilSetRequestBody(modifiedRequestBody);
                } catch (e) {
                    FiddlerApplication.Log.LogString("处理错误: " + e.toString());
                }
            }
        }

        // 常规请求处理
        if (m_SimulateModem) {
            oSession["request-trickle-delay"] = "300"; 
            oSession["response-trickle-delay"] = "150"; 
        }

        if (m_DisableCaching) {
            oSession.oRequest.headers.Remove("If-None-Match");
            oSession.oRequest.headers.Remove("If-Modified-Since");
            oSession.oRequest["Pragma"] = "no-cache";
        }

        if (null != sUA) {
            oSession.oRequest["User-Agent"] = sUA; 
        }

        if (m_Japanese) {
            oSession.oRequest["Accept-Language"] = "ja";
        }

        if (m_AutoAuth) {
            oSession["X-AutoAuth"] = "(default)";
        }

        if (m_AlwaysFresh && (oSession.oRequest.headers.Exists("If-Modified-Since") || oSession.oRequest.headers.Exists("If-None-Match")))
        {
            oSession.utilCreateResponseAndBypassServer();
            oSession.responseCode = 304;
            oSession["ui-backcolor"] = "Lavender";
        }
    }

    // 响应前处理
    static function OnBeforeResponse(oSession) {
        if (m_Hide304s && oSession.responseCode == 304) {
            oSession["ui-hide"] = "true";
        }
    }

    // 主函数
    static function Main() {
        var today = new Date();
        FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;
    }

    // 断点和QuickExec规则变量
    BindPref("fiddlerscript.ephemeral.bpRequestURI")
    public static var bpRequestURI = null;

    BindPref("fiddlerscript.ephemeral.bpResponseURI")
    public static var bpResponseURI = null;

    BindPref("fiddlerscript.ephemeral.bpMethod")
    public static var bpMethod = null;

    static var bpStatus = -1;
    static var uiBoldURI = null;
    static var gs_ReplaceToken = null;
    static var gs_ReplaceTokenWith = null;
    static var gs_OverridenHost = null;
    static var gs_OverrideHostWith = null;

    // 执行操作函数
    static function OnExecAction(sParams) {
        FiddlerObject.StatusText = "ExecAction: " + sParams[0];
        
        var sAction = sParams[0].toLowerCase();
        switch (sAction) {
            case "bold":
                if (sParams.Length<2) {uiBoldURI=null; FiddlerObject.StatusText="Bolding cleared"; return false;}
                uiBoldURI = sParams[1]; FiddlerObject.StatusText="Bolding requests for " + uiBoldURI;
                return true;
            case "bp":
                FiddlerObject.alert("bpu = breakpoint request for uri\nbpm = breakpoint request method\nbps=breakpoint response status\nbpafter = breakpoint response for URI");
                return true;
            case "bps":
                if (sParams.Length<2) {bpStatus=-1; FiddlerObject.StatusText="Response Status breakpoint cleared"; return false;}
                bpStatus = parseInt(sParams[1]); FiddlerObject.StatusText="Response status breakpoint for " + sParams[1];
                return true;
            case "bpv":
            case "bpm":
                if (sParams.Length<2) {bpMethod=null; FiddlerObject.StatusText="Request Method breakpoint cleared"; return false;}
                bpMethod = sParams[1].toUpperCase(); FiddlerObject.StatusText="Request Method breakpoint for " + bpMethod;
                return true;
            case "bpu":
                if (sParams.Length<2) {bpRequestURI=null; FiddlerObject.StatusText="RequestURI breakpoint cleared"; return false;}
                bpRequestURI = sParams[1]; 
                FiddlerObject.StatusText="RequestURI breakpoint for "+sParams[1];
                return true;
            case "bpa":
            case "bpafter":
                if (sParams.Length<2) {bpResponseURI=null; FiddlerObject.StatusText="ResponseURI breakpoint cleared"; return false;}
                bpResponseURI = sParams[1]; 
                FiddlerObject.StatusText="ResponseURI breakpoint for "+sParams[1];
                return true;
            case "overridehost":
                if (sParams.Length<3) {gs_OverridenHost=null; FiddlerObject.StatusText="Host Override cleared"; return false;}
                gs_OverridenHost = sParams[1].toLowerCase();
                gs_OverrideHostWith = sParams[2];
                FiddlerObject.StatusText="Connecting to [" + gs_OverrideHostWith + "] for requests to [" + gs_OverridenHost + "]";
                return true;
            case "urlreplace":
                if (sParams.Length<3) {gs_ReplaceToken=null; FiddlerObject.StatusText="URL Replacement cleared"; return false;}
                gs_ReplaceToken = sParams[1];
                gs_ReplaceTokenWith = sParams[2].Replace(" ", "%20");  // Simple helper
                FiddlerObject.StatusText="Replacing [" + gs_ReplaceToken + "] in URIs with [" + gs_ReplaceTokenWith + "]";
                return true;
            case "allbut":
            case "keeponly":
                if (sParams.Length<2) { FiddlerObject.StatusText="Please specify Content-Type to retain during wipe."; return false;}
                UI.actSelectSessionsWithResponseHeaderValue("Content-Type", sParams[1]);
                UI.actRemoveUnselectedSessions();
                UI.lvSessions.SelectedItems.Clear();
                FiddlerObject.StatusText="Removed all but Content-Type: " + sParams[1];
                return true;
            case "stop":
                UI.actDetachProxy();
                return true;
            case "start":
                UI.actAttachProxy();
                return true;
            case "cls":
            case "clear":
                UI.actRemoveAllSessions();
                return true;
            case "g":
            case "go":
                UI.actResumeAllSessions();
                return true;
            case "goto":
                if (sParams.Length != 2) return false;
                Utilities.LaunchHyperlink("http://www.google.com/search?hl=en&btnI=I%27m+Feeling+Lucky&q=" + Utilities.UrlEncode(sParams[1]));
                return true;
            case "help":
                Utilities.LaunchHyperlink("http://fiddler2.com/r/?quickexec");
                return true;
            case "hide":
                UI.actMinimizeToTray();
                return true;
            case "log":
                FiddlerApplication.Log.LogString((sParams.Length<2) ? "User couldn't think of anything to say..." : sParams[1]);
                return true;
            case "nuke":
                UI.actClearWinINETCache();
                UI.actClearWinINETCookies(); 
                return true;
            case "screenshot":
                UI.actCaptureScreenshot(false);
                return true;
            case "show":
                UI.actRestoreWindow();
                return true;
            case "tail":
                if (sParams.Length<2) { FiddlerObject.StatusText="Please specify # of sessions to trim the session list to."; return false;}
                UI.TrimSessionList(int.Parse(sParams[1]));
                return true;
            case "quit":
                UI.actExit();
                return true;
            case "dump":
                UI.actSelectAll();
                UI.actSaveSessionsToZip(CONFIG.GetPath("Captures") + "dump.saz");
                UI.actRemoveAllSessions();
                FiddlerObject.StatusText = "Dumped all sessions to " + CONFIG.GetPath("Captures") + "dump.saz";
                return true;

            default:
                if (sAction.StartsWith("http") || sAction.StartsWith("www.")) {
                    System.Diagnostics.Process.Start(sParams[0]);
                    return true;
                }
                else
                {
                    FiddlerObject.StatusText = "Requested ExecAction: '" + sAction + "' not found. Type HELP to learn more.";
                    return false;
                }
        }
    }
}
