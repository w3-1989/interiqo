/*
Future add - database transaction or a cleanup 
function that deletes the auth user if subsequent steps fail
*/
import type { Freelancer } from "../../../types/Freelancer";
import { supabase } from "../../supabaseClient";

export default async function createFreelancerAcc(
  firstName: string,
  lastName: string,
  email: string,
  specialities: string[],
  password: string,
) {
  const { data, error: errorCreateUser } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        specialities: specialities,
      },
    },
  });

  if (errorCreateUser) {
    console.log("createFreelancerAcc - Couldn't create user", errorCreateUser);
    throw errorCreateUser;
  }

  const userId = data.user!.id;

  if (!userId) {
    return console.log("user id cannot be found");
  }

  const { error: errorInsertFreelancerData } = await supabase
    .from("freelancers")
    .insert({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      specialities: specialities,
    })
    .select("id")
    .returns<Freelancer[]>();

  if (errorInsertFreelancerData) {
    console.log(
      "createFreelancerAcc - Could not insert user data",
      errorInsertFreelancerData,
    );
    throw errorInsertFreelancerData;
  } 
}
