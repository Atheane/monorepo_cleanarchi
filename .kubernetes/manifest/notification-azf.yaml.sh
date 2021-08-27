#deploy the SecretProviderClass
cat <<EOF | kubectl apply -f -
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: ${NAME}-KV
  namespace: ${NAMESPACE}
spec:
  provider: azure
  secretObjects:                                 #SecretObject defines the desired state of synced K8s secret objects
  - secretName: sqlserver
    type: Opaque
    data: 
    - objectName: SECRET_1                    # name of the mounted content to sync. this could be the object name or object alias 
      key: dbpassword                   
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: $clientId 
    keyvaultName: $keyVaultName
    cloudName: ""          #[OPTIONAL] if not provided, azure environment will default to AzurePublicCloud
    cloudEnvFileName: ""   # [OPTIONAL] use to define path to file for populating azure environment
    objects:  |
      array:
        - |
          objectName: $secretName
          objectAlias: SECRET_1     # [OPTIONAL] object alias
          objectType: secret        # object types: secret, key or cert
          objectVersion: ""         # [OPTIONAL]
    resourceGroup: $KeyvaultResourceGroupName            # the resource group of the KeyVault
    subscriptionId: $subscriptionId         # the subscription ID of the KeyVault
    tenantId: $tenantId                 # the tenant ID of the KeyVault
EOF