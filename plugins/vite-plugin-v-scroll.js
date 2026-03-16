// vite-plugin-v-scroll.js - Vite插件：压缩CSS并生成ES模块
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Vite插件：将v-scroll.css压缩并包装为ES模块
 * 在构建过程中自动生成可供import的CSS字符串模块
 */
export default function vScrollPlugin(options = {}) {
  const defaultOptions = {
    cssInputPath: 'src/v-scroll.css',           // 输入CSS文件路径（相对于项目根目录）
    jsOutputPath: 'dist/v-scroll.js',           // 输出JS模块路径
    minify: true,                               // 是否压缩CSS
    sourceMap: false                            // 是否生成source map
  };

  const config = { ...defaultOptions, ...options };
  let viteConfig = null;

  return {
    name: 'v-scroll-plugin',
    enforce: 'pre', // 在Vite核心插件之前运行

    // 解析Vite配置
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },

    // 构建开始钩子
    buildStart() {
      const root = viteConfig.root || process.cwd();
      const cssPath = resolve(root, config.cssInputPath);
      const outputPath = resolve(root, config.jsOutputPath);

      // 检查CSS文件是否存在
      if (!existsSync(cssPath)) {
        this.warn(`v-scroll CSS file not found: ${cssPath}`);
        return;
      }

      try {
        // 读取CSS文件
        let cssContent = readFileSync(cssPath, 'utf-8');

        // CSS压缩处理
        if (config.minify) {
          cssContent = minifyCSS(cssContent);
        }

        // 包装为ES模块
        const jsModule = `export default '${escapeCSSString(cssContent)}';\n`;

        // 确保输出目录存在
        const outputDir = dirname(outputPath);
        if (!existsSync(outputDir)) {
          const fs = require('fs');
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // 写入JS模块文件
        writeFileSync(outputPath, jsModule, 'utf-8');

        this.info(`v-scroll CSS模块已生成: ${outputPath}`);

        // 可选：生成source map
        if (config.sourceMap) {
          const mapPath = `${outputPath}.map`;
          const sourceMap = {
            version: 3,
            file: config.jsOutputPath,
            sources: [config.cssInputPath],
            mappings: '', // 简化示例，实际需要生成mappings
            sourcesContent: [cssContent]
          };
          writeFileSync(mapPath, JSON.stringify(sourceMap), 'utf-8');
        }

      } catch (error) {
        this.error(`处理v-scroll CSS时出错: ${error.message}`);
      }
    },

    // 开发服务器钩子：监听CSS文件变化
    configureServer(server) {
      const root = viteConfig.root || process.cwd();
      const cssPath = resolve(root, config.cssInputPath);

      server.watcher.add(cssPath);
      server.watcher.on('change', (file) => {
        if (file === cssPath) {
          this.buildStart();
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      });
    }
  };
}

/**
 * CSS压缩函数
 * 移除注释、空白字符，简化样式规则
 */
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')     // 移除多行注释
    .replace(/\/\/.*$/gm, '')             // 移除单行注释
    .replace(/\s+/g, ' ')                 // 合并连续空白字符
    .replace(/\s*([{}:;,])\s*/g, '$1')    // 移除规则周围的空白
    .replace(/;}/g, '}')                  // 移除最后一个分号
    .replace(/: /g, ':')                  // 移除冒号后的空格
    .replace(/, /g, ',')                  // 移除逗号后的空格
    .trim();                              // 移除首尾空白
}

/**
 * 转义CSS字符串中的特殊字符
 * 确保在JS字符串中安全使用
 */
function escapeCSSString(css) {
  return css
    .replace(/'/g, "\\'")   // 转义单引号
    .replace(/"/g, '\\"')   // 转义双引号
    .replace(/\n/g, '\\n')  // 转义换行符
    .replace(/\r/g, '\\r')  // 转义回车符
    .replace(/\t/g, '\\t'); // 转义制表符
}

