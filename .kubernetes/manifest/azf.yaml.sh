#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

cat <<EOF
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentity
metadata:
  name: ${IDENTITY_NAME}
  namespace: ${NAMESPACE}
  annotations:
    aadpodidentity.k8s.io/Behavior: namespaced
spec:
  type: 0
  resourceID: ${IDENTITY_RESOURCE_ID}
  clientID: ${IDENTITY_CLIENT_ID}
---
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzureIdentityBinding
metadata:
  name: ${IDENTITY_NAME}-binding
  namespace: ${NAMESPACE}
spec:
  azureIdentity: ${IDENTITY_NAME}
  selector: ${IDENTITY_NAME}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    name: ${NAME}
  name: ${NAME}
  namespace: ${NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      name: ${NAME}
  template:
    metadata:
      labels:
        name: ${NAME}
        application: odb
        service: ${NAME}
        aadpodidbinding: ${IDENTITY_NAME}
      name: ${NAME}
    spec:
      containers:  
      - image: ${IMAGE}
        envFrom:
        - configMapRef:
            name: ${NAME}-app-config-map
        - configMapRef:
            name: ${NAME}-env-config-map
        - secretRef:
            name: azf-startup-secret
        name: app
        ports:
        - containerPort: ${PORT}
        livenessProbe:
          httpGet:
            path: ${PROBE_PATH}
            port: ${PORT}
          initialDelaySeconds: 60
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ${NAME}
  namespace: ${NAMESPACE}
  labels:
      name: ${NAME}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: ${PORT}
    name: app
  selector:
    name: ${NAME}

EOF


