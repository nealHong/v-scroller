// v-scroll.js - 虚拟滚动条Web组件
import CSS from "$/v-scroll.css.js"; // 通过import映射导入压缩后的CSS字符串

class VScroll extends HTMLElement {
  static get observedAttributes() {
    return ['direction']; // 支持方向属性，默认为垂直滚动
  }

  constructor() {
    super();
    
    // 创建Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // 内部结构 - 只包含必要的基础样式
    this.shadowRoot.innerHTML = `
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
    `;

    // 元素引用
    this.container = this.shadowRoot.querySelector('.scroll-container');
    this.scrollContent = this.shadowRoot.querySelector('.scroll-content');
    this.scrollBar = this.shadowRoot.querySelector('.scroll-bar');
    this.track = this.shadowRoot.querySelector('.scroll-track');
    this.thumb = this.shadowRoot.querySelector('.scroll-thumb');

    // 状态变量
    this.isDragging = false;
    this.startY = 0;
    this.startScrollTop = 0;
    this.resizeObserver = null;

    // 绑定事件处理函数
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.injectStyles();
    this.setupEventListeners();
    this.setupResizeObserver();
    this.updateScrollbar();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // 注入外部CSS样式
  injectStyles() {
    if (CSS && typeof CSS === 'string') {
      const style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);
    } else {
      console.warn('VScroll: CSS module not loaded. Using default styles.');
    }
  }

  // 设置事件监听
  setupEventListeners() {
    this.container.addEventListener('scroll', this.handleScroll);
    this.thumb.addEventListener('pointerdown', this.handlePointerDown);
    
    // 全局指针事件用于拖拽
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp);
    document.addEventListener('pointercancel', this.handlePointerUp);
    
    // 防止拖拽时文本选中
    this.thumb.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // 设置Resize Observer
  setupResizeObserver() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.container);
      this.resizeObserver.observe(this.scrollContent);
    } else {
      // 回退方案：使用轮询或直接监听resize事件
      window.addEventListener('resize', this.handleResize);
    }
  }

  // 更新滚动条状态
  updateScrollbar() {
    const containerHeight = this.container.clientHeight;
    const contentHeight = this.scrollContent.scrollHeight;
    const scrollTop = this.container.scrollTop;

    // 判断是否需要显示滚动条
    if (contentHeight <= containerHeight) {
      this.scrollBar.style.display = 'none';
      return;
    }


    this.scrollBar.style.display = 'block';
    // 监听 bar 的 hover 状态
    this.scrollBar.addEventListener('mouseenter', () => {
      this.setAttribute('data-hover', 'true');
    });
    
    this.scrollBar.addEventListener('mouseleave', () => {
      this.removeAttribute('data-hover');
    });
    // 计算滑块尺寸和位置
    const trackHeight = this.track.clientHeight;
    const minThumbHeight = 16;
    const maxScrollTop = contentHeight - containerHeight;
    
    // 滑块高度（自适应，有最小限制）
    const thumbHeight = Math.max(
      minThumbHeight,
      (containerHeight / contentHeight) * (trackHeight - 6) // 减去上下间距
    );
    this.thumb.style.height = `${thumbHeight}px`;

    // 滑块位置
    if (maxScrollTop > 0) {
      const thumbTop = (scrollTop / maxScrollTop) * (trackHeight - thumbHeight - 6) + 3;
      this.thumb.style.top = `${thumbTop}px`;
    } else {
      this.thumb.style.top = '3px';
    }
  }

  // 事件处理函数
  handleScroll() {
    this.updateScrollbar();
  }

  handleResize() {
    this.updateScrollbar();
  }

  handlePointerDown(event) {
    event.preventDefault();
    this.isDragging = true;
    this.startY = event.clientY;
    this.startScrollTop = this.container.scrollTop;
    
    // 设置指针捕获
    this.thumb.setPointerCapture(event.pointerId);
    
    // 添加拖拽状态
    this.setAttribute('data-dragging', 'true');
  }

  handlePointerMove(event) {
    if (!this.isDragging) return;
    event.preventDefault();

    const deltaY = event.clientY - this.startY;
    const containerHeight = this.container.clientHeight;
    const contentHeight = this.scrollContent.scrollHeight;
    const trackHeight = this.track.clientHeight;
    const thumbHeight = parseFloat(this.thumb.style.height);

    // 计算滚动映射
    const scrollableHeight = contentHeight - containerHeight;
    const thumbMoveableHeight = trackHeight - thumbHeight - 6; // 减去上下间距
    
    if (thumbMoveableHeight > 0 && scrollableHeight > 0) {
      const scrollRatio = deltaY / thumbMoveableHeight;
      const newScrollTop = this.startScrollTop + (scrollRatio * scrollableHeight);
      
      // 限制滚动范围
      this.container.scrollTop = Math.max(0, Math.min(scrollableHeight, newScrollTop));
    }
  }

  handlePointerUp(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // 释放指针捕获
    if (this.thumb.hasPointerCapture(event.pointerId)) {
      this.thumb.releasePointerCapture(event.pointerId);
    }
    
    // 移除拖拽状态
    this.removeAttribute('data-dragging');
  }

  // 清理资源
  cleanup() {
    this.container.removeEventListener('scroll', this.handleScroll);
    this.thumb.removeEventListener('pointerdown', this.handlePointerDown);
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('pointercancel', this.handlePointerUp);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    } else {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  // 属性变化回调
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'direction') {
      // 可扩展：支持水平滚动
      console.log('Direction changed:', newValue);
    }
  }
}

// 注册Web组件
customElements.define('v-scroll', VScroll);

// 导出组件类
export default VScroll;
