import {neon} from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_jM4hkIiDlH3v@ep-plain-credit-ab4o6vm4-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require")

export async function getPassword(username: string){
    const result = sql("select password from users where username = '" + username + "'");
    return result
}
