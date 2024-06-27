'use server'

export const checkUser = () => {
    let test: RequestCookie | undefined = cookies().get('show_new_player_toast');
    if (test) cookies().delete('show_new_player_toast');
    return test;
  };