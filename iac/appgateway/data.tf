data "azurerm_key_vault_certificate" "certificate_secret_id" {
  name         = "onbadi"
  key_vault_id = data.azurerm_key_vault.certificate_keyvault.id
}

data "azurerm_key_vault" "certificate_keyvault" {
  name                = "odb-keyvault-dev"
  resource_group_name = "RG_DEV_APP_ODB"
}


data "azurerm_subscription" "current" {}