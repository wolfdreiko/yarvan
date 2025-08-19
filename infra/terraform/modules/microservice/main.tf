variable "service_name" {
  description = "Name of the microservice"
  type        = string
}

variable "cluster_id" {
  description = "ECS Cluster ID"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "alb_listener_arn" {
  description = "ALB Listener ARN"
  type        = string
}

# ECR Repository
resource "aws_ecr_repository" "service" {
  name                 = "yarvan/${var.service_name}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "service" {
  family                   = "yarvan-${var.service_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.execution_role.arn

  container_definitions = jsonencode([
    {
      name  = var.service_name
      image = "${aws_ecr_repository.service.repository_url}:latest"
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.service.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "service" {
  name            = "yarvan-${var.service_name}"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service.arn
    container_name   = var.service_name
    container_port   = 3000
  }
}

# Security Group
resource "aws_security_group" "service" {
  name_prefix = "yarvan-${var.service_name}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Target Group
resource "aws_lb_target_group" "service" {
  name     = "yarvan-${var.service_name}"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "service" {
  name              = "/ecs/yarvan-${var.service_name}"
  retention_in_days = 7
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "execution_role" {
  name = "yarvan-${var.service_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "execution_role_policy" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.service.repository_url
}

output "service_name" {
  value = aws_ecs_service.service.name
}