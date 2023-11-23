output "base_url" {
  description = "Base URL for API Gateway"

  value = aws_api_gateway_stage.dev.invoke_url
}