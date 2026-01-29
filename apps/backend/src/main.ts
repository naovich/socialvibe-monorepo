import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS pour le frontend
  app.enableCors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("SocialVibe API")
    .setDescription("SocialVibe - Social Media Platform API Documentation")
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("posts", "Posts and feed")
    .addTag("comments", "Comments management")
    .addTag("friendships", "Friendships and connections")
    .addTag("messages", "Direct messaging")
    .addTag("groups", "Groups management")
    .addTag("stories", "Stories (24h)")
    .addTag("search", "Search users and posts")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "SocialVibe API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 SocialVibe Backend running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 API Documentation available at http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
