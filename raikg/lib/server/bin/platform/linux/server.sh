#! /bin/bash
#
# @author		Antonio Membrides Espinosa
# @package    	bin
# @date		    25/10/2016
# @copyright  	Copyright (c) 2015-2015
# @license    	GPL
# @version    	1.0
#

SCRIPT=$(readlink -f $0)
PATHL=`dirname $SCRIPT`

export KSRP=$PATHL/../../../../../../../../
NODE=$PATHL/../../../../../../../../bin/re/nodejs/linux/node
KSRS=$PATHL/../../../../../lib/server/bin/raikg.js

$NODE $KSRS $*