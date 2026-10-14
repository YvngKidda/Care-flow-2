import React, { useMemo, useRef, useState } from 'react';
import {
  Activity, AlarmClock, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, FileText, Filter, FlaskConical, HeartPulse, LayoutDashboard, LogOut,
  Menu, MoreHorizontal, Pill, Plus, Search, Settings, ShieldCheck, Stethoscope,
  UserRound, Users, UserCog, X, Upload, TrendingUp, Wallet, Sparkles, CircleHelp
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from 'recharts';

const initialPatients = [
  { id: 'CF-1042', name: 'Amara Okafor', age: 34, gender: 'Female', reason: 'Persistent headache', department: 'General Medicine', status: 'With doctor', priority: 'Routine', time: '09:42 AM', initials: 'AO', color: 'peach' },
  { id: 'CF-1041', name: 'David Ibrahim', age: 52, gender: 'Male', reason: 'Follow-up consultation', department: 'Cardiology', status: 'Awaiting vitals', priority: 'Priority', time: '09:38 AM', initials: 'DI', color: 'blue' },
  { id: 'CF-1040', name: 'Chioma Eze', age: 27, gender: 'Female', reason: 'Fever and fatigue', department: 'General Medicine', status: 'At reception', priority: 'Routine', time: '09:25 AM', initials: 'CE', color: 'lilac' },
  { id: 'CF-1039', name: 'Musa Bello', age: 41, gender: 'Male', reason: 'Medication review', department: 'Endocrinology', status: 'At pharmacy', priority: 'Routine', time: '09:10 AM', initials: 'MB', color: 'mint' },
  { id: 'CF-1038', name: 'Grace Nwosu', age: 63, gender: 'Female', reason: 'Knee pain', department: 'Orthopaedics', status: 'Ready for billing', priority: 'Priority', time: '08:56 AM', initials: 'GN', color: 'rose' },
  { id: 'CF-1037', name: 'Emeka Obi', age: 19, gender: 'Male', reason: 'Sports injury', department: 'Orthopaedics', status: 'Completed', priority: 'Routine', time: '08:32 AM', initials: 'EO', color: 'gold' },
];
const staffSeed = [
  { name: 'Dr. Adaeze Nwankwo', role: 'Doctor', dept: 'General Medicine', email: 'adaeze.n@careflow.demo', initials: 'AN', color: 'lilac', status: 'Active' },
  { name: 'Nurse Daniel James', role: 'Nurse', dept: 'Triage', email: 'daniel.j@careflow.demo', initials: 'DJ', color: 'blue', status: 'Active' },
  { name: 'Dr. Tunde Akinola', role: 'Doctor', dept: 'Cardiology', email: 'tunde.a@careflow.demo', initials: 'TA', color: 'mint', status: 'Active' },
  { name: 'Pharm. Ifeoma Obi', role: 'Pharmacist', dept: 'Pharmacy', email: 'ifeoma.o@careflow.demo', initials: 'IO', color: 'peach', status: 'Active' },
  { name: 'Joy Ekanem', role: 'Receptionist', dept: 'Front desk', email: 'joy.e@careflow.demo', initials: 'JE', color: 'rose', status: 'Active' },
];
const flowSteps = ['At reception', 'Awaiting vitals', 'With doctor', 'At pharmacy', 'Ready for billing', 'Completed'];
const chartData = [
  { day: 'Mon', patients: 42, target: 35 }, { day: 'Tue', patients: 56, target: 40 },
  { day: 'Wed', patients: 49, target: 38 }, { day: 'Thu', patients: 68, target: 42 },
  { day: 'Fri', patients: 61, target: 45 }, { day: 'Sat', patients: 37, target: 30 },
  { day: 'Sun', patients: 28, target: 25 },
];
const roleInfo = {
  Admin: { name: 'Alex Morgan', title: 'System Administrator', initials: 'AM', dept: 'Administration' },
  Reception: { name: 'Joy Ekanem', title: 'Receptionist', initials: 'JE', dept: 'Front desk' },
  Nurse: { name: 'Daniel James', title: 'Senior Nurse', initials: 'DJ', dept: 'Nursing & Triage' },
  Doctor: { name: 'Dr. Adaeze Nwankwo', title: 'Consultant Physician', initials: 'AN', dept: 'General Medicine' },
  Pharmacist: { name: 'Ifeoma Obi', title: 'Lead Pharmacist', initials: 'IO', dept: 'Pharmacy' },
};
const navGroups = [
  { label: 'WORKSPACE', items: [
    { id: 'Overview', icon: LayoutDashboard }, { id: 'Patients', icon: Users, count: '24' },
    { id: 'Appointments', icon: CalendarDays }, { id: 'Care workflow', icon: Activity },
  ]},
  { label: 'CLINICAL & OPERATIONS', items: [
    { id: 'Staff directory', icon: UserRound }, { id: 'Pharmacy', icon: Pill },
    { id: 'Billing', icon: CreditCard }, { id: 'Analytics', icon: TrendingUp },
  ]},
  { label: 'ADMINISTRATION', items: [
    { id: 'Staff management', icon: UserCog }, { id: 'Settings', icon: Settings },
  ]},
];

function Avatar({ initials, color = 'blue', size = 'md' }) {
  return <span className={`avatar ${color} ${size}`}>{initials}</span>;
}
function Status({ children }) {
  const cls = String(children).toLowerCase().replaceAll(' ', '-');
  return <span className={`status status-${cls}`}>{children}</span>;
}
function Metric({ label, value, change, icon: Icon, tone = 'blue', foot }) {
  return <div className="metric-card">
    <div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18}/></span></div>
    <div className="metric-value">{value}</div>
    <div className="metric-foot"><span className="change"><ArrowUpRight size={14}/>{change}</span><span>{foot}</span></div>
  </div>;
}
function SectionTitle({ title, subtitle, action, onAction }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="text-action" onClick={onAction}>{action}<ArrowRight size={15}/></button>}</div>;
}

export default function App() {
  const [active, setActive] = useState('Overview');
  const [role, setRole] = useState('Admin');
  const [patients, setPatients] = useState(initialPatients);
  const [staff, setStaff] = useState(staffSeed);
  const [search, setSearch] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [toast, setToast] = useState('');
  const [staffForm, setStaffForm] = useState({ name: '', role: 'Doctor', dept: '', email: '' });
  const fileRef = useRef(null);
  const user = roleInfo[role];
  const filteredPatients = useMemo(() => patients.filter(p => `${p.name} ${p.id} ${p.reason} ${p.status}`.toLowerCase().includes(search.toLowerCase())), [patients, search]);

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const changeStatus = (id, direction = 1) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== id) return p;
      const current = Math.max(0, flowSteps.indexOf(p.status));
      const next = Math.min(flowSteps.length - 1, Math.max(0, current + direction));
      return { ...p, status: flowSteps[next] };
    }));
    notify('Patient workflow updated in this demo.');
  };
  const addStaff = (e) => {
    e.preventDefault();
    const name = staffForm.name.trim();
    if (!name) return;
    const initials = name.split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
    setStaff(prev => [...prev, { ...staffForm, name, initials, color: 'mint', status: 'Invited' }]);
    setStaffForm({ name: '', role: 'Doctor', dept: '', email: '' });
    setShowAddStaff(false);
    notify('Staff record added to demo data. No login was created.');
  };
  const importCsv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      const rows = lines.slice(1).map(line => line.split(','));
      const parsed = rows.filter(r => r[0]?.trim()).map(r => {
        const name = r[0].trim();
        return { name, role: r[1]?.trim() || 'Doctor', dept: r[2]?.trim() || 'Unassigned', email: r[3]?.trim() || '', initials: name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase(), color: 'mint', status: 'Imported' };
      });
      if (parsed.length) { setStaff(prev => [...prev, ...parsed]); notify(`${parsed.length} demo staff row(s) imported.`); }
      else notify('No staff rows found. Check the CSV format.');
      e.target.value = '';
    };
    reader.readAsText(file);
  };
  const exportCsv = () => {
    const content = ['Name,Role,Department,Email,Status', ...staff.map(s => [s.name,s.role,s.dept,s.email,s.status].map(v => `"${String(v || '').replaceAll('"','""')}"`).join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'careflow-staff-demo.csv'; a.click(); URL.revokeObjectURL(url);
    notify('Staff demo CSV exported.');
  };

  const pageTitle = active === 'Overview' ? 'Good morning' : active;
  const pageSub = active === 'Overview' ? 'Here’s what’s happening at your hospital today.' : ({
    Patients: 'Search and review the patient directory.',
    Appointments: 'View the appointment schedule and patient check-ins.',
    'Care workflow': 'Track each patient handoff across hospital departments.',
    'Staff directory': 'Meet the team and view staff profiles.',
    Pharmacy: 'Review prescriptions and dispensing status.',
    Billing: 'Track invoices, payments, and receipts.',
    Analytics: 'Understand patient flow, workload, and operational trends.',
    'Staff management': 'Create staff records and prepare account provisioning.',
    Settings: 'Manage your workspace preferences.',
  })[active] || 'Manage your CareFlow workspace.';

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><HeartPulse size={23}/></span><span>careflow<span className="brand-dot">.</span><small>HOSPITAL WORKSPACE</small></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="hospital-switch"><div className="hospital-symbol">NH</div><div><strong>Northstar Health</strong><small>Central Hospital</small></div><ChevronDown size={15}/></div>
      <div className="nav-list">
        {navGroups.map(group => <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(item => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setMobileNav(false); }}>
            <item.icon size={18}/><span>{item.id}</span>{item.count && <span className="nav-count">{item.count}</span>}
          </button>)}
        </div>)}
      </div>
      <div className="sidebar-bottom">
        <div className="support-card"><div className="support-icon"><CircleHelp size={18}/></div><strong>Need a hand?</strong><p>Explore the demo workspace and discover what’s possible.</p><button onClick={() => notify('Help centre is a placeholder in this prototype.')}>Visit help centre <ArrowRight size={14}/></button></div>
        <div className="sidebar-user"><Avatar initials={user.initials} color="lilac"/><div className="user-meta"><strong>{user.name}</strong><small>{user.title}</small></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="breadcrumbs"><button className="hamburger" onClick={() => setMobileNav(true)}><Menu size={20}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div>
        <div className="top-actions">
          <label className="role-preview"><span>Preview role</span><select value={role} onChange={e => setRole(e.target.value)} aria-label="Preview role"><option>Admin</option><option>Reception</option><option>Nurse</option><option>Doctor</option><option>Pharmacist</option></select><ChevronDown size={14}/></label>
          <button className={`icon-button ${noticeOpen ? 'selected' : ''}`} aria-label="Notifications" onClick={() => setNoticeOpen(!noticeOpen)}><Bell size={19}/><i/></button>
          <Avatar initials={user.initials} color="lilac"/>
        </div>
        {noticeOpen && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><span className="tiny-pill">2 new</span></div><div className="notification-item"><span className="notification-dot"/><div><strong>Patient handoff pending</strong><p>David Ibrahim is awaiting triage.</p><small>12 minutes ago</small></div></div><div className="notification-item"><span className="notification-dot green"/><div><strong>Daily report is ready</strong><p>Your sample operations report is available.</p><small>35 minutes ago</small></div></div></div>}
      </header>

      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-dot"/> TUESDAY, 13 OCTOBER 2026</div><h1>{pageTitle}{active === 'Overview' ? <>, {user.name.split(' ')[0]} <span className="wave">✦</span></> : null}</h1><p>{pageSub}</p></div><div className="heading-actions"><button className="btn btn-secondary" onClick={() => notify('Report export is planned for a later build.')}><Download size={16}/> Export report</button><button className="btn btn-primary" onClick={() => active === 'Staff management' ? setShowAddStaff(true) : (setActive('Patients'), notify('Open the patient directory to continue.'))}><Plus size={17}/>{active === 'Staff management' ? 'Add staff member' : 'New patient'}</button></div></div>

        {active === 'Overview' && <>
          <div className="metric-grid">
            <Metric label="Total patients today" value="124" change="+12.8%" foot="vs. yesterday" icon={Users} tone="blue"/>
            <Metric label="Waiting for care" value={patients.filter(p=>!['Completed','At pharmacy','Ready for billing'].includes(p.status)).length.toString().padStart(2,'0')} change="-8.2%" foot="vs. yesterday" icon={Clock3} tone="amber"/>
            <Metric label="Appointments" value="38" change="+4.3%" foot="vs. yesterday" icon={CalendarDays} tone="purple"/>
            <Metric label="Revenue today" value="₦842k" change="+10.6%" foot="vs. yesterday" icon={Wallet} tone="green"/>
          </div>
          <div className="overview-grid">
            <section className="panel patient-panel">
              <SectionTitle title="Patient overview" subtitle="Recent patient activity across departments" action="View all patients" onAction={() => setActive('Patients')}/>
              <div className="table-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients..." /></div><button className="filter-btn" onClick={() => notify('Filters can be added in the next iteration.')}><Filter size={15}/> Filter</button></div>
              <PatientTable patients={filteredPatients.slice(0,5)} onOpen={p => notify(`Opened demo profile for ${p.name}.`)} compact/>
              <button className="table-footer-link" onClick={() => setActive('Patients')}>View patient directory <ArrowRight size={15}/></button>
            </section>
            <section className="panel chart-panel">
              <SectionTitle title="Patient activity" subtitle="Patient visits over the last 7 days"/>
              <div className="chart-legend"><span><i className="legend-dot blue-dot"/> Patient visits</span><span><i className="legend-dot pale-dot"/> Previous trend</span><button onClick={() => notify('Chart period selector is a demo control.')}>This week <ChevronDown size={13}/></button></div>
              <div className="activity-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:5,left:-22,bottom:0}}><defs><linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4c6fff" stopOpacity={0.2}/><stop offset="100%" stopColor="#4c6fff" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#edf0f6" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8b93a7'}} dy={10}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8b93a7'}}/><Tooltip contentStyle={{border:'1px solid #edf0f6',borderRadius:12,fontSize:12}}/><Area type="monotone" dataKey="target" stroke="#c9d0e5" strokeDasharray="4 4" strokeWidth={2} fill="transparent"/><Area type="monotone" dataKey="patients" stroke="#526dff" strokeWidth={2.5} fill="url(#visitsFill)" activeDot={{r:5}}/></AreaChart></ResponsiveContainer></div>
              <div className="chart-summary"><div><span className="summary-label">Total visits</span><strong>341 <small><ArrowUpRight size={13}/> 8.4%</small></strong></div><div><span className="summary-label">Daily average</span><strong>48.7</strong></div><div><span className="summary-label">Peak day</span><strong>Thursday</strong></div></div>
            </section>
          </div>
          <div className="lower-grid">
            <section className="panel workflow-panel"><SectionTitle title="Care workflow" subtitle="Live status of patient handoffs" action="Open workflow" onAction={() => setActive('Care workflow')}/><div className="workflow-list">{patients.slice(0,4).map(p=><div className="workflow-row" key={p.id}><Avatar initials={p.initials} color={p.color}/><div className="workflow-person"><strong>{p.name}</strong><small>{p.id} · {p.department}</small></div><Status>{p.status}</Status><button className="small-icon-btn" aria-label={`Advance ${p.name}`} onClick={()=>changeStatus(p.id)}><ArrowRight size={15}/></button></div>)}</div></section>
            <section className="panel departments-panel"><SectionTitle title="Department snapshot" subtitle="Today's activity at a glance"/><div className="department-list">{[['General Medicine',34,'blue'],['Cardiology',21,'purple'],['Orthopaedics',18,'amber'],['Paediatrics',15,'green']].map(([name,n,tone])=><div className="department-row" key={name}><span className={`department-icon ${tone}`}><Activity size={16}/></span><span className="department-name">{name}<small>{n} patients</small></span><div className="mini-bar"><i className={tone} style={{width:`${n/34*100}%`}}/></div><strong>{n}</strong></div>)}</div><button className="table-footer-link" onClick={()=>setActive('Analytics')}>View department analytics <ArrowRight size={15}/></button></section>
          </div>
          <div className="prototype-note"><ShieldCheck size={17}/><div><strong>Prototype workspace</strong><span>All displayed records are fictional demo data. Role preview is not a security boundary.</span></div><button onClick={()=>setActive('Staff management')}>Explore admin <ArrowRight size={14}/></button></div>
        </>}

        {active === 'Patients' && <section className="panel full-panel"><SectionTitle title="Patient directory" subtitle={`${patients.length} fictional patient records in this demo`}/><div className="table-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, ID, reason..." /></div><button className="filter-btn" onClick={()=>notify('Filter panel is planned for a later build.')}><Filter size={15}/> Filter</button></div><PatientTable patients={filteredPatients} onOpen={p=>notify(`Opened demo profile for ${p.name}.`)}/></section>}
        {active === 'Care workflow' && <section className="panel full-panel"><SectionTitle title="Care workflow" subtitle="Move fictional patients through each department handoff."/><div className="workflow-stage-grid">{flowSteps.map((step,i)=><div className="stage-card" key={step}><div className="stage-number">{String(i+1).padStart(2,'0')}</div><strong>{step}</strong><span>{patients.filter(p=>p.status===step).length} patients</span></div>)}</div><div className="workflow-list roomy">{patients.map(p=><div className="workflow-row" key={p.id}><Avatar initials={p.initials} color={p.color}/><div className="workflow-person"><strong>{p.name}</strong><small>{p.id} · {p.reason}</small></div><Status>{p.status}</Status><button className="btn btn-secondary btn-small" onClick={()=>changeStatus(p.id)}>Advance <ArrowRight size={14}/></button></div>)}</div></section>}
        {active === 'Staff management' && <section className="panel full-panel"><div className="admin-intro"><div className="admin-intro-icon"><UserCog size={23}/></div><div><h2>Staff management</h2><p>Manage staff directory data and prepare accounts for secure provisioning.</p></div></div><div className="admin-warning"><ShieldCheck size={18}/><span><strong>Demo mode:</strong> Adding or importing records only changes in-memory demo data. This does not create real user accounts or grant permissions.</span></div><div className="admin-toolbar"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search staff..." /></div><div className="toolbar-right"><input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={importCsv}/><button className="btn btn-secondary" onClick={()=>fileRef.current?.click()}><Upload size={16}/> Import CSV</button><button className="btn btn-secondary" onClick={exportCsv}><Download size={16}/> Export</button><button className="btn btn-primary" onClick={()=>setShowAddStaff(true)}><Plus size={16}/> Add staff</button></div></div><div className="staff-grid">{staff.filter(s=>`${s.name} ${s.role} ${s.dept}`.toLowerCase().includes(search.toLowerCase())).map((s,i)=><div className="staff-card" key={`${s.email}-${i}`}><div className="staff-card-top"><Avatar initials={s.initials} color={s.color} size="lg"/><button className="small-icon-btn" onClick={()=>notify('Staff actions are a placeholder in this prototype.')}><MoreHorizontal size={18}/></button></div><h3>{s.name}</h3><p>{s.role}</p><div className="staff-detail"><Stethoscope size={14}/>{s.dept || 'Department not set'}</div><div className="staff-detail"><FileText size={14}/><span className="staff-email">{s.email || 'Email not provided'}</span></div><div className="staff-card-bottom"><Status>{s.status}</Status><button className="text-action" onClick={()=>notify('Profile editing will be added in the next iteration.')}>View profile <ArrowRight size={14}/></button></div></div>)}</div></section>}
        {active === 'Staff directory' && <section className="panel full-panel"><SectionTitle title="Staff directory" subtitle="Profiles for the team supporting patient care."/><div className="staff-grid">{staff.map((s,i)=><div className="staff-card" key={i}><div className="staff-card-top"><Avatar initials={s.initials} color={s.color} size="lg"/><Status>{s.status}</Status></div><h3>{s.name}</h3><p>{s.role}</p><div className="staff-detail"><Stethoscope size={14}/>{s.dept}</div><div className="staff-detail"><FileText size={14}/><span className="staff-email">{s.email}</span></div><div className="staff-card-bottom"><span className="muted-text">CareFlow team</span><button className="text-action" onClick={()=>notify(`Viewing demo profile: ${s.name}`)}>View profile <ArrowRight size={14}/></button></div></div>)}</div></section>}
        {active === 'Appointments' && <section className="panel full-panel"><SectionTitle title="Appointments" subtitle="Sample appointments for today." action="Add appointment" onAction={()=>notify('Appointment creation is planned for a later build.')}/><div className="appointment-list">{[['09:00 AM','Amara Okafor','Dr. Adaeze Nwankwo','General Medicine','Checked in'],['09:30 AM','David Ibrahim','Dr. Tunde Akinola','Cardiology','Waiting'],['10:15 AM','Chioma Eze','Dr. Adaeze Nwankwo','General Medicine','Confirmed'],['11:00 AM','Grace Nwosu','Dr. Tunde Akinola','Orthopaedics','Confirmed']].map((a,i)=><div className="appointment-row" key={a[1]}><div className="appointment-time"><Clock3 size={16}/>{a[0]}</div><Avatar initials={a[1].split(' ').map(n=>n[0]).join('')} color={['peach','blue','lilac','rose'][i]}/><div className="workflow-person"><strong>{a[1]}</strong><small>{a[2]} · {a[3]}</small></div><Status>{a[4]}</Status><button className="small-icon-btn" onClick={()=>notify(`Opened appointment for ${a[1]}.`)}><ChevronRight size={17}/></button></div>)}</div></section>}
        {active === 'Pharmacy' && <section className="panel full-panel"><SectionTitle title="Pharmacy" subtitle="Prescription queue and dispensing overview."/><div className="metric-grid mini-metrics"><Metric label="Awaiting dispensing" value="08" change="+2" foot="since 8am" icon={Pill} tone="purple"/><Metric label="Dispensed today" value="32" change="+11%" foot="vs. yesterday" icon={Check} tone="green"/><Metric label="Low-stock items" value="04" change="Review" foot="inventory alerts" icon={FlaskConical} tone="amber"/></div><div className="simple-table"><div className="simple-table-head"><span>Patient</span><span>Prescription</span><span>Prescriber</span><span>Status</span><span>Action</span></div>{[['Musa Bello','Metformin · 30 tablets','Dr. T. Akinola','Awaiting'],['Amara Okafor','Prescription review required','Dr. A. Nwankwo','Pending review'],['David Ibrahim','Amlodipine · 28 tablets','Dr. T. Akinola','Ready']].map((r,i)=><div className="simple-table-row" key={i}><strong>{r[0]}</strong><span>{r[1]}</span><span>{r[2]}</span><Status>{r[3]}</Status><button className="small-icon-btn" onClick={()=>notify('Dispensing action is a prototype placeholder.')}><ArrowRight size={15}/></button></div>)}</div><p className="muted-text disclaimer">Medication examples are fictional. Do not use this prototype to prescribe or dispense medication.</p></section>}
        {active === 'Billing' && <section className="panel full-panel"><SectionTitle title="Billing & payments" subtitle="Sample invoices and payment status." action="Create invoice" onAction={()=>notify('Invoice creation is planned for a later build.')}/><div className="metric-grid mini-metrics"><Metric label="Collected today" value="₦842,000" change="+10.6%" foot="vs. yesterday" icon={Wallet} tone="green"/><Metric label="Outstanding" value="₦186,500" change="6 invoices" foot="awaiting payment" icon={CreditCard} tone="amber"/><Metric label="Receipts issued" value="86" change="+9%" foot="today" icon={FileText} tone="blue"/></div><div className="simple-table"><div className="simple-table-head"><span>Invoice</span><span>Patient</span><span>Amount</span><span>Status</span><span>Receipt</span></div>{[['INV-2084','Grace Nwosu','₦24,500','Paid'],['INV-2083','Musa Bello','₦18,200','Pending'],['INV-2082','Emeka Obi','₦35,000','Paid'],['INV-2081','Chioma Eze','₦12,000','Paid']].map((r,i)=><div className="simple-table-row" key={i}><strong>{r[0]}</strong><span>{r[1]}</span><strong>{r[2]}</strong><Status>{r[3]}</Status><button className="small-icon-btn" onClick={()=>notify('Receipt printing requires a connected billing backend.')}><FileText size={15}/></button></div>)}</div></section>}
        {active === 'Analytics' && <><div className="metric-grid"><Metric label="Average wait time" value="18 min" change="-12%" foot="vs. last week" icon={Clock3} tone="blue"/><Metric label="Patients served" value="341" change="+8.4%" foot="this week" icon={Users} tone="green"/><Metric label="Department load" value="76%" change="+3%" foot="average utilization" icon={Activity} tone="purple"/><Metric label="Staff coverage" value="92%" change="+5%" foot="planned shifts" icon={UserCog} tone="amber"/></div><div className="overview-grid"><section className="panel chart-panel"><SectionTitle title="Weekly patient volume" subtitle="Fictional patient visits by day"/><div className="activity-chart tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{top:10,right:5,left:-22,bottom:0}}><CartesianGrid stroke="#edf0f6" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8b93a7'}} dy={10}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8b93a7'}}/><Tooltip/><Bar dataKey="patients" fill="#526dff" radius={[5,5,0,0]} maxBarSize={34}/></BarChart></ResponsiveContainer></div></section><section className="panel ai-panel"><div className="ai-badge"><Sparkles size={17}/> AI READINESS</div><h2>Make better-informed decisions.</h2><p>Future analytics can forecast patient arrivals and help planners evaluate staff coverage using historical, appropriately governed data.</p><div className="ai-feature"><span><TrendingUp size={16}/></span><div><strong>Demand forecasting</strong><small>Estimate busy periods from past visits.</small></div></div><div className="ai-feature"><span><Users size={16}/></span><div><strong>Staffing recommendations</strong><small>Suggest coverage for human review.</small></div></div><div className="ai-footnote"><ShieldCheck size={15}/> Predictions require validation and human oversight. No clinical predictions are active in this demo.</div></section></div></>}
        {active === 'Settings' && <section className="panel full-panel settings-panel"><SectionTitle title="Workspace settings" subtitle="Basic preferences for this prototype."/><div className="setting-row"><div><strong>Hospital workspace</strong><p>Northstar Health · Central Hospital</p></div><button className="btn btn-secondary" onClick={()=>notify('Hospital settings are demo-only.')}>Edit details</button></div><div className="setting-row"><div><strong>Security and access</strong><p>Production access policies must be enforced by Supabase RLS.</p></div><span className="setting-status"><ShieldCheck size={15}/> Not configured</span></div><div className="setting-row"><div><strong>Notifications</strong><p>Configure staff alerts and appointment reminders in a future version.</p></div><button className="btn btn-secondary" onClick={()=>notify('Notification preferences are a placeholder.')}>Preferences</button></div></section>}
      </div>
      <footer className="footer"><span>© 2026 CareFlow Health Systems <span className="footer-dot">·</span> Prototype v0.1</span><span><ShieldCheck size={13}/> Designed with privacy in mind</span></footer>
    </main>

    {showAddStaff && <div className="modal-backdrop" onClick={()=>setShowAddStaff(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Add staff member</h2><p>Create a staff directory record for this demo.</p></div><button className="icon-button" onClick={()=>setShowAddStaff(false)}><X size={18}/></button></div><form onSubmit={addStaff}><label>Full name<input required value={staffForm.name} onChange={e=>setStaffForm({...staffForm,name:e.target.value})} placeholder="e.g. Dr. Kemi Adeyemi"/></label><label>Role<select value={staffForm.role} onChange={e=>setStaffForm({...staffForm,role:e.target.value})}><option>Doctor</option><option>Nurse</option><option>Pharmacist</option><option>Receptionist</option><option>Administrator</option></select></label><label>Department<input value={staffForm.dept} onChange={e=>setStaffForm({...staffForm,dept:e.target.value})} placeholder="e.g. Paediatrics"/></label><label>Work email<input type="email" value={staffForm.email} onChange={e=>setStaffForm({...staffForm,email:e.target.value})} placeholder="name@hospital.com"/></label><div className="modal-note"><ShieldCheck size={16}/> This creates only a demo directory record, not an authenticated account.</div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setShowAddStaff(false)}>Cancel</button><button className="btn btn-primary" type="submit"><Plus size={16}/> Add staff record</button></div></form></div></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}

function PatientTable({ patients, onOpen, compact = false }) {
  return <div className={`patient-table-wrap ${compact ? 'compact' : ''}`}><table className="patient-table"><thead><tr><th>Patient</th><th>Patient ID</th><th>Department</th><th>Visit status</th><th>Priority</th><th></th></tr></thead><tbody>{patients.map(p=><tr key={p.id}><td><button className="patient-name-btn" onClick={()=>onOpen(p)}><Avatar initials={p.initials} color={p.color}/><span><strong>{p.name}</strong><small>{p.age} yrs · {p.gender}</small></span></button></td><td className="id-cell">{p.id}</td><td>{p.department}</td><td><Status>{p.status}</Status></td><td><span className={`priority ${p.priority.toLowerCase()}`}><i/>{p.priority}</span></td><td><button className="small-icon-btn" aria-label={`View ${p.name}`} onClick={()=>onOpen(p)}><ChevronRight size={16}/></button></td></tr>)}</tbody></table>{patients.length===0 && <div className="empty-state"><Search size={22}/><strong>No patients found</strong><span>Try a different search term.</span></div>}</div>;
}
