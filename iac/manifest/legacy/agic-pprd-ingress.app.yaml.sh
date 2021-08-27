#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
cat <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: odb-ingress-preprod-app
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/appgw-ssl-certificate: "ssl-certificate"
    appgw.ingress.kubernetes.io/backend-protocol: "http"
spec:
  rules:
    - host: aks-api-preprod-gateway.onbadi.com
      http:
        paths:
          - path: /subscription/*
            pathType: Prefix
            backend:
              service:
                name: subscription-api
                port:
                  number: 80
          - path: /cdp/*
            pathType: Prefix
            backend:
              service:
                name: cdp-api
                port:
                  number: 80
          - path: /notifications/*
            pathType: Prefix
            backend:
              service:
                name: notification-api
                port:
                  number: 80
          - path: /authentication/*
            pathType: Prefix
            backend:
              service:
                name: authentication-api
                port:
                  number: 80
          - path: /aggregation/*
            pathType: Prefix
            backend:
              service:
                name: aggregation-api
                port:
                  number: 80
          - path: /profile/*
            pathType: Prefix
            backend:
              service:
                name: profile-api
                port:
                  number: 80
          - path: /payment/*
            pathType: Prefix
            backend:
              service:
                name: payment-api
                port:
                  number: 80
          - path: /pfm/*
            pathType: Prefix
            backend:
              service:
                name: pfm-api
                port:
                  number: 80
          - path: /credit/*
            pathType: Prefix
            backend:
              service:
                name: credit-api
                port:
                  number: 80
EOF