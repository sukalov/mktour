'use server'

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const checkUser = async () => {
    let test: RequestCookie | undefined = cookies().get('show_new_player_toast');
    if (test) cookies().delete('show_new_player_toast');
    return test;
  };