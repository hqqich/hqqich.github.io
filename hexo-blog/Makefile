# 定义变量
MAVEN_HOME = F:\sorf\apache-maven-3.8.6
MAVEN_HOME2 = %JAVA_HOME%

.PHONY: help all build windows linux


downThemes:
	@git clone https://github.com/xbmlz/hexo-theme-maple.git themes/maple

build:
	@npm run build

uploadNex:
	@mvn deploy -DaltDeploymentRepository=maven_release::http://172.22.90.3:5678/repository/maven-releases/

help:
	@echo %JAVA_HOME%
	@echo ${MAVEN_HOME2}
	@echo "options and effects:"
	@ifconfig
