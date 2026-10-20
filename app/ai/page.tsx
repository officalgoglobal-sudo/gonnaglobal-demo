'use client';
'use client';
import React, {useEffect,useMemo,useState} from 'react';
import Sidebar from "@/components/home/Sidebar";
import Topbar from "@/components/home/Topbar";
import "./ai-dashboard.css";
import {Activity,ArrowUpRight,BriefcaseBusiness,Check,FileText,GraduationCap,LayoutDashboard,LoaderCircle,MapPin,Search,Sparkles,Target,Upload,UserRound,WandSparkles} from 'lucide-react';
const API=(process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:8001').replace(/\/$/,'');

type Opp={
    id:string|number;
    title:string;
    organization:string;
    type:string;
    description:string;
    required_skills:string[];
    preferred_skills:string[];
    location:string;
    work_mode:string;
    eligibility:string;
    deadline:string|null;
    application_url:string;
    source?:string;
    remote?:boolean;
  };
  
type Rec=Opp&{match_score:number;matched_skills:string[];missing_skills:string[];explanation:string};
type Profile={skills:string[];interests:string[];career_goals:string[];education:string;preferred_location:string;preferred_work_mode:string};
const defaults:Profile={skills:['Python','SQL','Machine Learning'],interests:['AI','Research'],career_goals:['Machine Learning Engineer'],education:'B.Tech Information Technology',preferred_location:'Remote',preferred_work_mode:'Remote'};
async function api<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch(API+path,init);if(!r.ok){let m=`API error ${r.status}`;try{m=(await r.json()).detail||m}catch{}throw Error(m)}return r.json()}
function csv(s:string){return s.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean)}
export default function Home(){const [tab,setTab]=useState('Overview'),[profile,setProfile]=useState<Profile>(defaults),[skills,setSkills]=useState(defaults.skills.join(', ')),[interests,setInterests]=useState(defaults.interests.join(', ')),[goals,setGoals]=useState(defaults.career_goals.join(', ')),[items,setItems]=useState<Opp[]>([]),[recs,setRecs]=useState<Rec[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[message,setMessage]=useState(''),[search,setSearch]=useState(''),[kind,setKind]=useState('All'),[busy,setBusy]=useState(false),[resume,setResume]=useState(false),[dataSource,setDataSource]=useState('Loading sources…'),[demoMode,setDemoMode]=useState(false);
const load=async(p=profile)=>{setLoading(true);setError('');try{const [o,r]=await Promise.all([api<{count:number;items:Opp[];source?:string;is_demo?:boolean}>('/api/opportunities'),api<{recommendations:Rec[];source?:string;is_demo?:boolean}>('/api/recommendations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})]);setItems(o.items);setRecs(r.recommendations);setDataSource(o.source||r.source||'Source not reported');setDemoMode(Boolean(o.is_demo||r.is_demo))}catch(e){setError(e instanceof Error?e.message:'Could not reach backend')}finally{setLoading(false)}};
useEffect(()=>{try{const saved=localStorage.getItem('ggai-profile');if(saved){const p=JSON.parse(saved) as Profile;setProfile(p);setSkills(p.skills.join(', '));setInterests(p.interests.join(', '));setGoals(p.career_goals.join(', '));void load(p)}else void load()}catch{void load()}},[]);
const filtered=useMemo(()=>recs.filter(o=>(kind==='All'||o.type===kind)&&`${o.title} ${o.organization} ${o.description} ${o.required_skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())),[recs,kind,search]);

const gaps=useMemo(()=>{
  const count=new Map<string,number>();
  const currentSkills=new Set(profile.skills.map(s=>s.trim().toLowerCase()));

  for(const r of recs){
    for(const s of r.missing_skills){
      const skill=s.trim();
      const normalized=skill.toLowerCase();

      if(!skill || currentSkills.has(normalized)) continue;

      count.set(skill,(count.get(skill)||0)+1);
    }
  }

  return [...count.entries()]
    .sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))
    .slice(0,12);
},[recs,profile.skills]);

const setField=(k:keyof Profile,v:string)=>setProfile(p=>({...p,[k]:v}));
async function save(e:React.FormEvent){e.preventDefault();const p={...profile,skills:csv(skills),interests:csv(interests),career_goals:csv(goals)};if(!p.skills.length&&!p.interests.length&&!p.career_goals.length){setMessage('Add at least one skill, interest, or career goal to get recommendations.');return;}setProfile(p);localStorage.setItem('ggai-profile',JSON.stringify(p));setBusy(true);try{await load(p);setMessage('Profile saved. Recommendations refreshed.')}catch(e){setMessage(e instanceof Error?e.message:'Recommendations could not be refreshed. Your profile was saved locally.')}finally{setBusy(false)}}
const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

async function parseResume(e: React.ChangeEvent<HTMLInputElement>) {
  const f = e.target.files?.[0];
  if (!f) return;

  const fd = new FormData();
  fd.append("file", f);
  setResume(true);
  setMessage("");

  try {
    const out = await api<{
      detected_skills: string[];
      extracted_text_preview: string;
    }>("/api/resume/parse", { method: "POST", body: fd });

    const unique = [...new Set(out.detected_skills)];
    setDetectedSkills(unique);
    setSelectedSkills(unique);
    setMessage(
      `Detected ${unique.length} skills. Review and select the skills you want to save.`
    );
  } catch (e) {
    setMessage(e instanceof Error ? e.message : "Resume parsing failed");
  } finally {
    setResume(false);
    e.target.value = "";
  }
}

function saveSelectedSkills() {
  const merged = [...new Set([...csv(skills), ...selectedSkills])];
  const updatedProfile = { ...profile, skills: merged };

  setSkills(merged.join(", "));
  setProfile(updatedProfile);
  localStorage.setItem("ggai-profile", JSON.stringify(updatedProfile));

  setDetectedSkills([]);
  setSelectedSkills([]);
  setMessage("Skills saved. Click Save profile & refresh to update recommendations.");
  setTab("My Profile");
}
const nav=[['Overview',LayoutDashboard],['Opportunities',BriefcaseBusiness],['My Profile',UserRound],['Resume AI',FileText],['Skill Gaps',Target]] as const;
return <div className="ai-dashboard-shell"><Sidebar /><div className="ai-dashboard-content"><Topbar /><main className="main"><header className="top"><div><div className="eyebrow">STUDENT WORKSPACE / {tab.toUpperCase()}</div><h1>{({Overview:'Your career, with a clearer direction',Opportunities:'Opportunities matched to you','My Profile':'Build your student profile','Resume AI':'Turn your resume into a signal','Skill Gaps':'Your next skills to learn'} as Record<string,string>)[tab]}</h1><div className="sub">Find relevant opportunities and understand what to learn next.</div></div><button className="btn" onClick={()=>load()} title="Refresh"><Activity size={15}/> Refresh</button></header>
<nav className="workspace-nav" aria-label="AI workspace">
  {nav.map(([n, I]) => (
    <button
      key={n}
      type="button"
      className={`workspace-nav-item ${tab === n ? "active" : ""}`}
      onClick={() => { setTab(n); setMessage(""); }}
      aria-current={tab === n ? "page" : undefined}
    >
      <I size={16} />
      <span>{n}</span>
    </button>
  ))}
</nav>
{error&&<div className="notice error"><strong>Backend connection:</strong> {error}<br/>Ensure the AI backend is running on port 8001, then refresh this page.</div>}{!loading&&!error&&<div className="notice"><strong>Data source:</strong> {dataSource} · <strong>{demoMode?'Demo sample data — verify before use':'Live-source listings — verify details before applying'}</strong></div>}{message&&<div className="notice success">{message}</div>}{loading&&<div className="card"><LoaderCircle className="spin" size={18}/> Loading workspace…</div>}
{!loading&&tab==='Overview'&&<><div className="stats"><Stat title="Opportunities" value={items.length} foot="In current catalogue"/><Stat title="Strong matches" value={recs.filter(r=>r.match_score>=60).length} foot="60+ ranking score"/><Stat title="Your skills" value={profile.skills.length} foot="From profile and resume"/><Stat title="Skill gaps" value={gaps.length} foot="Across current catalogue"/></div><div className="columns"><section className="card"><div className="cardhead"><div><h2>Recommended for you</h2><p>Ranked against your current profile</p></div><button className="btn" onClick={()=>setTab('Opportunities')}>View all <ArrowUpRight size={13}/></button></div>{recs.slice(0,4).map(r=><Recommendation key={r.id} r={r} compact/>)}</section><section className="card"><div className="cardhead"><div><h2>Skills to focus on</h2><p>Frequently requested in this catalogue</p></div><GraduationCap size={19}/></div>{gaps.slice(0,6).map(([s,n])=><div className="gap" key={s}><div><strong>{s}</strong>
<small>Detected in {n} opportunity description(s)</small></div><span className="pill">{n} roles</span></div>)}{!gaps.length&&<div className="empty">Add your skills to see skill gaps.</div>}<button className="btn" style={{width:'100%',marginTop:12}} onClick={()=>setTab('Skill Gaps')}>Explore skill gaps</button></section></div></>}
{!loading&&tab==='Opportunities'&&<section className="card"><div className="cardhead"><div><h2>Opportunity catalogue</h2><p>{filtered.length} matches · live and fallback opportunities</p></div></div><div className="toolbar"><div style={{position:'relative',flex:'1 1 250px'}}><Search size={15} style={{position:'absolute',left:11,top:12,color:'#737e93'}}/><input className="search" style={{paddingLeft:34,maxWidth:'none'}} placeholder="Search roles, skills, organizations…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select className="search" style={{maxWidth:180}} value={kind} onChange={e=>setKind(e.target.value)}><option>All</option>{[...new Set(items.map(x=>x.type))].map(x=><option key={x}>{x}</option>)}</select></div>{filtered.map(r=><Recommendation key={r.id} r={r}/>)}{!filtered.length&&<div className="empty">No results. Try another search or category.</div>}</section>}
{!loading&&tab==='My Profile'&&<section className="card"><div className="cardhead"><div><h2>Student profile</h2><p>Your profile is saved in this browser. Recommendations are ranked against your profile.</p></div><UserRound size={19}/></div><form onSubmit={save}><div className="formgrid"><Field label="Skills (comma separated)"><textarea value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Python, SQL, Machine Learning"/></Field><Field label="Interests (comma separated)"><textarea value={interests} onChange={e=>setInterests(e.target.value)} placeholder="AI, startups, research"/></Field><Field label="Career goals (comma separated)" full><textarea value={goals} onChange={e=>setGoals(e.target.value)} placeholder="Machine Learning Engineer, AI Research"/></Field><Field label="Education"><input value={profile.education||''} onChange={e=>setField('education',e.target.value)} placeholder="B.Tech Information Technology"/></Field><Field label="Preferred location"><input value={profile.preferred_location||''} onChange={e=>setField('preferred_location',e.target.value)} placeholder="Remote, India, Jaipur"/></Field><Field label="Preferred work mode"><select value={profile.preferred_work_mode||'Any'} onChange={e=>setField('preferred_work_mode',e.target.value)}><option>Any</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></Field></div><div style={{display:'flex',justifyContent:'flex-end',marginTop:18}}><button className="btn primary" disabled={busy}>{busy?<LoaderCircle className="spin" size={15}/>:<Check size={15}/>} Save profile & refresh</button></div></form></section>}
{!loading&&tab==='Resume AI'&&<div className="columns"><section className="card"><div className="cardhead"><div><h2>Resume analyzer</h2><p>Extract text and detect known skills</p></div><FileText size={18}/></div><div className="notice">PDF and TXT supported · max 5 MB. Scanned/image-only PDFs need OCR, which is not included. Review detected skills before saving.</div><label className="card" style={{display:'flex',alignItems:'center',flexDirection:'column',gap:12,borderStyle:'dashed',cursor:'pointer',padding:30}}><Upload size={27}/><strong>{resume?'Analyzing…':'Choose your resume'}</strong><span className="small">PDF or TXT</span><input type="file" accept=".pdf,.txt" onChange={parseResume} disabled={resume}/>{resume&&<LoaderCircle className="spin" size={18}/>}</label>{detectedSkills.length>0&&<div style={{marginTop:18}}><h3>Review detected skills</h3><p className="small">Select the skills you want to add to your profile.</p><div className="skillrow" style={{marginTop:12}}>{detectedSkills.map(skill=><label key={skill} className="skill" style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={selectedSkills.includes(skill)} onChange={e=>setSelectedSkills(current=>e.target.checked?[...current,skill]:current.filter(x=>x!==skill))}/>{skill}</label>)}</div><button className="btn primary" style={{marginTop:16}} onClick={saveSelectedSkills} disabled={selectedSkills.length===0}>Save selected skills ({selectedSkills.length})</button></div>}</section><section className="card"><h2 style={{fontFamily:'Manrope',fontSize:16}}>How it works</h2><div className="gap"><div><strong>1. Extract text</strong><small>Read selectable PDF/TXT content</small></div></div><div className="gap"><div><strong>2. Detect skills</strong><small>Rule-based keyword extraction</small></div></div><div className="gap"><div><strong>3. Review and save</strong><small>Confirm skills before recommendations</small></div></div></section></div>}
{!loading&&tab==='Skill Gaps'&&<div className="columns"><section className="card"><div className="cardhead"><div><h2>Prioritized skill gaps</h2><p>Frequency in the current opportunity sample</p></div><Target size={18}/></div>{gaps.map(([s,n],i)=><div className="gap" key={s}><div><strong>{i<3?'High focus':i<7?'Explore next':'Additional'} · {s}</strong><small>Detected in {n} opportunity record(s)</small></div><span className="pill">{n} roles</span></div>)}{!gaps.length&&<div className="empty">Add profile skills to compare against requirements.</div>}</section><section className="card"><h2 style={{fontFamily:'Manrope',fontSize:16}}>Your current skills</h2><div className="skillrow">{profile.skills.map(s=><span className="skill" key={s}>{s}</span>)}</div><button className="btn primary" style={{width:'100%',justifyContent:'center',marginTop:18}} onClick={()=>setTab('My Profile')}>Update skills</button><p className="meta">Scores are heuristic ranking scores, not probabilities of getting selected. Skill gaps are inferred from detected keywords in the current GoGlobal catalogue, not verified mandatory requirements or market demand. </p></section></div>}
<div className="notice" style={{marginTop:17}}><strong>Important:</strong> Listings may have eligibility or availability restrictions. Verify the details on the original source before applying.</div><div className="footer">GoGlobal AI · Hybrid recommendation baseline · Resume processing is rule-based and requires human review.</div></main></div></div>}
function Stat({title,value,foot}:{title:string;value:number;foot:string}){return <div className="card"><div className="label">{title}<Sparkles size={15} color="#3157d5"/></div><div className="value">{value}</div><div className="small">{foot}</div></div>}
function Field({label,children,full=false}:{label:string;children:React.ReactNode;full?:boolean}){return <div className={`field ${full?'full':''}`}><label>{label}</label>{children}</div>}
function Recommendation({r,compact=false}:{r:Rec;compact?:boolean}){return <div className="item"><div className="org"><BriefcaseBusiness size={17}/></div><div className="itembody"><h3>{r.title}</h3><div className="meta">{r.organization} · {r.type} · <MapPin size={11} style={{display:'inline',verticalAlign:'-2px'}}/> {r.location}</div>{!compact&&<div className="meta" style={{marginTop:7}}>{r.description}</div>}<div className="skillrow">{r.matched_skills.slice(0,compact?3:8).map(s=><span className="skill" key={s}>✓ {s}</span>)}{r.missing_skills.slice(0,compact?2:8).map(s=><span className="skill missing" key={s}>Need: {s}</span>)}</div>{!compact&&<div className="meta">{r.eligibility} · {r.explanation}</div>}<div className="meta"><span className="pill">
{r.source || 'DEMO LISTING'}
</span> <a href={r.application_url} target="_blank" rel="noreferrer" style={{color:'#3157d5',fontWeight:700}}>View listing <ArrowUpRight size={11} style={{display:'inline',verticalAlign:'-2px'}}/></a></div></div><div className="score">{r.match_score}%<div className="small" style={{textAlign:'right'}}>match</div></div></div>}
