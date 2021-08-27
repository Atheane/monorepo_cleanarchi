#!/bin/bash
workingDirectory=$1
env=$2
resourceGroup=$3
appServiceName=$4
appConf=$5
cd $workingDirectory
GLOBIGNORE=*

if [  -f "$env" ] 
then
	if [ -s "$env" ] 
	then
		echo "$env has some data."
		cat $env
		echo "" >>  $env
		doc="["
		ITER="0"
		while IFS='=' read -r key value
		do
		key=$(echo $key | tr '.' '_')
		if [[ $key != ""  ]] && [[ $value != ""  ]]  && [[ "$key" != "#"*  ]] 
		then
				if [ $ITER != "0" ]
				then
				doc="$doc,"
				fi
			echo "{\"name\": \"$key\",\"value\": \"$value\" }"
			doc="$doc{\"name\": \"$key\",\"value\": \"$value\" } "
			ITER=1 
		fi
		done < "$env"
		doc="$doc]"
		echo $doc
		echo $doc > tmp_env.json
        az webapp config appsettings set -g $resourceGroup -n $appServiceName --settings @tmp_env.json
	else
		echo "$env is empty."
	fi
else
	echo echo "$env dosn't exist."
fi


if [  -f "$appConf" ] 
then
	if [ -s "$appConf" ] 
	then
		echo "$appConf has some data."
		cat $appConf
		echo "" >>  $appConf
		doc="["
		ITER="0"
		while IFS='=' read -r key value
		do
		key=$(echo $key | tr '.' '_')
		if [[ $key != ""  ]] && [[ $value != ""  ]]  && [[ "$key" != "#"*  ]] 
		then
				if [ $ITER != "0" ]
				then
				doc="$doc,"
				fi
			echo "{\"name\": \"$key\",\"value\": \"$value\" }"
			doc="$doc{\"name\": \"$key\",\"value\": \"$value\" } "
			ITER=1 
		fi
		done < "$appConf"
		doc="$doc]"
		echo $doc
		pwd
		echo $doc > tmp_app.json
		echo " az webapp config appsettings set -g $resourceGroup -n $appServiceName --settings @$workingDirectory/tmp_app.json"
        az webapp config appsettings set -g $resourceGroup -n $appServiceName --settings @tmp_app.json
	else
		echo "$appConf is empty."
	fi
else
	echo echo "$appConf dosn't exist."
fi