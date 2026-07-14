import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appUrl, randomState } from '../../../lib';
export async function GET(){
 if(!process.env.DISCORD_CLIENT_ID) return NextResponse.redirect(new URL('/?authError=discord_config',appUrl()));
 const state=randomState(); const c=await cookies(); c.set('discord_state',state,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:600,path:'/'});
 const q=new URLSearchParams({client_id:process.env.DISCORD_CLIENT_ID,response_type:'code',redirect_uri:`${appUrl()}/api/auth/discord/callback`,scope:'identify',state,prompt:'consent'});
 return NextResponse.redirect(`https://discord.com/oauth2/authorize?${q}`);
}
