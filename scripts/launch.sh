#!/bin/sh
ARGS=("$*")
SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")
exec node "$BASEDIR/launch.js" $ARGS
