@echo off 
mkdir npl_packages
cd npl_packages
 git clone https://github.com/NPLPackages/main

pushd main
git pull 
popd

pushd paracraft
git pull 
popd
