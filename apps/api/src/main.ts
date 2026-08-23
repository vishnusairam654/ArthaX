import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CONFIG } from "@arthax/config";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(CONFIG.defaultApiPort);
}
void bootstrap();
