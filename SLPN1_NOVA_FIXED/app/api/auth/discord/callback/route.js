import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appUrl, readSession, writeSession } from '../../../../lib';
export async function GET(req){
 try{
  const u=new URL(req.url), code=u.searchParams.get('code'), state=u.searchParams.get('state'); const c=await cookies();
  if(!code || !state || state!==c.get('discord_state')?.value) throw new Error('state');
  const body=new URLSearchParams({client_id:process.env.DISCORD_CLIENT_ID,client_secret:process.env.DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code,redirect_uri:`${appUrl()}/api/auth/discord/callback`});
  const tr=await fetch('https://discord.com/api/v10/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body}); if(!tr.ok) throw new Error('token'); const t=await tr.json();
  const ur=await fetch('https://discord.com/api/v10/users/@me',{headers:{Authorization:`Bearer ${t.access_token}`}}); if(!ur.ok) throw new Error('user'); const d=await ur.json();
  const old=await readSession(); const role=(process.env.DISCORD_OWNER_ID===d.id || old?.role==='owner')?'owner':'user';
  await writeSession({...(old||{}),role,discord:{id:d.id,username:d.global_name||d.username,avatar:d.avatar}}); c.delete('discord_state');
  return NextResponse.redirect(new URL('/?connected=discord',appUrl()));
 }catch{return NextResponse.redirect(new URL('/?authError=discord',appUrl()));}
}
