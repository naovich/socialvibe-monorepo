import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
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

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 SocialVibe Backend running on http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
