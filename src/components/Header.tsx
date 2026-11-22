import { BarChart3, BookOpen, ChevronDown, Code2, FileText, Globe, Moon, Search, Sun, Trophy } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { allLessons, pad2 } from '../course';
import { lessons } from '../lessons';

export type View = 'learn' | 'practice' | 'cheatsheets' | 'challenges' | 'progress';

const NAV: { id: View; label: string; Icon: typeof BookOpen }[] = [
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'practice', label: 'Practice', Icon: Code2 },
  { id: 'cheatsheets', label: 'Cheatsheets', Icon: FileText },
  { id: 'challenges', label: 'Challenges', Icon: Trophy },
  { id: 'progress', label: 'Progress', Icon: BarChart3 },
];

export function Logo() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="logo-tile" />
      <path d="M16 7 25 11.5 16 16 7 11.5Z" className="logo-top" />
      <path d="M7 16l9 4.5 9-4.5M7 20.5l9 4.5 9-4.5" className="logo-line" />
    </svg>
  );
}

interface Props {
  view: View;
  onView: (v: View) => void;
  onOpen: (id: string) => void;
  theme: 'light' | 'dark';
  onTheme: () => void;
}

export function Header({ view, onView, onOpen, theme, onTheme }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? allLessons.filter((l) => l.title.toLowerCase().includes(s) || l.chapter.title.toLowerCase().includes(s)) : allLessons.filter((l) => lessons[l.id]);
    return list.slice(0, 8);
  }, [q]);

  const pick = (id: string) => {
    onOpen(id);
    onView('learn');
    setOpen(false);
    setQ('');
    input.current?.blur();
  };

  return (
    <header className="topbar">
      <a className="brand" href="#/stacks" aria-label="Algo Lab home">
        <Logo />
        <span className="brand-name">
          Algo <mark>Lab</mark>
        </span>
      </a>
      <nav className="nav" aria-label="Sections">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} className={`nav-item${view === id ? ' is-on' : ''}`} onClick={() => onView(id)} aria-current={view === id ? 'page' : undefined}>
            <Icon size={19} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="topbar-tools">
        <div className="search">
          <Search size={18} />
          <input
            ref={input}
            value={q}
            placeholder="Search topics, algorithms..."
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') setActive((a) => Math.min(results.length - 1, a + 1));
              else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
              else if (e.key === 'Enter' && results[active]) pick(results[active].id);
              else if (e.key === 'Escape') input.current?.blur();
              e.stopPropagation();
            }}
            aria-label="Search lessons"
          />
          <kbd>⌘K</kbd>
          {open && (
            <ul className="search-results" role="listbox">
              {results.length === 0 && <li className="search-empty">Nothing matches “{q}”.</li>}
              {results.map((r, i) => (
                <li key={r.id} role="option" aria-selected={i === active} className={i === active ? 'is-active' : ''} onMouseDown={() => pick(r.id)} onMouseEnter={() => setActive(i)}>
                  <span className="search-title">{r.title}</span>
                  <span className="search-meta">
                    {pad2(r.chapterIndex + 1)} · {r.chapter.title}
                    {lessons[r.id] ? '' : ' · soon'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="tool-btn lang" title="Only English for now">
          <Globe size={18} /> EN <ChevronDown size={15} />
        </button>
        <button className="tool-btn icon" onClick={onTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <a className="credit" href="https://x.com/DilumSanjaya/status/2124547118220316851" target="_blank" rel="noreferrer">
          <span className="credit-x" aria-hidden="true">
            𝕏
          </span>
          <span className="credit-text">
            inspired by
            <mark>@DilumSanjaya</mark>
          </span>
        </a>
      </div>
    </header>
  );
}
