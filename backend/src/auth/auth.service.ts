import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService
  ) {}

  async login(dto: LoginDto) {
    // For local dev without seed: simply check if password is 'password' and email matches specific admin
    // Or check DB if users exist
    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    
    // Auto-seed for testing if no user found
    if (!user && dto.email === 'admin@smarthire.com' && dto.password === 'admin123') {
       user = await this.prisma.user.create({
         data: {
           email: dto.email,
           password: 'mock_hash_password', // Mocking for demo
           role: 'Admin'
         }
       });
    }

    // Since this is a local showcase demo, we'll allow password bypass if user exists and it matches mock
    // In production, use bcrypt
    if (!user || (dto.password !== 'admin123' && dto.password !== 'password')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.audit.logAction('LOGIN', user.id, 'User', user.id, 'Successful login');

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}
