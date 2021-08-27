provider "azurerm" {
  # The "feature" block is required for AzureRM provider 2.x. 
  # If you are using version 1.x, the "features" block is not allowed.
  version = "~>2.36"
  features {}
}

provider "azuread" {
  # Whilst version is optional, we /strongly recommend/ using it to pin the version of the Provider being used
  version = "=0.10.0"

  use_msi = true
}

provider "azurerm" {
  alias = "prod"
  features {}
  subscription_id = "4b916ecb-57eb-434b-9e0c-50aca8346e7d"
}

