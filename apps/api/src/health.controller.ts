import { Controller, Get } from "@nestjs/common";
import { isBalanced } from "@arthax/types";

@Controller("health")
export class HealthController {
  @Get()
  health(): { status: string; service: string } {
    // Smoke-proof that shared workspace types resolve in the API target.
    void isBalanced({ postings: [] });
    return { status: "ok", service: "arthax-api" };
  }
}
