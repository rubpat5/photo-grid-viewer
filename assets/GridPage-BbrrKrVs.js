import{L as t,u as e,r as o,j as r}from"./vendor-react-BGEkkODs.js";import{u as i,a as n}from"./index-D9NtyFo-.js";import{d as s}from"./vendor-styled-CnASnzz6.js";import"./vendor-BMVzX8SX.js";const a=s.div`
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  will-change: transform;
  
  &.instant-scroll {
    overflow-y: hidden;
    scroll-behavior: auto !important;
  }
`,c=s.div`
  position: relative;
  height: ${t=>`${t.height}px`};
  width: 100%;
`,l=s(t)`
  position: absolute;
  width: ${t=>t.width}px;
  transform: ${t=>t.transform};
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: none;
  will-change: auto;

  &:hover {
    z-index: 1;
    transform: ${t=>t.transform} scale(1.02);
  }

  img {
    width: 100%;
    aspect-ratio: ${t=>t.$aspectRatio};
    height: auto;
    display: block;
    background-color: #f0f0f0;
  }
`,d=s.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`,u=s.div`
  height: 100vh;
  overflow: hidden;
`,h=({photo:t,index:n,gridLayout:s,registerPhotoRef:a})=>{const c=e(),{setGridScrollPosition:d}=i(),u=s.itemPositions.get(n);if(!u)return null;const h=t.width/t.height,g=`translate3d(${u.column*(s.columnWidth+20)}px, ${u.top}px, 0)`,f=o.useCallback((e=>{e.preventDefault();const o=document.querySelector(".grid-container");o&&d(o.scrollTop),c(`/photo/${t.id}`)}),[c,t.id,d]);return r.jsx(l,{to:`/photo/${t.id}`,transform:g,width:s.columnWidth,$aspectRatio:h,"data-index":n,ref:t=>a(n,t),onClick:f,children:r.jsx("img",{src:t.src.large,alt:`Photo by ${t.photographer}`,loading:"lazy",decoding:"async",style:{transform:"translateZ(0)",backfaceVisibility:"hidden"}})},t.id)};function g({photos:t}){const e=o.useRef(null),[r,n]=o.useState(new Set),[s,a]=o.useState({height:0,layout:{columnWidth:0,columns:3,columnHeights:[0,0,0],itemPositions:new Map}}),{height:c,layout:l}=s,{gridScrollPosition:d}=i(),u=o.useRef(null),h=o.useRef(new Map),g=o.useRef(!1),[f,m]=o.useState(!0),p=o.useCallback((()=>{if(!e.current||0===t.length)return;const o=e.current.clientWidth-40,{layout:r,gridHeight:i}=function(t,e){let o=3;window.innerWidth<=768?o=1:window.innerWidth<=1200&&(o=2);const r=(t-20*(o-1))/o,i=Array(o).fill(0),n=new Map;e.forEach(((t,e)=>{const o=i.indexOf(Math.min(...i)),s=t.width/t.height,a=r/s;n.set(e,{column:o,top:i[o],height:a}),i[o]+=a+20}));const s=Math.max(...i);return{layout:{columnWidth:r,columns:o,columnHeights:i,itemPositions:n},gridHeight:s}}(o,t);a({height:i,layout:r})}),[t]),w=o.useCallback((()=>{u.current&&u.current.disconnect();u.current=new IntersectionObserver((t=>{n((e=>{const o=new Set(e);return t.forEach((t=>{const e=Number(t.target.getAttribute("data-index"));isNaN(e)||(t.isIntersecting?o.add(e):o.delete(e))})),o}))}),{root:e.current,rootMargin:"175% 0px",threshold:.01}),h.current.forEach(((t,e)=>{t&&u.current?.observe(t)}))}),[]);o.useEffect((()=>{p();const t=function(t,e){let o=null;return function(...r){o&&clearTimeout(o),o=setTimeout((()=>{t(...r),o=null}),e)}}((()=>{p()}),200);return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[p]),o.useEffect((()=>(l.itemPositions.size>0&&requestAnimationFrame((()=>{w()})),()=>{u.current&&u.current.disconnect()})),[s,w]),o.useEffect((()=>{if(t.length>0&&0===r.size){const e=new Set,o=Math.min(t.length,30);for(let t=0;t<o;t++)e.add(t);n(e)}}),[t.length,r.size]),o.useLayoutEffect((()=>{e.current&&d>0&&l.itemPositions.size>0&&!g.current?(e.current.scrollTop=d,g.current=!0,setTimeout((()=>{m(!1)}),50)):l.itemPositions.size>0&&!g.current&&m(!1)}),[d,s]);const x=o.useCallback((t=>e.current?function(t,e,o,r,i){if(e.has(t))return!0;const n=o.itemPositions.get(t);if(!n)return!1;const s=r,a=s+i,c=2*i,l=n.top,d=n.top+n.height;return l>=s-c&&l<=a+c||d>=s-c&&d<=a+c}(t,r,l,e.current.scrollTop,e.current.clientHeight):r.has(t)),[r,l]);return{containerRef:e,gridHeight:c,gridLayout:l,initialLoad:f,shouldRenderItem:x,registerPhotoRef:(t,e)=>{e!==h.current.get(t)&&(h.current.set(t,e),e&&u.current&&u.current.observe(e))}}}function f(){const{photos:t,loading:e,error:o}=n(),{containerRef:i,gridHeight:s,gridLayout:l,initialLoad:f,shouldRenderItem:m,registerPhotoRef:p}=g({photos:t});return e?r.jsx(d,{children:"Loading..."}):o?r.jsxs(d,{children:["Error: ",o]}):r.jsx(u,{children:r.jsx(a,{ref:i,className:"grid-container "+(f?"instant-scroll":""),style:f?{scrollBehavior:"auto",overflowY:"hidden"}:void 0,children:r.jsx(c,{height:s,children:t.map(((t,e)=>m(e)?r.jsx(h,{photo:t,index:e,gridLayout:l,registerPhotoRef:p},t.id):null))})})})}export{f as default};
