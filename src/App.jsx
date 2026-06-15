import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ─── 1. SUB SENSOR STATUS ───────────────────────────────────────────────────
const SENSORS = [
  { id: 1, name: 'Pressure Sensor',  unit: 'bar', min: 10,  max: 120 },
  { id: 2, name: 'Navigation Array', unit: '°',   min: 0,   max: 360 },
  { id: 3, name: 'Hull Integrity',   unit: '%',   min: 70,  max: 100 },
  { id: 4, name: 'Thermal Scanner',  unit: '°C',  min: 1,   max: 15  },
  { id: 5, name: 'Gyroscope',        unit: 'rpm', min: 200, max: 800 },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function getStatus(val, min, max) {
  const pct = ((val - min) / (max - min)) * 100;
  if (pct > 65) return 'online';
  if (pct > 30) return 'warning';
  return 'offline';
}

function SubSensorStatus() {
  const [readings, setReadings] = useState(SENSORS.map(s => ({ ...s, value: rand(s.min, s.max) })));

  useEffect(() => {
    const id = setInterval(() => {
      setReadings(prev => prev.map(s => ({ ...s, value: rand(s.min, s.max) })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel">
      <div className="panel-title">Sub Sensor Status</div>
      <div className="panel-subtitle">Live robotic &amp; navigation sensor readings</div>
      <div className="sensor-list">
        {readings.map(s => {
          const pct = Math.round(((s.value - s.min) / (s.max - s.min)) * 100);
          const status = getStatus(s.value, s.min, s.max);
          const barColor = status === 'online' ? '#2ed573' : status === 'warning' ? '#ffa502' : '#ff4757';
          return (
            <div key={s.id} className="sensor-item">
              <div>
                <div className="sensor-name"><span className={`status-dot ${status}`} />{s.name}</div>
                <div className="sensor-value">{s.value} {s.unit}</div>
              </div>
              <div className="sensor-right">
                <span className={`tag tag-${status === 'online' ? 'green' : status === 'warning' ? 'yellow' : 'red'}`}>{status}</span>
                <div className="sensor-bar-track">
                  <div className="sensor-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 2. SAFETY ACTION UNDO ──────────────────────────────────────────────────
const DEFAULT_ACTIONS = [
  { id: 1, text: 'Blow ballast tank — port side',    time: '21:04', undone: false },
  { id: 2, text: 'Emergency buoyancy valve opened',  time: '21:11', undone: false },
  { id: 3, text: 'Depth stabilizer engaged',         time: '21:18', undone: false },
];

function SafetyActionUndo() {
  const [actions, setActions] = useState(DEFAULT_ACTIONS);
  const [input, setInput] = useState('');

  function addAction() {
    if (!input.trim()) return;
    const time = new Date().toTimeString().slice(0, 5);
    setActions(prev => [...prev, { id: Date.now(), text: input.trim(), time, undone: false }]);
    setInput('');
  }

  return (
    <div className="panel">
      <div className="panel-title">Safety Action Undo</div>
      <div className="panel-subtitle">Command history — reverse any logged action</div>
      <div className="action-log">
        {actions.length === 0 && <div style={{ color: '#2a6080', fontSize: '0.7rem' }}>No actions logged.</div>}
        {actions.map(a => (
          <div key={a.id} className={`action-entry ${a.undone ? 'undone' : ''}`}>
            <span className="action-text">{a.text}</span>
            <span className="action-time">{a.time}</span>
            <div className="action-controls">
              <button className={`btn ${a.undone ? 'btn-success' : 'btn-danger'}`}
                onClick={() => setActions(prev => prev.map(x => x.id === a.id ? { ...x, undone: !x.undone } : x))}>
                {a.undone ? 'Redo' : 'Undo'}
              </button>
              <button className="btn btn-danger"
                onClick={() => setActions(prev => prev.filter(x => x.id !== a.id))}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <hr className="panel-divider" />
      <div className="action-input-row">
        <input type="text" placeholder="Log new safety action..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addAction()} />
        <button className="btn btn-success" onClick={addAction}>LOG</button>
      </div>
    </div>
  );
}

// ─── 3. SONAR DATA FEED ─────────────────────────────────────────────────────
const OBJECTS   = ['kelp formation','rock shelf','thermal vent','unknown mass','wreckage debris','sea floor ridge','sonar echo','biologic swarm'];
const DIRS      = ['N','NE','E','SE','S','SW','W','NW'];

function makePing(seq) {
  return {
    id: seq, seq,
    text: `${OBJECTS[Math.floor(Math.random() * OBJECTS.length)]} — bearing ${DIRS[Math.floor(Math.random() * DIRS.length)]}`,
    dist: `${(Math.random() * 4 + 0.2).toFixed(2)} km`,
    isNew: true,
  };
}

function SonarDataFeed() {
  const [pings, setPings]   = useState(() => [1,2,3].map(i => ({ ...makePing(i), isNew: false })));
  const [running, setRunning] = useState(true);
  const seqRef = useRef(4);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const ping = makePing(seqRef.current++);
      setPings(prev => [...prev.map(p => ({ ...p, isNew: false })), ping].slice(-10));
    }, 1800);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="panel">
      <div className="panel-title">Sonar Data Feed</div>
      <div className="panel-subtitle">Continuous underwater radar stream — FIFO queue</div>
      <div className="sonar-feed">
        {pings.map(p => (
          <div key={p.id} className={`sonar-entry ${p.isNew ? 'new' : ''}`}>
            <span className="sonar-seq">#{p.seq}</span>
            <span className="sonar-data">{p.text}</span>
            <span className="sonar-dist">{p.dist}</span>
          </div>
        ))}
      </div>
      <div className="sonar-controls">
        <button className={`btn ${running ? 'btn-danger' : 'btn-success'}`} onClick={() => setRunning(r => !r)}>
          {running ? 'PAUSE FEED' : 'RESUME FEED'}
        </button>
        <button className="btn" onClick={() => setPings([])}>CLEAR</button>
        <span className="sonar-status">{running ? '● LIVE' : '■ PAUSED'}</span>
      </div>
    </div>
  );
}

// ─── 4. PILOT ID CHECKER ────────────────────────────────────────────────────
const PILOTS = [
  { id: 'PLT-001', name: 'Capt. Arjun Mehta',      cert: 'Class-A Deep Dive',  status: 'CLEARED', expiry: '2026-08-12' },
  { id: 'PLT-002', name: 'Lt. Priya Nair',          cert: 'Class-B Navigation', status: 'CLEARED', expiry: '2025-12-01' },
  { id: 'PLT-003', name: 'Ens. Rohan Deshpande',   cert: 'Trainee',            status: 'PENDING', expiry: '2025-06-30' },
  { id: 'PLT-004', name: 'Dr. Kavya Iyer',          cert: 'Science Operator',   status: 'CLEARED', expiry: '2027-03-15' },
];

function PilotIDChecker() {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState(null);
  const [searched, setSearched] = useState(false);

  function search() {
    if (!query.trim()) return;
    setResult(PILOTS.find(p =>
      p.id.toLowerCase() === query.toLowerCase() ||
      p.name.toLowerCase().includes(query.toLowerCase())
    ) || null);
    setSearched(true);
  }

  return (
    <div className="panel">
      <div className="panel-title">Pilot ID Checker</div>
      <div className="panel-subtitle">Verify pilot certification against clearance profiles</div>
      <div className="pilot-search-row">
        <input type="text" placeholder="Enter Pilot ID or Name..."
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()} />
        <button className="btn" onClick={search}>VERIFY</button>
      </div>
      {searched && !result && <div className="pilot-no-result">⚠ NO MATCH FOUND IN CLEARANCE DATABASE</div>}
      {result && (
        <div className="pilot-result">
          <div><span className="field-label">PILOT ID</span><span className="field-value">{result.id}</span></div>
          <div><span className="field-label">NAME</span><span className="field-value">{result.name}</span></div>
          <div><span className="field-label">CERT LEVEL</span><span className="field-value">{result.cert}</span></div>
          <div><span className="field-label">EXPIRY</span><span className="field-value">{result.expiry}</span></div>
          <div>
            <span className="field-label">STATUS</span>
            <span className={`tag ${result.status === 'CLEARED' ? 'tag-green' : 'tag-yellow'}`}>{result.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 5. MISSION TIME SORTER ─────────────────────────────────────────────────
const MISSIONS = [
  { id: 1, name: 'Mariana Ridge Survey',    hours: 312 },
  { id: 2, name: 'Hydrothermal Vent Study', hours: 87  },
  { id: 3, name: 'Wreck Site Recovery',     hours: 204 },
  { id: 4, name: 'Bio-sample Collection',   hours: 45  },
  { id: 5, name: 'Pressure Boundary Test',  hours: 167 },
  { id: 6, name: 'Acoustic Relay Deploy',   hours: 390 },
];

function MissionTimeSorter() {
  const [order, setOrder] = useState('desc');
  const sorted = [...MISSIONS].sort((a, b) => order === 'desc' ? b.hours - a.hours : a.hours - b.hours);

  return (
    <div className="panel">
      <div className="panel-title">Mission Time Sorter</div>
      <div className="panel-subtitle">Rank missions by total underwater hours</div>
      <div className="sort-controls">
        <button className={`btn ${order === 'desc' ? 'btn-success' : ''}`} onClick={() => setOrder('desc')}>↓ MOST HRS</button>
        <button className={`btn ${order === 'asc'  ? 'btn-success' : ''}`} onClick={() => setOrder('asc')}>↑ LEAST HRS</button>
      </div>
      <div className="mission-list">
        {sorted.map((m, i) => (
          <div key={m.id} className="mission-item">
            <span className="mission-rank">#{i + 1}</span>
            <span className="mission-name">{m.name}</span>
            <span className="mission-hours">{m.hours} hrs</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. UNDERWATER COMMS MAP ────────────────────────────────────────────────
const RELAYS = [
  { id: 'R1', name: 'Alpha Buoy',    x: 15, y: 25, freq: '12.4 kHz', depth: '200m'  },
  { id: 'R2', name: 'Beta Ridge',    x: 40, y: 60, freq: '8.7 kHz',  depth: '1200m' },
  { id: 'R3', name: 'Gamma Trench',  x: 70, y: 35, freq: '5.1 kHz',  depth: '3400m' },
  { id: 'R4', name: 'Delta Base',    x: 85, y: 75, freq: '15.0 kHz', depth: '50m'   },
  { id: 'R5', name: 'Epsilon Node',  x: 55, y: 15, freq: '9.9 kHz',  depth: '800m'  },
];
const LINKS = [['R1','R2'],['R2','R3'],['R3','R4'],['R2','R5'],['R5','R3']];

function UnderwaterCommsMap() {
  const [selected, setSelected] = useState(null);
  const getPos = id => RELAYS.find(r => r.id === id) || { x: 0, y: 0 };

  return (
    <div className="panel">
      <div className="panel-title">Underwater Comms Map</div>
      <div className="panel-subtitle">Acoustic relay network — click a node for details</div>
      <div className="comms-map">
        <svg className="comms-line" width="100%" height="100%">
          {LINKS.map(([a, b]) => {
            const pa = getPos(a), pb = getPos(b);
            return <line key={`${a}-${b}`} x1={`${pa.x}%`} y1={`${pa.y}%`} x2={`${pb.x}%`} y2={`${pb.y}%`}
              stroke="#0a4d68" strokeWidth="1" strokeDasharray="4 4" />;
          })}
        </svg>
        {RELAYS.map(r => (
          <div key={r.id} className="relay-node" style={{ left: `${r.x}%`, top: `${r.y}%` }}
            onClick={() => setSelected(selected?.id === r.id ? null : r)}>
            <div className="relay-dot"
              style={selected?.id === r.id ? { background: '#ffa502', boxShadow: '0 0 12px #ffa502' } : {}} />
            <div className="relay-label">{r.id}</div>
          </div>
        ))}
      </div>
      {selected
        ? <div className="relay-info"><strong style={{ color: '#00e5ff' }}>{selected.name}</strong> &nbsp;
            <span className="tag tag-blue">{selected.id}</span><br />
            Frequency: {selected.freq} &nbsp;|&nbsp; Depth: {selected.depth}</div>
        : <div className="relay-info" style={{ color: '#2a6080' }}>Select a relay node to view details.</div>
      }
    </div>
  );
}

// ─── 7. QUIET NAV PLANNER ───────────────────────────────────────────────────
const DEFAULT_WAYPOINTS = [
  { id: 1, name: 'Launch Bay A',      noise: 42 },
  { id: 2, name: 'Thermal Corridor',  noise: 18 },
  { id: 3, name: 'Ridge Pass-7',      noise: 31 },
  { id: 4, name: 'Sample Zone Delta', noise: 12 },
];

function noiseTag(n) { return n < 20 ? 'tag-green' : n < 35 ? 'tag-yellow' : 'tag-red'; }

function QuietNavPlanner() {
  const [waypoints, setWaypoints] = useState(DEFAULT_WAYPOINTS);
  const [name, setName]   = useState('');
  const [noise, setNoise] = useState('');

  function addWaypoint() {
    if (!name.trim() || !noise) return;
    setWaypoints(prev => [...prev, { id: Date.now(), name: name.trim(), noise: parseInt(noise) }]);
    setName(''); setNoise('');
  }

  const sorted = [...waypoints].sort((a, b) => a.noise - b.noise);
  const avg = waypoints.length ? Math.round(waypoints.reduce((s, w) => s + w.noise, 0) / waypoints.length) : 0;

  return (
    <div className="panel">
      <div className="panel-title">Quiet Navigation Planner</div>
      <div className="panel-subtitle">Route waypoints sorted by engine noise (dB)</div>
      <div className="waypoint-list">
        {sorted.map((w, i) => (
          <div key={w.id} className="waypoint-item">
            <span className="wp-index">{i + 1}</span>
            <span className="wp-name">{w.name}</span>
            <span className={`tag ${noiseTag(w.noise)}`}>{w.noise} dB</span>
            <button className="btn btn-danger" style={{ padding: '2px 8px' }}
              onClick={() => setWaypoints(prev => prev.filter(p => p.id !== w.id))}>✕</button>
          </div>
        ))}
      </div>
      <div className="nav-add-row">
        <input type="text" placeholder="Waypoint name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="dB" value={noise} onChange={e => setNoise(e.target.value)} style={{ width: '70px' }} />
        <button className="btn btn-success" onClick={addWaypoint}>ADD</button>
      </div>
      <div className="nav-summary">WAYPOINTS: {waypoints.length} &nbsp;|&nbsp; AVG NOISE: {avg} dB</div>
    </div>
  );
}

// ─── 8. SAMPLE STORAGE MANAGER ──────────────────────────────────────────────
const SAMPLE_NAMES = ['Biolum. Algae','Deep Coral','Vent Bacteria','Abyssal Worm','Mineral Core','Sediment'];

function makeBoxes() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    label: `B${String(i + 1).padStart(2, '0')}`,
    content: i < 6 ? SAMPLE_NAMES[i] : null,
  }));
}

function SampleStorageManager() {
  const [boxes, setBoxes]       = useState(makeBoxes());
  const [selected, setSelected] = useState(null);
  const [sampleName, setSampleName] = useState('');

  function assignSample() {
    if (!selected || !sampleName.trim()) return;
    setBoxes(prev => prev.map(b => b.id === selected ? { ...b, content: sampleName.trim() } : b));
    setSampleName(''); setSelected(null);
  }

  function clearBox() {
    if (!selected) return;
    setBoxes(prev => prev.map(b => b.id === selected ? { ...b, content: null } : b));
    setSelected(null);
  }

  const filled = boxes.filter(b => b.content).length;

  return (
    <div className="panel">
      <div className="panel-title">Sample Storage Manager</div>
      <div className="panel-subtitle">Cold storage box organizer — click a box to manage</div>
      <div className="storage-grid">
        {boxes.map(b => (
          <div key={b.id}
            className={`storage-box ${b.content ? 'filled' : 'empty'} ${selected === b.id ? 'selected' : ''}`}
            onClick={() => setSelected(prev => prev === b.id ? null : b.id)}>
            <div className="box-id">{b.label}</div>
            {b.content
              ? <div className="box-name">{b.content}</div>
              : <div style={{ color: '#0a4d68' }}>—</div>
            }
          </div>
        ))}
      </div>
      <div className="storage-controls">
        <button className="btn btn-danger" onClick={clearBox} disabled={!selected}>CLEAR BOX</button>
        <span className="storage-info">
          {selected ? `Selected: B${String(selected).padStart(2,'0')}` : 'No box selected'} &nbsp;|&nbsp; {filled}/20 occupied
        </span>
      </div>
      <div className="add-sample-row">
        <input type="text" placeholder="Sample name for selected box..."
          value={sampleName} onChange={e => setSampleName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && assignSample()}
          disabled={!selected} />
        <button className="btn btn-success" onClick={assignSample} disabled={!selected}>STORE</button>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>BenthicSim Matrix</h1>
        <p>Deep-Sea Submarine Control Panel · Semester II · React JS Case Study</p>
      </header>
      <main className="dashboard-grid">
        <SubSensorStatus />
        <SafetyActionUndo />
        <SonarDataFeed />
        <PilotIDChecker />
        <MissionTimeSorter />
        <UnderwaterCommsMap />
        <QuietNavPlanner />
        <SampleStorageManager />
      </main>
    </div>
  );
}