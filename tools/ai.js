export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'POST required'});
  const {action='summarize',text=''}=req.body||{};
  if(!text.trim()) return res.status(400).json({error:'Text is required'});
  // Production hook: set OPENAI_API_KEY and connect your chosen provider here.
  // This intentionally returns a deterministic demo when no provider key is configured.
  if(!process.env.OPENAI_API_KEY){
    const words=text.trim().split(/\s+/);
    const out= action==='summarize' ? words.slice(0,55).join(' ')+(words.length>55?'…':'') : `Demo mode (${action}): ${text.trim()}`;
    return res.status(200).json({mode:'demo',output:out});
  }
  try{
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5-mini',input:`Perform this utility action: ${action}\n\nUser text:\n${text}`})});
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:data.error?.message||'Provider error'});
    const output=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||'').join('')||'';
    return res.status(200).json({mode:'provider',output});
  }catch(e){return res.status(500).json({error:'AI provider request failed'});}
}
