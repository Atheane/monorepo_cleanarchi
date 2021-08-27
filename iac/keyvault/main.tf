data "azurerm_user_assigned_identity" "identity" {
  name                = var.identity_name
  resource_group_name = var.ressource_group_name
}

data "azurerm_key_vault" "keyvault" {
  name                =var.keyvault_name
  resource_group_name = var.keyvault_ressource_group
}

/*resource "azurerm_key_vault_access_policy" "policy" {
  key_vault_id = data.azurerm_key_vault.keyvault.id
  //tenant_id    = data.azurerm_user_assigned_identity.identity.tenant_id
  tenant_id = "1cbcfc5b-bfc4-46cf-9dd1-b61140309b99"
  object_id    = data.azurerm_user_assigned_identity.identity.principal_id

  key_permissions = [
    "Get",
    "List"
  ]

  secret_permissions = [
    "Get",
    "List"
  ]
}*/


resource "null_resource" "kubeconfig" {

  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "az keyvault set-policy -n ${var.keyvault_name} --key-permissions get list import --secret-permissions get list --object-id ${data.azurerm_user_assigned_identity.identity.principal_id}"

    interpreter = ["/bin/bash", "-c"]
  }
}