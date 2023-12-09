terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

variable "lambda_name" {
  type = string
}
variable "source_path" {
  type=string
}
variable "output_path" {
  type = string
}
variable "lambda_layer_arn"{
  type = string
}
variable "handler_path" {
  type = string
}
data "archive_file" "lambda_zip" {

  type = "zip"
  source_dir = var.source_path
  output_path = var.output_path
#   source_dir  = "../${path.module}/src/getlists/dist"
#   output_path = "${path.module}/getlists.zip"
}
resource "aws_s3_bucket" "lambda_bucket" {
  bucket = "${var.lambda_name}-bucket"

  tags = {
    Name        = "FamilyListApp ${var.lambda_name}"
  }
}
resource "aws_s3_object" "lambda-s3_object" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "${var.lambda_name}.zip"
  source = data.archive_file.lambda_zip.output_path

  etag = filemd5(data.archive_file.lambda_zip.output_path)
}
resource "aws_lambda_function" "lambda_function" {
  function_name = var.lambda_name

  s3_bucket =  aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda-s3_object.key

  runtime = "nodejs18.x"
  handler = "${var.handler_path}"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
  layers = [var.lambda_layer_arn]
}
resource "aws_iam_role" "lambda_exec" {
  name = "${var.lambda_name}_role"

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
resource "aws_cloudwatch_log_group" "log_group" {
  name = "/aws/lambda/${aws_lambda_function.lambda_function.function_name}"

  retention_in_days = 30
}
resource "aws_iam_policy" "iam_policy_for_lambda"{
    name = "${var.lambda_name}_policy"
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
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:us-west-2:*"
            },
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Sid    = ""
                "Resource":aws_lambda_function.lambda_function.arn
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
        },
        {
          "Effect":"Allow",
          "Action":[
            "cognito-idp:AdminCreateUser"
          ]
          "Resource":"arn:aws:cognito-idp:us-west-2:219875217854:userpool/*"
        }
        ]
        }
)
}
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
}

output "lambda_arn" {
  value = aws_lambda_function.lambda_function.arn
  
}
output "lambda_function_name"{
  value = aws_lambda_function.lambda_function.function_name
}
output "invoke_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}