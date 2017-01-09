@ECHO OFF
::
:: @author		Antonio Membrides Espinosa
:: @package    	bin
:: @date		25/10/2016
:: @copyright  	Copyright (c) 2015-2015
:: @license    	GPL
:: @version    	1.0
::

@set PATH=%PATH%;%~dp0
@set PATHL=%~dp0
@set KSRP=%PATHL%../../../../../../../../
@set NODE=%KSRP%bin/re/nodejs/7.3.0/x64/windows/node.exe
@set KSRS=%PATHL%../../../../../lib/server/bin/raikg.js

%NODE% %KSRS% %*