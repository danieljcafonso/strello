import { action, cache, redirect } from "@solidjs/router";
import { db } from "./db";
import { createBoard, login, register, validateEmail, validatePassword } from "./server";
import { getSession, logoutSession, setAuthOnResponse } from "./auth";

export const getUser = cache(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === undefined) throw new Error("User not found");
    const user = await db.account.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return { id: user.id, email: user.email };
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateEmail(email) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(email, password)
      : login(email, password));
    await setAuthOnResponse(user.id);
  } catch (err) {
    return err as Error;
  }
  return redirect("/");
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return redirect("/login");
});

export const getBoards = cache(async () => {
  "use server";
  const user = await getUser();

  return db.board.findMany({
    where: {
      accountId: user.id,
    },
  });

}, 'get-boards');

export const addBoard = action(async (formData: FormData) => {
  "use server";

  const user = await getUser();
  const name = String(formData.get('name'));
  const color = String(formData.get('color'));

  const board = await db.board.create({
    data: {
      accountId: user.id,
      name,
      color
    },
  });

  return redirect(`/board/${board.id}`);
}, 'add-board');

export const deleteBoard = action(async (boardId: number) => {
  "use server";

  const user = await getUser();

  console.log('test');

  await db.board.delete({
    where: { id: boardId, accountId: user.id },
  });

  return redirect('/');
}, 'delete-board');

