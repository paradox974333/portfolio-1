"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  endAdminSession,
  isAdmin,
  startAdminSession,
  tokenIsValid,
} from "@/lib/admin";

export async function login(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!tokenIsValid(token)) {
    redirect("/admin/comments?error=1");
  }
  await startAdminSession(token);
  redirect("/admin/comments");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin/comments");
}

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Not authorised");
  }
}

export async function approveComment(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db()`update comments set approved = true where id = ${id}`;
  revalidatePath("/admin/comments");
}

export async function unapproveComment(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db()`update comments set approved = false where id = ${id}`;
  revalidatePath("/admin/comments");
}

export async function deleteComment(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db()`delete from comments where id = ${id}`;
  revalidatePath("/admin/comments");
}
