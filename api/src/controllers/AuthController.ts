import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";

interface LoginParams {
  email: string;
  password?: string;
  isAdmin?: boolean;
}

interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: "Admin" | "Employee";
  token: string;
}

@Route("auth")
export class AuthController extends Controller {
  @Post("login")
  @SuccessResponse("200", "Created")
  public async login(@Body() requestBody: LoginParams): Promise<UserResponse> {
    // Mock Logic
    const role =
      requestBody.email.includes("admin") || requestBody.isAdmin
        ? "Admin"
        : "Employee";

    return {
      id: 1,
      email: requestBody.email,
      name: role === "Admin" ? "Admin User" : "Employee User",
      role: role,
      token: "mock-jwt-token-" + Date.now(),
    };
  }
}
