# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "yarvan" {
  name       = "yarvan-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

# ElastiCache Security Group
resource "aws_security_group" "elasticache" {
  name_prefix = "yarvan-cache-"
  vpc_id      = aws_vpc.yarvan.id

  ingress {
    from_port       = 6379
    to_port         = 6379
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
    Name = "yarvan-cache-sg"
  }
}

# ElastiCache Redis
resource "aws_elasticache_replication_group" "yarvan" {
  replication_group_id       = "yarvan-redis"
  description                = "Redis cluster for Yarvan"
  
  node_type                  = var.redis_node_type
  port                       = 6379
  parameter_group_name       = "default.redis7"
  
  num_cache_clusters         = 1
  
  subnet_group_name          = aws_elasticache_subnet_group.yarvan.name
  security_group_ids         = [aws_security_group.elasticache.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  tags = {
    Name = "yarvan-redis"
  }
}