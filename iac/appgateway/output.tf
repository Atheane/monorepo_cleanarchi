output appgateway_id {
  value = azurerm_application_gateway.app_gateway.id
}


output network_id{
value = azurerm_virtual_network.app_gateway_network.id
}