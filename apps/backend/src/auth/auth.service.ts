import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto, LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.username}`,
      },
    });

    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: process.env.JWT_SECRET || "secret",
    });

    return { access_token: token };
  }
}
