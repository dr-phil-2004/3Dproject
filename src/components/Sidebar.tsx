import { ChevronRight, FileCheck2, FileText, Folder, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { allLessons, course, findLesson, pad2 } from '../course';

interface Props {
  current: string;
  done: Set<string>;
  onOpen: (id: string) => void;
}

export function Sidebar({ current, done, onOpen }: Props) {
  const currentChapter = findLesson(current)?.chapterIndex ?? 0;
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([currentChapter]));

  // Opening a lesson from elsewhere (search, "next lesson") unfolds its chapter.
  useEffect(() => {
    setOpenSet((s) => (s.has(currentChapter) ? s : new Set(s).add(currentChapter)));
  }, [currentChapter]);

  const toggle = (i: number) =>
    setOpenSet((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const total = allLessons.length;
  return (
    <aside className="sidebar card" aria-label="Course">
      <div className="sidebar-head">
        <FolderOpen size={20} className="sidebar-head-icon" fill="currentColor" />
        <span className="sidebar-title">Course</span>
        <span className="sidebar-count">{total} lessons</span>
      </div>
      <div className="tree">
        {course.map((ch, ci) => {
          const isOpen = openSet.has(ci);
          const doneCount = ch.lessons.filter((l) => done.has(l.id)).length;
          const isCurrent = ci === currentChapter;
          return (
            <div key={ch.title} className={`chapter${isOpen ? ' is-open' : ''}`}>
              <button className="chapter-row" onClick={() => toggle(ci)} aria-expanded={isOpen}>
                <ChevronRight size={16} className="chev" />
                {isCurrent ? <Folder size={19} className="folder folder--on" fill="currentColor" /> : <Folder size={19} className="folder" />}
                <span className="chapter-name">
                  {pad2(ci + 1)}. {ch.title}
                </span>
                <span className="chapter-count">
                  {doneCount}/{ch.lessons.length}
                </span>
              </button>
              <div className="chapter-lessons" role="list">
                <div className="chapter-lessons-inner">
                  {ch.lessons.map((l) => (
                    <button key={l.id} role="listitem" className={`lesson-row${l.id === current ? ' is-current' : ''}${done.has(l.id) ? ' is-done' : ''}`} onClick={() => onOpen(l.id)} aria-current={l.id === current ? 'page' : undefined}>
                      {done.has(l.id) ? <FileCheck2 size={15} /> : <FileText size={15} />}
                      <span>{l.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="sidebar-progress">
        <span>Progress</span>
        <div className="bar">
          <i style={{ width: `${(done.size / total) * 100}%` }} />
        </div>
        <span className="sidebar-progress-num">
          {done.size} / {total}
        </span>
      </div>
    </aside>
  );
}
