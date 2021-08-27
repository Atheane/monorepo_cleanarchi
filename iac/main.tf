
data "azurerm_subscription" "current" {
}
data "azurerm_virtual_network" "app_gateway_network" {
  name                = var.appgateway_network_name
  resource_group_name = var.appgateway_resource_group_name
}
resource "azurerm_resource_group" "k8s_cluster_rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_resource_group" "k8s_other_cluster_rg" {
  name     = var.others_resource_group_name
  location = var.location
}

resource "random_id" "log_analytics_workspace_name_suffix" {
  byte_length = 8
}

resource "azurerm_log_analytics_workspace" "test" {
  # The WorkSpace name has to be unique across the whole of azure, not just the current subscription/tenant.
  name                = "${var.log_analytics_workspace_name}-${random_id.log_analytics_workspace_name_suffix.dec}"
  location            = var.log_analytics_workspace_location
  resource_group_name = azurerm_resource_group.k8s_other_cluster_rg.name
  sku                 = var.log_analytics_workspace_sku
}

resource "azurerm_log_analytics_solution" "test" {
  solution_name         = "ContainerInsights"
  location              = azurerm_log_analytics_workspace.test.location
  resource_group_name   = azurerm_resource_group.k8s_other_cluster_rg.name
  workspace_resource_id = azurerm_log_analytics_workspace.test.id
  workspace_name        = azurerm_log_analytics_workspace.test.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/ContainerInsights"
  }
}


resource "azurerm_virtual_network" "pool-network" {
  name                = var.pool_network_name
  address_space       = ["10.0.0.0/16"]
  resource_group_name     = azurerm_resource_group.k8s_cluster_rg.name
  location = var.location
}

resource "azurerm_subnet" "pool-network-subnet" {
  name                 = var.pool_subnet_name
  resource_group_name  = azurerm_resource_group.k8s_cluster_rg.name
  virtual_network_name = azurerm_virtual_network.pool-network.name
  address_prefixes     = ["10.0.0.0/20"] 
}

data "azurerm_virtual_network" "pool-network" {
  name                = azurerm_virtual_network.pool-network.name
  resource_group_name = azurerm_resource_group.k8s_cluster_rg.name
}

resource "azurerm_kubernetes_cluster" "k8s_cluster" {
  name                = var.cluster_name
  location            = azurerm_resource_group.k8s_cluster_rg.location
  resource_group_name = azurerm_resource_group.k8s_cluster_rg.name
  node_resource_group = var.node_resource_group_name
  dns_prefix          = var.dns_prefix


  linux_profile {
    admin_username = "ubuntu"
    ssh_key {
      key_data = file(var.ssh_public_key)
    }
  }


  default_node_pool {
    name       = var.pool_name
    node_count = var.agent_count
    vm_size    = "Standard_D2_v2"
    vnet_subnet_id  = "${azurerm_virtual_network.pool-network.id}/subnets/${azurerm_subnet.pool-network-subnet.name}"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"

    #vnet_id         = data.azurerm_virtual_network.vpn.id
    #nodes_subnet_id = data.azurerm_virtual_network.vpn.subnet_ids[0]
    service_cidr       = "10.1.0.0/16"
    dns_service_ip     = "10.1.0.10"
    docker_bridge_cidr = "172.17.0.1/16"
    outbound_type      = "loadBalancer"
    load_balancer_sku  = "Standard"
  }

  role_based_access_control {
    enabled = true
    azure_active_directory {
              admin_group_object_ids = [] 
              managed                = true 
       #       tenant_id              = "1cbcfc5b-bfc4-46cf-9dd1-b61140309b99" 
     }
  }

  addon_profile {
    kube_dashboard {
      enabled = false
    }

    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.test.id
    }
  }

  tags = {
    Environment = "Development"
  }
}

### Cluster Identity permissions on Resource groups
data "azurerm_resource_group" "k8s_node_rg" {
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster]
  name       = azurerm_kubernetes_cluster.k8s_cluster.node_resource_group
}

resource "azurerm_role_assignment" "Managed_Identity_Operator_cluster" {
  scope                = azurerm_resource_group.k8s_cluster_rg.id
  role_definition_name = "Managed Identity Operator"
  principal_id         = azurerm_kubernetes_cluster.k8s_cluster.identity[0].principal_id
}

resource "azurerm_role_assignment" "Managed_Identity_Operator_nodes" {
  scope = data.azurerm_resource_group.k8s_node_rg.id

  role_definition_name = "Managed Identity Operator"
  principal_id         = azurerm_kubernetes_cluster.k8s_cluster.identity[0].principal_id
}

resource "azurerm_role_assignment" "Virtual_Machine_Contributor_nodes" {
  scope = data.azurerm_resource_group.k8s_node_rg.id

  role_definition_name = "Virtual Machine Contributor"
  principal_id         = azurerm_kubernetes_cluster.k8s_cluster.identity[0].principal_id
}


### Pod Identity permissions on KeyVault
resource "azurerm_user_assigned_identity" "identity" {
  for_each = var.pod_identities 
  resource_group_name = azurerm_resource_group.k8s_cluster_rg.name
  location            = azurerm_resource_group.k8s_cluster_rg.location
  name = each.key
}

module "keyvault" {
    depends_on = [azurerm_user_assigned_identity.identity]

    for_each = var.pod_identities 
    source              = "./keyvault"
    identity_name = each.key
    keyvault_name = each.value.name
    keyvault_ressource_group = each.value.resource_group
    ressource_group_name = azurerm_resource_group.k8s_cluster_rg.name
 
}
/*
module "appgateway" {
    source              = "./appgateway"
    resource_group_name = azurerm_resource_group.k8s_cluster_rg.name
    network_cidr = "10.2.0.0/16"
    subnet_cidr = "10.2.1.0/24"
    appgateway_network_name = var.appgateway_network_name
    location = var.location
    pool_subnet_name = var.pool_subnet_name
    app_gateway_vnet_name = var.app_gateway_vnet_name
    app_gateway_public_ip = var.app_gateway_public_ip
    app_gateway_name = var.app_gateway_name
    app_gateway_identity = var.app_gateway_identity
}

*/

resource "azurerm_virtual_network_peering" "appgateway_vnet_to_aks" {
  depends_on = [azurerm_virtual_network.pool-network ]
  name                      = "appgateway_vnet_to_aks"
  resource_group_name       = var.appgateway_resource_group_name
  virtual_network_name      = data.azurerm_virtual_network.app_gateway_network.name
  remote_virtual_network_id = azurerm_virtual_network.pool-network.id
}

resource "azurerm_virtual_network_peering" "aks_vnet_to_appgateway" {
  depends_on = [azurerm_virtual_network.pool-network ]
  name                      = "aks_vnet_to_appgateway"
  resource_group_name       = azurerm_resource_group.k8s_cluster_rg.name
  virtual_network_name      = var.pool_network_name
  remote_virtual_network_id = data.azurerm_virtual_network.app_gateway_network.id
}


resource "null_resource" "attachacr" {
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "az aks update  -n ${azurerm_kubernetes_cluster.k8s_cluster.name}  -g ${azurerm_kubernetes_cluster.k8s_cluster.resource_group_name} --attach-acr odbdevregistry || true"

    interpreter = ["/bin/bash", "-c"]
  }
}


resource "null_resource" "kubeconfig" {
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "az aks get-credentials --name ${azurerm_kubernetes_cluster.k8s_cluster.name} --overwrite-existing --resource-group ${azurerm_kubernetes_cluster.k8s_cluster.resource_group_name} --admin"

    interpreter = ["/bin/bash", "-c"]
  }
}


/*resource "null_resource" "agicadd_on" {
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster ]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "az aks enable-addons -n ${azurerm_kubernetes_cluster.k8s_cluster.name}  -g ${azurerm_kubernetes_cluster.k8s_cluster.resource_group_name} -a ingress-appgw --appgw-id ${module.appgateway.appgateway_id}"

    interpreter = ["/bin/bash", "-c"]
  }
}*/



resource "null_resource" "installpodidentity" {
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster]

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "./shell/2-role-for-podidentity.sh ${data.azurerm_subscription.current.subscription_id} ${azurerm_resource_group.k8s_cluster_rg.name}  ${var.cluster_name}"

    interpreter = ["/bin/bash", "-c"]
  }


  provisioner "local-exec" {
    command = "./shell/3-aad-pod-id-chart.sh"

    interpreter = ["/bin/bash", "-c"]
  }
}

resource "null_resource" "install_ingress_controller" {
  count               = var.env == "no-prod" ? 1 : 0
  depends_on = [azurerm_kubernetes_cluster.k8s_cluster]

  provisioner "local-exec" {
    command = "./shell/4-create-ingress-controller.sh"

    interpreter = ["/bin/bash", "-c"]
  }
}
resource "null_resource" "initcluster_dev" {
  count               = var.env == "no-prod" ? 1 : 0
  depends_on = [null_resource.install_ingress_controller]

  provisioner "local-exec" {
    command = "./shell/5-init-cluster.sh dev secret/startup_function_secret_dev.env"

    interpreter = ["/bin/bash", "-c"]
  }
}

resource "null_resource" "initcluster_qa" {
  count               = var.env == "no-prod" ? 1 : 0
  depends_on = [null_resource.install_ingress_controller]

  provisioner "local-exec" {
    command = "./shell/5-init-cluster.sh qa secret/startup_function_secret_qa.env"

    interpreter = ["/bin/bash", "-c"]
  }
}

resource "null_resource" "initcluster_preprod" {
  count               = var.env == "no-prod" ? 1 : 0
  depends_on = [null_resource.install_ingress_controller]

  provisioner "local-exec" {
    command = "./shell/5-init-cluster.sh preprod secret/startup_function_secret_preprod.env"

    interpreter = ["/bin/bash", "-c"]
  }
}

resource "null_resource" "initcluster_prod" {
  count               = var.env == "prod" ? 1 : 0
  depends_on = [null_resource.install_ingress_controller]

  provisioner "local-exec" {
    command = "./shell/5-init-cluster.sh prod secret/startup_function_secret_prod.env"

    interpreter = ["/bin/bash", "-c"]
  }
}

