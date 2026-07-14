import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appUrl, randomState } from '../../../lib';
export async function GET(){
 if(!process.env.ROBLOX_CLIENT_ID) return NextResponse.redirect(new URL('/?authError=roblox_config',appUrl()));
 const state=randomState(); const c=await cookies(); c.set('roblox_state',state,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:600,path:'/'});
 const q=new URLSearchParams({client_id:process.env.ROBLOX_CLIENT_ID,redirect_uri:`${appUrl()}/api/auth/roblox/callback`,scope:'openid profile',response_type:'code',state});
 return NextResponse.redirect(`https://apis.roblox.com/oauth/v1/authorize?${q}`);
}
