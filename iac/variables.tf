variable agent_count {
  default = 3
}

variable env {
  default = "no-prod"
}

variable pool_name {
  default = "noprdakspool"
}

variable dns_prefix {
  default = "noprdodbaksdnsdevon"
}

variable keyvault_ressource_group {
  default     = "RG_DEV_APP_ODB"
}


variable cluster_name {
  default = "no-prod-odb-aks-cluster-devon"
}

variable others_resource_group_name {
  default = "RG_NO-PROD_AKS_OTHER_ODB"
}

variable resource_group_name {
  default = "RG_NO-PROD_AKS_ODB"
}

variable appgateway_resource_group_name {
  default = "RG_COMMON_NO_PROD_ODB"
}


variable appgateway_network_name {
    default="common-odb-app-gateway-vnet-haxsx"
}

variable node_resource_group_name {
  default = "RG_NO-PROD_AKS_NODES_ODB"
}

variable location {
  default = "France Central"
}

variable pod_identities {
  default = {dev-odb-account-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-account-kv-dev" } ,
             dev-odb-account-mgt-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-keyvault-dev" } , 
             dev-odb-transaction-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-tran-kv-dev" } ,
             dev-odb-profile-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-prf-kv-dev" } ,
             dev-odb-payment-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-pay-kv-dev" } ,
             dev-odb-pfm-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-pfm-kv-dev" } ,
             dev-odb-credit-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-cred-kv-dev" } ,
             dev-odb-aggregation-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-aggr-kv-dev" } ,
             dev-odb-subscription-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-subs-kv-dev" } ,
             dev-odb-notification-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-noti-kv-dev" } ,
             dev-odb-cdp-id-devon = { resource_group :"RG_DEV_APP_ODB", name :  "odb-cdp-kv-dev" } ,
             
             
             qa-odb-account-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-acc-jqaxl"},
             qa-odb-account-mgt-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-amgt-jqaxl"}, 
             qa-odb-transaction-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-tran-jqaxl"},
             qa-odb-profile-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-prfl-jqaxl"},
             qa-odb-payment-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-paym-jqaxl"},
             qa-odb-pfm-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-pfm-jqaxl"},
             qa-odb-credit-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-crdt-jqaxl"},
             qa-odb-aggregation-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-aggr-jqaxl"},
             qa-odb-subscription-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-subs-jqaxl"},
             qa-odb-notification-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-noti-jqaxl"},
             qa-odb-cdp-id-jqaxl = { resource_group :"RG_QA_LIN_ODB", name : "qa-odb-kvl-cdp-jqaxl"},
             
             pprd-odb-account-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-acco-hmzsm"},
             pprd-odb-account-mgt-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-acmg-hmzsm"}, 
             pprd-odb-transaction-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-tran-hmzsm"},
             pprd-odb-profile-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-prf-hmzsm"},
             pprd-odb-payment-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-pmt-hmzsm"},
             pprd-odb-pfm-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-pfm-hmzsm"},
             pprd-odb-credit-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-crd-hmzsm"},
             pprd-odb-aggregation-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-aggr-hmzsm"},
             pprd-odb-subscription-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-subs-hmzsm"},
             pprd-odb-notification-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-noti-hmzsm"},
             pprd-odb-cdp-id-hmzsm = { resource_group :"RG_PREPROD_APP_ODB", name :  "pprd-odb-kv-cdp-hmzsm" }} 
        }

variable log_analytics_workspace_name {
  default = "no-prod-odb-aks-log-analytic-devon"
}

variable ssh_public_key {
  default = "pki/odbaks.pub"
}

# refer https://azure.microsoft.com/global-infrastructure/services/?products=monitor for log analytics available regions
variable log_analytics_workspace_location {
  default = "westeurope"
}

# refer https://azure.microsoft.com/pricing/details/monitor/ for log analytics pricing 
variable log_analytics_workspace_sku {
  default = "PerGB2018"
}

variable kubeconfig {
  default = "~/.kube/config"
}

variable pool_network_name {
  default     = "no-prod-odb-aks-vnet-devon"
}


variable pool_subnet_name {
  default     = "no-prod-odb-aks-subnet-devon"
}

variable app_gateway_vnet_name {
  default     = "no-prod-odb-appgateway-subnet-devon"
}


variable app_gateway_public_ip {
  default     = "no-prod-odb-appgateway-ip-devon"
}

variable app_gateway_name {
  default     = "no-prod-odb-appgateway-devon"
}

variable app_gateway_identity {
  default     = "no-prod-odb-appgateway-id-devon"
}
