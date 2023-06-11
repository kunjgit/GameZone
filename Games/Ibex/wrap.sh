#!/bin/bash

# usage: wrap.sh file varname

echo -n "var $2 ='"
cat $1 | perl -i -p -e 's/\n/\\n/';
echo -ne "';"
