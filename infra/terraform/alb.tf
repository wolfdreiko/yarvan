# ALB Security Group
resource "aws_security_group" "alb" {
  name_prefix = "yarvan-alb-"
  vpc_id      = aws_vpc.yarvan.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "yarvan-alb-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "yarvan" {
  name               = "yarvan-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "yarvan-alb"
  }
}

# Target Group for API Gateway
resource "aws_lb_target_group" "api_gateway" {
  name     = "yarvan-api-gateway"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.yarvan.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/api/v1/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "yarvan-api-gateway-tg"
  }
}

# ALB Listener
resource "aws_lb_listener" "yarvan" {
  load_balancer_arn = aws_lb.yarvan.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_gateway.arn
  }
}