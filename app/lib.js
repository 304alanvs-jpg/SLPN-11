import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const enc = new TextEncoder();
function key(){ return enc.encode(process.env.SESSION_SECRET || 'dev-secret-change-me-dev-secret-change-me'); }
export async function readSession(){
  const store = await cookies(); const token = store.get('slpn_session')?.value;
  if(!token) return null;
  try { return (await jwtVerify(token,key())).payload; } catch { return null; }
}
export async function writeSession(data){
  const token = await new SignJWT(data).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('30d').sign(key());
  const store = await cookies(); store.set('slpn_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*30});
}
export function appUrl(){ return process.env.APP_URL || 'http://localhost:3000'; }
export function randomState(){ return crypto.randomUUID().replaceAll('-',''); }
