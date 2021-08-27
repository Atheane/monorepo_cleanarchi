#!/bin/bash

export $(grep -v ‘^#’ .kubernetes/pipeline/$ENV/$PIPELINE_CONF.conf | xargs) 
echo "IDENTITY_NAME : $IDENTITY_NAME"
echo "IDENTITY_RESOURCE_GROUP : $IDENTITY_RESOURCE_GROUP"
echo "SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
echo "NAME: $NAME"
echo "PROBE_PATH: $PROBE_PATH"
echo "IMAGE: $IMAGE"
echo "NAMESPACE: $NAMESPACE"
echo "CLUSTER_NAME: $CLUSTER_NAME"
echo "CONFIG_PATH: $CONFIG_PATH"
echo "COMMAND: $COMMAND"
echo "PORT : $PORT"
echo "TAG: $TAG"
echo "WORKING_DIR: $WORKING_DIR"

cd $WORKING_DIR

az aks get-credentials --name $CLUSTER_NAME --overwrite-existing --resource-group $IDENTITY_RESOURCE_GROUP --admin

IMAGE="$IMAGE:$TAG"
export IDENTITY_CLIENT_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query clientId -otsv)"
export IDENTITY_RESOURCE_ID="$(az identity show -g ${IDENTITY_RESOURCE_GROUP} -n ${IDENTITY_NAME} --query id -otsv)"
export IDENTITY_ASSIGNMENT_ID="$(az role assignment create --role Reader --assignee ${IDENTITY_CLIENT_ID} --scope /subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${IDENTITY_RESOURCE_GROUP} --query id -otsv)"


# Print array values in  lines
kubectl delete configmap $NAME-app-config-map -n $NAMESPACE || true
kubectl delete configmap $NAME-env-config-map -n $NAMESPACE || true
kubectl create configmap  $NAME-app-config-map --from-env-file=$CONFIG_PATH/app.env -n $NAMESPACE
kubectl create configmap  $NAME-env-config-map --from-env-file=$CONFIG_PATH/$ENV.env -n $NAMESPACE

bash .kubernetes/manifest/app.yaml.sh |  kubectl $COMMAND -f -



#export IDENTITY_RESOURCE_GROUP="RG_PROD_PASSIF_ODB"
#export IDENTITY_NAME="prd-odb-profile-id-pdzzc"
#export SUBSCRIPTION_ID="fd474ff2-89e0-432b-9906-e652220f5073"
#export NAME="profile-api"
#export PROBE_PATH=/profile/status
#export IMAGE=odbdevregistry.azurecr.io/odb-profile-api:v0.3.11
#export NAMESPACE=production

# sh .kubernetes/deploy-app.sh delete apps/payment/payment-api/conf/ dev
# sh .kubernetes/deploy-app.sh create apps/profile/profile-api/conf/ dev

#[[ ! -z "${PORT:-}" ]] || (export PORT=3004)
# payment export PORT=3022
# credit



