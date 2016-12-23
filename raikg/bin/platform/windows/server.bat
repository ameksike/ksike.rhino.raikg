@ECHO OFF
::
:: @author		Antonio Membrides Espinosa
:: @package    	bin
:: @date		25/10/2016
:: @copyright  	Copyright (c) 2015-2015
:: @license    	GPL
:: @version    	1.0
::

@set PATHL=%~dp0
@set BIN=%PATHL%../../../lib/server/bin/platform/windows/server.bat

%BIN% %*