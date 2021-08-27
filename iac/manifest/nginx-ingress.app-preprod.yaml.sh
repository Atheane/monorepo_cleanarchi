apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: odb-ingress-app
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  rules:
    - host: pprd-aks-api-gateway.onbadi.com
      http:
        paths:
          - path: /api/account-sync(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: aggregation-azf
                port:
                  number: 80
          - path: /api/card-life-cycle(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: payment-azf
                port:
                  number: 80
          - path: /api/debt(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: payment-azf
                port:
                  number: 80
          - path: /api/smo-dispatcher(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: payment-azf
                port:
                  number: 80
          - path: /api/ot-callback(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: profile-azf
                port:
                  number: 80
          - path: /profile(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: profile-api
                port:
                  number: 80
          - path: /aggregation(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: aggregation-api
                port:
                  number: 80
          - path: /credit(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: credit-api
                port:
                  number: 80
          - path: /payment(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: payment-api
                port:
                  number: 80
          - path: /pfm(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: pfm-api
                port:
                  number: 80
          - path: /notifications(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: notification-api
                port:
                  number: 80
          - path: /subscription(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: subscription-api
                port:
                  number: 80
          - path: /pfm(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: pfm-api
                port:
                  number: 80
         