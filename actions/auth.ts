"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(data: { email?: string; password?: string }) {
  if (!data.email || !data.password) {
    return { error: "Email and password are required." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.email.split("@")[0], // Default name
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to create user." };
  }
}
