> 假设 Chrome/Firefox/IE 浏览器安装的是 32 位版本，对应的浏览器驱动放在 D:\WebDrivers 目录。


> 官网：`https://www.selenium.dev/`


** Chrome 浏览器

驱动下载地址
> `https://sites.google.com/a/chromium.org/chromedriver/home`
> `https://sites.google.com/chromium.org/driver/`

```java
import org.openqa.selenium.WebDriver; // 浏览器驱动操作接口
import org.openqa.selenium.By; // 页面元素定位类
import org.openqa.selenium.chrome.ChromeDriver; // Chrome 浏览器驱动类

public class SeleniumChrome {

    public static void main(String[] args) throws Exception {
        // 设置 Chrome 浏览器可执行文件的位置，一般可以不用设置
        String browserPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        System.setProperty("webdriver.chrome.bin", browserPath);
        // 设置 Chrome 浏览器驱动的位置
        String driverPath = "D:\\WebDrivers\\chromedriver.exe";
        System.setProperty("webdriver.chrome.driver", driverPath);
        // 关闭 Chrome 浏览器驱动的日志输出
        System.setProperty("webdriver.chrome.silentOutput", "true");
        // 创建 Chrome 浏览器驱动对象
        WebDriver driver = new ChromeDriver();
        // 打开百度首页
        driver.get("https://www.baidu.com");
        // 定位搜索输入框输入查找的内容
        driver.findElement(By.id("kw")).sendKeys("Chrome");

        driver.findElement(By.id("su")).click();
        // 等待 3 秒
        Thread.sleep(3000);
        // 关闭浏览器窗口
        driver.close();
    }
}
```







** Firefox 浏览器
```java
import org.openqa.selenium.WebDriver; // 浏览器驱动操作接口
import org.openqa.selenium.By; // 页面元素定位类
import org.openqa.selenium.firefox.FirefoxDriver; // Firefox 浏览器驱动类

public class SeleniumFirefox {

    public static void main(String[] args) throws InterruptedException {    
        // 设置 Firefox 浏览器可执行文件的位置，一般可以不用设置
        String browserPath = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
        System.setProperty("webdriver.firefox.bin", browserPath);
        // 设置 Firefox 浏览器驱动的位置
        String driverPath = "D:\\WebDrivers\\geckodriver.exe";
        System.setProperty("webdriver.gecko.driver", driverPath);
        // 默认日志信息输出很多，可以关闭日志
        System.setProperty(FirefoxDriver.SystemProperty.BROWSER_LOGFILE,"/dev/null");
        // 创建 Firefox 浏览器驱动对象
        WebDriver driver = new FirefoxDriver();
        // 打开百度首页
        driver.get("https://www.baidu.com");
        // 定位搜索输入框输入查找的内容
        driver.findElement(By.id("kw")).sendKeys("Firefox");
        // 等待 3 秒
        Thread.sleep(3000);
        // 关闭浏览器窗口
        driver.close();
    }

}
```


** IE 浏览器
```java
import org.openqa.selenium.WebDriver; // 浏览器驱动操作接口
import org.openqa.selenium.By; // 页面元素定位类
import org.openqa.selenium.ie.InternetExplorerDriver; // IE 浏览器驱动类

public class SeleniumIE {

    public static void main(String[] args) throws InterruptedException {
        // 设置 IE 浏览器可执行文件的位置，一般可以不用设置
        String browserPath = "C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe";
        System.setProperty("webdriver.ie.bin", browserPath);
        // 设置 IE 浏览器驱动的位置
        String driverPath = "D:\\WebDrivers\\IEDriverServer.exe";
        System.setProperty("webdriver.ie.driver", driverPath);
        // 创建 IE 浏览器驱动对象
        WebDriver driver = new InternetExplorerDriver();
        // 打开百度首页
        driver.get("https://www.baidu.com");
        // 定位搜索输入框输入查找的内容
        driver.findElement(By.id("kw")).sendKeys("IE");
        // 等待 3 秒
        Thread.sleep(3000);
        // 关闭浏览器窗口
        driver.close();
    }

}
```
