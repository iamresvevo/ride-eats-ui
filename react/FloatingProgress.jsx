import React, { useId, useState } from 'react';
import { Button, Card, Flex } from './index.jsx';
import { Progress } from './collection.jsx';

/** A persistent task monitor. Minimizing never pauses the caller's task. */
export function FloatingProgress({title='Progress', summary, value=0, indeterminate=false, minimized, defaultMinimized=false, onMinimizedChange, children, className='', style}) {
  const [localMinimized, setLocalMinimized] = useState(defaultMinimized);
  const collapsed = minimized ?? localMinimized;
  const contentId = useId();
  function toggle() {
    setLocalMinimized(!collapsed);
    onMinimizedChange?.(!collapsed);
  }
  return <div className={`re-floating-progress ${className}`} data-minimized={collapsed || undefined} style={style} role="region" aria-label={title}>
    <Card padding="sm" title={collapsed?undefined:title} action={collapsed?undefined:<Flex gap={8} align="center">{summary}<Button size="sm" variant="ghost" aria-label={collapsed?'Expand progress':'Minimize progress'} aria-expanded={!collapsed} aria-controls={contentId} onClick={toggle}>{collapsed?'Expand':'Minimize'}</Button></Flex>}>
      {collapsed?<div className="re-floating-progress-mini">{summary}<Progress label={title} value={value} indeterminate={indeterminate}/><Button size="sm" variant="ghost" aria-label="Expand progress" aria-expanded={false} aria-controls={contentId} onClick={toggle}>Expand</Button></div>:<Progress label="Finished" value={value} indeterminate={indeterminate}/>}
      <div id={contentId} hidden={collapsed} className="re-floating-progress-details">{children}</div>
    </Card>
  </div>;
}
