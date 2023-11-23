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
module "create_list_lambda" {
  source = "./lambda_module"
  source_path = "../${path.module}/src/createlist/dist"
  output_path = "${path.module}/createllist.zip"
  lambda_name = "create-list"
  lambda_layer_arn = aws_lambda_layer_version.family_list_app_lambda_layer.arn
  handler_path = "handler.handler"
}
module "get_lists_lambda" {
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
#Dynamo setup
resource "aws_dynamodb_table" "lists-dynamodb-table" {
  name           = "Lists"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 21
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
    write_capacity     = 10
    read_capacity      = 10
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
  name           = "Events"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
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
resource "aws_api_gateway_rest_api" "familylistapp_gateway" {
  name          = "FamiyListAppsGateway"
}

resource "aws_api_gateway_authorizer" "auth" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.familylistapp_gateway.id
  provider_arns = ["${aws_cognito_user_pool.pool.arn}"]
}
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.familylistapp_gateway.id
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [  
    module.get_lists_api,
    module.create_items_api,
    module.create_list_api,
    module.create_events_api,
     ]
}
resource "aws_api_gateway_stage" "dev" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.familylistapp_gateway.id
  stage_name    = "dev"
}

module "get_lists_api" {
  source = "./api_endpoint_module"
  gateway_root_resource_id=aws_api_gateway_rest_api.familylistapp_gateway.root_resource_id
  gateway_id=aws_api_gateway_rest_api.familylistapp_gateway.id
  route="get-list"
  method="GET"
  lambda_arn = module.get_lists_lambda.invoke_arn
  lambda_function_name = module.get_lists_lambda.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id
}

module "create_list_api" {
  source = "./api_endpoint_module"
  gateway_root_resource_id=aws_api_gateway_rest_api.familylistapp_gateway.root_resource_id
  gateway_id=aws_api_gateway_rest_api.familylistapp_gateway.id
  route="create-list"
  method="POST"
  lambda_arn = module.create_list_lambda.invoke_arn
  lambda_function_name = module.create_list_lambda.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id
}
module "create_items_api" {
  source = "./api_endpoint_module"
  gateway_root_resource_id=aws_api_gateway_rest_api.familylistapp_gateway.root_resource_id
  gateway_id=aws_api_gateway_rest_api.familylistapp_gateway.id
  route="create-items"
  method="POST"
  lambda_arn = module.create_items.invoke_arn
  lambda_function_name = module.create_items.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id
}
module "create_events_api" {
  source = "./api_endpoint_module"
  gateway_root_resource_id=aws_api_gateway_rest_api.familylistapp_gateway.root_resource_id
  gateway_id=aws_api_gateway_rest_api.familylistapp_gateway.id
  route="create-events"
  method="POST"
  lambda_arn = module.create_event.invoke_arn
  lambda_function_name = module.create_event.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id
}
module "get_events_api" {
  source = "./api_endpoint_module"
  gateway_root_resource_id=aws_api_gateway_rest_api.familylistapp_gateway.root_resource_id
  gateway_id=aws_api_gateway_rest_api.familylistapp_gateway.id
  route="get-event"
  method="GET"
  lambda_arn = module.get_event.invoke_arn
  lambda_function_name = module.get_event.lambda_function_name
  region = var.region
  account_id = local.account_id
  auth_type = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id
}


resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_api_gateway_rest_api.familylistapp_gateway.name}"

  retention_in_days = 30
}
resource "aws_cloudwatch_log_group" "api_gw_stage" {
  name = "/aws/api_gw/${aws_api_gateway_stage.dev.id}/example"

  retention_in_days = 30
}