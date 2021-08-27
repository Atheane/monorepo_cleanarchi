export NAMESPACE=$1
kubectl delete secret generic azf-startup-secret -n $NAMESPACE 
kubectl create ns $NAMESPACE 
kubectl create secret generic azf-startup-secret -n $NAMESPACE --from-env-file=$2

if [ $NAMESPACE == "dev" ]
then
   echo $NAMESPACE
   kubectl apply -f ./manifest/nginx-ingress.app-dev.yaml.sh -n $NAMESPACE
elif [ $NAMESPACE == "qa" ]
then
   echo $NAMESPACE
   kubectl apply -f ./manifest/nginx-ingress.app-qa.yaml.sh -n $NAMESPACE
elif [ $NAMESPACE == "preprod" ]
then
   echo $NAMESPACE
   kubectl apply -f ./manifest/nginx-ingress.app-preprod.yaml.sh -n $NAMESPACE
elif [ $NAMESPACE == "prod" ]
then
   echo $NAMESPACE
   kubectl apply -f ./manifest/nginx-ingress.app-prod.yaml.sh -n $NAMESPACE
fi

#bash ./manifest/agic-ingress.azf.yaml.sh |  kubectl apply -f -
