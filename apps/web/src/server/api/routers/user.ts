import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";

export type DummyUser = { id: string; name: string };

const DUMMY_USERS: DummyUser[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Carol" },
  { id: "4", name: "David" },
  { id: "5", name: "Eve" },
];

export const userRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.undefined())
    .query(() => {
      return DUMMY_USERS;
    }),
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.user.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  ),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.user.findUnique({ where: { id: input.id } })
    ),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db.user.update({
        where: { id: input.id },
        data: { name: input.name },
      })
    ),

  /**
   * changePassword: verify current, then set new password
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword:   z.string().min(1, "Current password is required"),
        newPassword:       z.string()
          .min(6, "Must be at least 6 characters")
          .regex(/[a-z]/, "Must include a lowercase letter")
          .regex(/[A-Z]/, "Must include an uppercase letter")
          .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
        confirmPassword:   z.string().min(1, "Please confirm your new password"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // zod will catch mismatches & length/pattern failures first
      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Passwords do not match" });
      }

      // fetch the user’s email from Supabase Auth
      const userId = ctx.session.user.id;
      const { data: userInfo, error: getErr } =
        await supabaseAdmin.auth.admin.getUserById(userId);
      if (getErr || !userInfo?.user.email) {
        throw new TRPCError({
          code:    "NOT_FOUND",
          message: "Could not look up your user record",
        });
      }
      const email = userInfo.user.email;

      // verify current password
      const { data: verify, error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({
          email,
          password: input.currentPassword,
        });
      if (signInError || !verify.session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      }

      // set new password via Admin API
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: input.newPassword,
      });
      if (updateError) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: updateError.message });
      }

      return { success: true };
    }),

});
