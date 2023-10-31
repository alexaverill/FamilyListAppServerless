data "archive_file" "family_list_app_lambda_layer_zip"{
    type="zip"
    source_dir = "../${path.module}/src/layers/dist"
    output_path = "${path.module}/layer.zip"
}
resource "aws_lambda_layer_version" "family_list_app_lambda_layer" {
  filename   = data.archive_file.family_list_app_lambda_layer_zip.output_path
  layer_name = "family-list-app-lambda-layer"

  compatible_runtimes = ["nodejs18.x"]
}
