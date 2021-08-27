


resource "azurerm_user_assigned_identity" "app_gateway_id" {
  resource_group_name = var.resource_group_name
  location            = var.location
  name                = var.app_gateway_identity 
}

resource "azurerm_key_vault_access_policy" "access_policy" {
  key_vault_id = data.azurerm_key_vault.certificate_keyvault.id
  tenant_id    = data.azurerm_subscription.current.tenant_id
  object_id    = azurerm_user_assigned_identity.app_gateway_id.principal_id

  key_permissions = [
    "get", "list"
  ]

  secret_permissions = [
    "get", "list"
  ]

  storage_permissions = [
    "get", "list"
  ]

  certificate_permissions = [
    "get", "list"
  ]

}

resource "azurerm_virtual_network" "app_gateway_network" {
  name                = var.appgateway_network_name
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = ["${var.network_cidr}"]
}

resource "azurerm_subnet" "app_gateway_subnet" {
  name                 = var.app_gateway_vnet_name 
  resource_group_name = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.app_gateway_network.name
  address_prefixes     = ["${var.subnet_cidr}"]
}

resource "azurerm_public_ip" "appgateway_ip" {
  name                = var.app_gateway_public_ip
  resource_group_name = var.resource_group_name
  location            = var.location
  sku= "Standard"
  allocation_method   = "Static"
}


resource "azurerm_dns_a_record" "dns_a_record" {

  provider            = azurerm.prod
  name                = "aks-api-gateway"
  zone_name           = "onbadi.com"
  resource_group_name = "rg_prod_odb_hub"
  ttl                 = 300
  records             = [azurerm_public_ip.appgateway_ip.ip_address]
}


#&nbsp;since these variables are re-used - a locals block makes this more maintainable
locals {
  backend_address_pool_name      = "${azurerm_virtual_network.app_gateway_network.name}-beap"
  frontend_port_name             = "${azurerm_virtual_network.app_gateway_network.name}-feport"
  frontend_ip_configuration_name = "${azurerm_virtual_network.app_gateway_network.name}-feip"
  http_setting_name              = "${azurerm_virtual_network.app_gateway_network.name}-be-htst"
  listener_name                  = "${azurerm_virtual_network.app_gateway_network.name}-httplstn"
  request_routing_rule_name      = "${azurerm_virtual_network.app_gateway_network.name}-rqrt"
  redirect_configuration_name    = "${azurerm_virtual_network.app_gateway_network.name}-rdrcfg"
  ssl_certificate_name    = "ssl-certificate"
}

resource "azurerm_application_gateway" "app_gateway" {
  depends_on = [azurerm_key_vault_access_policy.access_policy]
  name                = var.app_gateway_name 
  resource_group_name = var.resource_group_name
  location            = var.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }
 lifecycle {
    ignore_changes = [
      request_routing_rule, probe, tags, backend_address_pool, backend_http_settings, http_listener
    ]
  }
 
  identity {
    type = "UserAssigned"
    ## We use replace because the id in the resource group make inconsistency for diff
    identity_ids = [replace(azurerm_user_assigned_identity.app_gateway_id.id, "resourceGroups", "resourceGroups")]
  }

  ssl_certificate {
    name                = local.ssl_certificate_name
    key_vault_secret_id = data.azurerm_key_vault_certificate.certificate_secret_id.secret_id
  }

  gateway_ip_configuration {
    name      = "my-gateway-ip-configuration"
    subnet_id = azurerm_subnet.app_gateway_subnet.id
  }

  frontend_port {
    name = local.frontend_port_name
    port = 80
  }

  frontend_ip_configuration {
    name                 = local.frontend_ip_configuration_name
    public_ip_address_id = azurerm_public_ip.appgateway_ip.id
  }

  backend_address_pool {
    name = local.backend_address_pool_name
  }

  backend_http_settings {
    name                  = local.http_setting_name
    cookie_based_affinity = "Disabled"
    path                  = "/path1/"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }

  http_listener {
    name                           = local.listener_name
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = local.request_routing_rule_name
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name
    backend_address_pool_name  = local.backend_address_pool_name
    backend_http_settings_name = local.http_setting_name
  }
}