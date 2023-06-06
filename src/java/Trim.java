public class Trim {
    public static void main(String[] args) {

        String str = "   Hello Genius!    ";  

        //方法1：String.trim();trim()是去掉首尾空格  
        System.out.println("1:"+str.trim());  

        //方法2：str.replaceAll(" ", ""); 去掉所有空格，包括首尾、中间  
        String str2 = str.replaceAll(" ", "");   
        System.out.println("2:"+str2);   

        //方法3：或者replaceAll(" +","");  去掉所有空格，包括首尾、中间  
        String str3 = str.replaceAll(" +", "");   
        System.out.println("3:"+str3);   

        //方法4：、str = .replaceAll("\\s*", "");可以替换大部分空白字符， 不限于空格 ；           \s 可以匹配空格、制表符、换页符等空白字符的其中任意一个。
        /**
         * Important :比如键入Tab键  不信你试一试，前面的2 3是去不掉的
         */
        String str4 = str.replaceAll("\\s*", "");  
        System.out.println("4:"+str4);  
    }

}