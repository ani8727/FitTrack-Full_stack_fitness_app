@echo off
setlocal

:: Maven Wrapper Script for Windows

set MAVEN_HOME=%~dp0\.mvn\wrapper\maven-wrapper.jar
set MAVEN_OPTS=-Xmx512m

if not exist "%MAVEN_HOME%" (
    echo Maven wrapper jar not found. Please run mvnw from the root of the project.
    exit /b 1
)

java -cp "%MAVEN_HOME%" org.apache.maven.wrapper.MavenWrapperMain %*