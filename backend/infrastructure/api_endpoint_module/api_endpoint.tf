terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}
 variable "gateway_root_resource_id" {
   type = string
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
 resource "aws_api_gateway_resource" "resource" {
  parent_id   = var.gateway_root_resource_id
  path_part   = var.route
  rest_api_id = var.gateway_id
}
resource "aws_api_gateway_method" "method" {
  authorization = var.auth_type
  http_method   = var.method
  resource_id   = aws_api_gateway_resource.resource.id
  rest_api_id   = var.gateway_id
  authorizer_id = var.authorizer_id
}
resource "aws_api_gateway_method" "options_method" {
    rest_api_id   = var.gateway_id
    resource_id   = aws_api_gateway_resource.resource.id
    http_method   = "OPTIONS"
    authorization = "NONE"
}
resource "aws_api_gateway_method_response" "options_200" {
    rest_api_id   = var.gateway_id
    resource_id   = aws_api_gateway_resource.resource.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = "200"
    response_models ={
        "application/json" = "Empty"
    }
    response_parameters= {
        "method.response.header.Access-Control-Allow-Headers" = true,
        "method.response.header.Access-Control-Allow-Methods" = true,
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.options_method]
}
resource "aws_api_gateway_method_response" "cors_400" {
  rest_api_id         = var.gateway_id
  response_type       = "DEFAULT_4XX"
  http_method = "OPTIONS"
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'OPTIONS'"
  }
}
resource "aws_api_gateway_gateway_response" "cors_500" {
  rest_api_id         = var.gateway_id
  response_type       = "DEFAULT_5XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'OPTIONS'"
  }
}
resource "aws_api_gateway_integration" "options_integration" {
    rest_api_id   = var.gateway_id
    resource_id   = aws_api_gateway_resource.resource.id
    http_method   = aws_api_gateway_method.options_method.http_method
    type          = "MOCK"
    depends_on = [aws_api_gateway_method.options_method]
}
resource "aws_api_gateway_integration_response" "options_integration_response" {
    rest_api_id   = var.gateway_id
    resource_id   = aws_api_gateway_resource.resource.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = aws_api_gateway_method_response.options_200.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'",
        "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'",
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [aws_api_gateway_method_response.options_200]
}
resource "aws_api_gateway_integration_response" "options_integration_response" {
    rest_api_id   = var.gateway_id
    resource_id   = aws_api_gateway_resource.resource.id
    http_method   = aws_api_gateway_method.options_method.http_method
    status_code   = aws_api_gateway_method_response.cors_400.status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'",
        "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'",
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = [aws_api_gateway_method_response.options_200]
}
resource "aws_api_gateway_integration" "integration" {
  http_method = aws_api_gateway_method.method.http_method
  resource_id = aws_api_gateway_resource.resource.id
  rest_api_id = var.gateway_id
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arn
}
resource "aws_lambda_permission" "api_gateway_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway_${var.route}"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.gateway_id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.resource.path}"
}
resource "aws_api_gateway_method_response" "cors_method_response_200" {
  resource_id = aws_api_gateway_resource.resource.id
  rest_api_id = var.gateway_id
    http_method   = "${aws_api_gateway_method.method.http_method}"
    status_code   = "200"
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
    }
    depends_on = [aws_api_gateway_method.method]
}