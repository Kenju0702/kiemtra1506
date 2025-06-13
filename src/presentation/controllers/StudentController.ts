import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "src/shared/auth/decorators/roles.decorator";
import { RolesGuard } from "src/shared/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/shared/auth/jwt-auth.guard";
import { UserRole } from "src/shared/enum/enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@Controller(UserRole.STUDENT)
export class StudentController {
  @Get('StudentOnlyUse')
  getStudentData() {
    return 'Student data only';
  }
}