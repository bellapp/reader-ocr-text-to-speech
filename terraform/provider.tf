provider "aws" {
  region = var.aws_region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.46.0"
    }
  }
  
  backend "s3" {
    bucket = "ocr-reader-bucket"
    key    = "ocr-app/terraform.tfstate"
    region = "us-east-1"
  }
}