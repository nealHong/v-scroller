(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();const d="v-scroll::part(track){position:absolute;right:0;top:0;bottom:0;width:15px;background-color:rgba(0,0,0,0.1);box-shadow:0 2px 8px 0 rgba(0,0,0,0.36);opacity:0;transition:opacity 0.3s ease}v-scroll[data-hover]::part(track){opacity:1}v-scroll::part(thumb){position:absolute;right:3px;width:7px;min-height:26px;background-color:rgba(0,0,0,0.3);border-radius:5px;cursor:pointer;opacity:0;transition:background-color 0.2s ease,opacity 0.3s ease}v-scroll::part(thumb):hover{background-color:rgba(0,0,0,0.5)}v-scroll[data-dragging]::part(thumb):hover{background-color:rgba(0,0,0,0.7)}v-scroll:hover::part(thumb){opacity:1}v-scroll::part(container){width:100%;height:100%;overflow:auto;scrollbar-width:none;-ms-overflow-style:none}v-scroll::part(container)::-webkit-scrollbar{width:0;height:0;display:none}v-scroll::part(content){position:relative;min-height:100%}v-scroll{--v-scroll-track-width:10px;--v-scroll-track-bg:rgba(0,0,0,0.1);--v-scroll-bar-bg:rgba(0,0,0,0.3);--v-scroll-bar-hover-bg:rgba(0,0,0,0.5);--v-scroll-bar-drag-bg:rgba(0,0,0,0.7);--v-scroll-bar-min-height:16px;--v-scroll-track-padding:3px}";class p extends HTMLElement{static get observedAttributes(){return["direction"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
      <style>
        /* 基础样式：隐藏默认滚动条 */
        :host {
          display: block;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        .scroll-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .scroll-container::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .scroll-content {
          min-height: 100%;
        }
        .scroll-bar {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 100%;
          pointer-events: none;
        }
        .scroll-track {
          position: absolute;
          top: 3px;
          bottom: 3px;
          right: 0;
          width: 100%;
          pointer-events: auto;
        }
        .scroll-thumb {
          position: absolute;
          width: 100%;
          pointer-events: auto;
          cursor: pointer;
          min-height: 16px;
          transition: background-color 0.2s;
        }
      </style>
      <div class="scroll-container" part="container">
        <div class="scroll-content">
          <slot></slot> <!-- 内容插槽 -->
        </div>
      </div>
      <div class="scroll-bar" part="bar">
        <div class="scroll-track" part="track"></div>
        <div class="scroll-thumb" part="thumb"></div>
      </div>
    `,this.container=this.shadowRoot.querySelector(".scroll-container"),this.scrollContent=this.shadowRoot.querySelector(".scroll-content"),this.scrollBar=this.shadowRoot.querySelector(".scroll-bar"),this.track=this.shadowRoot.querySelector(".scroll-track"),this.thumb=this.shadowRoot.querySelector(".scroll-thumb"),this.isDragging=!1,this.startY=0,this.startScrollTop=0,this.resizeObserver=null,this.handleScroll=this.handleScroll.bind(this),this.handlePointerDown=this.handlePointerDown.bind(this),this.handlePointerMove=this.handlePointerMove.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleResize=this.handleResize.bind(this)}connectedCallback(){this.injectStyles(),this.setupEventListeners(),this.setupResizeObserver(),this.updateScrollbar()}disconnectedCallback(){this.cleanup()}injectStyles(){{const t=document.createElement("style");t.textContent=d,document.head.appendChild(t)}}setupEventListeners(){this.container.addEventListener("scroll",this.handleScroll),this.thumb.addEventListener("pointerdown",this.handlePointerDown),document.addEventListener("pointermove",this.handlePointerMove),document.addEventListener("pointerup",this.handlePointerUp),document.addEventListener("pointercancel",this.handlePointerUp),this.thumb.addEventListener("dragstart",t=>t.preventDefault())}setupResizeObserver(){"ResizeObserver"in window?(this.resizeObserver=new ResizeObserver(this.handleResize),this.resizeObserver.observe(this.container),this.resizeObserver.observe(this.scrollContent)):window.addEventListener("resize",this.handleResize)}updateScrollbar(){const t=this.container.clientHeight,o=this.scrollContent.scrollHeight,i=this.container.scrollTop;if(o<=t){this.scrollBar.style.display="none";return}this.scrollBar.style.display="block",this.scrollBar.addEventListener("mouseenter",()=>{this.setAttribute("data-hover","true")}),this.scrollBar.addEventListener("mouseleave",()=>{this.removeAttribute("data-hover")});const e=this.track.clientHeight,r=16,s=o-t,n=Math.max(r,t/o*(e-6));if(this.thumb.style.height=`${n}px`,s>0){const a=i/s*(e-n-6)+3;this.thumb.style.top=`${a}px`}else this.thumb.style.top="3px"}handleScroll(){this.updateScrollbar()}handleResize(){this.updateScrollbar()}handlePointerDown(t){t.preventDefault(),this.isDragging=!0,this.startY=t.clientY,this.startScrollTop=this.container.scrollTop,this.thumb.setPointerCapture(t.pointerId),this.setAttribute("data-dragging","true")}handlePointerMove(t){if(!this.isDragging)return;t.preventDefault();const o=t.clientY-this.startY,i=this.container.clientHeight,e=this.scrollContent.scrollHeight,r=this.track.clientHeight,s=parseFloat(this.thumb.style.height),n=e-i,a=r-s-6;if(a>0&&n>0){const c=o/a,h=this.startScrollTop+c*n;this.container.scrollTop=Math.max(0,Math.min(n,h))}}handlePointerUp(t){this.isDragging&&(this.isDragging=!1,this.thumb.hasPointerCapture(t.pointerId)&&this.thumb.releasePointerCapture(t.pointerId),this.removeAttribute("data-dragging"))}cleanup(){this.container.removeEventListener("scroll",this.handleScroll),this.thumb.removeEventListener("pointerdown",this.handlePointerDown),document.removeEventListener("pointermove",this.handlePointerMove),document.removeEventListener("pointerup",this.handlePointerUp),document.removeEventListener("pointercancel",this.handlePointerUp),this.resizeObserver?(this.resizeObserver.disconnect(),this.resizeObserver=null):window.removeEventListener("resize",this.handleResize)}attributeChangedCallback(t,o,i){t==="direction"&&console.log("Direction changed:",i)}}customElements.define("v-scroll",p);const u=document.querySelector(".content-paragraph");for(let l=0;l<100;l++){const t=document.createElement("p");t.textContent=`Welcome to Vibe ${l+1}`,u.appendChild(t)}
//# sourceMappingURL=index-DhRJlPAz.js.map
