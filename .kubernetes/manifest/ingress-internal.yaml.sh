#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
cat <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: odb-ingress-internal
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - http:
        paths:
          - path: /transaction/*
            pathType: Prefix
            backend:
              service:
                name: transaction-api
                port:
                  number: 80
          - path: /account-management/*
            pathType: Prefix
            backend:
              service:
                name: account-management-api
                port:
                  number: 80
          - path: /account/*
            pathType: Prefix
            backend:
              service:
                name: account-api
                port:
                  number: 80
          - path: /notification*
            pathType: Prefix
            backend:
              service:
                name: notification-api
                port:
                  number: 80
          - path: /authentication*
            pathType: Prefix
            backend:
              service:
                name: authentication-api
                port:
                  number: 80
          - path: /aggregation*
            pathType: Prefix
            backend:
              service:
                name: aggregation-api
                port:
                  number: 80
          - path: /profile*
            pathType: Prefix
            backend:
              service:
                name: profile-api
                port:
                  number: 80
          - path: /payment*
            pathType: Prefix
            backend:
              service:
                name: payment-api
                port:
                  number: 80
          - path: /pfm*
            pathType: Prefix
            backend:
              service:
                name: pfm-api
                port:
                  number: 80
          - path: /credit*
            pathType: Prefix
            backend:
              service:
                name: credit-api
                port:
                  number: 80
EOF