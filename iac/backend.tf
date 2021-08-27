terraform {
  backend "azurerm" {
    resource_group_name  = "RG_TERRAFORM_ODB"
    storage_account_name = "terraformodb"
    container_name       = "odb-aks"
    key                  = "terraform.tfstate"
  }
}
