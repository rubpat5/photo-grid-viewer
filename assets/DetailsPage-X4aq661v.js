import{r as o,c as e,u as r,j as i}from"./vendor-react-DC-HNDk7.js";import{g as n,u as t}from"./index-COM6atNC.js";import{d as a}from"./vendor-styled-B90fjfj0.js";import"./vendor-CAzp3sNt.js";const d=a.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-sizing: border-box;
  
  @media (max-width: 900px) {
    padding: 10px;
    overflow-y: auto;
    height: 100vh;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`,l=a.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 900px) {
    padding: 20px;
    gap: 20px;
    max-height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`,s=a.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`,x=a.div`
  flex: 3;
  position: relative;
  
  img {
    display: block;
    width: 100%;
    max-height: 70vh;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: none;
    object-fit: contain;
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 900px) {
    img {
      max-height: 50vh;
    }
  }
`,h=a.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  flex: 2;
  align-self: flex-start;
  
  @media (max-width: 900px) {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
`,p=a.h1`
  font-size: 2rem;
  margin: 0;
  color: #1a1a1a;
  
  @media (max-width: 900px) {
    font-size: 1.6rem;
  }
`,c=a.h2`
  font-size: 1.3rem;
  margin: 0;
  color: #4a6cf7;
  font-weight: 500;
`,f=a.div`
  margin-top: 10px;
  
  a {
    color: #4a6cf7;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`,g=a.button`
  padding: 12px 24px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: none;
  align-self: flex-start;
  
  &:hover {
    background: #3451c6;
    transform: none;
    box-shadow: none;
  }
  
  &:active {
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 900px) {
    padding: 10px 20px;
    font-size: 1rem;
  }
`,m=a.div`
  text-align: center;
  padding: 40px;
  font-size: 1.6rem;
  color: #666;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;function u(){const{id:a}=e(),{resetScrollPosition:u}=t(),b=r(),{photo:w,loading:v,error:j}=(e=>{const[r,i]=o.useState(null),[t,a]=o.useState(!0),[d,l]=o.useState(null);return o.useEffect((()=>{(async()=>{if(!e)return l("No photo ID provided"),void a(!1);try{a(!0);const o=await n(e);i(o),l(null)}catch(o){l(o instanceof Error?o.message:"Failed to fetch photo details")}finally{a(!1)}})()}),[e]),{photo:r,loading:t,error:d}})(a);return v?i.jsx(m,{children:"Loading photo details..."}):j?i.jsxs(m,{children:["Error: ",j]}):w?i.jsx(d,{children:i.jsxs(l,{children:[i.jsx(g,{onClick:()=>{setTimeout((()=>{u()}),100),b(-1)},children:"← Back to Grid"}),i.jsxs(s,{children:[i.jsx(x,{children:i.jsx("img",{src:w.src.large2x,alt:w.alt||`Photo by ${w.photographer}`})}),i.jsxs(h,{children:[i.jsx(p,{children:w.alt||"Untitled Photo"}),i.jsxs(c,{children:["By: ",w.photographer]}),i.jsx(f,{children:i.jsx("a",{href:w.url,target:"_blank",rel:"noopener noreferrer",children:"View original on Pexels"})})]})]})]})}):i.jsx(m,{children:"Photo not found"})}export{u as default};
