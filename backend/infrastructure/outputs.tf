output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.familylistapp_gateway_stage.invoke_url
}