#!/bin/bash

cd ../app/back
pwd
ln -s ~/goinfre/files files
echo 'Symbolic link created'
yarn install
echo 'BACK END SET - Please start server'

cd ../front
pwd
yarn install
echo 'FRONT END SET - Server starting...'
yarn start

exit 0