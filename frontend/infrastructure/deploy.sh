# Build React APP

# Run Terraform to build infrastructure

# Sync react app to S3 Bucket
aws s3 sync ../familylistapp/build s3://familylistapp.com
# sync TF state to S3?
