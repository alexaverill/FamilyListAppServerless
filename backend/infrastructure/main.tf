terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}
data "archive_file" "lambda_create_list" {
  type = "zip"

  source_dir  = "../${path.module}/src/createlist/dist"
  output_path = "${path.module}/createllist.zip"
}
data "archive_file" "lambda_get_lists" {
  type = "zip"

  source_dir  = "../${path.module}/src/getlists/dist"
  output_path = "${path.module}/getlists.zip"
}
resource "aws_s3_bucket" "lambda-create-list-bucket" {
  bucket = "lamda-create-list"

  tags = {
    Name        = "FamilyListApp lambda bucket"
  }
}
resource "aws_s3_bucket" "lambda-get-lists-bucket" {
  bucket = "lamda-get-lists"

  tags = {
    Name        = "FamilyListApp get lists lambda bucket"
  }
}
resource "aws_s3_object" "lambda-create_list" {
  bucket = aws_s3_bucket.lambda-create-list-bucket.id

  key    = "createllist.zip"
  source = data.archive_file.lambda_create_list.output_path

  etag = filemd5(data.archive_file.lambda_create_list.output_path)
}
resource "aws_s3_object" "lambda-get-lists" {
  bucket = aws_s3_bucket.lambda-get-lists-bucket.id

  key    = "getlists.zip"
  source = data.archive_file.lambda_get_lists.output_path

  etag = filemd5(data.archive_file.lambda_get_lists.output_path)
}
resource "aws_lambda_function" "create_list" {
  function_name = "CreateList"

  s3_bucket =  aws_s3_bucket.lambda-create-list-bucket.id
  s3_key    = aws_s3_object.lambda-create_list.key

  runtime = "nodejs18.x"
  handler = "handler.handler"

  source_code_hash = data.archive_file.lambda_create_list.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}
resource "aws_lambda_function" "get_lists" {
  function_name = "GetLists"

  s3_bucket =  aws_s3_bucket.lambda-get-lists-bucket.id
  s3_key    = aws_s3_object.lambda-get-lists.key

  runtime = "nodejs18.x"
  handler = "handler.handler"

  source_code_hash = data.archive_file.lambda_create_list.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}
resource "aws_cloudwatch_log_group" "create_list_log_group" {
  name = "/aws/lambda/${aws_lambda_function.create_list.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}
resource "aws_iam_policy" "iam_policy_for_lambda"{
    name = "generic_lambda_policy"
    path = "/"
    policy = jsonencode({
        "Version": "2012-10-17",
        "Statement": [
            {
            "Sid": "Stmt1696027930901",
            "Action": [
                "dynamodb:BatchGetItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:us-west-2:*"
            },
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Sid    = ""
                "Resource":aws_lambda_function.create_list.arn
            },
            
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "*"
        }
        ]
        }
)
}
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
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

  integration_uri    = aws_lambda_function.create_list.invoke_arn
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

  integration_uri    = aws_lambda_function.get_lists.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "get_lists_route" {
  api_id = aws_apigatewayv2_api.familylistapp_gateway.id

  route_key = "GET /get-lists"
  target    = "integrations/${aws_apigatewayv2_integration.get_lists_integration.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.familylistapp_gateway.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_list.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.familylistapp_gateway.execution_arn}/*/*"
}
resource "aws_lambda_permission" "api_gw_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_lists.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.familylistapp_gateway.execution_arn}/*/*"
}