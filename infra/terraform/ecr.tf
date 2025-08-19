# ECR Repositories
locals {
  services = [
    "api-gateway",
    "auth",
    "users",
    "drivers",
    "trips",
    "dispatch",
    "pricing",
    "geofence",
    "wallet",
    "compliance",
    "demand-engine",
    "ml-facial",
    "notifications"
  ]
}

resource "aws_ecr_repository" "yarvan_services" {
  for_each = toset(local.services)
  
  name                 = "yarvan/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "yarvan-${each.key}"
  }
}

# ECR Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "yarvan_services" {
  for_each = aws_ecr_repository.yarvan_services

  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Delete untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}