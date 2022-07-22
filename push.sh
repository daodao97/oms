#!/bin/bash
set -x

rm -rf .git
git init
git config user.name okiss 
git config user.email okissjs@gmail.com
git add .
git commit -m '·'
git remote add origin git@github.com:daodao97/oms.git
git push origin master -f
