# RDS Subnet Group
resource "aws_db_subnet_group" "yarvan" {
  name       = "yarvan-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "yarvan-db-subnet-group"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "yarvan-rds-"
  vpc_id      = aws_vpc.yarvan.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "yarvan-rds-sg"
  }
}

# RDS Instance
resource "aws_db_instance" "yarvan" {
  identifier = "yarvan-postgres"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = "yarvan"
  username = "yarvan"
  password = random_password.db_password.result
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.yarvan.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  deletion_protection = false
  
  tags = {
    Name = "yarvan-postgres"
  }
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Store DB password in SSM
resource "aws_ssm_parameter" "db_password" {
  name  = "/yarvan/db/password"
  type  = "SecureString"
  value = random_password.db_password.result

  tags = {
    Name = "yarvan-db-password"
  }
}