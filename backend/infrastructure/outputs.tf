output "base_url" {
  description = "Base URL for API Gateway"

  value = aws_apigatewayv2_stage.familylistapp_gateway_stage.invoke_url
}
output "CognitoPool"{
  description = "Cognito Pool ID"
  value = aws_cognito_user_pool.pool.id
}
output "CognitoClient"{
  description = "Cognito Client ID"
  value = aws_cognito_user_pool_client.client.id
}