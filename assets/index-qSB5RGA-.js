(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=s(e);fetch(e.href,i)}})();class a extends HTMLElement{static get observedAttributes(){return["direction"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
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
    `,this.container=this.shadowRoot.querySelector(".scroll-container"),this.scrollContent=this.shadowRoot.querySelector(".scroll-content"),this.scrollBar=this.shadowRoot.querySelector(".scroll-bar"),this.track=this.shadowRoot.querySelector(".scroll-track"),this.thumb=this.shadowRoot.querySelector(".scroll-thumb"),this.isDragging=!1,this.startY=0,this.startScrollTop=0,this.resizeObserver=null,this.handleScroll=this.handleScroll.bind(this),this.handlePointerDown=this.handlePointerDown.bind(this),this.handlePointerMove=this.handlePointerMove.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleResize=this.handleResize.bind(this)}connectedCallback(){this.injectStyles(),this.setupEventListeners(),this.setupResizeObserver(),this.updateScrollbar()}disconnectedCallback(){this.cleanup()}injectStyles(){if(c&&typeof c=="string"){const t=document.createElement("style");t.textContent=c,document.head.appendChild(t)}else console.warn("VScroll: CSS module not loaded. Using default styles.")}setupEventListeners(){this.container.addEventListener("scroll",this.handleScroll),this.thumb.addEventListener("pointerdown",this.handlePointerDown),document.addEventListener("pointermove",this.handlePointerMove),document.addEventListener("pointerup",this.handlePointerUp),document.addEventListener("pointercancel",this.handlePointerUp),this.thumb.addEventListener("dragstart",t=>t.preventDefault())}setupResizeObserver(){"ResizeObserver"in window?(this.resizeObserver=new ResizeObserver(this.handleResize),this.resizeObserver.observe(this.container),this.resizeObserver.observe(this.scrollContent)):window.addEventListener("resize",this.handleResize)}updateScrollbar(){const t=this.container.clientHeight,s=this.scrollContent.scrollHeight,o=this.container.scrollTop;if(s<=t){this.scrollBar.style.display="none";return}this.scrollBar.style.display="block";const e=this.track.clientHeight,i=16,r=s-t,n=Math.max(i,t/s*(e-6));if(this.thumb.style.height=`${n}px`,r>0){const h=o/r*(e-n-6)+3;this.thumb.style.top=`${h}px`}else this.thumb.style.top="3px"}handleScroll(){this.updateScrollbar()}handleResize(){this.updateScrollbar()}handlePointerDown(t){t.preventDefault(),this.isDragging=!0,this.startY=t.clientY,this.startScrollTop=this.container.scrollTop,this.thumb.setPointerCapture(t.pointerId),this.thumb.setAttribute("data-dragging","true")}handlePointerMove(t){if(!this.isDragging)return;t.preventDefault();const s=t.clientY-this.startY,o=this.container.clientHeight,e=this.scrollContent.scrollHeight,i=this.track.clientHeight,r=parseFloat(this.thumb.style.height),n=e-o,h=i-r-6;if(h>0&&n>0){const d=s/h,u=this.startScrollTop+d*n;this.container.scrollTop=Math.max(0,Math.min(n,u))}}handlePointerUp(t){this.isDragging&&(this.isDragging=!1,this.thumb.hasPointerCapture(t.pointerId)&&this.thumb.releasePointerCapture(t.pointerId),this.thumb.removeAttribute("data-dragging"))}cleanup(){this.container.removeEventListener("scroll",this.handleScroll),this.thumb.removeEventListener("pointerdown",this.handlePointerDown),document.removeEventListener("pointermove",this.handlePointerMove),document.removeEventListener("pointerup",this.handlePointerUp),document.removeEventListener("pointercancel",this.handlePointerUp),this.resizeObserver?(this.resizeObserver.disconnect(),this.resizeObserver=null):window.removeEventListener("resize",this.handleResize)}attributeChangedCallback(t,s,o){t==="direction"&&console.log("Direction changed:",o)}}customElements.define("v-scroll",a);const c=a,p=document.querySelector(".content-paragraph");for(let l=0;l<100;l++){const t=document.createElement("p");t.textContent=`Welcome to Vibe ${l+1}`,p.appendChild(t)}
//# sourceMappingURL=index-qSB5RGA-.js.map
