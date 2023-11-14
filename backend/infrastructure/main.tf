terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

module "create_list_lambda" {
  source = "./lambda_module"
  source_path = "../${path.module}/src/createlist/dist"
  output_path = "${path.module}/createllist.zip"
  lambda_name = "create-list"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "handler.handler"
}
module "get_list_lambda" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/getlists/dist"
  output_path = "${path.module}/getlists.zip"
  lambda_name = "get-lists"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "handler.handler"
}

module "create_items" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/createItems/dist"
  output_path = "${path.module}/createItems.zip"
  lambda_name = "create-items"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "createItems.handler"
}

#Dynamo setup
resource "aws_dynamodb_table" "lists-dynamodb-table" {
  name           = "Lists"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "listId"
  range_key      = "eventId"

  attribute {
    name = "listId"
    type = "S"
  }
  attribute {
    name = "eventId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }


  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    range_key          = "listId"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
    #non_key_attributes = ["UserId"]
  }
  global_secondary_index {
    name               = "eventIndex"
    hash_key           = "eventId"
    range_key          = "listId"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
    #non_key_attributes = ["UserId"]
  }
  tags = {
    Name        = "listapp-list-table"

  }
}
resource "aws_dynamodb_table" "items-dynamodb-table" {
  name           = "ListItems"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "itemId"
  range_key      = "listId"

  attribute {
    name = "itemId"
    type = "N"
  }
  attribute {
    name = "listId"
    type = "S"
  }



  global_secondary_index {
    name               = "listIdIndex"
    hash_key           = "itemId"
    range_key          = "listId"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
  }
  tags = {
    Name        = "listapp-item-table"

  }
}
resource "aws_dynamodb_table" "events-dynamodb-table" {
  name           = "events"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "eventId"

  attribute {
    name = "eventId"
    type = "S"
  }
  tags = {
    Name        = "listapp-event-table"

  }
}
#api gateway
resource "aws_apigatewayv2_api" "familylistapp_gateway" {
  name          = "FamiyListAppsGateway"
  protocol_type = "HTTP"
}
resource "aws_apigatewayv2_stage" "familylistapp_gateway_stage" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  name        = "familylistapp_gateway_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "create_list_integration" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  integration_uri    = module.create_list_lambda.lambda_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "create_list_route" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  route_key = "POST /create-list"
  target    = "integrations/${aws_apigatewayv2_integration.create_list_integration.id}"
}
resource "aws_apigatewayv2_integration" "get_lists_integration" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  integration_uri    = module.get_list_lambda.lambda_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "get_lists_route" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  route_key = "GET /get-lists/{eventId}"
  target    = "integrations/${aws_apigatewayv2_integration.get_lists_integration.id}"
}
resource "aws_apigatewayv2_integration" "creat_items_integration" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  integration_uri    = module.create_items.lambda_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "create_items_route" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  route_key = "POST /create-items"
  target    = "integrations/${aws_apigatewayv2_integration.creat_items_integration.id}"
}
resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.familylistapp_gateway.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.create_list_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.familylistapp_gateway.execution_arn}/*/*"
}
resource "aws_lambda_permission" "api_gw_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.get_list_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.familylistapp_gateway.execution_arn}/*/*"
}
resource "aws_lambda_permission" "api_gw_create_list" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.create_items.lambda_function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.familylistapp_gateway.execution_arn}/*/*"
}