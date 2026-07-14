import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appUrl, readSession, writeSession } from '../../../../lib';
export async function GET(req){
 try{
  const u=new URL(req.url), code=u.searchParams.get('code'), state=u.searchParams.get('state'); const c=await cookies();
  if(!code || !state || state!==c.get('roblox_state')?.value) throw new Error('state');
  const basic=Buffer.from(`${process.env.ROBLOX_CLIENT_ID}:${process.env.ROBLOX_CLIENT_SECRET}`).toString('base64');
  const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:`${appUrl()}/api/auth/roblox/callback`});
  const tr=await fetch('https://apis.roblox.com/oauth/v1/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',Authorization:`Basic ${basic}`},body}); if(!tr.ok) throw new Error('token'); const t=await tr.json();
  const ur=await fetch('https://apis.roblox.com/oauth/v1/userinfo',{headers:{Authorization:`Bearer ${t.access_token}`}}); if(!ur.ok) throw new Error('user'); const r=await ur.json();
  const old=await readSession(); const role=(process.env.ROBLOX_OWNER_ID===r.sub || old?.role==='owner')?'owner':'user';
  await writeSession({...(old||{}),role,roblox:{id:r.sub,username:r.preferred_username||r.name,displayName:r.nickname||r.name,picture:r.picture}}); c.delete('roblox_state');
  return NextResponse.redirect(new URL('/?connected=roblox',appUrl()));
 }catch{return NextResponse.redirect(new URL('/?authError=roblox',appUrl()));}
}
