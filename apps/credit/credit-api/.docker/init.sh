#!/bin/sh
set -e

# Get environment variables to show up in SSH session
eval $(printenv | sed -n "s/^\([^=]\+\)=\(.*\)$/export \1=\2/p" | sed 's/"/\\\"/g' | sed '/=/s//="/' | sed 's/$/"/' >> /etc/profile)

/usr/sbin/sshd
#npm start
node /usr/src/app/dist/apps/credit/credit-api/main.js