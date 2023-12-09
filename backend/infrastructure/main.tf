terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}
variable "region" {
  type = string
  default = "us-west-2"
}
data "aws_caller_identity" "current" {}

locals {
    account_id = data.aws_caller_identity.current.account_id
}

module "get_list_lambda" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/getlist/dist"
  output_path = "${path.module}/getlist.zip"
  lambda_name = "get-list-lambda"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "getlist.handler"
}

module "create_items" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/createItems/dist"
  output_path = "${path.module}/createItems.zip"
  lambda_name = "create-items"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "createItems.handler"
}
module "delete_item" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/deleteItem/dist"
  output_path = "${path.module}/deleteItem.zip"
  lambda_name = "delete-item"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "deleteItem.handler"
}
module "claim_item" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/claimItems/dist"
  output_path = "${path.module}/claimItems.zip"
  lambda_name = "claim-item"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "claimItem.handler"
}
module "unclaim_item" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/unclaimItem/dist"
  output_path = "${path.module}/unclaimItem.zip"
  lambda_name = "unclaim-item"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "unclaimItem.handler"
}
module "create_event" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/createEvent/dist"
  output_path = "${path.module}/createEvent.zip"
  lambda_name = "create-event"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "createEvent.handler"
}
module "get_event" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/getEvent/dist"
  output_path = "${path.module}/getEvent.zip"
  lambda_name = "get-event"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "getEvent.handler"
}
module "get_events" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/getEvents/dist"
  output_path = "${path.module}/getEvents.zip"
  lambda_name = "get-events"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "getEvents.handler"
}
module "create_user" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/createUser/dist"
  output_path = "${path.module}/createUser.zip"
  lambda_name = "family-list-app-create-user"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "createUser.handler"
}
module "get_users" {
  source = "./lambda_module"
  source_path =  "../${path.module}/src/getUsers/dist"
  output_path = "${path.module}/getUsers.zip"
  lambda_name = "family-list-app-get-users"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "getUsers.handler"
}
#Dynamo setup
resource "aws_dynamodb_table" "lists-dynamodb-table" {
  name           = "Lists"
  billing_mode   = "PAY_PER_REQUEST"
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
    name="listIdIndex"
    hash_key = "listId"
    projection_type = "ALL"
  }
  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    range_key          = "listId"
    projection_type    = "ALL"
    #non_key_attributes = ["UserId"]
  }
  global_secondary_index {
    name               = "eventIndex"
    hash_key           = "eventId"
    range_key          = "listId"
    projection_type    = "ALL"
    #non_key_attributes = ["UserId"]
  }
  tags = {
    Name        = "listapp-list-table"

  }
}
resource "aws_dynamodb_table" "items-dynamodb-table" {
  name           = "ListItems"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "itemId"
  range_key      = "eventId"

  attribute {
    name = "itemId"
    type = "S"
  }
  attribute {
    name="userId"
    type="S"
  }
  attribute {
    name="eventId"
    type = "S"
  }
    global_secondary_index {
    name               = "userIdIndex"
    hash_key           = "userId"
    range_key          = "eventId"
    projection_type    = "ALL"
  }
  global_secondary_index {
    name               = "eventIdIndex"
    hash_key           = "eventId"
    range_key          = "itemId"
    projection_type    = "ALL"
  }
  tags = {
    Name        = "listapp-item-table"

  }
}
resource "aws_dynamodb_table" "events-dynamodb-table" {
  name           = "Events"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "eventId"
  range_key      = "name"
  attribute {
    name = "eventId"
    type = "S"
  }
  attribute {
    name="name"
    type = "S"
  }
  global_secondary_index {
    name = "eventIdIndex"
    hash_key = "eventId"
    write_capacity = 10 
    read_capacity = 10
    projection_type = "ALL"
  }
  tags = {
    Name        = "listapp-event-table"

  }
}
resource "aws_dynamodb_table" "users-dynamodb-table" {
  name           = "Users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "username"
  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name="username"
    type = "S"
  }
  global_secondary_index {
    name = "usernameIndex"
    hash_key = "username"
    write_capacity = 10 
    read_capacity = 10
    projection_type = "ALL"
  }
  tags = {
    Name        = "listapp-users-table"

  }
}
#cognito

resource "aws_cognito_user_pool" "pool" {
  name = "family_list_app_pool"
}

resource "aws_cognito_user_pool_client" "client" {
  name = "family_list_app_client"

  user_pool_id = "${aws_cognito_user_pool.pool.id}"
  explicit_auth_flows = ["USER_PASSWORD_AUTH"]
}
#api gateway
resource "aws_apigatewayv2_api" "familylistapp_gateway" {
  name          = "FamiyListAppsGateway"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "DELETE","OPTIONS"]
    allow_headers = ["content-type","authorization"]
    max_age = 300
  }
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


resource "aws_apigatewayv2_authorizer" "auth" {
  # name          = "CognitoUserPoolAuthorizer"
  # type          = "JWT"
  # rest_api_id   = aws_apigatewayv2_api.familylistapp_gateway.id
  # provider_arns = ["${aws_cognito_user_pool.pool.arn}"]
  api_id           = aws_apigatewayv2_api.familylistapp_gateway.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "authorizer"

  jwt_configuration {
     audience = [aws_cognito_user_pool_client.client.id]
    issuer   = "https://${aws_cognito_user_pool.pool.endpoint}"
  }
}
# resource "aws_api_gateway_deployment" "api_deployment" {
#   rest_api_id = aws_apigatewayv2_api.familylistapp_gateway.id
#   triggers = {
#     redeployment = "${join(",",[md5(file("api_endpoint_module/api_endpoint.tf")),md5(file("main.tf"))])}"
#   }
#   stage_description = "${join(",",[md5(file("api_endpoint_module/api_endpoint.tf")),md5(file("main.tf"))])}" #workaround to force a deploy to happen if the files change.
#   lifecycle {
#     create_before_destroy = true
#   }
#   depends_on = [  
#     module.get_lists_api,
#     module.create_items_api,
#     module.create_list_api,
#     module.create_events_api,
#      ]
# }
# resource "aws_api_gateway_stage" "dev" {
#   deployment_id = aws_api_gateway_deployment.api_deployment.id
#   rest_api_id   = aws_apigatewayv2_api.familylistapp_gateway.id
#   stage_name    = "dev"
# }

module "get_list_api" {
  permission_name = "get-list"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="get-list/{proxy+}"
  method="GET"
  lambda_arn = module.get_list_lambda.invoke_arn
  lambda_function_name = module.get_list_lambda.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}

module "create_items_api" {
  permission_name = "create-items"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="create-items"
  method="POST"
  lambda_arn = module.create_items.invoke_arn
  lambda_function_name = module.create_items.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "delete_item_api" {
  permission_name = "delete-item"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="delete-item"
  method="DELETE"
  lambda_arn = module.delete_item.invoke_arn
  lambda_function_name = module.delete_item.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "claim_item_api" {
  permission_name = "claim-items"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="claim-item"
  method="POST"
  lambda_arn = module.claim_item.invoke_arn
  lambda_function_name = module.claim_item.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "unclaim_item_api" {
  permission_name = "claim-items"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="unclaim-item"
  method="DELETE"
  lambda_arn = module.unclaim_item.invoke_arn
  lambda_function_name = module.unclaim_item.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "create_events_api" {
  permission_name = "create-events"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="create-events"
  method="POST"
  lambda_arn = module.create_event.invoke_arn
  lambda_function_name = module.create_event.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}

module "get_events_api" {
  permission_name = "get-events"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="get-events"
  method="GET"
  lambda_arn = module.get_events.invoke_arn
  lambda_function_name = module.get_events.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id =aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "get_events_proxy_api" {
  permission_name = "get-events-proxy"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="get-events/{proxy+}"
  method="GET"
  lambda_arn = module.get_events.invoke_arn
  lambda_function_name = module.get_events.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id =aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "get_event_proxy_api" {
  permission_name = "get-event-proxy"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="get-event/{proxy+}"
  method="GET"
  lambda_arn = module.get_event.invoke_arn
  lambda_function_name = module.get_event.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id =aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}
module "get_users_api" {
  permission_name = "get-users"
  source = "./api_endpoint_module"
  gateway_id=aws_apigatewayv2_api.familylistapp_gateway.id
  route="get-users"
  method="GET"
  lambda_arn = module.get_users.invoke_arn
  lambda_function_name = module.get_users.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "JWT"
  authorizer_id =aws_apigatewayv2_authorizer.auth.id
  gateway_execution_arn = aws_apigatewayv2_api.familylistapp_gateway.execution_arn
}


resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.familylistapp_gateway.name}"

  retention_in_days = 30
}
resource "aws_cloudwatch_log_group" "api_gw_stage" {
  name = "/aws/api_gw/${aws_apigatewayv2_stage.familylistapp_gateway_stage.id}/example"

  retention_in_days = 30
}