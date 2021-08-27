#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
cat <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: odb-ingress-azf
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/appgw-ssl-certificate: "ssl-certificate"
    appgw.ingress.kubernetes.io/backend-protocol: "http"
spec:
  rules:
    - host: aks-api-gateway.onbadi.com
      http:
        paths:
          - path: /notification-azf/*
            pathType: Prefix
            backend:
              service:
                name: transaction-azf
                port:
                  number: 80
EOF