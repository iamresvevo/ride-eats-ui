import React, { useEffect, useRef, useState } from "react";
import { Dialog, Button, Icon } from "./index.jsx";

/** Lazy, asynchronous sources keep authentication and caching in the consuming app. */
export function ImageThumbnail({
  src,
  load,
  alt = "",
  label = "Open image",
  onClick,
  size = 56,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({});
  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    setState({ loading: true });
    Promise.resolve()
      .then(() => src || load?.({ signal: controller.signal }))
      .then(
        (url) => {
          if (!controller.signal.aborted)
            setState(url ? { url } : { error: true });
        },
        () => {
          if (!controller.signal.aborted) setState({ error: true });
        },
      );
    return () => controller.abort();
  }, [visible, src, load, attempt]);
  return (
    <button
      ref={ref}
      type="button"
      className="image-thumbnail"
      style={{ width: size, height: size }}
      aria-label={state.error ? `Retry: ${label}` : label}
      aria-busy={state.loading || undefined}
      onClick={() => (state.error ? setAttempt((v) => v + 1) : onClick?.())}
    >
      {state.url ? (
        <img
          src={state.url}
          alt={alt}
          loading="lazy"
          onError={() => setState({ error: true })}
        />
      ) : (
        <Icon name={state.error ? "refresh-cw" : "image"} size={20} />
      )}
    </button>
  );
}

export function ImageGallery({
  items = [], open, onOpenChange, index = 0, onIndexChange, loadImage,
  renderActions, label = "Image gallery", inline = false, height,
}) {
  const active = Math.max(0, Math.min(index, items.length - 1));
  const item = items[active];
  const visible = inline || open;
  const [state, setState] = useState({});
  const [attempt, setAttempt] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({width:1,height:1});
  const [natural, setNatural] = useState({width:1,height:1});
  const [dragging,setDragging]=useState(false);
  const stage=useRef(null), drag=useRef(null);
  useEffect(() => {
    setZoom(1);setNatural({width:1,height:1});
    if (!visible || !item) { setState({}); return; }
    const controller = new AbortController();
    setState({ loading: true });
    Promise.resolve().then(() => item.src || loadImage?.(item, { signal: controller.signal })).then(
      url => {if (!controller.signal.aborted) setState(url ? { url } : { error: true });},
      () => {if (!controller.signal.aborted) setState({ error: true });},
    );
    return () => controller.abort();
  }, [visible, item, loadImage, attempt]);
  useEffect(()=>{
    const el=stage.current;if(!el)return;
    const update=()=>setSize({width:el.clientWidth,height:el.clientHeight});
    update();const observer=new ResizeObserver(update);observer.observe(el);
    return ()=>observer.disconnect();
  },[visible]);
  const fit=Math.min(size.width/natural.width,size.height/natural.height,1);
  const width=natural.width*fit*zoom,heightPx=natural.height*fit*zoom;
  function changeZoom(next) {
    next=Math.max(1,Math.min(4,next));const el=stage.current;
    const x=el?(el.scrollLeft+el.clientWidth/2)/Math.max(size.width,width):.5;
    const y=el?(el.scrollTop+el.clientHeight/2)/Math.max(size.height,heightPx):.5;
    setZoom(next);
    requestAnimationFrame(()=>el?.scrollTo({left:next===1?0:x*Math.max(size.width,natural.width*fit*next)-size.width/2,top:next===1?0:y*Math.max(size.height,natural.height*fit*next)-size.height/2}));
  }
  const move=delta=>onIndexChange?.(Math.max(0,Math.min(items.length-1,active+delta)));
  const controls=<div className="image-gallery-controls">
    {items.length>1&&<div className="image-gallery-navigation"><Button size="sm" icon="chevron-left" aria-label="Previous image" disabled={!active} onClick={()=>move(-1)}/><span aria-live="polite">{active+1} / {items.length}</span><Button size="sm" icon="chevron-right" aria-label="Next image" disabled={active>=items.length-1} onClick={()=>move(1)}/></div>}
    <div className="image-gallery-navigation">
      <Button size="sm" icon="minus" aria-label="Zoom out" disabled={!state.url||zoom<=1} onClick={()=>changeZoom(zoom-.5)}/>
      <span aria-live="polite">{Math.round(zoom*100)}%</span>
      <Button size="sm" icon="plus" aria-label="Zoom in" disabled={!state.url||zoom>=4} onClick={()=>changeZoom(zoom+.5)}/>
      <Button size="sm" disabled={!state.url||zoom===1} onClick={()=>changeZoom(1)}>Fit</Button>
    </div>
    {item&&renderActions?.(item)}
  </div>;
  const content=<div className="image-gallery-content">
    <div ref={stage} className="image-gallery-stage" style={height?{height}:undefined} role="region" tabIndex={0}
      aria-label="Image preview. Use plus and minus to zoom, zero to fit, or drag to pan."
      aria-busy={state.loading||undefined} data-zoom={zoom>1||undefined} data-dragging={dragging||undefined}
      onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(['+','=','-','0'].includes(event.key)){event.preventDefault();changeZoom(event.key==='0'?1:zoom+(event.key==='-'?-.5:.5));}else if(zoom===1&&items.length>1&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}
      onDoubleClick={()=>changeZoom(zoom===1?2:1)}
      onPointerDown={event=>{if(zoom<=1||event.button!==0)return;const el=event.currentTarget;drag.current={id:event.pointerId,x:event.clientX,y:event.clientY,left:el.scrollLeft,top:el.scrollTop};el.setPointerCapture(event.pointerId);setDragging(true);event.preventDefault();}}
      onPointerMove={event=>{const d=drag.current;if(!d||d.id!==event.pointerId)return;event.currentTarget.scrollLeft=d.left+d.x-event.clientX;event.currentTarget.scrollTop=d.top+d.y-event.clientY;}}
      onPointerUp={event=>{drag.current=null;setDragging(false);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
      onPointerCancel={()=>{drag.current=null;setDragging(false);}}
      onLostPointerCapture={()=>{drag.current=null;setDragging(false);}}>
      {state.loading?<span role="status">Loading image…</span>:state.error?<div role="alert">Image unavailable. <Button onClick={()=>setAttempt(v=>v+1)}>Retry</Button></div>:state.url?
        <div className="image-gallery-canvas" style={{width:Math.max(size.width,width),height:Math.max(size.height,heightPx)}}>
          <img src={state.url} alt={item?.alt||item?.title||"Image"} draggable={false} style={{width,height:heightPx}} onLoad={event=>setNatural({width:event.currentTarget.naturalWidth,height:event.currentTarget.naturalHeight})} onError={()=>setState({error:true})}/>
        </div>:<span>No images</span>}
    </div>
    {item?.description&&<p className="image-gallery-caption">{item.description}</p>}
  </div>;
  return inline?<section className="image-gallery image-gallery-inline" aria-label={label}>{controls}{content}</section>:<Dialog open={open} onOpenChange={onOpenChange} title={item?.title||label} size="lg" style={{width:"min(1200px, calc(100vw - 32px))",maxWidth:"calc(100vw - 32px)"}} className="image-gallery" footer={controls}>{content}</Dialog>;
}
