terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}
 variable "gateway_id"{
    type=string
 }
 variable "route" {
   type=string
 }
 variable "method" {
   type = string
 }
 variable "lambda_arn" {
   type = string
 }
 variable "lambda_function_name"{
    type = string
 }
 variable "region"{
    type = string
 }
 variable "account_id" {
   type = string
 }
 variable "auth_type"{
  type = string
 }
 variable "authorizer_id" {
   type = string
  }
  variable "gateway_execution_arn"{
    type = string
  }
  variable "permission_name"{
    type = string
  }
  resource "aws_apigatewayv2_integration" "gateway_integration" {
  api_id = var.gateway_id

  integration_uri    = var.lambda_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "route" {
  api_id = var.gateway_id

  route_key = "${var.method} /${var.route}"
  authorizer_id = var.authorizer_id
  authorization_type = var.auth_type
  target    = "integrations/${aws_apigatewayv2_integration.gateway_integration.id}"
}
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway_${var.permission_name}_http"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.gateway_execution_arn}/*/*"
}
